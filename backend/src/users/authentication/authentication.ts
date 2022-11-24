// this file is responsible for checking if the user has the permission to access a protected route by verifying the JWT token

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express'; 

const usernameNotLoggedIn = `You need to log in to access this page`;

export async function isUserAuthenticated(req: Request, res:Response, next: NextFunction) {
    const cookies = req.cookies; // cookie in object format

    try {
        if (
            Object.keys(cookies).length < 1
                ||
            'token' in cookies == false
        ) {
            throw Error('Token missing')
        }

        // if the token is not valid for some reason it throws an error
        jwt.verify(cookies['token'], (process.env.JWT_KEY as string))

        // if everything went right
        // call the next route callback
        next()
    }
    catch(e) {
        console.log(e)
        res.writeHead(401, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({errors: usernameNotLoggedIn}));
        return

    }
}
