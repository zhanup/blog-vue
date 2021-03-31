<template>
  <div id="tags">
    <!-- 背景和文章信息 -->
    <header class="tags-header" style="background-image: url(https://cdn.pixabay.com/photo/2021/03/11/02/57/mountain-6086083_1280.jpg)">
      <div class="tags-container">
        <el-badge v-for="(value, key) in tagList" :value="value" :key="key">
          <el-tag :class="{active: key === currentTag}" @click="handleTagClick(key)">{{key}}</el-tag>
        </el-badge>
      </div>
    </header>
    <!-- 文章列表 -->
    <div class="article-list-container">
      <ArticleList :blogs="blogs" />
    </div>
    <!-- 分页 -->
    <el-pagination
      background
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="total"
      @current-change="handelCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import { request } from '@/request/index';
import ArticleList from '@/components/ArticleList';

export default {
  name: 'Tags',
  components: {
    ArticleList,
  },
  data() {
    return {
      currentTag: '',
      tagList: [],
      blogs: [],
      total: 0,
      currentPage: 1,
      pageSize: 5
    }
  },
  created() {
    this.getTagList();
  },
  methods: {
    async getTagList() {
      const res = await request({ url: '/article/tagList'});
      this.tagList = res.tagList;
      this.currentTag = Object.keys(res.tagList)[0];
      this.getData();
    },
    async getData() {
      const params = { page: this.currentPage, limit: this.pageSize, tag: this.currentTag };
      const res = await request({ url: '/article/tags', params });
      this.blogs = res.data;
      this.total = res.total;
    },
    async handleTagClick(key) {
      this.currentTag = key;
      this.getData();
    },
    handelCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getData();
    }
  }
}
</script>

<style>
#tags .tags-header {
  height: 45vh;
  padding: 5vh 10% 15vh;
  font-weight: 700;
  border-radius: 5px;
  background: no-repeat 50%;
  background-size: cover;
  position: relative;
}
#tags .tags-header:before {
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
#tags .tags-header .tags-container .el-badge {
  margin-right: 5px;
}
#tags .tags-header .tags-container .el-badge .el-tag {
  color: #303133;
  padding: 5px 12px;
  line-height: 1.5;
  height: auto;
  margin: 5px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
}
#tags .tags-header .tags-container .el-badge .active {
  color: #fff;
  background-color: #2821fc;
}
#tags .tags-header .tags-container .el-badge .el-tag:hover {
  color: #fff;
  background-color: #2821fc;
}
#tags .tags-header .tags-container .el-badge sup {
  background-color: rgba(69,94,204,0);
}
#tags .el-pagination {
  text-align: center;
  padding: 20px 0;
}
#tags .el-pagination button {
  background-color: var(--app-background-color-light);
  color: var(--font-color-primary);
}
#tags .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: var(--theme-active);
}

@media screen and (max-width: 800px) {
  #tags .tags-container {
    width: 80vw!important;
    top: 5vh!important;
    left: 10vw!important;
  }
  #tags .tags-top {
    border-radius: 0;
  }
   #tags .article-list-container {
    padding: 0 15px;
  }
}

</style>