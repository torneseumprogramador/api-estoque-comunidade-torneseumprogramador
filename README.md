# API Estoque da Comunidade Torne Se Um Programador

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
