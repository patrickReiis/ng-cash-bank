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

## Compile typescript to javascript
```
$ npm run build
```

## Run the compiled javascript
```
$ npm run start
```

## Endpoints
#### All POST methods required JSON as body format

1. Creating a new User and new Account
  - url: /api/v1/register
  - method: POST
  - body format: { username: string; password: string}
  - response:
    - 200:
      - body format: { success: string }
    - 400:
      - body format: { errors: string[] }
2. Logging in
  - url: /api/v1/login
  - method: POST
  - body format: { username: string; password: string}
  - response:
    - 200:
      - body format: { success: string }
      - cookie:
        - description: Returns a cookie with the JWT token
        - cookie format: token=JWT
    - 400:
      - body format: { errors: string[] }
    - 404:
      - body format: { errors: string[] }
      - description: User not found
