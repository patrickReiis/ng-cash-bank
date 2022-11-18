import { Request, Response } from 'express';
import { getAllRegisterValidation } from './validation'; 
import { dataSource } from '../../db/get-data-source';
import { User } from '../../db/entity/User';
import { Account } from '../../db/entity/Account';
import { getPasswordHashed } from '../password/password';
import { arePasswordsEqual } from '../password/password';

export async function handleRegister(req: Request, res: Response) {
    const errors = await getAllRegisterValidation(req.body);

    if (errors.length > 0) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({errors: errors}));
        return
    }
    

    // creating user
    const user = new User();
    user.username = req.body.username;
    user.password = await getPasswordHashed(req.body.password);
    // creating account for user
    user.account = new Account();

    // saving all
    await dataSource.manager.save(user);

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({ success: `${user.username}, your account has been created successfully`}));
}
