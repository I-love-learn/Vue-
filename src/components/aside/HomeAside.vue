<template>
  <div class="warp">
    <!-- 放一个按钮，可折叠展开菜单 -->
    <el-button type="primary" @click="toggleMenu" id="btn">|||</el-button>
    <!-- 侧边菜单区域 -->
    <el-menu :default-active="router" class="el-menu-vertical-demo" active-text-color="#409EFF" :collapse="isCollapse" unique-opened :collapse-transition="false" router>
      <!-- collapse-transition关闭折叠展开动画 -->
      <!-- unique-opened是否只保持一个子菜单的展开 -->
      <!-- active-text-color点击文字变色 -->
      <!-- 一级菜单 -->
      <!-- @index必须是字符串 -->
      <!-- @ v-for 想用索引时要和item一起放在括号里声明 不能直接用  使用时直接index 而不要item.index -->
      <!-- 给el-menu加了 router属性后 会根据index的值跳转对应路由页面 这里index我们用的是index值1234这种，数字作为路由地址不太好，所以要改造一下，这里用item.path值 -->
      <el-submenu v-for="(item, index) in $store.state.menusList" :key="item.id" :index="`/home/${item.path}`">
        <!-- path是我们设置的路由 -->
        <!-- 一级菜单模板区域 -->
        <template slot="title">
          <!-- 图标 -->
          <!-- @如果key值不确定，而是一个变量的时候，只能通过obj[key]来访问 -->
          <i :class="$store.state.iconObj[index + 1]"></i>
          <!-- 文本 -->
          <span>{{ item.authName }}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="`/home/${val.path}`" v-for="(val, index2) in item.children" :key="val.id" @click="active(`/home/${val.path}`)">
          <!-- ?这里我犯了个错误 没有把index的完整值作为参数传递 而是只用了${val.path} -->
          <!-- @这里所有的:index和active后面的路由地址都可以省略不写/home/ 直接写成${val.path} 这是由于默认情况下路由的link跳转的地址是当前的父路由地址拼接跳转里写的地址，也就是说/home/写不写都会自动带上 至于这里案例应该不写拼接的是/ 当前父路由是/ 但是却拼接的是/home至于为什么我也不知道，或许是elementui的设定吧，但老师的那个不拼接默认就是/+${val.path}，我的不拼接/home却还是自动拼接了，这个以后再说，反正只要默认写完成地址就一定不会出错。 -->
          <!-- 不对劲，经过我自己的测试 routerlinkto的确自动拼接了 /home 证明element并没有自动处理这个 还是我写的问题。 -->
          <!-- @ 最终结论：不写/home/ 的确不会拼接/home/ 而是拼接的根目录 证明先前的结论是正确的，至于为什么前几次没测试出来，是因为页面没有重新刷新。 -->
          <i :class="$store.state.iconarr[index + 1 + '-' + (index2 + 1).toString()]"></i>
          <span>{{ val.authName }}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'home-aside',
  data() {
    return {
      // 展开收缩的数据
      isCollapse: false,
      // 当然这里也可以不用router接收 直接在上面的标签中写sessionStorage.getItem('active')
      router: sessionStorage.getItem('active')
    }
  },
  methods: {
    // 按钮折叠与展开方法
    toggleMenu() {
      this.isCollapse = !this.isCollapse
      this.$emit('toggleWidth', this.isCollapse)
    },
    // 保持链接激活状态
    active(val) {
      sessionStorage.setItem('active', val)
      this.router = sessionStorage.getItem('active')
    }
  }
}
</script>

<style lang="less" scoped>
.warp {
  width: 100%;
  height: 100%;
  background: #ffffff;
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  #btn {
    width: 100%;
    height: 25px;
    padding: 0;
    border-radius: 0;
    letter-spacing: 1px;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    // 最小高度100%父盒子高度减去按钮高度 保证每条线长度都能铺满盒子
    min-height: calc(100% - 25px);
    /* calc想生效 必须符号两边加空格 */
  }
  .el-menu--collapse {
    min-height: calc(100% - 25px);
  }
}
</style>
