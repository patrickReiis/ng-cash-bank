// minimum username characters
const minimumUsernameCharacters = 3;

// username error messages
const usernameNotEnoughCharacters = `The username must have at least ${minimumUsernameCharacters} characters`; 
const usernameInvalidCharacters = `The username can only be made of letters and/or underscore between letters. Example: john_doe, johndoe, jo_hn_doe`;
const usernameAlreadyExists = `Choose another username`;

// minimum password characters
const minimumPasswordCharacters = 8;

// password error messages
const passwordNotEnoughCharacters = `The password must have at least ${minimumPasswordCharacters} characters`; 
const passwordMissesSpecialCharacters = `The password needs at least one number and one upper case letter`; 


// basic rules error messages
const notValidKeys = ``;
const usernameKeyMissing = `Username key is missing`;
const usernameMustBeString = `Username must be a string`;

// pasword validate calls others and return, maybe

export async function getAllRegisterValidation(body:any){

    const errorMessages = [
        await registerValidate(body, usernameValidate),
        await registerValidate(body, passwordValidate),
        await registerValidate(body, keysValidate)
    ];
}

type BodyGeneric = { [ k: string ]: any}

async function registerValidate(body: BodyGeneric, callback:Function) {
    return await callback(body);
}

async function usernameValidate(body: BodyGeneric):Promise<Array<string>> {
    const errors:string[] = []

    if ('username' in body === false) {
        errors.push(usernameKeyMissing); 
        return errors
    }

    if (typeof body.username !== 'string') {
        errors.push(usernameMustBeString); 
        return errors
    }

    if (body.username.length < minimumUsernameCharacters) {
        errors.push(usernameNotEnoughCharacters); 
    }    

    return errors
}

async function passwordValidate(body: BodyGeneric) {
}

async function keysValidate(body: BodyGeneric) {
}
