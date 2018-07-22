const Sequelize = require('sequelize');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const {buildSchema} = require('graphql');

// Construct a schema, using GraphQL schema language
let schema = buildSchema(`
  scalar Date

  type Query {
    Profile(id: Int): Profile
    Profiles: [Profile]!
  }
  
  type Profile {
    id: Int
    identity: IdentityProfile
    personal: PersonalProfile
    political: PoliticalProfile
    professional: ProfessionalProfile
    social: SocialProfile
    achievements: [String]
    priorities: [String]
  }
  
  type IdentityProfile {
    id: String
    key: String
    firstName: String
    lastName: String
    title: String
    titleSpoken: String
    email: String
  }
  
  type PersonalProfile {
    email: String
    phone: String
    gsm: String
    fax: String
    address: Address
    birthDate: Date
    birthPlace: String
    deathDate: Date
    gender: String
    language: String
    numberOfChildren: Int
    belief: String
  }
  
  type Address {
    street: String
    zipcode: String
    city: String
  }
  
  type PoliticalProfile {
    function: String
    slogan: String
    quote: String
  }
  
  type ProfessionalProfile {
    education: String
    experience: String
  }
    
  type SocialProfile {
    facebook: String
    twitter: String
    flickr: String
    website: String
    xing: String
    youtube: String
  }
  
`);

const sequelize = new Sequelize('mysql://root:root@localhost:3306/wecitizens_poldir');

function search() {
    
}

const q = "select\n" +
    "  id,\n" +
    "  ident                            as `identity.key`,\n" +
    "  name                             as `identity.firstName`,\n" +
    "  surname                          as `identity.lastName`,\n" +
    "  title_written                    as `identity.title`,\n" +
    "  title_spoken                     as `identity.titleSpoken`,\n" +
    "  email                            as `identity.email`,\n" +
    "\n" +
    "  #  id_party as `party.id`,\n" +
    "\n" +
    "  home_phone                       as `personal.phone`,\n" +
    "  home_email                       as `personal.email`,\n" +
    "  home_fax                         as `personal.fax`,\n" +
    "  home_gsm                         as `personal.gsm`,\n" +
    "\n" +
    "  home_street                      as `personal.address.street`,\n" +
    "  home_city                        as `personal.address.city`,\n" +
    "  home_postcode                    as `personal.address.postcode`,\n" +
    "\n" +
    "  personal_birth                   as `personal.birthDate`,\n" +
    "  personal_birthplace              as `personal.birthPlace`,\n" +
    "  personal_date_of_death           as `personal.deathDate`,\n" +
    "  personal_gender                  as `personal.gender`,\n" +
    "  personal_language                as `personal.language`,\n" +
    "  personal_children                as `personal.numberOfChildren`,\n" +
    "  personal_belief                  as `personal.belief`,\n" +
    "\n" +
    "  personal_education               as `professional.education`,\n" +
    "  personal_professional_experience as `professional.experience`,\n" +
    "\n" +
    "  social_facebook                  as `social.facebook`,\n" +
    "  social_flickr                    as `social.flickr`,\n" +
    "  social_twitter                   as `social.twitter`,\n" +
    "  social_website                   as `social.website`,\n" +
    "  social_xing                      as `social.xing`,\n" +
    "  social_youtube                   as `social.youtube`,\n" +
    "\n" +
    "  success1                         as `achievements.1`,\n" +
    "  success2                         as `achievements.2`,\n" +
    "  success3                         as `achievements.3`,\n" +
    "\n" +
    "  priority1_text                   as `priorities.1`,\n" +
    "  priority2_text                   as `priorities.2`,\n" +
    "  priority3_text                   as `priorities.3`,\n" +
    "  priority4_text                   as `priorities.4`,\n" +
    "\n" +
    "  #  personal_electoral_score         as `political.election.score1`,\n" +
    "  #  electoral_score                  as `political.election.score1`,\n" +
    "  #  electoral_score_vote             as `political.election.vote`,\n" +
    "\n" +
    "  political_function               as `political.function`,\n" +
    "  slogan                           as `political.slogan`,\n" +
    "  quotes                           as `political.quote`\n" +
    "\n" +
    "#  parliament_activity              as `political.parliament.activity`\n" +
    "from\n" +
    "  wecitizens_poldir.politician";

// The root provides a resolver function for each API endpoint
let root = {
    Profiles: () => {        
        let p = new Promise((resolve, reject) => {
            sequelize.query(q).spread((results, metadata) => {
                
                resolve((results.map(r => removeEmpty(unflatten(r)))));
                //return results;
            });
        });
        
        return Promise.resolve(p);
    },
    Profile: (request) => {
        let p = new Promise((resolve, reject) => {
            // BUG sql injection
            let q1 = q + " where id = " + request.id;
            sequelize.query(q1).spread((results, metadata) => {

                resolve(removeEmpty(unflatten(results[0])));
                //return results;
            });
        });

        return Promise.resolve(p);
    },
};

const removeEmpty = (obj) => {
    const o = JSON.parse(JSON.stringify(obj)); // Clone source oect.

    Object.keys(o).forEach(key => {
        if (o[key] && typeof o[key] === 'object')
            o[key] = removeEmpty(o[key]);  // Recurse.
        else if (o[key] === undefined || o[key] === null)
            delete o[key]; // Delete undefined and null.
        else
            o[key] = o[key];  // Copy value.
    });

    return o; // Return new object.
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