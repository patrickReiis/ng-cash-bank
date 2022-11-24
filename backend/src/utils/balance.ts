import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { dataSource } from '../db/get-data-source';
import { User } from '../db/entity/User';

export async function handleShowBalance(req: Request, res: Response) {
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
    res.json({success: `Your current balance is ${user.account.balance}`})
}
