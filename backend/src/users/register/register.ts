import { Request, Response } from 'express';
import { getAllRegisterValidation } from './validation'; 

export async function handleRegister(req: Request, res: Response) {
    const errors = await getAllRegisterValidation(req.body);

    if (errors.length > 0) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({errors: errors}));
        return
    }

    res.end('register fine');
}
