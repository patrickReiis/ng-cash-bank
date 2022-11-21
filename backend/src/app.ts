import * as dotenv from 'dotenv'; 
dotenv.config();
import express, { Application } from 'express';
import { handleRegister } from './users/register/register';
import { handleLogin } from './users/login/login';

export const app:Application = express();

// middleware
app.use(express.json()); // parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })) // parses incoming requests with urlencoded payloads

app.post('/api/v1/register', handleRegister);

app.post('/api/v1/login', handleLogin);
