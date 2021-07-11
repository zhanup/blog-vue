const article = require('./article')
const message = require('./message')
const login = require('./login')
const upload = require('./upload')

module.exports = function (app) {
    app.use(article)
    app.use(message)
    app.use(login)
    app.use(upload)
}
