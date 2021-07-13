<template>
  <div id="article-list">
    <div class="article-item" v-for="item in blogs" :key="item.date">
      <article class="article-wrapper">
        <h3 @click="jumpTo(item)">
          {{item.title}}
          <span class="hover-dot"></span>
        </h3>
        <tag-list :tags="item.tags" />
        <p>{{item.abstract}}</p>
        <div class="footer">
          <span>{{itemDate(item)}}</span>
          <ul class="info-detail">
              <li><i class="el-icon-view"></i>{{item.scan}}</li>
              <li><i class="el-icon-chat-dot-round"></i>{{item.comments.length}}</li>
              <li><i class="iconfont icon-heart"></i>{{item.like}}</li>
            </ul>
        </div>
      </article>
      <div class="split"></div>
      <el-image fit="cover" lazy :src="item.coverUrl"></el-image>
    </div>
  </div>
</template>

<script>
import { format } from '@/common/utils';
import TagList from '@/components/TagList';

export default {
  name: 'ArticleList',
  components: { TagList },
  props: {
    blogs: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    itemDate() {
      return function(item) {
        const date = new Date(item.date);
        return `${date.getFullYear()}-${format(date.getMonth() + 1)}-${format(date.getDate())}`;
      }
    }
  },
  methods: {
    jumpTo(item) {
      this.$router.push({path: `/detail/${item._id}`});
    }
  }
}
</script>

<style>
#article-list {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background-color: var(--app-background-color-light);
  padding: 40px 70px;
  border-radius: 5px;
  transition: all .1s linear;
  position: relative;
  margin-top: -10vh;
  z-index: 2001;
}
#article-list .article-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  text-align: left;
  margin-bottom: 60px;
  position: relative;
}
#article-list .article-item:last-child {
  margin-bottom: 0;
}
#article-list .article-wrapper {
  width: calc(100% - 340px - 4vw);
  color: var(--font-color-article);
}
.article-wrapper h3 {
  font-size: 26px;
  color: var(--font-color-primary);
  cursor: pointer;
  position: relative;
  display: inline-block;
}
.hover-dot {
  position: absolute;
  right: -10px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  transition: all .25s ease;
}
.article-wrapper h3:hover .hover-dot {
  background-color: var(--theme-active);
}
.article-wrapper p {
  margin: 10px 0;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.article-wrapper .footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}
.article-wrapper .info-detail {
  list-style: none;
}
.article-wrapper .info-detail li {
  float: left;
  margin-left: 5px;
}
.split {
  width: 4vw;
  min-width: 4vw;
}
.article-item .el-image {
  width: 340px;
  border-radius: 4px;
  background-size: cover;
}
@media screen and (max-width: 800px) {
  #article-list {
    padding: 10px;
    box-shadow: none;
    background: var(--app-background-color);
  }
  #article-list .article-item {
    flex-direction: column-reverse;
    margin-bottom: 20px;
  }
  #article-list .article-wrapper {
    width: 100%;
  }
  .article-wrapper h3 {
    font-size: 20px;
  }
  .article-wrapper p {
    font-size: 14px;
  }
  .article-item .el-image {
    width: 100%;
    min-width: auto;
    margin-bottom: 20px;
  }
}
</style>