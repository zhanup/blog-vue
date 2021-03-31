<template>
   <div id="archive">
    <div class="year-wrapper" v-for="(value, key) in blogs" :key="key">
      <div class="year-name">{{key}}</div>
      <dl class="month-wrapper" v-for="(value2, key2) in value" :key="key2">
        <dt class="month-name">{{months[parseInt(key2) - 1]}}</dt>
        <dd class="article-item" v-for="item in value2" :key="item._id">
          <span class="time">{{itemDate(item)}}</span>
          <span class="title" @click="jumpTo(item)">{{item.title}}</span>
        </dd>
      </dl>
    </div>
   </div>
</template>

<script>
import { request } from '@/request/index';
import { format, changStructure } from '@/common/utils'

export default {
  name: "Archive",
  data() {
    return {
      blogs: {},
      total: 0,
      months: [ 'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December' 
      ]
    }
  },
  created() {
    this.getData();
  },
  computed: {
    itemDate() {
      return function(item) {
        const d = new Date(item.date);
        return `${format(d.getMonth() + 1) }.${format(d.getDate())}`;
      }
    }
  },
  methods: {
    async getData() {
      const res = await request({ url: '/article/archive' });
      this.blogs = changStructure(res);
      this.total = res.length;
    },
    jumpTo(item) {
      this.$router.push({ path: `/detail/${item._id}` })
    }
  }
}
</script>

<style>
#archive {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
#archive .year-wrapper {
  margin-top: .5em;
  margin-left: 2em;
}
#archive .year-wrapper .year-name {
  font-size: 24px;
  font-weight: 700;
}
#archive .month-wrapper {
  margin-top: .5em;
  margin-left: 2em;
}
#archive .month-wrapper .month-name {
  font-size: 1.1rem;
}
#archive .article-item {
  margin-top: .5em;
  margin-left: 2em;
  display: flex;
  min-height: 30px;
  font-size: 1rem;
}
#archive .article-item .time{
  position: relative;
  margin: 0 14px;
  white-space: nowrap;
}
#archive .article-item .time:before {
  content: "";
  position: absolute;
  top: 9px;
  left: -18px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--font-color-primary);
}
#archive .article-item .title {
  cursor: pointer;
}

@media screen and (max-width: 800px) {
  #archive .month-wrapper {
    margin-top: .3em;
    margin-left: .7em;
 }
 #archive .article-item {
    margin-top: .3em;
    margin-left: .7em;
    margin-left: 1.5em;
  }
  #archive .article-item .time {
    margin: 0 10px 0 0;
 }
}
</style>