// this file is only responsible of validating the body object
// it does NOT validate wheter the user exists or not

import { notValidKeys, passwordRestriction, onlyLettersAndUnderscore, minimumUsernameCharacters, usernameMaxLength, minimumPasswordCharacters } from '../register/validation';

// error messages
export const usernameDoesNotExists = `Couldn't find this username`;
export const passwordIsWrong = `Password is wrong`;
const invalidUsername = `This username is not valid`;
const invalidPassword = `This password is not valid`;

export async function getAllLoginValidation(body: any) {
    const errorMessages:string[][] = [
            await loginValidate(body, usernameValidate),
            await loginValidate(body, passwordValidate),
            await loginValidate(body, keysValidate)
    ];

    // returning array 1D instead of array 2D
    return ([] as string[]).concat(...errorMessages); 
} 

async function loginValidate(body: any, callback: Function) {
    return callback(body);
}

async function keysValidate(body: any) {
    const errorMessages:string[] = []

    const keys = Object.keys(body);
    if (keys.length > 2 || keys.length == 1) {
        errorMessages.push(notValidKeys);
    }

    return errorMessages
}

async function passwordValidate(body:any) {
    const errorMessages:string[] = []

    // body is NOT an object
    if (typeof body != 'object' || Array.isArray(body) == true) {
        errorMessages.push(invalidPassword);
    }

    // body is an object but misses 'password' key
    else if ('password' in body == false) {
        errorMessages.push(invalidPassword);
    }

    // body has password key but the value is not a string
    else if (typeof body['password'] != 'string') {
        errorMessages.push(invalidPassword);
    }

    // body has password key but the value is not valid according to regex
    else if (passwordRestriction.test(body['password']) == false) {
        errorMessages.push(invalidPassword);
    }

    // password key does not sufficient length
    else if (body['password'].length < minimumPasswordCharacters){
        errorMessages.push(invalidPassword);
    }

    return errorMessages

}

async function usernameValidate(body:any) {
    const errorMessages:string[] = []

    // body is NOT an object
    if (typeof body != 'object' || Array.isArray(body) == true) {
        errorMessages.push(invalidUsername);
    }

    // body is an object but misses 'username' key
    else if ('username' in body == false) {
        errorMessages.push(invalidUsername);
    }

    // body has username key but the value is not a string
    else if (typeof body['username'] != 'string') {
        errorMessages.push(invalidUsername);
    }

    // body has username key but the value is not valid according to regex
    else if (onlyLettersAndUnderscore.test(body['username']) == false) {
        errorMessages.push(invalidUsername);
    }

    // username key does not sufficient length
    else if (body['username'].length < minimumUsernameCharacters){
        errorMessages.push(invalidUsername);
    }

    return errorMessages
}
