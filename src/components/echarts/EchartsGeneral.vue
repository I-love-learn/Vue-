<template>
  <!-- 如果一个页面引入多个相同组件 id怎么处理呢 -->
  <!-- 最好就不要带id了吧，否则一个页面引入多个组件 id重复 -->
  <div class="echarts_general" ref="echarts">
    <!-- 看百度上别人的做法，就是可以自己封装一个echarts的组件出来，想用的时候传一个option即可 -->
  </div>
</template>

<script>
// 如果echarts已经在main.js引入了，并且注册为原型链上的方法了，这里也可省略这一步
import * as echarts from 'echarts'
export default {
  props: {
    // props接收的值可以this.xx直接用，并且会随父组件更新。
    option: {
      // 是否必须传递
      required: true,
      type: Object,
      // 默认是一个空对象
      default: () => {
        return {}
      }
    }
  },
  watch: {
    /*  option:function(newVal, oldVal){

    } */
    // 如果是深度侦听 则要写成对象形式了
    option: {
      /* immediate: true, */
      deep: true,
      handler(newVal, oldVal) {
        /*  this.$nextTick(() => {
          this.initEcharts(newVal)
        }) */
        // @即便不写mounted 防止父级传递的同步数据渲染不出来的第二种办法给watch添加一个immediate: true 意思是一进页面就执行handler一次，但是此时会报错报dom未渲染，解决方法是在这里加this.$nextTick或者在methods中的init方法中加this.$nextTick
        // @watch加了immediate: true 页面一刷新（进入）就会立即执行一次，时机要在mounted之前，这也就是为什么获取不到dom的原因，而watch正常的时机是在mounted之后，加了immediate: true执行时机被提前了。
        /* console.log(newVal) */
        this.initEcharts(newVal)
        // 可以理解为 一开始的val是空被监听到了 一直等到mounted后 val还是空呢 watch就是从mounted后才生效的 后来变成了newval被监听到了 便渲染echarts了
      }
    }
    // watch的触发会在created和mounted结束后。
  },
  methods: {
    // 初始化echarts方法
    initEcharts(option) {
      // 初始化echarts实例
      /* console.log(option) */
      const myChart = echarts.init(this.$refs.echarts)
      myChart.setOption(option)
    }
  },
  /* *******************************************
  VUE中解决echarts数据二次渲染不成功的问题xAxis
  应该设置：mychart.setOption({},true);

  原因：chart.setOption(option,notMerge,lazyUpdate);

  option:图表的配置项和数据

  notMerge:可选，是否不跟之前设置的option进行合并，默认为false，即合并。（这里是导致二次渲染不成功的根本）

  lazyUpdate:可选，在设置完option后是否不立即更新图表，默认为false，即立即更新。
  ********************************************** */
  // 父组件给echarts组件传递数据时候并不会初始化的时候就执行一次，所以要在mounted中执行一次
  // 这是因为父组件是在created的时候给子组件传递值的，这就导致子组件的option并没有发生变化，从而watch也不会监听到数据改变。
  mounted() {
    // !知道为什么这里要写一个mounted吗？这里接收异步请求的option为{} 执行下面的this.initEcharts(this.option)也不会渲染。
    // ?为的是防止父组件传过来的option不是异步请求的而是直接写死的情况，所以这里要写一个mounted，这样才会执行一次this.initEcharts(this.option)，否则仅靠watch监听到option变化就会执行一次this.initEcharts(this.option)，但是如果是直接从父组件传递过来的写死的data数据,子组件的created接收到数据，没有mounted就无法渲染了。watch执行监听又再mounted之后，因此也无法监听到this.option的数据变化，就无法渲染了。
    // @同样的 即便不在这里封装公共组件，直接在父组件中写死，也要考虑到这两种情况，异步数据要放watch渲染，同步要mounted渲染。
    // console.log(this.option)
    /* 这里的this.option还不是异步请求回来的数据 还是个{} */
    // 初始化echarts
    this.initEcharts(this.option)
  }
  /* created() {
    for (const key in this.option) {
      console.log(key)
    }
    console.log(this.option)
  } */
  // 经过我的测试 的确是父组件先created获取值后 再传递给子组件，子组件在created中的this.option已经是父组件更改后的值了。 符合前面的父子组件的生命周期
  // @错误 这里的option的值是空，也就是说父组件created时候 要传递过来的值的异步请求并没有完成，所以这里的option是空的 但如果不是异步请求，那可以直接传递
}
</script>

<style lang="less" scoped>
.echarts_general {
  // 在使用时，父组件先放一个大盒子设置好大小，直接把子盒子放进去即可
  width: 100%;
  height: 100%;
  z-index: 5;
}
</style>
