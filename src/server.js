import { GraphQLServer } from 'graphql-yoga'

// Dummy data
const users = [
    { id: 1, name: 'xedriq', email: 'xedriq@sample.com', age: 36 },
    { id: 2, name: 'cedrick', email: 'cedrick@sample.com' },
    { id: 3, name: 'charlotte', email: 'charlotte@sample.com' },
]

const posts = [
    { id: 1, title: 'test post 1', body: 'test body content 1', published: false },
    { id: 2, title: 'test post 2', body: 'test body content 2', published: true },
    { id: 3, title: 'test post 3', body: 'test body content 3', published: false },
]

// Type definitions (Schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        posts(query: String): [Post!]!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users
            }

            return users.filter(user => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        me() {
            return {
                id: 'sd234',
                name: 'xedriq',
                email: 'xedriq@gmail.com'
            }
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts
            }

            return posts.filter(post =>
                (post.title.toLowerCase().includes(args.query.toLowerCase()) ||
                    post.body.toLowerCase().includes(args.query.toLowerCase()))
            )
        },
        post() {
            return {
                id: '2343',
                title: 'Testing Title',
                body: 'Testing body content',
                published: false
            }
        }

    }
}

const port = process.env.PORT
const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log(`Server is running on localhost:${port}`))