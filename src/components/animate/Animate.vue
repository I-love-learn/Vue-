<template>
  <div class="big_bg">
    <div class="bg">
      <div class="bear"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Bear-run'
}
</script>

<style lang="less" scoped>
.big_bg {
  position: fixed;
  width: 100%;
  bottom: 0;
  background: url(@/assets/bg2.png) repeat-x;
  /* 让repeat沿着x轴铺满 这样小熊就可以一直跑下去了 中间也不会停顿有背景切换卡顿的效果，影响观感 */
  animation: bg 16s linear infinite;
  .bg {
    padding-top: 200px;
    background: url(@/assets/bg1.png) repeat-x;
    animation: bg 18s linear infinite;
    .bear {
      width: 200px;
      height: 100px;
      background: url(@/assets/bear.png) no-repeat;
      /* 元素可以添加多个动画 方法是用,隔开 */
      animation: bear 0.5s steps(8) infinite, run 3s forwards;
      /* 这里如果不用关键帧steps 结果就会是变成轮播图 小熊一直滚动 */
    }
  }
}

@keyframes bg {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: -3840px 0;
  }
}

@keyframes bear {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: -1600px 0;
  }
}

@keyframes run {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(800px);
  }
}
</style>
