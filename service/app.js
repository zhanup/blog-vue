const express = require('express')
const router = require('./api/index')
const jwtAuth = require('./auth')

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(jwtAuth)

//跨域设置(所有域名)
app.all('*', function (req, res, next) {
    //其中*表示允许所有域可跨
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.header('Access-Control-Allow-Methods', '*')
    res.header('Content-Type', 'application/json;charset=utf-8')
    next()
})

router(app)

app.listen(3000, () => {
    console.log('http://localhost:3000')
})
