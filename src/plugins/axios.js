'use strict'
// 这个文件是一个自定义插件 不过是vuecli帮我们封装好的 里面是封装axios的方法来调用接口 以及快速的为项目配置多个接口 以我现在的水平还不会自己封装插件
import Vue from 'vue'
import axios from 'axios'
// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// 自定义axios配置
const config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // 基准地址
  baseURL: 'http://127.0.0.1:8888/api/private/v1/'
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
}
// 创建一个axios实例
const _axios = axios.create(config)
// 请求拦截器 在请求之前做一些配置
_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent 在发送请求之前做些什么
    return config
  },
  function (error) {
    // Do something with request error 处理请求错误
    return Promise.reject(error)
    // 输出错误信息
  }
)

// Add a response interceptor 添加一个响应拦截器
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data 处理响应数据
    return response
  },
  function (error) {
    // Do something with response error 处理响应错误
    return Promise.reject(error)
  }
)
/* *******************************************************************************************
https://zhuanlan.zhihu.com/p/40192351
从源码中我们可以发现vue首先判断这个插件是否被注册过，不允许重复注册。
并且接收的plugin参数的限制是Function | Object两种类型。
对于这两种类型有不同的处理。

首先将我们传入的参数整理成数组 =>const args = toArray(arguments, 1)。
再将Vue对象添加到这个数组的起始位置args.unshift(this),这里的this 指向Vue对象
如果我们传入的plugin(Vue.use的第一个参数)的install是一个方法。也就是说如果我们传入一个对象，对象中包含install方法，那么我们就调用这个plugin的install方法并将整理好的数组当成参数传入install方法中。 =>plugin.install.apply(plugin, args)
如果我们传入的plugin就是一个函数,那么我们就直接调用这个函数并将整理好的数组当成参数传入。 =>plugin.apply(null, args)
之后给这个插件添加至已经添加过的插件数组中，标示已经注册过 =>installedPlugins.push(plugin)
最后返回Vue对象。

通过以上分析我们可以知道，在我们以后编写插件的时候可以有两种方式。

一种是将这个插件的逻辑封装成一个对象最后将最后在install编写业务代码暴露给Vue对象。这样做的好处是可以添加任意参数在这个对象上方便将install函数封装得更加精简，可拓展性也比较高。
还有一种则是将所有逻辑都编写成一个函数暴露给Vue。
其实两种方法原理都一样，无非第二种就是将这个插件直接当成install函数来处理。
个人觉得第一种方式比较合理。
******************************************************************************************* */

// 这里是本插件的核心业务代码 因为Plugin是一个对象，对象有install 方法，则必须使用vue.use()注册组件
Plugin.install = function (Vue, options) {
  // 这俩 不知道干嘛的 删除了也不影响请求发送
  // @知道了 这俩意思 就是发送请求时也可使用 Vue.axios或者window.axios
  Vue.axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    // 在vue的原型对象上增加两个 新方法 一个axios 一个$axios 他们的本质都是_axios这个axios实例
    axios: {
      get() {
        return _axios
      }
    },
    $axios: {
      get() {
        return _axios
      }
    }
  })
}
// 上面这个配置意味着我们发送请求时可以用 Vue.axios或者window.axios又或者this.axios和this.$axios
Vue.use(Plugin)
// 如果Vue.use() 中的参数是一个Object对象，那么这个对象必须提供一个install方法，install方法的参数就是Vue。 这里我们给Plugin提供install方法了

// @根据vue开发插件的文档，Vue.use方法会寻找插件上的install方法，并且执行，如果插件没有install方法的话，就会报错，无法使用use来注册插件。因此，Vue.js 的插件应该暴露一个 install 方法。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象:
// #安装 Vue.js 插件。如果插件是一个对象，必须提供 install 方法。如果插件是一个函数，它会被作为 install 方法。install 方法调用时，会将 Vue 作为参数传入。什么意思呢？ Vue.use() 中的参数必须是一个function函数或者是一个Object对象，如果是对象的话，必须在对象中提供一个install方法。之后会将 Vue 作为参数传入。我们分两点来看：
/*
 *1.如果Vue.use() 中的参数是一个function函数，那么函数的参数是Vue对象。
 *2.如果Vue.use() 中的参数是一个Object对象，那么这个对象必须提供一个install方法，install方法的参数就是Vue。
 axios本质是函数，赋值了一些别名方法，比如get、post方法，可被调用，最终调用的还是Axios.prototype.request函数。
 这就是为何axios不能用vue.use了,因为 axios 没有 install。
 */
/*
因为axios是基于Promise封装的库，是完全独立于Vue的，根本不需要挂载在Vue上也能实现发送请求。
而因为VueRouter需要为我们提供$router、$routers之类的属性，要依赖与Vue或者操作Vue实例才能实现。
Vue.use实际上就是Vue实例与插件的一座桥梁。
 */
// !Vue.use()在使用时，传入的参数要么是一个对象（Object），并且这个Object中必须提供并暴露一个install函数；要么是一个函数（function），这个函数会被当作install去调用。而axios并不是一个对象，且其自身也不是一个能被当作install调用的函数，故而axios在引入之后可以直接使用，而不需要利用Vue.use()做全局混入，直接将axios挂载到Vue的实例对象上即可全局使用！
export default Plugin
