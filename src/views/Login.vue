<template>
  <div id="login">
    <div class="login-box">
      <h1>Login</h1>
      <div class="form">
        <div class="item">
          <i class="iconfont">&#xe606;</i>
          <input type="text" v-model="username" placeholder="用户名" />
        </div>
        <div class="item">
          <i class="iconfont">&#xe607;</i>
          <input type="password" v-model="password" placeholder="密码" @keydown.enter="login" />
        </div>
      </div>
      <button @click="login">登录</button>
    </div>
  </div>
</template>

<script>
import { request } from '@/request/index';

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async login() {
      if (this.username === "" || this.password === "") {
        this.$message({
          message: '用户名和密码不能为空',
          type: 'warning'
        });
      } else {
        const data = { username: this.username, password: this.password };
        const result = await request({method: 'post', url: '/login', data});
        if (result.token) {
          sessionStorage.setItem('token', result.token);
          this.$router.push('/manage')
        } else {
          this.$message.error('用户名或密码有误！');
        }
      }
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: content-box;
}
#login {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("~@/assets/img/login_bg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}
#login .login-box {
  width: 30%;
  height: auto;
  border: 1px solid #000;
  margin: 0 auto;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  background-color: rgb(0, 0, 0, 0.1);
  border: 1px solid rgb(0, 0, 0, 0.1);
  padding: 20px 50px;
}
#login .login-box h1 {
  color: #fff;
}
#login .form .item {
  margin-top: 15px;
}
#login .form .item i {
  font-size: 16px;
  color: #fff;
}
#login .form .item input {
  width: 180px;
  font-size: 16px;
  border: 0;
  border-bottom: 2px solid #fff;
  outline: 0;
  padding: 5px 10px;
  background: none;
  color: #fff;
}
#login .login-box button {
  margin-top: 15px;
  width: 180px;
  height: 30px;
  color: #fff;
  font-size: 16px;
  font-weight: 400;
  border: 0;
  border-radius: 15px;
  background-image: linear-gradient(to right, #649173 0%, #dbd5a4 100%);
}
</style>