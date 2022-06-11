<template>
  <div class="warp">
    <el-button type="primary" @click="gaibian">改变数据</el-button>
    <el-card>
      <div class="main" ref="main"></div>
      <div class="main2">
        <echarts-general :option="option1"></echarts-general>
      </div>
      <div class="main2">
        <echarts-general :option="option1"></echarts-general>
      </div>
      <div class="main2">
        <echarts-general :option="option3"></echarts-general>
      </div>
      <h2>
        {{ a }}
      </h2>
    </el-card>
  </div>
</template>

<script>
/* **********************************************************
总结：在vue组件中使用echarts需要使用watch监听数据变化，如果数据变化了，就会触发watch的回调函数，然后调用init方法重新初始化echarts。
否则会出现数据改变了但是echarts没有渲染的情况。
而且vue 替换echarts的数据也不会重新渲染一个新图，就很奇怪。只渲染了一部分,或者说是在原本的cavans上进行了修改,解决了解决办法是在数据的后面加一个true，这样不会合并两次给的数据。
 ********************************************************** */
import EchartsGeneral from '@/components/echarts/EchartsGeneral.vue'
// 一些变量是可以定义在export default外的，然后在data中直接被拿去用。
const colors = ['#FFAE57', '#FF7853', '#EA5151', '#CC3F57', '#9A2555']
const bgColor = '#2E2733'
const itemStyle = {
  star5: {
    color: colors[0],
  },
  star4: {
    color: colors[1],
  },
  star3: {
    color: colors[2],
  },
  star2: {
    color: colors[3],
  },
}
const data = [
  {
    name: '虚构',
    itemStyle: {
      color: colors[1],
    },
    children: [
      {
        name: '小说',
        children: [
          {
            name: '5☆',
            children: [
              {
                name: '疼',
              },
              {
                name: '慈悲',
              },
              {
                name: '楼下的房客',
              },
            ],
          },
          {
            name: '4☆',
            children: [
              {
                name: '虚无的十字架',
              },
              {
                name: '无声告白',
              },
              {
                name: '童年的终结',
              },
            ],
          },
          {
            name: '3☆',
            children: [
              {
                name: '疯癫老人日记',
              },
            ],
          },
        ],
      },
      {
        name: '其他',
        children: [
          {
            name: '5☆',
            children: [
              {
                name: '纳博科夫短篇小说全集',
              },
            ],
          },
          {
            name: '4☆',
            children: [
              {
                name: '安魂曲',
              },
              {
                name: '人生拼图版',
              },
            ],
          },
          {
            name: '3☆',
            children: [
              {
                name: '比起爱你，我更需要你',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: '非虚构',
    itemStyle: {
      color: colors[2],
    },
    children: [
      {
        name: '设计',
        children: [
          {
            name: '5☆',
            children: [
              {
                name: '无界面交互',
              },
            ],
          },
          {
            name: '4☆',
            children: [
              {
                name: '数字绘图的光照与渲染技术',
              },
              {
                name: '日本建筑解剖书',
              },
            ],
          },
          {
            name: '3☆',
            children: [
              {
                name: '奇幻世界艺术\n&RPG地图绘制讲座',
              },
            ],
          },
        ],
      },
      {
        name: '社科',
        children: [
          {
            name: '5☆',
            children: [
              {
                name: '痛点',
              },
            ],
          },
          {
            name: '4☆',
            children: [
              {
                name: '卓有成效的管理者',
              },
              {
                name: '进化',
              },
              {
                name: '后物欲时代的来临',
              },
            ],
          },
          {
            name: '3☆',
            children: [
              {
                name: '疯癫与文明',
              },
            ],
          },
        ],
      },
      {
        name: '心理',
        children: [
          {
            name: '5☆',
            children: [
              {
                name: '我们时代的神经症人格',
              },
            ],
          },
          {
            name: '4☆',
            children: [
              {
                name: '皮格马利翁效应',
              },
              {
                name: '受伤的人',
              },
            ],
          },
          {
            name: '3☆',
          },
          {
            name: '2☆',
            children: [
              {
                name: '迷恋',
              },
            ],
          },
        ],
      },
      {
        name: '居家',
        children: [
          {
            name: '4☆',
            children: [
              {
                name: '把房子住成家',
              },
              {
                name: '只过必要生活',
              },
              {
                name: '北欧简约风格',
              },
            ],
          },
        ],
      },
      {
        name: '绘本',
        children: [
          {
            name: '5☆',
            children: [
              {
                name: '设计诗',
              },
            ],
          },
          {
            name: '4☆',
            children: [
              {
                name: '假如生活糊弄了你',
              },
              {
                name: '博物学家的神秘动物图鉴',
              },
            ],
          },
          {
            name: '3☆',
            children: [
              {
                name: '方向',
              },
            ],
          },
        ],
      },
      {
        name: '哲学',
        children: [
          {
            name: '4☆',
            children: [
              {
                name: '人生的智慧',
              },
            ],
          },
        ],
      },
      {
        name: '技术',
        children: [
          {
            name: '5☆',
            children: [
              {
                name: '代码整洁之道',
              },
            ],
          },
          {
            name: '4☆',
            children: [
              {
                name: 'Three.js 开发指南',
              },
            ],
          },
        ],
      },
    ],
  },
]
for (let j = 0; j < data.length; ++j) {
  const level1 = data[j].children
  for (let i = 0; i < level1.length; ++i) {
    const block = level1[i].children
    const bookScore = []
    let bookScoreId
    for (let star = 0; star < block.length; ++star) {
      let style = (function (name) {
        switch (name) {
          case '5☆':
            bookScoreId = 0
            return itemStyle.star5
          case '4☆':
            bookScoreId = 1
            return itemStyle.star4
          case '3☆':
            bookScoreId = 2
            return itemStyle.star3
          case '2☆':
            bookScoreId = 3
            return itemStyle.star2
        }
      })(block[star].name)
      block[star].label = {
        color: style.color,
        downplay: {
          opacity: 0.5,
        },
      }
      if (block[star].children) {
        style = {
          opacity: 1,
          color: style.color,
        }
        block[star].children.forEach(function (book) {
          book.value = 1
          book.itemStyle = style
          book.label = {
            color: style.color,
          }
          let value = 1
          if (bookScoreId === 0 || bookScoreId === 3) {
            value = 5
          }
          if (bookScore[bookScoreId]) {
            bookScore[bookScoreId].value += value
          } else {
            bookScore[bookScoreId] = {
              color: colors[bookScoreId],
              value: value,
            }
          }
        })
      }
    }
    level1[i].itemStyle = {
      color: data[j].itemStyle.color,
    }
  }
}
const b = 11
export default {
  data() {
    return {
      echartsOption: {},
      option1: {
        title: {
          text: 'ECharts 入门示例',
        },
        tooltip: {},
        legend: {
          data: ['销量'],
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      },
      option2: {
        legend: {
          top: 'bottom',
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        series: [
          {
            name: 'Nightingale Chart',
            type: 'pie',
            radius: [50, 250],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8,
            },
            data: [
              { value: 40, name: 'rose 1' },
              { value: 38, name: 'rose 2' },
              { value: 32, name: 'rose 3' },
              { value: 30, name: 'rose 4' },
              { value: 28, name: 'rose 5' },
              { value: 26, name: 'rose 6' },
              { value: 22, name: 'rose 7' },
              { value: 18, name: 'rose 8' },
            ],
          },
        ],
      },
      option3: {
        backgroundColor: bgColor,
        color: colors,
        series: [
          {
            type: 'sunburst',
            center: ['50%', '48%'],
            data: data,
            sort: function (a, b) {
              if (a.depth === 1) {
                return b.getValue() - a.getValue()
              } else {
                return a.dataIndex - b.dataIndex
              }
            },
            label: {
              rotate: 'radial',
              color: bgColor,
            },
            itemStyle: {
              borderColor: bgColor,
              borderWidth: 2,
            },
            levels: [
              {},
              {
                r0: 0,
                r: 40,
                label: {
                  rotate: 0,
                },
              },
              {
                r0: 40,
                r: 105,
              },
              {
                r0: 115,
                r: 140,
                itemStyle: {
                  shadowBlur: 2,
                  shadowColor: colors[2],
                  color: 'transparent',
                },
                label: {
                  rotate: 'tangential',
                  fontSize: 10,
                  color: colors[0],
                },
              },
              {
                r0: 140,
                r: 145,
                itemStyle: {
                  shadowBlur: 80,
                  shadowColor: colors[0],
                },
                label: {
                  position: 'outside',
                  textShadowBlur: 5,
                  textShadowColor: '#333',
                },
                downplay: {
                  label: {
                    opacity: 0.5,
                  },
                },
              },
            ],
          },
        ],
      },
      a: b,
    }
  },
  // mounted(载入后):此时页面和内存中都是最新的数据,这个钩子函数是最早可以操作 dom 节点的方法。
  // created(创建后)：在此生命周期函数中，data 和 methods 都已经被初始化好了，如果要调用 methods 中的方法，或者操作 data 中的数据，最早只能在 created 中操作。这里是不能操作dom的，因为此时dom还未渲染。
  /*  mounted() {
    this.init()
  }, */
  created() {
    // init图表的数据 得到的数据直接就是echarts的配置项，非常之秀。
    this.getEchartsData()
  },
  methods: {
    // 初始化echarts图表
    init() {
      // 这里可以看出this.$refs.main其实就是选中DOM
      // this.$refs.main === document.getElementsByClassName('main')
      // console.log(this.$refs.main === document.getElementsByClassName('main')) false 因为document.getElementsByClassName('main')是一个数组
      // console.log(this.$refs.main) dom
      // console.log(document.getElementsByClassName('main')) dom  数组
      // console.log(this.$refs.main === document.querySelector('.main'))  true
      // #直接选中dom通过javascript方法也是可以的
      var myChart = this.$echarts.init(this.$refs.main)
      myChart.setOption(this.echartsOption)
      // this.echartsOption 在created中获取的数据数据改变阶段是在Update阶段，因此如果在mounted这里什么也不会渲染
      // 我理解错了，Update是重新根据最新数据渲染dom阶段，在Update之前，data中的数据就是最新的了，在beforeUpdate阶段 此时页面中显示的数据还是旧的，但是 data 中的数据是最新的，且页面并未和最新的数据同步。
    },
    async getEchartsData() {
      const { data } = await this.$axios({
        url: 'reports/type/1',
        // get请求可省略
      })
      if (data.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.echartsOption = data.data
    },
    gaibian() {
      this.option1 = this.option2
    },
  },
  /*   mounted() {
    // mounted的时候 this.echartsOption居然还没被赋值是为啥
    this.init()
  }, */
  watch: {
    echartsOption: {
      handler(val, oldVal) {
        console.log(val, oldVal) // 赋值后的obj 和空obj
        this.init()
      },
      deep: true,
    },
  },
  components: {
    EchartsGeneral,
  },
}
</script>

<style lang="less" scoped>
.main {
  width: 600px;
  height: 600px;
}
.main2 {
  width: 600px;
  height: 600px;
}
</style>
