import { Request, Response } from 'express'
import jwt from 'jsonwebtoken';
import { dataSource } from '../db/get-data-source';
import { User } from '../db/entity/User';
import { Account } from '../db/entity/Account';
import { Transactions } from '../db/entity/Transactions';
import { getAllTransactionValidation } from './validation';

// error messages
const transactionSameUser = `You cannot do a transaction to yourself`;
const transactionNoMoney = `You don't have the amount you wish to cash-out`;
const couldNotFind = `Couldn't find any account`;

// success messages
const transactionOk = `Your transaction has been done`;

export async function handleTransaction(req: Request, res: Response) {
    const userRepo = dataSource.getRepository(User);

    const errors = await getAllTransactionValidation(req.body);
    if (errors.length > 0) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({errors: errors}));
        return
    }

    const token = req.cookies['token'];

    // jwt.decode returns an object with the payload, it does NOT VERIFY if the token is valid
    // I'm only using this function because I have a function that validates the token
    // So if the code comes here it means the token is valid
    // However I will validate one more time when I do the transaction
    const username = (jwt.decode(token) as {'username': string})['username'];

    // User that will be cashed-out
    const userCashOut = await userRepo.findOne({where: {username: username}, relations: {account: true}})

    // User that will be cashed-in
    const userCashIn = await userRepo.findOne({where: {username: req.body.account}, relations: {account: true}}, ) 

    // just in case
    if (userCashOut === null || userCashIn === null) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({errors: couldNotFind}));
        return
    }

    // the user cannot do a transaction to himself
    if (userCashOut?.username === userCashIn?.username) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({errors: transactionSameUser}));
        return
    }

    // the user that will cash-out needs to have the amount he wishes to send
    if (userCashOut?.account.balance as number < req.body.amount) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({errors: transactionNoMoney}));
        return
    }

    try {
        // verifying JWT one more time just in case (it is first verifed in the file '../users/authentication/authentication.ts'; 
        // if the token is not valid for some reason it throws an error
        jwt.verify(req.cookies['token'], (process.env.JWT_KEY as string))


        // if an error happens in this function, it does not affect any table. it's all or nothing
        await dataSource.transaction(async (transactionalEntityManager) => {

            // getting repo of user table with transaction entity
            const userTransactionRepo = transactionalEntityManager.getRepository(User);
            // getting repo of transactions table with transaction entity
            const transactionTransactionRepo = transactionalEntityManager.getRepository(Transactions); 

            const moneyAmount = req.body.amount

            const transactionDb = new Transactions();
            transactionDb.createdAt = new Date();
            transactionDb.creditedAccountId = userCashOut.account;
            transactionDb.debitedAccountId = userCashIn.account;
            transactionDb.value = moneyAmount;

            userCashIn.account.balance = ((userCashIn.account.balance * 100) + (moneyAmount * 100)) / 100

            userCashOut.account.balance = ((userCashOut.account.balance * 100) - (moneyAmount * 100)) / 100

            await userTransactionRepo.save([userCashOut, userCashIn]);
            await transactionTransactionRepo.save(transactionDb);
        })
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({success: transactionOk}));
        return
    }
    catch (e) {
        console.log(e)
        res.writeHead(500);
        res.end();
        return
    }
}
