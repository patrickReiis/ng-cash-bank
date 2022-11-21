import { dataSource } from '../../db/get-data-source';
import { User } from '../../db/entity/User';

// minimum username characters
export const minimumUsernameCharacters = 3;

export const usernameMaxLength = 355 as const;

// username error messages
const usernameNotEnoughCharacters = `The username must have at least ${minimumUsernameCharacters} characters`; 
const usernameInvalidCharacters = `The username can only be made of ASCII letters and/or underscore between letters. Example: john_doe, johndoe, jo_hn_doe`;
const usernameAlreadyExists = `Choose another username`;
const usernamePassedMaxLength = `The username length cannot be greater than ${usernameMaxLength}`;

// only letters and underscore between letters
export const onlyLettersAndUnderscore = /^([a-zA-Z]+_)*[a-zA-Z]+$/; 

// matches any string that has at least 1 number and 1 upper case letter
export const passwordRestriction = /^(?:(?=.*\d)(?=.*[A-Z]).*)$/

// minimum password characters
export const minimumPasswordCharacters = 8;

// password error messages
const passwordNotEnoughCharacters = `The password must have at least ${minimumPasswordCharacters} characters`; 
const passwordMissesSpecialCharacters = `The password needs at least one number and one upper case ASCII letter`; 


// basic rules error messages
export const notValidKeys = `The only allowed and required keys are 'username' and 'password'`;
const usernameKeyMissing = `Username key is missing`;
const usernameMustBeString = `Username must be a string`;
const passwordKeyMissing = `Password key is missing`;
const passwordMustBeString = `Password mustt be a string`;

// pasword validate calls others and return, maybe

export async function getAllRegisterValidation(body:any){

    const errorMessages = [
        await registerValidate(body, usernameValidate),
        await registerValidate(body, passwordValidate),
        await registerValidate(body, keysValidate)
    ];

    // returning array 1D instead of array 2D
    const errorMessages1D:string[] = [].concat(...errorMessages);
    
    return errorMessages1D
}

type BodyGeneric = { [ k: string ]: any}

async function registerValidate(body: BodyGeneric, callback:Function) {
    return await callback(body);
}

async function usernameValidate(body: BodyGeneric):Promise<Array<string>> {
    const errors:string[] = []

    // username key must be in object
    if ('username' in body === false) {
        errors.push(usernameKeyMissing); 
        return errors
    }

    // username value must be a string
    if (typeof body.username !== 'string') {
        errors.push(usernameMustBeString); 
        return errors
    }


    // checking if username already exists
    if (await doesUsernameExists(body.username) == true) {
        errors.push(usernameAlreadyExists);
        return errors
    }


    // username needs to have at least X length
    if (body.username.length < minimumUsernameCharacters) {
        errors.push(usernameNotEnoughCharacters); 
    }    

    // username needs to have X regex pattern
    if (onlyLettersAndUnderscore.test(body.username) == false) {
        errors.push(usernameInvalidCharacters); 
    }

    // username cannot have a length greater than 355
    if (body.username.length > usernameMaxLength) {
        errors.push(usernamePassedMaxLength); 
    }

    return errors
}

async function passwordValidate(body: BodyGeneric) {
    const errors:string[] = [];

    // password key must be in object
    if ('password' in body == false) {
        errors.push(passwordKeyMissing); 
        return errors
    } 

    // password value must be a string
    if (typeof body.password !== 'string') {
        errors.push(passwordMustBeString); 
        return errors
    }

    if (body.password.length < minimumPasswordCharacters) {
        errors.push(passwordNotEnoughCharacters);
    }

    if (passwordRestriction.test(body.password) == false) {
        errors.push(passwordMissesSpecialCharacters);
    }


    return errors
}

async function keysValidate(body: BodyGeneric) {
    const errors:string[] = []

    // to register the only keys allowed are username and password
    const keys = Object.keys(body);
    if (keys.length > 2 || keys.length == 1) {
        errors.push(notValidKeys);
    }
    return errors
}

async function doesUsernameExists(username:string):Promise<boolean> {
    const errors = [];
    const user = await dataSource.getRepository(User).findOneBy({ username: username }); 

    if (user == null) {
        return false
    }
    errors.push(usernameAlreadyExists);
    return true
}
