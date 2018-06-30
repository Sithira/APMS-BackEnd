# APMS - Advance Project Mangement System

This is the BackEnd for the APMS written in NodeJS using AdonisJS.

1. User management
2. Project management
3. Project sprint management
4. Ticket Management

## Setup

use `adoins` command to download all the dependencies

```bash
adonis install
```

or manually clone the repo and then run `npm install`.

### The .env file
APMS Runs of on top of MongoDB. Make sure you have installed mongoDB.
Once database in place. edit the `.env` as to match your resources


### Running the server

For production usages for the APMS-BackEnd please run

```js
server --watch
```
or for development purposes
```js
adonis serve --dev
```

### Run the test 
```js
adonis test
```

### Angular 6 Client
[Client for APMS-BackEnd](https://github.com/Sithira/APMS-Client)

_AAF Assesment 2018 SHU - Sithira Munasinghe (27045236)_
