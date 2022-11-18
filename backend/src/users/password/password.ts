import * as argon2 from "argon2";

export async function getPasswordHashed(password: string): Promise<string>{
    // hash function accepts Buffer or string
    // if the hash function recieves an argument that is not allowed it throws an Error
    // so to prevent that I format the value to a string, just to make sure
    return argon2.hash(`${password}`);
}
