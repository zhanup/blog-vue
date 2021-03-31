<template>
  <div class="tag-list">
    <el-tag v-for="tag in tags" :key="tag">{{tag}}</el-tag>
  </div>
</template>

<script>
export default {
  name: 'TagList',
  props: {
    tags: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style>
.tag-list .el-tag {
  padding: 5px 12px;
  line-height: 1.5;
  height: auto;
  margin: 5px;
  color: var(--font-color-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  border-radius: 20px;
  background: var(--tag-color);
  border-color: var(--border-color);
  cursor: pointer;
}
</style>