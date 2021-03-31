# blog-vue

## 主要技术构成

前端主要技术栈为vue.js、vue-router、 axios

后端主要技术栈为node.js、Express、 mongodb

## Setup

运行环境

- node.js
- mongoDB

克隆远程库

```
git clone https://github.com/zhanup/blog-vue.git
```

进入项目目录 `blog-vue` 后，安装依赖

```
npm install
```

安装完数据库后，启动 mongodb。

```
mongod
```

`cd` 进入 `blog-vue` 目录下的 `server` 文件夹，进入运行服务器。（确保数据库mongodb已经启动）

```
node app.js
```

等待一会后，在`blog-vue` 目录下启动项目

```
npm run serve
```