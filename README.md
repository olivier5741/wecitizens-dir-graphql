run `npm start` once

run `node server.js`

go to http://localhost:4000/graphql

search

```graphql
{
  profiles {
    identity {
      id
      key
      lastName
      email 
    }    
    personal {
      gsm
      address {
        city
      }
      birthDate
    }
    social {
      facebook
    }
    professional {
      education
    }
    political {
      quote
      slogan
    }
  }
}
```