# ng-cash-bank
Bank System that has user authentication and financial transactions

This project is a tech challenge for the company [ng cash](https://ng.cash/)

## How to run

## Create database
```
$ psql postgres

postgres=# CREATE DATABASE ng_cash;
postgres=# \q
```

## Setup enviorement variables
Inside the root directory create a .env file. The .env file requires the following structure:
```
DB_USERNAME=
DB_PASSWORD=
JWT_KEY=
```
The JWT_KEY can be anything, the DB_USERNAME and DB_PASSWORD are your PostgreSQL credentials

## Install dependencies
```
$ npm install
```

# Compile typescript to javascript
```
$ npm run build
```

# Run the compiled javascript
```
$ npm run start
```
