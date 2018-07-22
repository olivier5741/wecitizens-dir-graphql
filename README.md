run `npm start` once

run `node server.js`

go to http://localhost:4000/graphql

search

```graphql
{
  politicians {
    id
    key
    lastName
    email
    personal {
      gsm
      address {
        city
      }
      birthDate
    }
    achievements
  }
}
```