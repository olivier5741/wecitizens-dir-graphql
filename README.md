run `npm start` once

run `node server.js`

go to http://localhost:4000/graphql

**get all profiles**

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

**get a profile**

```graphql
{
  Profile(id:235) {
    identity {
      key
    }
    political {
      function
    }
  }
}
```