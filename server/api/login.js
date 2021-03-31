const express = require('express')
const jwt = require('jsonwebtoken')

const router = express.Router()
const secretOrPrivateKey = 'zhanup_key'

router.post("/api/login", function(req, res) {
    const { username, password } = req.body
    // 用jsonwebtoken生产token
    const token = jwt.sign(
        { name: 'zhanup' },
        secretOrPrivateKey,
        { expiresIn: 60 * 60 * 24 }
    );
    if (username == 'zhanup' && password === 'quan123456') {
        res.status(200).json({
        token: token
    })} else {
        res.status(401).send('验证失败')
    }
})

router.get('/api/authority', (req, res) => {
    res.send();
})

module.exports = router;
