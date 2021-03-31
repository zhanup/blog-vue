const express = require('express')
const multer  = require('multer')

const router = express.Router()

const storage = multer.diskStorage({
    //存储路径
    destination: function (req, file, cb) {
        cb(null, './public/upload')
    },
    //存储文件名
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

//运用存储器
const upload = multer({ storage: storage })

router.post('/api/upload', upload.single('image'), function (req, res, next) {
    //将存储后的文件名发还给前端
    res.send(req.file.filename)
})

module.exports = router