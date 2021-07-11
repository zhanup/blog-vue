const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/mblog', { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useFindAndModify', false)

// 文章
const articleSchema = new Schema({
    title: String,
    abstract: String,
    content: String,
    coverUrl: String,
    date: String,
    tags: {
        type: Array,
        default: []
    },
    scan: {
        type: Number,
        default: 0
    },
    like: {
        type: Number,
        default: 0
    },
    comments: [{
        name: String,
        content: String,
        date: String
    }]
})

// 留言
const messageSchema = new Schema( {
    title: String,
    email: String,
    content: String,
    date: String,
    reply: {
        type: String,
        default: ''
    }
})

const Models = {
    Article: mongoose.model('Article', articleSchema),
    Message: mongoose.model('Message', messageSchema)
}

module.exports = Models
