const express = require('express')
const Models = require('../db')
const sortObj = require('../utils/sortObj')

const router = express.Router()
const mArticle = Models.Article

// 获取所有数据
router.get('/api/article', (req, res) => {
    mArticle.find({}).sort({ date: -1 }).exec((err, data) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(data)
    })
})

// 获取所有文章（归档）
router.get('/api/article/archive', (req, res) => {
    mArticle.find({}).sort({ date: -1 }).exec((err, data) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(data.map(item => {
            return {
                _id: item._id,
                title: item.title,
                date: item.date
            }
        }))
    })
})

router.get('/api/article/hotblogs', (req, res) => {
    mArticle.find({}).sort({ scan: -1 }).exec((err, data) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(data.slice(0, 5).map(item => {
            return {
                
                _id: item._id,
                title: item.title,
                date: item.date,
                tags: item.tags,
                coverUrl: item.coverUrl
            }
        }))
    })
})

// 查找标签列表
router.get('/api/article/tagList', (req, res) => {
    mArticle.find({}, (error, doc) => {
        if (error) {
            res.send(error)
            return
        }

        let tags = []
        let tagList = {}
        doc.forEach(item => {
            tags = [...new Set([...tags, ...item.tags])]
        })

        const len = tags.length
        
        for (let i = 0; i < len; i++) {
            mArticle.countDocuments({ tags: tags[i] }, (err, count) => {
                if (err) {
                    res.send(err)
                    return
                }

                tagList[tags[i]] = count

                if (i == (len - 1)) {
                    res.send({ tagList: sortObj(tagList) })
                }
            })
        }
    })
})

// 标签查找
router.get('/api/article/tags', (req, res) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const tag = req.query.tag
    mArticle.countDocuments({ tags: tag }, (error, count) => {
        if (error) {
            res.send(error)
            return
        }
        mArticle.find({ tags: tag }).skip((page - 1) *limit).limit(limit).sort({ date: -1 }).exec((err, data) => {
            if (err) {
                res.send(err)
                return
            }
            res.json({
                data,
                total: count
            })
        })
    })
    
})

// 分页查找
router.get('/api/article/data', (req, res) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    mArticle.countDocuments({}, (err, count) => {  //获取总长度
        if (err) {
            res.send({
                status: 400,
                msg: JSON.stringify(err)
            })
        } else {
            mArticle.find({}).skip((page - 1) * limit).limit(limit).sort({'date': -1}).exec((err, data) => {
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
router.post('/api/article/new', (req, res) => {
    console.log('new')
    new mArticle(req.body).save((err, data) => {
        if (err) {
            res.send(err)
            return
        }
        res.send('添加数据')
    })
})

// 删除数据
router.post('/api/article/delete', (req, res) => {
    mArticle.findByIdAndRemove(req.body.id, (err) => {
        if (err) {
            res.send(err)
            return
        }
        res.send('删除数据')
    })
})

// 更新数据
router.post('/api/article/update', (req, res) => {
    mArticle.findByIdAndUpdate(req.body.id, {
        title: req.body.title,
        tags: req.body.tags,
        coverUrl: req.body.coverUrl,
        abstract: req.body.abstract,
        content: req.body.content
    }, (err) => {
        if (err) {
            res.send(err)
            return
        }
        res.send('更新数据')
    })
})

// 查询数据
router.get('/api/article/:id', (req, res) => {
    mArticle.findById(req.params.id, (err, data) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(data)
        // 浏览量加一
        mArticle.findByIdAndUpdate(data._id, {scan: data.scan + 1}, function() {
                
        })
    })
})

// 点赞
router.post('/api/article/like', (req, res) => {
    mArticle.findById(req.body.id, (err, data) => {
        if (err) {
            res.send(err)
            return
        }
        mArticle.findByIdAndUpdate(req.body.id, { like: data.like + 1 }, function(err) {
            if (err) {
                res.send(err)
                return
            }
            res.send(data)
        })
    })
})

// 添加评论
router.post('/api/article/addcomment', (req, res) => {
    mArticle.updateMany({ _id: req.body.id }, { $push: {comments: {
        name: req.body.name,
        content: req.body.content,
        date: req.body.date
    }}}, (err, result) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(result)
    })
})

// 删除评论
router.post('/api/article/delcomment', (req, res) => {
    mArticle.updateMany({ _id: req.body.id }, { 
        $pull: { comments: { 
            _id: req.body.comId
        } 
    }}, err => {
        if (err) {
            res.send(err)
            return
        }
        res.send('删除成功')
    })
})

module.exports = router
    