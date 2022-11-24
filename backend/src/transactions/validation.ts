import { onlyLettersAndUnderscore } from '../users/register/validation';
import { dataSource } from '../db/get-data-source';
import { Account } from '../db/entity/Account';
import { User } from '../db/entity/User';

// account is the user that will be cashed-in 

const accountUserDoesNotExist = `The user you wish to cash-in does not exist`;
const invalidKeys = `The only allowed and required keys are 'account' and 'amount'`;
const amountMissing = `'amount' key is missing`; 
const accountMissing = `'account' key is missing`;
const amountIsNotValidNumber = `Amount must be a whole number or a floating point number with the limit of 2 decimals digits`;
const accountInvalid = `Invalid account user`;
const accountDoesNotExist = `The account you wish to cash-in does not exist`;


type BodyGeneric = { [key: string]: any}

export async function getAllTransactionValidation(body: object) {
    const errorMessages:string[][] = [
        await transactionValidate(body, accountValidate),
        await transactionValidate(body, amountValidate),
        await transactionValidate(body, keysValidate),
    ]

    // returning array 1D instead of array 2D
    return ([] as string[]).concat(...errorMessages); 
}

async function transactionValidate(body: BodyGeneric, callback: Function) {
    return callback(body);
}

async function accountValidate(body:BodyGeneric):Promise<string[]> {
    const errors:string[] = []

    if ('account' in body == false) {
        errors.push(accountMissing)
        return errors
    }

    if (onlyLettersAndUnderscore.test(body.account) == false) {
        errors.push(accountInvalid)
        return errors
    }

    // checking if target exists
    const accountTarget = await dataSource.getRepository(User).findOneBy({ username: body.account}) 
    if (accountTarget == null) {
        errors.push(accountDoesNotExist);
        return errors
    }

    return errors 
}

async function amountValidate(body:BodyGeneric):Promise<string[]> {
    // amount can have 2 formats:
    //
    // 1. whole number
    // example: 232 (ok), 2 (ok), 2f2 (NOT ok)
    //
    // 2. floating point number with the limit of 2 decimals digits
    // example: 232.02 (ok), 666.66 (ok), 23.234 (NOT ok), 1.0001 (NOT ok) 
    //
    // as of nov 22, 2022 I don't have much knowledge in regex so I will perform this validation in the worst possible way
    
    const errors:string[] = []

    if ('amount' in body == false) {
        errors.push(amountMissing);
        return errors
    }
    if (typeof body['amount'] !== 'number') {
        errors.push(amountIsNotValidNumber);
        return errors
    }

    const onlyNumbers = /^[0-9]+$/;
    if (onlyNumbers.test(body['amount'] as unknown as string) == true) {
        return errors
    }

    // if the code reaches here it means that the number is (potentially) a floating point number
    

    const numberString = String(body['amount']);
    const numberSplit = numberString.split('.');
    // splitting a floating point number by dot should have a length of 2
    // example: 23.25 -> [23, 25]
    if (numberSplit.length !== 2) {
        errors.push(amountIsNotValidNumber)
        return errors 
    }

    const wholeNumber = numberSplit[0];
    const decimalNumber = numberSplit[1];
    if (
        onlyNumbers.test(wholeNumber) === true
                &&
        onlyNumbers.test(decimalNumber) === true
                &&
        decimalNumber.length === 2 
       ) {
           return errors
    } else {
        errors.push(amountIsNotValidNumber)
        return errors 
    }
}

async function keysValidate(body:BodyGeneric):Promise<string[]> {
    const errors:string[] = []
    const keys = Object.keys(body);

    if (
        keys.length !== 2 
            ||
        'amount' in body == false
            ||
        'account' in body == false
    ) {
        errors.push(invalidKeys);
    }

    return errors 
}
