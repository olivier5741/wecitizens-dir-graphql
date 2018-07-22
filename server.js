const Sequelize = require('sequelize');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const {buildSchema} = require('graphql');

// Construct a schema, using GraphQL schema language
let schema = buildSchema(`
  type Query {
    politicians: [Politician]!
  }
  
  type Politician {
    id: String
    key: String
    firstName: String
    lastName: String
    email: String
    personal: PoliticianPersonal
  }
  
  type PoliticianPersonal {
    email: String
    phone: String
    gsm: String
    fax: String
    address: Address
  }
  
  type Address {
    street: String
    zipcode: String
    city: String
  }
`);

const sequelize = new Sequelize('mysql://root:root@localhost:3306/wecitizens_poldir');

function search() {
    
}

// The root provides a resolver function for each API endpoint
let root = {
    politicians: () => {
        const q = "select\n" +
            "  id,\n" +
            "  ident       as `key`,\n" +
            "  name        as firstName,\n" +
            "  surname     as lastName,\n" +
            "  email,\n" +
            "  home_phone  as `personal.phone`,\n" +
            "  home_email  as `personal.email`,\n" +
            "  home_fax    as `personal.fax`,\n" +
            "  home_gsm    as `personal.gsm`,\n" +
            "  home_street as `personal.address.street`,\n" +
            "  home_city as `personal.address.city`,\n" +
            "  home_postcode as `personal.address.postcode`\n" +
            "from\n" +
            "  wecitizens_poldir.politician;";
        
        let p = new Promise((resolve, reject) => {
            sequelize.query(q).spread((results, metadata) => {
                
                resolve(results.map(r => unflatten(r)));
                //return results;
            });
        });
        
        return Promise.resolve(p);
    },
};

function unflatten(data) {
    let result = {};
    for (let i in data) {
        let keys = i.split('.');
        keys.reduce(function(r, e, j) {
            return r[e] || (r[e] = isNaN(Number(keys[j + 1])) ? (keys.length - 1 == j ? data[i] : {}) : [])
        }, result)
    }
    return result
}

let app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');