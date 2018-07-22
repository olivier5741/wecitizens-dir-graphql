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
  }
`);

// The root provides a resolver function for each API endpoint
let root = {
    politicians: () => {
        return [
            {
                id: "1421",
                key: "o.wouters",
                firstName: "Olivier",
                lastName: "Wouters"
            },
            {
                id: "1422",
                key: "d.sum",
                firstName: "Daniel",
                lastName: "Sum"
            }];
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