<template>
  <div class="warp">
    <div class="system_logo">
      <img src="@/assets/logo_03.png" alt="" height="80px" />
    </div>
    <div class="system_name">华为商城后台管理系统</div>
    <slot></slot>
    <el-button @click="drawer = true" type="warning" icon="el-icon-message" circle class="message"> </el-button>
    <el-drawer title="欢迎来到华为商城后台管理系统" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
      <span>本后台管理系统的主要用到的前台技术栈有vue2+elementui+vuex+vuerouter+axios，</span><br /><span>后台用到的技术栈是nodejs+express+mysql等，核心思路来自于黑马程序员电商管理后台。</span>
    </el-drawer>
    <div class="avatar">
      <img src="@/assets/touxiang.png" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'home-aside',
  data() {
    return {
      drawer: false,
      direction: 'ttb'
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    }
  }
}
</script>

<style lang="less" scoped>
.warp {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  background: #409eff;
  overflow: hidden;
  // 不设置侧轴布局方式的话 默认是高度平铺占满父盒子的
  align-items: center;
  justify-content: space-between;
  .system_logo {
    width: 80px;
  }
  .system_name {
    font-size: 28px;
    color: #fff;
    letter-spacing: 5px;
  }
  // 定位也会受flex布局影响
  .avatar {
    position: absolute;
    left: 85%;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .message {
    position: absolute;
    left: 91%;
  }
  /deep/ .el-drawer__header {
    font-size: 20px;
    letter-spacing: 1px;
  }
  .el-drawer {
    span /deep/ {
      padding-left: 50px;
      color: #333;
      font-size: 16px;
      letter-spacing: 2px;
      line-height: 200%;
    }
  }
}
</style>
