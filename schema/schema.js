const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLSchema } = graphql;

//dummyData 

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
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return authors.find(author => author.id === parent.authorId);
            }
        }
    })
})
const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books.filter(book => book.authorId === parent.id);
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
            resolve(parent, args) {
                //code to retrieve from db
                console.log(books.find(book => book.id === args.id))
                return books.find(book => book.id === args.id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //code to retrieve from db
                console.log(authors.find(author => author.id === args.id))
                return authors.find(author => author.id === args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return authors
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery
})