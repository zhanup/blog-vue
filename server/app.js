const express = require('express')
const compression  = require('compression')
const bodyParser = require('body-parser')
const router = require('./api/index')
const jwtAuth = require('./auth')

const app = express()

app.use(compression())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(jwtAuth)

router(app)

app.listen(3000, () => {
    console.log('http://localhost:3000')
})
