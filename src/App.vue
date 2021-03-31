<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
  mounted() {
    document.querySelector('.loading-wrapper').style.display = "none";
  }
}
</script>

<style scoped>
@import "assets/css/base.css";
</style>
