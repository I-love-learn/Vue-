import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 初始化css
import '@/assets/style/init.css'
// 字体图标css
import '@/assets/fonts/iconfont.css'
// vue-table-with-tree-grid引入并注册
import ZkTable from 'vue-table-with-tree-grid'

Vue.use(ZkTable)
// Vue.component(ZkTable.name, ZkTable) 第二种注册方式 直接注册为全局组件
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
