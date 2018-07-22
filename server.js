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
    firstname: String
    lastname: String
  }
`);

const sequelize = new Sequelize('mysql://root:root@localhost:3306/wecitizens_poldir');

function search() {
    
}

// The root provides a resolver function for each API endpoint
let root = {
    politicians: () => {
        const q = 'SELECT id, ident as `key`, name as firstname, surname as lastname FROM wecitizens_poldir.politician;';

        let p = new Promise((resolve, reject) => {
            sequelize.query(q).spread((results, metadata) => {
                resolve(results);
                //return results;
            });
        });
        
        return Promise.resolve(p);
    },
};

let app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');