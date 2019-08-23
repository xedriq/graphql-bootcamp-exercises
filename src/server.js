import { GraphQLServer } from 'graphql-yoga'

// Dummy data
const users = [
    { id: '1', name: 'xedriq', email: 'xedriq@sample.com', age: 36 },
    { id: '2', name: 'cedrick', email: 'cedrick@sample.com' },
    { id: '3', name: 'charlotte', email: 'charlotte@sample.com' },
]

const posts = [
    { id: '11', title: 'test post 1', body: 'test body content 1', published: false, author: '1' },
    { id: '12', title: 'test post 2', body: 'test body content 2', published: true, author: '1' },
    { id: '13', title: 'test post 3', body: 'test body content 3', published: false, author: '2' },
]

const comments = [
    { id: '21', text: "Graphql is interesting!", author: '3' },
    { id: '22', text: "I want to master javascript.", author: '2' },
    { id: '23', text: "NodeJS is awesome!", author: '1' },
    { id: '24', text: "Be a front-end developer.", author: '2' },
]

// Type definitions (Schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        posts(query: String): [Post!]!
        post: Post!
        comments: [Comment!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts:[Post!]!
        comments:[Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
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
        },
        comments() {
            return comments
        }

    },

    Post: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author)
        }
    },

    User: {
        posts(parent, args, ctx, info) {
            return posts.filter(post => post.author === parent.id)
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.author === parent.id)
        }
    },

    Comment: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author)
        }
    }

}

const port = process.env.PORT
const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log(`Server is running on localhost:${port}`))