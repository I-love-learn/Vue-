const prodPlugins = []
// 发布阶段才用到的plugins 这里定义一个数组，只有当发布时候才用这个数组里的plugins 开发阶段时候不用
if (process.env.NODE_ENV === 'production') {
  // 如果是发布阶段，就用prodPlugins里的plugins
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 配置自动清除console 不过这种配置有个问题就是无论开发还是运行阶段都会自动移除console
    /* 'transform-remove-console' */
    // 确实配置完毕后啥信息也不打了，就连vue自带的打印消息也没了
    // 发布时候的插件数组 只有发布时候才使用它
    ...prodPlugins,
    // 展开数组
    // 配置"@babel/plugin-syntax-dynamic-import"
    '@babel/plugin-syntax-dynamic-import'
  ]
}
