const graphql = require('graphql');
const joinMonster = require('join-monster')
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLSchema } = graphql;
const { Client } = require('pg');
const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "anand",
    database: "books"
})

client.connect()


var books = [
    { name: 'Wings Of Fire', genre: 'auto biography', id: '1', authorId: '1' },
    { name: 'The three musketeers', genre: 'fiction', id: '2', authorId: '2' },
    { name: 'Robinson Crusoe', genre: 'fiction', id: '3', authorId: '3' },
    { name: 'Developments in Fluid Mechanics and Space Technology', genre: 'Science', id: '4', authorId: '1' }
]

var authors = [
    { name: 'APJ Abdul Kalam', id: '1' },
    { name: 'Alexandre Dumas', id: '2' },
    { name: 'Daniel Defoe', id: '3' }
]

const BookType = new GraphQLObjectType({
    name: "Book",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            async resolve(parent, args) {
                const res = await client.query(`SELECT * FROM authors WHERE id= ${parent.authorId} `)
                return (res.rows[0])
            }
        }
    })
})
const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        books: {
            type: new GraphQLList(BookType),
            async resolve(parent, args) {
                // return books.filter(book => book.authorId === parent.id);
                const res = await client.query(`SELECT * FROM books WHERE id= ${parent.id} `)
                return (res.rows)
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
                //code to retrieve from db
                const res = await client.query(`SELECT * FROM books WHERE id= ${args.id} `)
                return (res.rows[0])
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
                //code to retrieve from db
                const res = await client.query(`SELECT * FROM authors WHERE id= ${args.id} `)
                return (res.rows[0])
            }
        },
        books: {
            type: new GraphQLList(BookType),
            async resolve(parent, args) {
                const res = await client.query('SELECT * FROM books')
                // console.log(res.rows)
                return (res.rows)
            }

        },
        authors: {
            type: new GraphQLList(AuthorType),
            async resolve(parent, args) {
                const res = await client.query('SELECT * FROM authors')
                // console.log(res.rows)
                return (res.rows)
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery
})