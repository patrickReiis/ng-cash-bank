import { DataSource } from 'typeorm';
import { Account } from './entity/Account';
import { User } from './entity/User';
import { Transactions } from './entity/Transactions';

export const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'ng_cash',
    synchronize: true,
    logging: false,
    entities: [Account, User, Transactions],
    subscribers: [],
    migrations: [],
})

