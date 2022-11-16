import "reflect-metadata"
import { Request, Response } from 'express';

export async function handleRegister(req: Request, res: Response) {
    res.end('hello from register')
}
