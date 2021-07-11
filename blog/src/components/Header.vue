<template>
  <header
    class="header-wrap"
    :class="{ 'home-mobile-class': $route.name === 'home' }"
  >
    <div class="logo">
      <i class="el-icon-moon" ref="switch" @click="handleSwitch"></i>
      <span>Peter</span>
    </div>

    <div class="nav">
      <router-link :key="item.path" v-for="item in pages" :to="item.path">
        {{ item.name }}
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
          {{ item.name }}
        </el-menu-item>
      </el-menu>
    </el-drawer>

  </header>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      pages: [
        { name: "首页", path: "/home" },
        { name: "归档", path: "/archive" },
        { name: "标签", path: "/tags" },
        { name: "关于", path: "/about" },
      ],
      defaultActive: `/${this.$route.name}`,
      drawer: false,
      flag: true,
    };
  },
  methods: {
    handleSwitch() {
      // 切换主题
      if (this.flag) {
        this.$refs.switch.className = "el-icon-sunny";
        document.body.id = "dark";
        this.flag = false;
      } else {
        this.$refs.switch.className = "el-icon-moon";
        document.body.id = "light";
        this.flag = true;
      }
    },
  },
};
</script>

<style>
.header-wrap {
  position: relative;
  z-index: 2001;
  padding: 0 170px;
  height: 160px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-wrap .logo i {
  font-size: 35px;
}
.header-wrap .logo span {
  font-size: 30px;
  margin-left: 10px;
}
.header-wrap .nav a {
  font-size: 16px;
  font-weight: 700;
  margin-left: 20px;
  position: relative;
}
.header-wrap .nav .nav-dot {
  position: absolute;
  top: -4px;
  right: -8px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  transition: all 0.25s ease;
}
.header-wrap.nav a:hover span {
  background-color: var(--theme-active);
}
.header-wrap .nav .router-link-active span {
  background-color: var(--theme-active);
}
.header-wrap .el-button {
  display: none;
}
.header-wrap .el-drawer__container {
  height: 50vh;
  z-index: 2000;
}
.header-wrap .el-menu {
  font-size: 18px;
  font-weight: 700;
}
.header-wrap .el-button {
  color: var(--font-color-primary);
}
.header-wrap .el-icon-s-unfold {
  font-size: 35px;
}

@media screen and (max-width: 800px) {
  .header-wrap {
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
    height: 100px;
    background-color: transparent;
  }
  .header-wrap .nav {
    display: none;
  }
  .header-wrap .el-button {
    display: inline-block!important;
  }
}
</style>