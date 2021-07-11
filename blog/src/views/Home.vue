<template>
  <div id="home">
    <el-carousel indicator-position="none" :interval="5000">
      <el-carousel-item v-for="item in hotBlogs" :key="item._id">
        <el-image fit="cover" :src="item.coverUrl"></el-image>
        <div class="swiper-info">
          <article>
            <h3 @click="jumpTo">
              {{item.title}}
              <span class="title-dot"></span>
            </h3>
            <tag-list :tags="item.tags" />
            <div>{{itemDate(item)}}</div>
          </article>
        </div>
      </el-carousel-item>
    </el-carousel>
    <div class="article-list-container">
      <ArticleList :blogs="blogs" />
    </div>
    

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
import { format } from '@/common/utils';
import ArticleList from '@/components/ArticleList';
import TagList from '@/components/TagList';

export default {
  name: "Home",
  components: {
    ArticleList,
    TagList
  },
  data() {
    return {
      blogs: [],
      total: 0,
      hotBlogs: [],
      currentPage: 1,
      pageSize: 10,
      swiperImg: [
        'https://cdn.pixabay.com/photo/2018/07/30/19/26/nature-3573390_1280.jpg',
        'https://cdn.pixabay.com/photo/2021/03/08/17/08/fog-6079632_1280.jpg',
        'https://cdn.pixabay.com/photo/2021/01/05/06/40/boat-5889919_1280.png',
      ]
    }
  },
  created() {
    this.getData();
    this.getHotBlogs();
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
    async getData() {
      const params = { page: this.currentPage, limit: this.pageSize };
      const res = await request({url: '/article/data', params});
      this.blogs = res.data;
      this.total = res.total;
    },

    // 获取最热门的博客
    async getHotBlogs() {
      const res = await await request({url: '/article/hotblogs'});
      this.hotBlogs = res;
    },

    handelCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getData();
    },

    jumpTo(item) {
      this.$router.push({ path: `/detail/${item._id}` });
    }
  }
}
</script>

<style>
#home .el-carousel {
  position: relative;
}
#home .el-carousel__container {
  height: 45vh;
}
#home .el-carousel__item {
  display: flex;
  justify-content: space-between;
}
#home .el-carousel__item .el-image {
  width: calc(50% - 45px);
  border-radius: 5px;
}
#home .swiper-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50%;
  padding: 0 10% 10vh 10%;
  box-sizing: border-box;
}
#home .swiper-info h3 {
  display: inline-block;
  font-size: 30px;
  cursor: pointer;
  position: relative;
}
#home .swiper-info h3 .title-dot {
  display: inline-block;
  position: absolute;
  right: -14px;
  width: 12px;
  height: 12px;
  margin-top: 8px;
  border-radius: 50%;
  transition: all .25s ease;
}

#home .swiper-info h3:hover .title-dot {
  background-color: var(--theme-active);
}
#home .el-pagination {
  text-align: center;
  padding: 20px 0;
}
#home .el-pagination button {
  background-color: var(--app-background-color-light);
  color: var(--font-color-primary);
}
#home .el-pagination .el-pager li {
  background-color: var(--app-background-color-light);
  color: var(--font-color-article);
}
#home .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: var(--theme-active);
  color: #fff;
}

@media screen and (max-width: 800px) {
  .home-mobile-class {
    color: #fff;
    border-radius: 0;
  }
  .home-mobile-class .el-button {
    color: #fff!important;
  }
  #home .el-carousel {
    height: 100vh;
    margin-top: -100px;
  }
  #home .el-carousel__item {
    width: 100vw;
    height: 100vh;
  }
  #home .el-carousel__item .el-image {
    width: 100vw;
    height: 100vh;
    -webkit-filter: brightness(70%);
    filter: brightness(70%);
  }
  #home .swiper-info {
    position: absolute!important;
    width: 70vw;
    height: 50%;
    left: 15vw;
    top: 18vh;
    z-index: 1000;
  }
  #home .swiper-info {
    color: #fff;
  }
  #home .swiper-info .el-tag {
    background-color: #fff;
    color: #606266;
    border-color: #fff;
  }
  #home .article-list-container {
    padding: 0 15px;
  }
}
</style>