<template>
  <div class="home_container">
    <el-button type="info" icon="el-icon-switch-button" circle @click="quit" title="退出"></el-button>
  </div>
</template>

<script>
export default {
  name: 'home-view',
  methods: {
    quit() {
      this.$confirm('此操作将退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          // 点击退出后，删除token
          localStorage.removeItem('token')
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped></style>
