import { GraphQLServer } from 'graphql-yoga'

import db from './db'

import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import User from './resolvers/User'
import Comment from './resolvers/Comment'
import Post from './resolvers/Post'

const port = process.env.PORT
const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        User,
        Post,
        Comment
    },
    context: {
        db
    }
})

server.start(() => console.log(`Server is running on localhost:${port}`))