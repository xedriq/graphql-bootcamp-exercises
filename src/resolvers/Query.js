const Query = {
    users(parent, args, { db }, info) {
        if (!args.query) {
            return db.users
        }

        return db.users.filter(user => {
            return user.name.toLowerCase().includes(args.query.toLowerCase())
        })
    },

    posts(parent, args, { db }, info) {
        if (!args.query) {
            return db.posts
        }

        return db.posts.filter(post =>
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
    comments(parent, args, { db }, info) {
        return db.comments
    }
}

export default Query