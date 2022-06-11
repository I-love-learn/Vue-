<template>
  <div class="warp">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- separator分隔符 separator-class图标分隔符 class -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="reportShow">
        <echarts-general :option="echartsOption"></echarts-general>
      </div>
    </el-card>
  </div>
</template>

<script>
import EchartsGeneral from '@/components/echarts/EchartsGeneral.vue'
/* import _ from 'lodash' */
const option = {
  title: {
    text: '用户来源'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#E9EEF3'
      }
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      boundaryGap: false
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ]
}
// @这里老师合并两个对象用的lodash中合并两个对象的方法。_.merge(obj1, obj2)
// es6的语法，可以直接用...来合并两个对象，...其实就是一个简写的语法，object.assign(target, source1, source2, ...) 合并后后面的对象同名属性会替代前面的
// 这里echarts自带了合并两组option的设置，所以这里就不用写了
export default {
  data() {
    return {
      echartsOption: {}
    }
  },
  created() {
    // init图表的数据 得到的数据直接就是echarts的配置项，非常之秀。
    this.getEchartsData()
  },
  // 这里echarts的渲染方法采取的是封装echats组件的方法
  methods: {
    /* initEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(this.$refs.main)
      // 绘制图表
      myChart.setOption({
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      })
    } */
    // 请求数据的方法 返回的数据是echarts的option
    async getEchartsData() {
      const { data } = await this.$axios({
        url: 'reports/type/1'
        // get请求可省略
      })
      if (data.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      // 也可以直接在请求数据的方法中执行渲染 这样不需要把数据定义到data中 只需要把此方法放到mounted中执行即可。也不需要watch

      // 这里要注意的是服务器返回的数据渲染出的图并不完整，需要用api文章中给的options进行合并，合并就不用我说了吧，就把组件中的true去掉就行了
      this.echartsOption = data.data
      // 合并方法 先让data.data的值赋值给echartsOption先渲染一次，接着计时器再下一个宏任务执行在渲染一次，合并两次。 这里要注意的是这里用this.$nextTick不能合并不知道为啥。
      // !错误 用this.$nextTick合并两次渲染也可以
      // this.$nextTick()  的执行时机  即：等到页面更新完毕之后执行，这一点和计时器是一致的
      // 数据更新（同步） =》 页面更新（异步） =》this.$nextTick() （等到页面更新完毕之后）
      // 官方解释：将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。它跟全局方法 Vue.nextTick 一样，不同的是回调的 this 自动绑定到调用它的实例上。
      /*  setTimeout(() => {
        this.echartsOption = option
      }, 0) */
      this.$nextTick(() => {
        this.echartsOption = option
      })
    }
  },
  components: {
    EchartsGeneral
  }
  // 无论script里写不写生命周期函数，vue组件创建都会经过这些生命周期。 vue先处理数据，然后根据数据渲染页面
  /* mounted() {
    // 初始化需要在mounted中执行 created中dom还未渲染
    this.initEcharts()
  } */
}
</script>

<style lang="less" scoped>
.warp {
  padding: 20px;
  .reportShow {
    width: 1000px;
    height: 600px;
  }
}
</style>
