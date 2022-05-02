<template>
  <div id="app">
    <!-- 路由切换视图的占位符 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {},
  created() {
    // 页面刚进去就执行异步请求获取数据
    this.$store.dispatch('initMenus')
    this.$store.dispatch('initUserList')
  }
}
</script>

<style></style>
