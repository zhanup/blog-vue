<template>
  <div id="app">
    <!-- 头部导航栏 -->
    <Header></Header>
    <!-- 内容 -->
    <main class="views">
      <transition name="slide-fade">
        <router-view />
      </transition>
    </main>
    <!-- 页脚 -->
    <Footer></Footer>
    <!-- 返回顶部 -->
    <el-backtop :right="10"></el-backtop>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default {
  name: "App",
  components: {
    Header,
    Footer
  },
  mounted() {
    document.querySelector('.loading-wrapper').style.display = "none";
  }
}
</script>

<style>
@import "assets/css/base.css";

#app {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
}
#app .views {
  flex: 1;
}
#app .el-backtop {
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
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>