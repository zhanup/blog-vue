const { query } = require('express')
const express = require('express')
const Models = require('../db')

const router = express.Router()
const mMessage = Models.Message

// 获取所有数据
router.get('/api/message', (req, res) => {
    mMessage.find({}).sort({ date: -1 }).exec((err, data) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(data)
    })
})

// 数据分页
router.get('/api/message/data', (req, res) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    mMessage.countDocuments({}, (err, count) => {  //获取总长度
        if (err) {
            res.send({
                status: 400,
                msg: JSON.stringify(err)
            })
        } else {
            mMessage.find({}).skip((page - 1) * limit).limit(limit).sort({'date': -1}).exec((err, data) => {
                if (err) {
                    res.send({
                        status: 400,
                        msg: JSON.stringify(err)
                    })
                } else {
                    res.send({
                        status: 200,
                        data: data,
                        total: count
                    })
                }
            })
        }
    })
    
})

// 添加数据
router.post('/api/message/new', (req, res) => {
    new mMessage(req.body).save(err => {
        if (err) {
            res.send(err)
            return
        }
        res.send('数据添加成功')
    })
})

//删除数据
router.post('/api/message/delete', (req, res) => {
    mMessage.findByIdAndRemove(req.body.id, (err) => {
        if (err) {
            res.send(err)
            return
        }
        res.send('数据删除成功')
    })
})

// 回复留言
router.post('/api/message/reply', (req, res) => {
    mMessage.findByIdAndUpdate(req.body.id, { reply: req.body.reply }, err => {
        if (err) {
            res.send(err)
            return
        }
        res.send('回复成功')
    })
})

module.exports = router
    