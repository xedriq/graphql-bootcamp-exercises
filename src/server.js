import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

// Dummy data
let users = [
    { id: '1', name: 'xedriq', email: 'xedriq@sample.com', age: 36 },
    { id: '2', name: 'cedrick', email: 'cedrick@sample.com' },
    { id: '3', name: 'charlotte', email: 'charlotte@sample.com' },
]

let posts = [
    { id: '11', title: 'GraphQL 101', body: 'test body content 1', published: false, author: '1' },
    { id: '12', title: 'GraphQL 201', body: 'test body content 2', published: true, author: '1' },
    { id: '13', title: 'GraphQL 301', body: 'test body content 3', published: false, author: '2' },
]

let comments = [
    { id: '21', text: "Graphql is interesting!", author: '3', postId: '11' },
    { id: '22', text: "I want to master javascript.", author: '2', postId: '11' },
    { id: '23', text: "NodeJS is awesome!", author: '1', postId: '12' },
    { id: '24', text: "Be a front-end developer.", author: '2', postId: '13' },
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

    type Mutation {
        createUser(user: CreateUserInput!):User!
        deleteUser(id: ID!): User!
        createPost(post: CreatePostInput!):Post!
        deletePost(id:ID!): Post!
        createComment(comment: CreateCommentInput!):Comment!
        deleteComment(id:ID!):Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateCommentInput {
        text: String!
        author: ID!
        postId: ID!
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
        comments:[Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
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

    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some(user => user.email === args.user.email)

            if (emailTaken) {
                throw new Error('Email is taken.')
            }

            const user = {
                id: uuidv4(),
                ...args.user
            }

            users.push(user)

            return user
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex(user => user.id === args.user.id)

            if (userIndex === -1) {
                throw new Error('User not found.')
            }

            const deletedUsers = users.splice(userIndex, 1)



        },
        createPost(parent, args, ctx, info) {
            const userExist = users.some(user => user.id === args.post.author)

            if (!userExist) {
                throw new Error('User not found.')
            }

            const post = {
                id: uuidv4(),
                ...args.post
            }

            posts.push(post)

            return post
        },
        deletePost(parent, args, ctx, info) {
            const postIndex = posts.findIndex(post => post.id === args.id)

            if (postIndex === -1) {
                return new Error('No post found.')
            }

            const deletedPosts = posts.splice(postIndex, 1)
            comments = comments.filter(comment => comment.postId !== args.id)
            return deletedPosts[0]
        },
        createComment(parent, args, ctx, info) {
            const userExist = users.some(user => user.id === args.comment.author)
            const postExist = posts.some(post => post.id === args.comment.postId)

            if (!userExist) {
                throw new Error('User not found.')
            }

            if (!postExist) {
                throw new Error('Post not found.')
            }

            const post = posts.find(post => post.id === args.comment.postId)

            if (!post.published) {
                throw new Error('Cannot comment on unpublished post.')
            }

            const comment = {
                id: uuidv4(),
                ...args.comment
            }

            comments.push(comment)

            return comment
        },
        deleteComment(parent, args, ctx, info) {
            const commentIndex = comments.findIndex(comment => comment.id === args.id)

            if (commentIndex === -1) {
                throw new Error('Comment not found.')
            }
            const removedComments = comments.splice(commentIndex, 1)

            return removedComments[0]
        }
    },

    Post: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author)
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.postId === parent.id)
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
        },

        post(parent, args, ctx, info) {
            return posts.find(post => post.id === parent.postId)
        }
    }

}

const port = process.env.PORT
const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log(`Server is running on localhost:${port}`))