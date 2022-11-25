import { dataSource } from '../db/get-data-source';
import { User } from '../db/entity/User';
import { Transactions } from '../db/entity/Transactions';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

export async function handleShowCashIn(req: Request, res: Response) {
    const token = req.cookies['token'];

    const username = (jwt.decode(token) as any).username;
    const user = await dataSource.getRepository(User).findOne({where: {username: username}, relations: {account: true}});

    // I call a function that validates the JWT before calling this function
    // if for some reason someone bypass the function that checks for authorization
    // I return a server error (500)
    if (user === null) {
        res.writeHead(500);
        res.end();
        return
    }

    const transactions = await dataSource.getRepository(Transactions).find({ 
        select: {
            value: true,
            createdAt: true
        },
        where: { 
            debitedAccountId: { 
                id: user.account.id 
            }
        }, 
    });

    res.json(transactions)
}

export async function handleShowCashOut(req: Request, res: Response) {
    const token = req.cookies['token'];

    const username = (jwt.decode(token) as any).username;
    const user = await dataSource.getRepository(User).findOne({where: {username: username}, relations: {account: true}});

    // I call a function that validates the JWT before calling this function
    // if for some reason someone bypass the function that checks for authorization
    // I return a server error (500)
    if (user === null) {
        res.writeHead(500);
        res.end();
        return
    }

    const transactions = await dataSource.getRepository(Transactions).find({ 
        select: {
            value: true,
            createdAt: true
        },
        where: { 
            creditedAccountId: { 
                id: user.account.id 
            }
        }, 
    });

    res.json(transactions)
}

export async function handleShowAll(req: Request, res: Response) {
    const token = req.cookies['token'];

    const username = (jwt.decode(token) as any).username;
    const user = await dataSource.getRepository(User).findOne({where: {username: username}, relations: {account: true}});

    // I call a function that validates the JWT before calling this function
    // if for some reason someone bypass the function that checks for authorization
    // I return a server error (500)
    if (user === null) {
        res.writeHead(500);
        res.end();
        return
    }

    const transactionsCashIn = await dataSource.getRepository(Transactions).find({ 
        select: {
            value: true,
            createdAt: true,
        },
        where: {
            debitedAccountId: { 
                id: user.account.id 
            }
        } 
    });

    const transactionsCashOut = await dataSource.getRepository(Transactions).find({ 
        select: {
            value: true,
            createdAt: true,
        },
        where: {
            creditedAccountId: { 
                id: user.account.id
            }
        }
         
    })

    res.json({
        cashIn: transactionsCashIn,
        cashOut: transactionsCashOut
    })
}
