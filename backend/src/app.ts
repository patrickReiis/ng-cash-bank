import express, { Application } from 'express';
import { handleRegister } from './users/register/register';

export const app:Application = express();

// middleware
app.use(express.json()); // parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })) // parses incoming requests with urlencoded payloads

app.post('/api/v1/register', handleRegister);
