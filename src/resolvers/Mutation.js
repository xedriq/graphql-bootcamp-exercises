import uuidv4 from 'uuid/v4'

const Mutation = {
    createUser(parent, args, { db }, info) {
        const emailTaken = db.users.some(user => user.email === args.user.email)

        if (emailTaken) {
            throw new Error('Email is taken.')
        }

        const user = {
            id: uuidv4(),
            ...args.user
        }

        db.users.push(user)

        return user
    },

    deleteUser(parent, args, { db }, info) {
        const userIndex = db.users.findIndex(user => user.id === args.user.id)

        if (userIndex === -1) {
            throw new Error('User not found.')
        }

        const deletedUsers = db.users.splice(userIndex, 1)
    },

    updateUser(parent, args, { db }, info) {
        const user = db.users.find(user => user.id === args.id)

        if (!user) {
            throw new Error('User not found.')
        }

        if (typeof args.data.email === 'string') {
            const emailTaken = db.users.some(user => user.email === args.data.email)

            if (emailTaken) {
                throw new Error('Email is taken.')
            }

            user.email = args.data.email
        }

        if (typeof args.data.name === 'string') {
            user.name = args.data.name
        }

        if (typeof args.data.age !== 'undefined') {
            user.age = args.data.age
        }

        return user
    },

    createPost(parent, args, { db, pubsub }, info) {
        const userExist = db.users.some(user => user.id === args.post.author)

        if (!userExist) {
            throw new Error('User not found.')
        }

        const post = {
            id: uuidv4(),
            ...args.post
        }

        db.posts.push(post)

        if (args.post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            })
        }

        return post
    },

    deletePost(parent, args, { db, pubsub }, info) {
        const postIndex = db.posts.findIndex(post => post.id === args.id)

        if (postIndex === -1) {
            return new Error('No post found.')
        }

        const [post] = db.posts.splice(postIndex, 1)

        db.comments = db.comments.filter(comment => comment.postId !== args.id)

        if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: post
                }
            })
        }
        return post
    },

    updatePost(parent, args, { db, pubsub }, info) {
        const { title, body, published } = args.data
        const post = db.posts.find(post => post.id === args.id)
        const originalPost = { ...post }

        if (!post) {
            throw new Error('Post not found.')
        }

        if (typeof title === 'string') {
            post.title = title
        }

        if (typeof body === 'string') {
            post.body = body
        }

        if (typeof published === 'boolean') {
            post.published = published

            if (originalPost.published && !post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                })

            } else if (!originalPost.published && post.published) {
                // Create event
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            }
        } else if (post.published) {
            // Update
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }

        return post
    },

    createComment(parent, args, { db, pubsub }, info) {
        const userExist = db.users.some(user => user.id === args.comment.author)
        const postExist = db.posts.some(post => post.id === args.comment.postId)

        if (!userExist) {
            throw new Error('User not found.')
        }

        if (!postExist) {
            throw new Error('Post not found.')
        }

        const post = db.posts.find(post => post.id === args.comment.postId)

        if (!post.published) {
            throw new Error('Cannot comment on unpublished post.')
        }

        const comment = {
            id: uuidv4(),
            ...args.comment
        }

        db.comments.push(comment)

        pubsub.publish(`COMMENT ${args.comment.postId}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        })

        return comment
    },

    deleteComment(parent, args, { db, pubsub }, info) {
        const commentIndex = db.comments.findIndex(comment => comment.id === args.id)

        if (commentIndex === -1) {
            throw new Error('Comment not found.')
        }
        const removedComments = db.comments.splice(commentIndex, 1)

        pubsub.publish(`COMMENT ${removedComments[0].postId}`, {
            comment: {
                mutation: 'DELETED',
                data: removedComments[0]
            }
        })

        return removedComments[0]
    },

    updateComment(parent, { id, data }, { db, pubsub }, info) {
        const { text } = data
        const comment = db.comments.find(comment => comment.id === id)

        if (!comment) {
            throw new Error('Comment not found.')
        }

        if (typeof text === 'string') {
            comment.text = text
        }

        pubsub.publish(`COMMENT ${comment.postId}`, {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        })
        return comment
    }
}

export default Mutation