<template>
  <div id="manage">
    <!-- 头部、退出登录 -->
    <div class="manage-header">
      <div class="header-logo">后台管理</div>
      <el-dropdown class="header-admin" trigger="click">
        <span class="el-dropdown-link">
          admin<i class="el-icon-arrow-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <span @click="logOut"><el-dropdown-item>退出</el-dropdown-item></span>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    
    <!-- 左侧导航栏 -->
    <div class="manage-nav">
      <el-menu 
        default-active="article" 
        background-color="#18202e" 
        text-color="#919bae" 
        @select="handleSelect"
      >
        <el-menu-item index="article">
          <i class="el-icon-menu"></i>
          <span slot="title">文章</span>
        </el-menu-item>
        <el-menu-item index="message">
          <i class="el-icon-menu"></i>
          <span slot="title">留言</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 数据表格 -->
    <div class="manage-main">
      <el-button v-if="showNew" size="small" class="bth-new" type="primary" @click="toNew">新建</el-button>

      <el-table class="table" :data="tableData" style="width: 100%">
        <el-table-column label="日期" prop="date">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{ showDate(scope.row.date) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column align="right" width="400">
          <template slot="header" slot-scope="scope">
            <el-input class="search" size="small" v-model="search" placeholder="输入关键字搜索"/>
          </template>
          <template slot-scope="scope">
            <el-button v-if="currentType === 'article'" type="info" size="small" @click="handleCommentList(scope.row)">评论列表</el-button>
            <el-button @click="handleEdit(scope.row)" type="primary" size="small">{{editOrReplay}}</el-button>
            <el-popconfirm class="popconfirm" title="您确定删除吗？" @confirm="handleDelete(scope.row)">
              <el-button slot="reference" size="small" type="danger">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        class="pagination"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total"
        @current-change="handelCurrentChange"
      >
      </el-pagination>
    </div>

    <!-- 留言回复 -->
    <el-dialog :visible.sync="replyVisible" title="留言回复">
      <p>昵称：{{comment.title}}</p>
      <p>邮箱：{{comment.email}}</p>
      <p>内容：{{comment.content}}</p>
      <p>时间：{{itemDate(comment.date)}}</p>
      <p>回复：<el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="reply"></el-input></p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="replyVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleReplay" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 文章的评论列表 -->
    <el-dialog :visible.sync="commentListVisible" title="评论列表">
      <ArticleComments :currentData="currentData" />
    </el-dialog>
  </div>
</template>

<script>
import { request } from '@/request/index';
import { format } from '@/common/utils';
import ArticleComments from '@/components/ArticleComments';
import axios from 'axios';

export default {
  name: 'Manage',
  components:{ ArticleComments },
  data() {
    return {
      currentType: 'article',
      blogs: [],
      total: 0,
      currentPage: 1,
      pageSize: 8,
      search: '',
      visible: false,
      replyVisible: false,
      comment: {},
      reply: '',
      commentListVisible: false,
      currentData: {}
    }
  },
  created() {
    this.tokenValid();
  },
  computed: {
    // 对数据进行搜索过滤、分页
    tableData() {
      return this.blogs
        .filter((data) => {
          return !this.search ||data.title.toLowerCase().includes(this.search.toLowerCase())
        })
        .slice(
          (this.currentPage - 1) * this.pageSize,
          this.currentPage * this.pageSize
        )
    },

    tableTitle() {
      return this.currentType === 'message';
    },

    showNew() {
      return this.currentType === 'article';
    },

    itemDate() {
      return function(date) {
        const d = new Date(date);
        return `${d.getFullYear()}/${format(d.getMonth() + 1)}/${format(d.getDate())} ${format(d.getHours())}:${format(d.getMinutes())}:${format(d.getSeconds())}`;
      }
    },

    editOrReplay() {
      return this.currentType === 'message' ? '回复' : '编辑';
    }
  },
  methods: {
    // 判断token是否有效
    tokenValid() {
      axios("/api/authority", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }})
        .then(res => {
          this.getData('article');
        })
        .catch(res => {
          this.$router.push('/login');
          this.$message.error('token无效，请重新登录')
        });
    },
    async getData(kind) {
      const res = await request({url: `/${kind}`});
      this.blogs = res;
      this.total = this.blogs.length;
    },

    toNew() {
      if (this.currentType === 'article') {
        this.$router.push({
          name: "Edit",
          params: {kind: this.currentType, id: 'new'}
        })
      }
    },

    showDate(date) {
      const d = new Date(date);
      return `${d.getFullYear()}-${format(d.getMonth() + 1)}-${format(d.getDate())}`;
    },

    handleSelect(index) {
      this.currentType = index;
      this.getData(index);
    },

    // 打开文章评论列表
    handleCommentList(item) {
      this.currentId = item._id;
      const index = this.blogs.findIndex(value => value._id === item._id);
      this.currentData = this.blogs[index];
      this.commentListVisible = true;
    },

    // 处理回复留言和编辑文章
    handleEdit(item) {
      const id = item._id;
      const index = this.blogs.findIndex(value => value._id === id);
      if (this.currentType === 'message') {
        this.comment = this.blogs[index];
        this.reply = this.comment.reply;
        this.replyVisible = true;
      } else {
        this.$router.push({
          name: "Edit",
          params: { kind: this.currentType, id }
        })
      }
    },

    // 回复留言
    async handleReplay() {
      if (this.reply.trim() === '') {
        this.$message.error('请输入要回复的内容')
      } else {
        await request({ method: 'post', url: '/message/reply', data: { id: this.comment._id, reply: this.reply }});
        this.replyVisible = false;
      }
    },

    // 删除列表数据
    async handleDelete(item) {
      const id = item._id;
      await request({method: 'post', url: `/${this.currentType}/delete`, data: { id }});
      const index = this.blogs.findIndex(value => value._id === id);
      this.blogs.splice(index, 1);
      this.total = this.blogs.length;
    },

    handelCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },

    // 退出登录
    logOut() {
      sessionStorage.removeItem('token');
      this.$router.push('/login');
    }
  }
}
</script>

<style>
#manage {
  min-width: 800px;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background-color: #fff;
}
#manage .manage-header {
  height: 72px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 2px 0 rgba(40, 42, 49, 0.16);
}
#manage .header-logo {
  width: 288px;
  height: 72px;
  line-height: 72px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  background-image: linear-gradient(100deg, #1c5de7, #1c91e7);
}
#manage .header-admin {
  cursor: pointer;
  margin-right: 50px;
}
#manage .manage-nav {
  position: absolute;
  top: 72px;
  left: 0;
  width: 288px;
  height: calc(100% - 72px);
  background-color: #18202e;
  text-align: center;
  padding-top: 50px;
}
#manage .manage-main {
  width: calc(100% - 288px);
  height: calc(100% - 72px);
  position: absolute;
  top: 72px;
  left: 288px;
  padding: 0 25px;
  overflow-y: scroll;
}
#manage .bth-new {
  margin-top: 20px;
}
#manage .manage-main .cell .el-button {
  margin-left: 10px;
}
#manage .table {
  width: 100%;
  margin-top: 20px;
}
#manage .el-table__body-wrapper {
  font-size: 13px;
}
#manage .search {
  max-width: 200px;
}
#manage .pagination {
  width: 100%;
  margin-top: 25px;
}
</style>