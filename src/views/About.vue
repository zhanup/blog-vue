<template>
  <div id="about">

    <div class="message">
      
      <div class="add-message">
          <div class="user-wrapper">
            <el-input v-model="title" class="nick" size="small" placeholder="昵称"></el-input>
            <el-input v-model="email" class="mail" size="small" placeholder="邮箱"></el-input>
          </div>
          <el-input v-model="content" type="textarea" size="small" rows="3" placeholder="内容"></el-input>
          <div class="btn-container">
            <el-button @click="handleSubmit"><i class="el-icon-s-promotion"></i></el-button>
            <el-button @click="clear"><i class="el-icon-delete-solid"></i></el-button>
          </div>
      </div>

        <div class="message-item" v-for="item in msg" :key="item.date">
          <span class="name">{{item.title}}</span>
          <div class="content">
            <div>{{item.content}}</div>
            <div class="admin" v-if="item.reply"><span>博主: </span>{{item.reply}}</div>
          </div>
          <div class="time">{{itemDate(item)}}</div>
        </div>

      <el-pagination 
        :page-size="pageSize" 
        layout="total, prev, pager, next" 
        :total="total"
        @current-change="handleCurrentChange" 
      >
      </el-pagination>
    </div>


    <div class="aboutme">
      <div class="info">
        <div class="info_img">
          <img src="~@/assets/img/logo.png" alt="">
        </div>
        <h3>在路上</h3>
        <p>承认自己的无知，乃是开启智慧的大门。</p>
        <div class="link-container">
          <a href="http://wpa.qq.com/msgrd?v=3&uin=2925309929&site=qq&menu=yes" target="_blank">
            <i class="iconfont icon-QQ"></i>
          </a>
          <el-popover trigger="click" placement="top" class="weixin" width="100px">
            <img class="wx" src="~@/assets/img/wx.jpg" alt="">
            <button slot="reference"><i class="iconfont icon-wechat-fill"></i></button>
          </el-popover>
          <a href="mailto:zhanup@outlook.com">
            <i class="iconfont icon-mail-fill"></i>
          </a>
          <a href="https://github.com/zhanup" target="_blank">
            <i class="iconfont icon-github-fill"></i>
          </a>
        </div>
      </div>

      <div class="body">
        <p>哈喽，你好！很高兴你来访问我的个人博客。如果你有什么想法，欢迎给我留言。</p>
      </div>
    </div>

  </div>
</template>

<script>
import { request } from '@/request/index';
import { format } from '@/common/utils';

export default {
  name: "About",
  data() {
    return {
      msg: [],
      title: '',
      email: '',
      content: '',
      total: 0,
      currentPage: 1,
      pageSize: 10
    }
  },
  created() {
    this.getData();
  },
  computed: {
    itemDate() {
      return function(item) {
        const d = new Date(item.date);
        return `${d.getFullYear()}/${format(d.getMonth() + 1)}/${format(d.getDate())} ${format(d.getHours())}:${d.getMinutes()}:${d.getSeconds()}`;
      }
    }
  },
  methods: {
    async getData() {
      const params = { page: this.currentPage, limit: this.pageSize };
      const res = await request({url: '/message/data', params});
      this.msg = res.data;
      this.total = res.total;
    },
    handleSubmit() {
      const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (!this.title) {
        this.$message.error('请填写昵称');
      } else if (!reg.test(this.email)) {
        this.$message.error('请填写正确邮箱');
      } else if (!this.content) {
        this.$message.error('请填写留言内容');
      } else {
        const data = { title: this.title, email: this.email,  content: this.content, date: new Date };
        request({ method: 'post', url: '/message/new', data });
        this.getData();
        this.clear();
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    clear() {
      this.title = '';
      this.email = '';
      this.content = '';
    }
  }
}
</script>

<style>
#about {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
}

#about .message {
  width: 70%;
  margin-right: 2%;
  border-radius: 8px;
}
#about .add-message {
  margin-bottom: 10px;
}
#about .add-message .user-wrapper {
  display: flex;
  margin-bottom: 10px;
}
#about .add-message .el-input__inner,
#about .add-message .el-textarea__inner {
  background-color: var(--app-background-color);
  color: var(--font-color-article);
  border-color: var(--border-color);
}
#about .add-message .user-wrapper .nick {
  margin-right: 20px;
}
#about .add-message .el-textarea {
  margin-bottom: 10px;
}
#about .add-message .el-textarea textarea {
  height: 84px;
}
#about .btn-container {
  width: 100%;
  text-align: right;
}
#about .btn-container .el-button {
  margin-left: 20px;
  font-size: 14px;
  border-radius: 50%;
  padding: 10px;
  background-color: var(--app-background-color);
  border-color: var(--border-color);
  color: var(--font-color-primary);
}
#about .btn-container .el-button:hover {
  color: var(--theme-active);
}
#about  .message-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: .4em 0;
  padding: 1em;
  background-color: var(--tag-color);
  transition: all .25s ease-in-out;
}
#about  .message-item .name {
  height: 24px;
  font-size: 14px;
  font-weight: 700;
}
#about .message-item .content {
  flex: 1;
  font-size: 14px;
  padding: .5em 0 .5em .5em;
}
#about  .message-item .time {
  margin-top: 1em;
  font-size: 14px;
  text-align: right;
}
#about .message-item .admin {
  margin-top: .5em;
}
#about .message-item .admin span {
  font-weight: 700;
  color: var(--theme-active);
  margin-right: 7px;
  font-size: 14px;
}
#about .aboutme {
  width: 28%;
  height: 100%;
  padding: 20px;
  border-radius: 5px;
  background: var(--app-background-color-light);
}
#about .aboutme .info {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding: 10px 0;
}
#about .aboutme .info .info_img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
}
#about .aboutme .info .info_img img {
  border-radius: 50%;
  width: 100%;
  height: 100%;
}
#about .aboutme .info h3 {
  font-size: 20px;
  margin: 15px 0;
}
#about .aboutme .info  p {
  font-size: 14px;
}
#about .info .link-container {
  margin: 10px 0;
}
#about .info .link-container button {
  background: none;
  border: 0;
  outline: none;
}
#about .info .link-container a {
  margin: 0 10px;
}
#about .aboutme .link-container .weixin {
  margin: 0 10px;
}
#about .link-container .weixin .el-popover__reference {
  color: var(--font-color-primary);
}
.wx {
  width: 150px;
}
#about .aboutme .body {
  padding: 10px;
  margin-top: 10px;
}
#about .body p {
  margin: 10px 0;
  font-size: 13px;
  line-height: 25px;
  text-indent: 2em;
}
#about .el-pagination button {
  background-color: var(--app-background-color);
  color: var(--font-color-article);
}
#about .el-pagination .el-pager li {
  background-color: var(--app-background-color);
  color: var(--font-color-article);
}
#about .el-pagination .el-pager .active {
  color: var(--theme-active);
}
@media screen and (max-width: 800px) {
  #about {
    width: 100%;
    margin: 0;
    flex-direction: column-reverse;
    padding: 0 15px;
  }
  #about .message {
    width: 100%;
    padding: 0;
    border: 0;
  }
  #about .add-message .user-wrapper {
    flex-direction: column;
    justify-content: space-around;
  }
  #about .add-message .user-wrapper .nick {
    margin-right: 0;
    margin-bottom: 10px;
  }
  #about .aboutme {
    width: 100%;
    margin: 0 auto 3vh auto
  }
}
</style>