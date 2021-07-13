<template>
  <div id="edit">
    <div class="header">
      <el-input class="title" v-model="title" placeholder="标题"></el-input>

      <el-dropdown trigger="click">
        <el-button type="primary" size="small">
          发布文章
          <i class="el-icon-caret-bottom"></i>
        </el-button>
        <el-dropdown-menu class="cover-submit">
          <div class="cover-container">
            <img class="cover" :src="coverUrl" style="max-height: 136px;">
            <div class="cover-btn-groups">
              <label class="cover-set btn-dark">
                设置封面
                <input class="hidden" type="file" @change="uploadCover">
              </label>
              <label class="cover-del btn-dark" v-if="coverUrl" @click="delCover">删除</label>
            </div>
          </div>
          <el-button 
            class="confirm-submit" 
            type="primary" 
            size="medium"
            @click="handleSubmit"
          >
            确认发布
          </el-button>
        </el-dropdown-menu>
      </el-dropdown>

    </div>
    <DynamicTags class="tags" :tags="tags" v-model="tags" />
    <el-input class="abstract" type="textarea" :rows="3" placeholder="摘要" v-model="abstract"></el-input>
    <mavon-editor ref="md" :ishljs = "true" @imgAdd="$imgAdd" @imgDel="$imgDel" v-model="content"/>
  </div>
</template>

<script>
import DynamicTags from '@/components/DynamicTags';
import { request } from "@/request/index";
import axios from 'axios';
import { mavonEditor } from "mavon-editor";
import 'mavon-editor/dist/css/index.css';

export default {
  name: "Edit",
  components: {
    DynamicTags,
    mavonEditor
  },
  data() {
    return {
      title: '',
      tags: [],
      coverUrl: '',
      abstract: '',
      content: '',
      id: '',
      isNew: true,
      uploadToken: '',
      coverHashKey: null,
      mdHashKey: null
    }
  },
  created() {
    this.id = this.$route.params.id;
    
    if (this.id !== "new") {
      this.isNew = false;
      this.getData();
    }

    axios.get('/api/uploadToken')
    .then((res) => {
      this.uploadToken = res.data
    })
  },
  methods: {
    async getData() {
      const res = await request({url: `/article/${this.id}`});
      this.title = res.title;
      this.tags = res.tags;
      this.coverUrl = res.coverUrl;
      this.abstract = res.abstract;
      this.content = res.content;
    },

    async handleSubmit() {
      if (this.title === '') {
         this.$message.error('请输入标题');
      } else if (this.tags.length === 0) {
         this.$message.error('请输入标签');
      } else if (this.abstract === '') {
         this.$message.error('请输入摘要');
      } else if (this.content === '') {
         this.$message.error('请输入内容');
      } else if (this.coverUrl === '') {
         this.$message.error('请设置封面');
      } else {
        if (this.isNew) {
          const data = {
            title: this.title,
            content: this.content,
            abstract: this.abstract,
            coverUrl: this.coverUrl,
            tags: this.tags,
            date: new Date() 
          };
          const res = await request({ method: "post", url: `/article/new`, data });
          console.log(res)
          this.$router.push("/manage");
        } else {
          const data = {
            id: this.id,
            title: this.title,
            content: this.content,
            abstract: this.abstract,
            tags: this.tags,
            coverUrl: this.coverUrl
          };
          await request({method: 'post', url: `/article/update`, data });
          this.$router.push("/manage");
        }
      }
    },

    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    },

    // 上传到七牛云
    uploadCover($event) {
      const formdata = new FormData()
      formdata.append('token', this.uploadToken)
      formdata.append('file', $event.target.files[0])

      axios({
        method: 'POST',
        url: 'http://upload-z2.qiniup.com',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then((res) => {
        const url = 'http://qw2ubd1xr.hn-bkt.clouddn.com/' + res.data.key
        this.coverUrl = url
        this.coverHashKey = res.data
      })
    },

    delCover() {
      // 删除七牛云中的文件
      axios({ method: 'POST', url: '/api/delUpload', data: this.coverHashKey })
      .then(() => this.coverUrl = '')
    },

    // 在markdown编辑器中上传图片
    $imgAdd(pos, $file) {
      const formdata = new FormData();
      formdata.append('token', this.uploadToken)
      formdata.append('file', $file)
      // 将图片上传到服务器.
      axios({
        method: 'POST',
        url: 'http://upload-z2.qiniup.com',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then((res) => {
        const url = 'http://qw2ubd1xr.hn-bkt.clouddn.com/' + res.data.key
        this.$refs.md.$img2Url(pos, url)
        this.mdHashKey = res.data
        console.log(res)
      })
    },

    $imgDel(pos) {
      console.log(pos)
      // 删除七牛云中的文件
      axios({ method: 'POST', url: '/api/delUpload', data: this.mdHashKey })
      .then(res => { delete this.img_file[pos] })
    }
  }
}
</script>

<style>
#edit {
  min-width: 800px;
  height: 100%;
  padding: 12px;
  background-color: #eeeded;
}
#edit .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}
#edit .header .title {
  width: 350px;
}
#edit .header .title input {
  height: 40px;
}
#edit .abstract {
  margin-bottom: 20px;
}
#edit .tags {
  margin: 20px 0;
}
#edit .markdown-body {
  height: 520px;
}
.hidden {
  display: none;
  visibility: hidden;
}
.cover-submit {
  width: 320px;
  margin: 0;
  padding: 20px;
}
.cover-submit .cover-container {
  position: relative;
  display: flex;
  margin-bottom: 20px;
}
.cover-submit .cover {
  width: 100%;
  min-height: 7.31rem;
  background-color: #e9ecef;
  vertical-align: middle;
  border-style: none;
}
.cover-submit .btn-dark {
  color: #fff;
  background-color: #343a40;
  border-color: #343a40;
  border-radius: 3px;
}
.cover-submit .cover-btn-groups {
  position: absolute;
  right: 8px;
  bottom: 0;
}
.cover-submit .cover-set {
  cursor: pointer;
  padding: 5px 10px;
  display: inline-block;
  font-weight: 400;
  vertical-align: middle;
  user-select: none;
  margin-bottom: 10px;
  
}
.cover-submit .cover-del {
  cursor: pointer;
  padding: 5px 10px;
  display: inline-block;
  font-weight: 400;
  vertical-align: middle;
  user-select: none;
  margin: 0 0 10px 10px;
}
.cover-submit .confirm-submit {
  width: 100%;
}
</style>