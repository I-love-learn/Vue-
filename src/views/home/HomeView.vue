<template>
  <div class="home_container">
    <el-container>
      <!-- 头部区域 -->
      <el-header height="80px">
        <home-header>
          <el-button type="info" icon="el-icon-switch-button" circle @click="quit" title="退出" class="btn"></el-button>
        </home-header>
      </el-header>
      <!-- 主题区域 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="toggle ? '64px' : '200px'">
          <!-- 自定义事件传值 -->
          <home-aside @toggleWidth="togglewidth"></home-aside>
        </el-aside>
        <el-container>
          <!-- 右侧主题 -->
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
      <!-- 底部 -->
      <el-footer>
        <home-footer></home-footer>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import HomeHeader from '@/components/header/HomeHeader'
import HomeAside from '@/components/aside/HomeAside'
import HomeFooter from '@/components/footer/HomeFooter'
export default {
  name: 'home-view',
  data() {
    return {
      toggle: false
    }
  },
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
    },
    togglewidth(val) {
      this.toggle = val
    }
  },
  components: {
    HomeHeader,
    HomeAside,
    HomeFooter
  },
  created() {
    // 页面刚进去就执行异步请求获取数据
    this.$store.dispatch('initMenus')
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
  // 让它占满全屏
  .is-vertical {
    height: 100%;
  }
  .el-header {
    padding: 0;
  }
  .el-main {
    padding: 0;
  }
  .el-footer {
    padding: 0;
  }
  .btn {
    margin-right: 20px;
  }
}
</style>
