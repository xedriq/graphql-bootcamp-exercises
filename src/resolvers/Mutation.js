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
    createPost(parent, args, { db }, info) {
        const userExist = db.users.some(user => user.id === args.post.author)

        if (!userExist) {
            throw new Error('User not found.')
        }

        const post = {
            id: uuidv4(),
            ...args.post
        }

        db.posts.push(post)

        return post
    },

    deletePost(parent, args, { db }, info) {
        const postIndex = db.posts.findIndex(post => post.id === args.id)

        if (postIndex === -1) {
            return new Error('No post found.')
        }

        const deletedPosts = db.posts.splice(postIndex, 1)
        db.comments = db.comments.filter(comment => comment.postId !== args.id)
        return deletedPosts[0]
    },

    createComment(parent, args, { db }, info) {
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

        return comment
    },

    deleteComment(parent, args, { db }, info) {
        const commentIndex = db.comments.findIndex(comment => comment.id === args.id)

        if (commentIndex === -1) {
            throw new Error('Comment not found.')
        }
        const removedComments = db.comments.splice(commentIndex, 1)

        return removedComments[0]
    }
}

export default Mutation