const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../schema/schema')
const cors = require('cors');
path = require('path');
const bodyParser = require('body-parser');

const app = express();



app.use(cors());
app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(4000, () => {
    console.log('now listening on port 4000')
})