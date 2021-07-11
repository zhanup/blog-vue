<template>
  <div id="detail">
    
    <!-- 头部背景 -->
    <header class="article-header" :style="{backgroundImage:'url('+detail.coverUrl+')'}">
      <div class="hearder-wrapper">
        <div class="article-info">
          <tag-list :tags="detail.tags" />
          <h3>{{detail.title}}</h3>
          <div class="info-footer">
            <i class="el-icon-edit"></i>
            <span>{{contDate}}</span>
          </div>
        </div>
      </div>
    </header>

    <div class="article-container">
      <!-- 文章内容 -->
      <div class="markdown-body" v-html="mdContent" ref="html" v-highlight></div>
      <!-- 点赞 -->
      <div class="like-btn" @click="handleLike">
        <i class="iconfont icon-heart-fill" :class="{ 'is-like': isLike === true }"></i>
        <br />
        <span>喜欢这篇文章★~★</span>
      </div>
      <!-- 评论 -->
      <div class="comments">
        <!-- 输入框 -->
        <div class="comm_add">
          <el-input class="nick" v-model="comment.name" size="small" placeholder="昵称"></el-input>
          <el-input class="content" v-model="comment.content" size="small" type="textarea" placeholder="评论"></el-input>
          <div class="btn-container">
            <el-button @click="handleAddComment"><i class="el-icon-s-promotion"></i></el-button>
            <el-button @click="handleClear"><i class="el-icon-delete-solid"></i></el-button>
          </div>
        </div>

        <div class="comment-item" v-for="item in comments" :key="item.date">
          <span class="nickname">{{item.name}}</span>
          <p class="content">{{item.content}}</p>
          <div class="time">{{itemDate(item)}}</div>
        </div>

      </div>
    </div>
    
    <aside class="menu" v-if="menu.length">
      <el-popover placement="left" trigger="click" width="200"> 
        <a 
          :href="'#' + item.id" 
          :style="menulist(item.level)" 
          :class="{ anchor: index === currentMenuIndex }"
          v-for="(item, index) in menu" :key="item.id"
          @click="currentTitle(index)"
        >
          {{item.body}}
        </a>
        <div class="menuctn" slot="reference">
          <i class="el-icon-notebook-2"></i><br>
        </div>
      </el-popover>
    </aside>
  </div>
</template>

<script>
import marked from "marked";
import "github-markdown-css/github-markdown.css";
import { request } from '@/request/index';
import { format } from '@/common/utils';
import TagList from '@/components/TagList';

export default {
  name: "ShowBlog",
  components: { TagList },
  data() {
    return {
      detail: {},
      mdContent: '',
      comment: {
        name: '',
        content: ''
      },
      comments: [],
      isLike: false,
      likeArticles: [],
      menu: [],
      currentMenuIndex: 0,
      menuItemPos: [],
      articleTag: ''
    }
  },
  created() {
    this.getData();
  },
  watch: {
    mdContent: function() {
      const template = this.$refs.html
      this.$nextTick(() => {
        template.querySelectorAll('h1,h2,h3,h4,h5').forEach(item => {
          let obj = {
            id: item.id,
            level: parseInt(item.tagName.substr(1,1)),
            body: item.innerHTML
          }
          this.menu.push(obj)
        })
      })
      this.getMenuItemPos();  
    }
  },
  computed: {
    contDate() {
      const d = new Date(this.detail.date);
      return `${d.getFullYear()}/${format(d.getMonth() + 1)}/${format(d.getDate())}`;
    },
    itemDate() {
      return function(item) {
        const d = new Date(item.date);
        return `${d.getFullYear()}/${format(d.getMonth() + 1)}/${format(d.getDate())} ${format(d.getHours())}:${format(d.getMinutes())}:${format(d.getSeconds())}`;
      }
    }
  },
  methods: {
    async getData() {
      const res = await request({ url: `/article/${this.$route.params.id}` });
      this.detail = res;
      this.like = res.like;
      this.comments = res.comments.reverse();
      this.articleTag = res.tags.join('、');
      this.mdContent = marked(res.content);
       
      if (localStorage.getItem('likeArticles') !== null) {
        this.likeArticles = JSON.parse(localStorage.getItem('likeArticles'));
        this.likeArticles.forEach(item => {
          if (item === this.detail.title) {
            this.isLike = true;
          }
        })
      }
    },
    async handleLike() {
      if (!this.isLike) {
        this.isLikeActive = true;
        this.likeArticles.push(this.detail.title);
        localStorage.likeArticles = JSON.stringify(this.likeArticles);
        await request({method: 'post', url: '/article/like', data: { id: this.detail._id }});
        this.isLike = true;
      }
    },
    async handleAddComment() {
      if (this.comment.name === '') {
        this.$message.error('请输入昵称');
      } else if (this.comment.content === '') {
        this.$message.error('请输入评论内容');
      } else {
        const data = Object.assign(this.comment, { id: this.detail._id, date: new Date() });
        await request({method: 'post', url: '/article/addcomment', data});
        this.handleClear();
        this.getData();
      }
    },
    handleClear() {
      this.comment.name = '';
      this.comment.content = '';
    },
    menulist(titleLevel) {  //根据标题的level决定样式,level越小标题越大
      let maxLevel = 6   //先弄个最小的6
      this.menu.forEach(item => {   //找出最大的level
        if(item.level < maxLevel) {
          maxLevel = item.level
        }
      })
      let minus = titleLevel - maxLevel  //计算当前标题的level与最大level的差值
      return {
        'margin-left': minus*10 + 'px' 
      }
    },
    currentTitle(index) {
      this.currentMenuIndex = index;
    },
    getMenuItemPos() {  //拿到目录每一项到页面顶部的距离
      this.$nextTick(() => {
        this.menu.forEach(item => {
          let el = document.getElementById(item.id)
          let pos = 0
          while(el && el.tagName !== 'BODY') {
            pos += el.offsetTop
            el = el.offsetParent
          }
          pos -= 10  //增强用户体验
          this.menuItemPos.push(pos)
        })
      })
    }
  }
}
</script>

<style>
#detail .article-header {
  position: relative;
  align-content: center;
  width: 100%;
  height: 45vh;
  background: no-repeat 50%;
  background-size: cover;
  overflow: hidden;
}
#detail .article-header:before {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  content: "";
  opacity: .35;
  background-color: #394245;
  background-image: linear-gradient(234deg,#394245,#000);
}
#detail .hearder-wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  padding: 40px 100px;

}
#detail .article-info {
  color: #fff;
}
#detail .article-info h3 {
  font-size: 35px;
  margin: 20px 0;
}
#detail .article-container {
  width: 100%;
  max-width: 1200px;
  min-height: 400px;
  background-color: var(--app-background-color-light);
  position: relative;
  margin: -10vh auto 0;
  border-radius: 5px 5px 0 0;
  padding: 20px 40px;
}
#detail .markdown-body {
  color: var(--font-color-article);
  /* font-size: 14px; */
}
#detail .markdown-body pre {
  background-color: #333;
}
#detail .markdown-body code,
#detail .markdown-body code span {
  font-family: 'Fira Code', Monaco, Consolas;
}
#detail .markdown-body h1,
#detail .markdown-body h2,
#detail .markdown-body h3,
#detail .markdown-body h4,
#detail .markdown-body h5 {
  color: var(--font-color-primary);
}
#detail .like-btn {
  text-align: center;
  margin: 20px 0;
}
#detail .like-btn i {
  font-size: 35px;
  cursor: pointer;
}
#detail .like-btn span {
  font-size: 14px;
}
#detail .is-like {
  color: var(--theme-active);
}
#detail .comm_add .nick {
  width: 45%;
  margin: 20px 0 15px 0;
}
#detail .comm_add .el-input__inner,
#detail .comm_add .el-textarea__inner
 {
  background-color: var(--app-background-color);
  color: var(--font-color-primary);
  border-color: var(--border-color);
}
#detail .el-textarea textarea {
  height: 75px;
}
#detail .btn-container {
  width: 100%;
  text-align: right;
  margin-bottom: 10px;
}
#detail .btn-container .el-button {
  margin: 10px 0 0 25px;
  font-size: 18px;
  border-radius: 50%;
  padding: 12px;
  background-color: var(--app-background-color);
  border-color: var(--border-color);
  color: var(--font-color-primary);
}
#detail .btn-container .el-button:hover {
  color: var(--theme-active);
}
#detail .comment-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 15px;
  padding: 1em;
  background-color: var(--tag-color);
  transition: all .25s ease-in-out;
}
#detail .comment-item .nickname {
  height: 24px;
  font-size: 14px;
  font-weight: 700;
}
#detail .comment-item .content {
  padding: 10px;
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
}
#detail .comment-item .time {
  text-align: right;
  font-size: 14px;
}
#detail .menu {
  background-color: var(--app-background-color);
  border: 1px solid var(--tag-color);
  color: var(--font-color-primary);
  position: fixed;
  bottom: 21%;
  right: 0;
  z-index: 9999;
  text-align: center;
  padding: 10px;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  cursor: pointer;
}
.el-popover a {
  color: #000;
  display: block;
  text-decoration: none;
  font-size: 14.5px;
  margin-bottom: 3px;
  line-height: 22px;
  border-radius: 5px;
}
.el-popover .anchor {
  background-color: #409EFF;
  color: #fff;
}

@media screen and (max-width: 800px) {
  #detail .article-header {
    padding: 15vh 0;
  }
  #detail .hearder-wrapper {
    padding: 0 15px;
  }
  #detail .article-info {
    padding: 10px 0;
  }
  #detail .article-container {
    padding: 0 15px;
    margin-top: 0;
  }
  #detail .article-info h3 {
    font-size: 24px;
    margin: 10px 0;
  }
  #detail .article-info .info-footer {
    font-size: 14px;
  }
  #detail .markdown-body {
    padding: 10px 0 5px;
  }
  #detail .like-btn {
    margin: 10px 0;
  }
  #detail .menu {
    display: none;
  }
}

</style>