<template>
  <div class="warp">
    <img src="@/assets/logo_04.png" alt="" id="logo" />
    <div class="welcome_cn">欢迎使用华为商城后台</div>
    <div class="welcome_en">Welcome to Huawei mall backstage</div>
  </div>
</template>

<script>
export default {
  name: 'home-main'
}
</script>

<style lang="less" scoped>
.warp {
  position: relative;
  padding-top: 30%;
  width: 100%;
  height: 100%;
  background: #fff;
  #logo {
    position: absolute;
    left: 50%;
    top: 5%;
    width: 300px;
    height: 300px;
    transform: translateX(-50%);
  }
  .welcome_cn,
  .welcome_en {
    color: #999;
    text-align: center;
  }
  .welcome_cn {
    font-size: 36px;
  }
  .welcome_en {
    font-size: 26px;
  }
}
</style>
