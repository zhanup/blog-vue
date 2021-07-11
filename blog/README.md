# blog-vue

## 主要技术构成

前端主要技术栈为vue.js、vue-router、 axios

后端主要技术栈为node.js、Express、 mongodb

## 完成的功能

- 文章列表
- 文章归档
- 标签
- 留言和关于
- 文章详情（支持代码语法高亮）
- 文章详情目录
- 文章点赞
- 文章评论
- 移动端适配
- 颜色主题切换

- 后台登录
- 文章管理
- 评论管理
- 留言管理
- markdown编辑

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
