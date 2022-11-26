import { Request, Response } from 'express';
import { getAllLoginValidation, usernameDoesNotExists, passwordIsWrong } from './validation';
import { dataSource } from '../../db/get-data-source';
import { User } from '../../db/entity/User';
import jwt from 'jsonwebtoken';
import { arePasswordsEqual } from '../password/password';

export async function handleLogin(req: Request, res: Response) {

    const errors = await getAllLoginValidation(req.body);

    if (errors.length > 0) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({errors: errors}));
        return
    }

    const { username, password } = req.body;

    const user = await dataSource.manager.findOneBy(User, {username: username});
    
    if (user == null) {
        res.writeHead(404, {'Content-Type': 'application/json', 'Set-Cookie':`token=helloworld;Max-Age=1`});
        res.end(JSON.stringify({errors: usernameDoesNotExists}));
        return
    }

    const isPasswordCorrect = await arePasswordsEqual(user.password, password)

    if (isPasswordCorrect == false) {
        res.writeHead(400, {'Content-Type': 'application/json', 'Set-Cookie':`token=helloworld;Max-Age=1`});
        res.end(JSON.stringify({errors: passwordIsWrong}));
        return
    }

    const token = jwt.sign({ username: username}, (process.env.JWT_KEY as string), { expiresIn: '1d' })

    const oneDay = 86400; // in seconds 
    res.writeHead(200, {'Content-Type': 'application/json', 'Set-Cookie': `token=${token};HttpOnly;Secure;Max-Age=${oneDay};Path=/`});
    res.end(JSON.stringify({success: 'Logged in successfully'}))
}
