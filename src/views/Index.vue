<template>
  <div id="index">
    <!-- 头部导航栏 -->
    <header class="header-container" :class="{ 'home-mobile-class': $route.name === 'home' }">
      <div class="logo">
        <i class="el-icon-moon" ref="switch" @click="handleSwitch"></i>
        <span>Peter</span>
      </div>

      <div class="nav">
        <router-link :key="item.path" v-for="item in pages" :to="item.path">
          {{item.name}}
          <span class="nav-dot"></span>
        </router-link>
      </div>

      <el-button type="text" @click="drawer = true">
        <i class="el-icon-s-unfold"></i>
      </el-button>
      <el-drawer :visible.sync="drawer" :modal="false" size="200px">
        <el-menu router :default-active="defaultActive">
          <el-menu-item 
            v-for="item in pages" 
            :key="item.path" 
            :index="item.path" 
            @click="drawer = false"
          >
            {{item.name}}
          </el-menu-item>
        </el-menu>
      </el-drawer>
    </header>
    <!-- 内容 -->
    <main class="views">
      <transition name="slide-fade">
        <router-view />
      </transition>
    </main>
    <!-- 页脚 -->
    <footer class="footer-container"></footer>
    <!-- 返回顶部 -->
    <el-backtop :right="10"></el-backtop>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      pages: [
        { name: '首页', path: '/home'},
        { name: '归档', path: '/archive' },
        { name: '标签', path: '/tags' },
        { name: '关于', path: '/about' }
      ],
      defaultActive: `/${this.$route.name}`,
      drawer: false,
      flag: true
    }
  },
  methods: {
    handleSwitch() { // 切换主题
      if (this.flag) {
        this.$refs.switch.className = "el-icon-sunny";
        document.body.id = "dark"
        this.flag = false;
      } else {
        this.$refs.switch.className = "el-icon-moon";
        document.body.id = "light";
        this.flag = true;
      }
    }
  }
}
</script>

<style>
#index {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
}
#index .views {
  flex: 1;
}
#index .header-container {
  position: relative;
  z-index: 2001;
  padding: 0 170px;
  height: 160px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#index .header-container .logo i {
  font-size: 35px;
}
#index .header-container .logo span {
  font-size: 30px;
  margin-left: 10px;
}
.header-container .nav a {
  font-size: 16px;
  font-weight: 700;
  margin-left: 20px;
  position: relative;
}
#index .header-container .nav .nav-dot {
  position: absolute;
  top: -4px;
  right: -8px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  transition: all .25s ease;
}
#index .header-container .nav a:hover span {
  background-color: var(--theme-active);
}
#index .header-container .nav .router-link-active span {
  background-color: var(--theme-active);
}
#index .header-container .el-button {
  display: none;
}
#index .header-container .el-drawer__container {
  height: 50vh;
  z-index: 2000;
}
#index .header-container .el-menu {
  font-size: 18px;
  font-weight: 700;
}
#index .header-container .el-button {
  color: var(--font-color-primary);
}
#index .header-container .el-icon-s-unfold {
  font-size: 35px;
}
#index .footer-container {
  height: 60px;
}
#index .el-backtop {
  z-index: 9999;
  background-color: var(--app-background-color-light);
  color: var(--theme-active);
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s ease-in-out;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

@media screen and (max-width: 800px) {
  #index .header-container  {
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
    height: 100px;
    background-color: transparent;
  }
  #index .header-container .nav {
    display: none;
  }
  #index .header-container .el-button {
    display: inline-block!important;
  }
}
</style>