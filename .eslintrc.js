module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': ['warn', 'never'],
    // # 关闭函数()前必须加空格的规则 error 报错  warn报警告
    // # 关闭eslint强制数组方法的回调函数中有 return 语句
    'array-callback-return': ['warn', { allowImplicit: true }]
  }
}
