const express = require('express')
const qiniu = require('qiniu')
const router = express.Router()

const accessKey = 'jvh_kjPEwc9gT3LtCxhtrc8ZyfRyFKGDjdpps2MJ'
const secretKey = 'QYUEPF27GPgbeGa9IpGX259zdxapblNijzW_B_wX'
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

const bucket = 'zhanup'
const options = {
    scope: bucket,
    expires: 7200
}
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)  // 创建上传凭证

// 资源管理相关的操作, 构建BucketManager对象
const config = new qiniu.conf.Config()
config.zone = qiniu.zone.Zone_z0
const bucketManager = new qiniu.rs.BucketManager(mac, config)

router.get('/api/uploadToken', (req, res) => {
    // 返回七牛云上传所需的token
    res.send(uploadToken)
})

// 删除空间中的文件
router.post('/api/delUpload', (req, res) => {
    // console.log(req.body.key)
    const key = req.body.key
    bucketManager.delete(bucket, key, function(err, respBody, respInfo) {
        if (err) {
          console.log(err)
          //throw err;
          res.send(err)
        } else {
          res.send(respInfo)
        }
    });
})

module.exports = router