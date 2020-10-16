# API Estoque da Comunidade Torne Se Um Programador

## How to start this application
---
### Install dependencies
```sh
yarn # or npm install
```
---
### Setup databases
---
- [] Make sure you have postgres database started
- [] Change the file ormconfig.json with your configurations
- [] Create your database
- [] Run this command
```sh
yarn typeorm migration:run # or npm run typeorm migration:run
```
---
### Start the application
```sh
yarn start # or npm start
```
This app is running on http://localhost:3333
---
## Routes
---
```js
// Routes
// Users
POST /users
  BODY
    name: string
    email: string,
    password: string

// Sessions
POST /sessions
  BODY
    email: string
    password: string

// Authenticated Routes
// Transactions
GET /transactions
POST /transactions
  BODY
    title: string,
    category: string,
    value: number,
    date: Date
    type: 'income' | 'outcome',
PUT /transactions/:id
  BODY
  title: string,
  category: string,
  value: number,
  date: Date,
  type: 'income' | 'outcome'

DELETE /transactions/:id
```

if you have all routes
get the file Insomnia.json and import this in Insomnia
