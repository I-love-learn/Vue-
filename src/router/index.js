import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/home/HomeView'
import Welcome from '@/components/welcome/Welcome'
import Users from '@/views/users/UsersView'
import Roles from '@/views/roles/RolesView'
import Rights from '@/views/rights/RightsView'
import Cate from '@/views/cate/ProductsCate'
import Params from '@/views/params/GoodsParams'
import List from '@/views/list/GoodsList'
// 导入添加商品组件
import Add from '@/views/add/AddGoods'
import Edit from '@/views/edit/EditGood'
/* import Order from '@/views/order/OrderList' */
// 在main.js中已经引入过 element的模块了 而element模块中将$message挂载到了vue的prototype上，因此 这里不需要再次引入element模块了  element组件中的this.$message弹出框的this是vue实例 而router中的this就是router实例，因此不生效 这里我的做法是在下面new一个Vue实例 然后弹出框
// @需要注意的是 import是异步加载的 因此element中this.$message挂载到vue.prototype的时机在下面的router.beforeEach声明路由首位之前，因此这里可以执行 new Vue().$message ，因为此时$message已经挂载到Vue的原型对象上了，假如this.$message挂载到vue.prototype的时机在router.beforeEach后就要报错了，因此安全起见 可以在这里也引入element模块
Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    // 重定向
    redirect: '/login'
  },
  {
    // 我们要把首页路由连接到登录页 而不能直接把首页就设置成登录页
    path: '/login',
    // 导入组件的第二种方式 这样不需要在外面import了
    component: () => import('../views/login/LoginView.vue')
  },
  // import命令能够接受什么参数，import()函数就能接受什么参数，两者区别主要是后者为动态加载。
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: 'users', component: Users },
      { path: 'roles', component: Roles },
      { path: 'rights', component: Rights },
      { path: 'categories', component: Cate },
      { path: 'params', component: Params },
      { path: 'goods', component: List },
      // 注册为home路由下的子路由 路由地址为goods/add 这里只是路由地址为goods/add 但add并非goods下的子路由 路由地址和router-view的对应关系是，routes规则里的亲儿子路由对应的是app.vue中的router-view，最底层的默认路由就是/ /展示的是app.vue的内容 /下一级的都是用app.vue中的router-view来切换的，如果亲儿子路由对应的.vue组件中还有router-view，那么该router-view想要注册路由，则需要在亲儿子路由规则里的children中，path可以带/ 如果path带/了，那么对应的路由跳转地址也要带/ /是根目录的意思
      { path: 'goods/add', component: Add },
      { path: 'goods/edit', component: Edit },
      // 导入组件第二种方式
      { path: 'orders', component: () => import('@/views/order/OrderList') },
      { path: 'reports', component: () => import('@/views/report/ReportView') }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫
// 为路由添加导航守卫 beforeEach导航守卫 to从哪来 from去哪 next是否放行 next()直接放行，next('xx')跳转至xx
router.beforeEach((to, from, next) => {
  // to和from都是对象，里面包含hash，fullpath，path等属性和组件实例身上的$route一样，由此我们可以得出结论 to和from对象其实就是即将去往的组件实例和去往前的组件实例身上的$route属性
  // $router是VueRouter的实例方法,可以认为是全局的路由对象,包含了所有路由的对象和属性。
  // $route是一个路由参数对象（跳转的路由对象），可以认为是当前组件的路由管理，指当前激活的路由对象，包含当前url解析得到的数据，可以从对象里获取一些数据。如name,path等。
  // 如果用户访问的是登录页直接放行
  /* console.log(to) */
  // path是访问的地址 fullpath是地址加参数 hash是访问地址后面携带的hash地址
  if (to.path === '/login') {
    return next()
    // 直接放行 后续代码不执行
  }
  // else可省略 因为if判断生效直接return出去 不执行后续代码了
  // 获取本地存储中的token
  const token = localStorage.getItem('token')
  // token不存在 则跳转登录页 我测试了一下删除了本地存储的token直接跳转登录页了
  if (!token) {
    new Vue().$message({
      showClose: true,
      message: '检测到未登录，跳转至登录页',
      type: 'warning'
    })
    return next('/login')
  }
  // 否则放行
  next()
  // 上面的逻辑是 每次to要去往的地址 如果是login登录页 那好直接放行，如果不是登录页，那好判断是否登陆过了已经（token是否存在），不存在强制跳转登录页，存在那好，放行。
})

export default router
