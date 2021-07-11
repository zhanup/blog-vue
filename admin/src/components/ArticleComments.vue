<template>
  <div id="comment-list">

    <el-table :data="tableData">
      <el-table-column label="时间" prop="date">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{ itemDate(scope.row.date) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" prop="name"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-popover  placement="left"  trigger="click">
            <p>昵称：{{comment.name}}</p>
            <p>时间：{{contDate}}</p>
            <p>内容：{{comment.content}}</p>
            <el-button size="small" slot="reference" @click="handleLook(scope.row)">查看</el-button>
          </el-popover>
          <el-popconfirm class="popconfirm" title="您确定删除吗？" @confirm="handleDelete(scope.row)">
              <el-button slot="reference" size="small" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      small
      :page-size="size"
      layout="prev, pager, next"
      :total="total" 
       @current-change="handleCurrentChange" 
    >
    </el-pagination>
  </div>
</template>

<script>
import { request } from '@/request/index';
import { format } from '@/common/utils';

export default {
  name: 'ArticleComments',
  props: {
    currentData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      comment: {},
      total: this.currentData.comments.length,
      page: 1,
      size: 5
      
    }
  },
  computed: {
    tableData() {
      return this.currentData.comments.reverse().slice((this.page - 1) * this.size, this.page * this.size);;
    },
    contDate() {
      const d = new Date(this.comment.date);
      return `${format(d.getHours())}:${format(d.getMinutes())}:${format(d.getSeconds())}`;
    }
  },
  methods: {
    itemDate(date) {
      const d = new Date(date);
      return `${d.getFullYear()}/${format(d.getMonth() + 1)}/${format(d.getDate())}`;
    },
    handleLook(item) {
      this.comment = item;
    },
    handleDelete(item) {
      const data = {
        id: this.currentData._id,
        comId: item._id
      }
      request({ method: 'post', url: '/article/delcomment', data });
      this.currentData.comments.splice(this.currentData.comments.findIndex(value => value._id  === this.comId), 1);
    },
    handleCurrentChange(page) {
      this.page = page;
    }
  }
}
</script>

<style>
#comment-list .cell .el-button {
  margin-left: 10px;
}
</style>