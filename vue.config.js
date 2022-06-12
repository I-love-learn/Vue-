const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
  transpileDependencies: true,
  // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。你可以启用本选项，以避免构建后的代码中出现未转译的第三方依赖。

  // 不过，对所有的依赖都进行转译可能会降低构建速度。如果对构建性能有所顾虑，你可以只转译部分特定的依赖：给本选项传一个数组，列出需要转译的第三方包包名或正则表达式即可。
  // 这个打开是为了防止有的第三方依赖不能被转译，导致项目报错 不过我看老师没启用
  // chainWebpack自定义打包配置
  chainWebpack: (config) => {
    // console.log(config) 无法打印config 不知道为何，也许是压根就没用到这个配置文件在文件运行时，mainjs里的log倒是能打印
    // 发布模式
    // config是webpack配置对象，when是条件，用来判断是否需要执行这个配置，这里是判断是否是生产环境
    config.when(process.env.NODE_ENV === 'production', (config) => {
      // entry是webpack配置对象中的入口配置，这里是配置所有入口文件的入口，clear是清除默认打包入口main.js，这里是清除所有入口文件的入口，add是添加配置，这里是添加一个新的入口文件，新入口文件的名字是main-prod
      config.entry('app').clear().add('./src/main-prod.js')

      // 我们只需在发布模式下配置externals
      // externals是用来配置那些不需要打包的。
      config.set('externals', {
        // key是包名 value是引入的全局变量名 这个名要和import的名字一致
        // 配置了externals后在index.html文件中我们通过cdn 引入的文件 就不需要打包了，并且可以直接被项目用import引入而不报错
        vue: 'Vue',
        // 带-符号的需要用字符串形式引入
        'vue-router': 'VueRouter',
        vuex: 'Vuex',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor',
        dayjs: 'dayjs'
        // element ui 不需要配置externals
      })
      config.plugin('html').tap((args) => {
        //添加参数isProd
        args[0].isProd = true
        return args
      })
    })

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', (config) => {
      config.entry('app').clear().add('./src/main-dev.js')

      // plugin是插件，这里插件名是html，这个插件用来更改index.html文件，添加一些自定义的属性，这里添加了isProd属性，用来判断是否是开发模式。
      // tap是点击，这里是点击html插件，这里的args是插件的参数，这里的args是一个数组，数组的第一个参数是webpack配置对象，第二个参数是插件的参数，这里我们把isProd设置为false，这样就可以在index.html文件中用{{isProd}}来判断是否是开发模式了。
      // 给webpack的配置对象增加一个新属性isprod判断是否是开发模式
      config.plugin('html').tap((args) => {
        //添加参数isProd
        args[0].isProd = false
        return args
      })
    })
  }
})
/* 
配置参数： 两种用哪种都行

1.两种配置方式
module.exports = {
  // 选项……
}
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // 选项……
})
具体配置参数：https://blog.csdn.net/weixin_35773751/article/details/123414144
*/
