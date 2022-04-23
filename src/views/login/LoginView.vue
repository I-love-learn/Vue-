<template>
  <div class="login_container">
    <login-box></login-box>
    <bear-run></bear-run>
  </div>
</template>

<script>
import Animate from '@/components/animate/Animate.vue'
import LoginBox from '@/components/loginBox/LoginBox.vue'
export default {
  components: { 'bear-run': Animate, LoginBox }
  // 组件跟路由使用components还不一样 组件无法采用import()注册组件
}
</script>

<style lang="less" scoped>
.login_container {
  background: linear-gradient(#bbffbb, #fff);
  height: 100%;
  // 高度等于可视区高度100vh 也可
}
</style>
