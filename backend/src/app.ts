import * as dotenv from 'dotenv'; 
dotenv.config();
import express, { Application } from 'express';
import { handleRegister } from './users/register/register';
import { handleLogin } from './users/login/login';
import { isUserAuthenticated } from './users/authentication/authentication';
import cookieParser from 'cookie-parser';
import { handleTransaction } from './transactions/transaction';
import { handleShowBalance } from './utils/balance';

export const app:Application = express();

// middleware
app.use(express.json()); // parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })) // parses incoming requests with urlencoded payloads
app.use(cookieParser()) // automatically formats cookies

app.post('/api/v1/register', handleRegister);

app.post('/api/v1/login', handleLogin);

app.post('/api/v1/transaction', isUserAuthenticated, handleTransaction)

app.get('/api/v1/balance', isUserAuthenticated, handleShowBalance)
