const expressJwt = require("express-jwt");
const secretOrPrivateKey = "zhanup_key";

// 用express-jwt验证token
const jwtAuth = expressJwt({
  secret: secretOrPrivateKey,
  algorithms: ["HS256"],
}).unless({
  path: [
    '/api/article',
    '/api/article/like',
    '/api/article/addcomment',
    '/api/article/delcomment',
    '/api/message',
    '/api/message/new',
    '/api/message/reply',
    {url: /\/api\/article\/.*/, methods: ['GET']},
    {url: /\/api\/message\/.*/, methods: ['GET']},
    '/api/login',
    '/api/uploadToken',
    '/api/delUpload'
  ]
});

module.exports = jwtAuth;
