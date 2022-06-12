import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
/* import './plugins/element.js' */
// 初始化css
import '@/assets/style/init.css'
// 字体图标css
import '@/assets/fonts/iconfont.css'
// vue-table-with-tree-grid引入并注册
import ZkTable from 'vue-table-with-tree-grid'
// 引入day.js格式化时间 import ... from ... import导入xx对象（自己命名）form 包（export出的方法或者变量） 在使用时 有些会有官方推荐的写法比如jquery import $ from 'jquery' 这样使用时就是$(),如果导入是 import jquery from 'jquery' 则使用就是jquery() 再使用$就会报错 axios 导入的时候也是这样 还有vue 因为import 后面的是重命名的
import dayjs from 'dayjs'
// 引入vue-quill-editor编辑器 两种方式一种注册为全局可使用的插件 第二种注册为组件私有的插件 这里我们是前者
// 导入包
import VueQuillEditor from 'vue-quill-editor'

// require styles 导入样式
/* import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css' */
// 引入echarts
import * as echarts from 'echarts'
// 注册插件
// 隐藏 右侧浏览器 滚动条 事实证明居然不用引入这俩 只写那个样式也能隐藏 离谱
/* import VueSmoothScroll from 'vue2-smooth-scroll'
Vue.use(VueSmoothScroll) */
Vue.use(VueQuillEditor /* { default global options } */)
Vue.prototype.$echarts = echarts
// 挂载到vue的原型对象上供全局使用。
Vue.prototype.$dayjs = dayjs

Vue.use(ZkTable)
// Vue.component(ZkTable.name, ZkTable) 第二种注册方式 直接注册为全局组件
Vue.config.productionTip = false
// 格式化时间的第二种做法，全局过滤器 vue.filter('name',function)
Vue.filter('formatTime', function (origin) {
  // origin是形参，也就是我们传进来的时间
  const dt = new Date(origin)
  /* return `${dt.getFullYear()}-${dt.getMonth() + 1 < 10 ? '0' + dt.getMonth() : dt.getMonth()}-${dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate()} ${Math.floor(origin / 1000 / 60 / 60) % 24 < 10 ? '0' + (Math.floor(origin / 1000 / 60 / 60) % 24) : Math.floor(origin / 1000 / 60 / 60) % 24}:${Math.floor(origin / 1000 / 60) % 60 < 10 ? '0' + (Math.floor(origin / 1000 / 60) % 60) : Math.floor(origin / 1000 / 60) % 60}:${Math.floor(origin / 1000) % 60 < 10 ? '0' + (Math.floor(origin / 1000) % 60) : Math.floor(origin / 1000) % 60}` */
  // !上面这种写法错误 适合计算倒计时效果
  return `${dt.getFullYear()}-${(dt.getMonth() + 1 + '').padStart(2, '0')}-${(dt.getDate() + '').padStart(2, '0')} ${(dt.getHours() + '').padStart(2, '0')}:${(dt.getMinutes() + '').padStart(2, '0')}:${(dt.getSeconds() + '').padStart(2, '0')}`
})
// 这里我补零用的三元表达式，老师用的padstart方法 明天研究一下padstart方法和padend str.padstart(满足多少位，'不满足在前面或者后面加什么字符串')
// 获取时分秒也可以直接用方法，我还以为要自己计算呢 可以看一下如果是自己算多么麻烦上面。
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
