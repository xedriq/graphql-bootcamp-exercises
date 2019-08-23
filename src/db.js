// Dummy data
const users = [
    { id: '1', name: 'xedriq', email: 'xedriq@sample.com', age: 36 },
    { id: '2', name: 'cedrick', email: 'cedrick@sample.com' },
    { id: '3', name: 'charlotte', email: 'charlotte@sample.com' },
]

const posts = [
    { id: '11', title: 'GraphQL 101', body: 'test body content 1', published: false, author: '1' },
    { id: '12', title: 'GraphQL 201', body: 'test body content 2', published: true, author: '1' },
    { id: '13', title: 'GraphQL 301', body: 'test body content 3', published: false, author: '2' },
]

const comments = [
    { id: '21', text: "Graphql is interesting!", author: '3', postId: '11' },
    { id: '22', text: "I want to master javascript.", author: '2', postId: '11' },
    { id: '23', text: "NodeJS is awesome!", author: '1', postId: '12' },
    { id: '24', text: "Be a front-end developer.", author: '2', postId: '13' },
]

const db = {
    users,
    posts,
    comments
}

export default db