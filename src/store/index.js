import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const vue = new Vue()

export default new Vuex.Store({
  state: {
    // menusList 是一个数组，数组中有5个元素 这五个元素的authName就是一级菜单名，在每个元素下都有chlidren属性，里面同样是一个数组，数组中每个元素的authName是二级菜单名
    menusList: [],
    iconObj: {
      1: 'el-icon-user',
      2: 'el-icon-turn-off',
      3: 'el-icon-sell',
      4: 'el-icon-document-copy',
      5: 'el-icon-data-line'
    },
    iconarr: { '1-1': 'el-icon-tickets', '2-1': 'el-icon-s-custom', '2-2': 'el-icon-key', '3-1': 'el-icon-s-grid', '3-2': 'el-icon-s-unfold', '3-3': 'el-icon-menu', '4-1': 'el-icon-printer', '5-1': 'el-icon-data-analysis' },
    userList: [],
    // 参数
    params: {
      query: '',
      pagenum: 1,
      pagesize: 5
    },
    total: 0,
    // 权限列表
    rightsList: [],
    // 角色列表
    rolesList: [],
    rightsTreeList: []
  },
  getters: {
    filterDateList(state) {
      const list = []
      let dateList = []
      const arr = []
      // 筛选用户对象中的time放入数组
      state.userList.forEach((element) => {
        for (const key in element) {
          if (key === 'create_time') {
            arr.push(element[key])
          }
        }
      })
      // time转成yyyy-mm-ss格式
      arr.forEach((element) => {
        // 不需要重新赋值的变量 我们都用const定义
        const newDate = new Date(element)
        dateList.push(newDate.getFullYear() + '-' + newDate.getMonth() + '-' + newDate.getDate())
      })
      // 数组去重
      dateList = [...new Set(dateList)]
      // 放入筛选数组
      dateList.forEach((element) => {
        list.push({ text: `${element}`, value: `${element}` })
      })
      return list
    },
    filterRoleList(state) {
      const arr = []
      // 筛选用户角色放入数组
      state.userList.forEach((element) => {
        for (const key in element) {
          if (key === 'role_name') {
            arr.push(element[key])
          }
        }
      })
      // 去重
      const newarr = [...new Set(arr)]
      const finalList = []
      newarr.forEach((element) => {
        finalList.push({ text: `${element}`, value: `${element}` })
      })
      return finalList
    }
  },
  mutations: {
    // 不需要执行方法渲染菜单结构了 直接v-for渲染好了
    /* initMenusDom() {
      menusList
    } */
    // 修改显示条数方法
    changePage(state, payload) {
      state.params.pagesize = payload
    },
    changePageNum(state, payload) {
      state.params.pagenum = payload
    }
  },
  actions: {
    // 异步操作写在actions中 context就是store
    async initMenus(context) {
      const { data } = await vue.$axios({
        url: 'menus',
        method: 'GET'
      })
      if (data.meta.status !== 200) {
        return vue.$message.error('获取菜单数据失败')
      }
      context.state.menusList = data.data
    },
    async initUserList(context) {
      // 其实这里也可以直接导入axios.js 未必非要使用挂载到vue上的axios
      const { data } = await vue.$axios({
        url: '/users',
        // 我们推荐把要传递的params参数定义到state上，可能后续为了方便分页之类的直接修改值传值吧。
        params: context.state.params,
        method: 'GET'
      })
      if (data.meta.status !== 200) {
        return vue.$message.error('获取用户数据失败')
      }
      context.state.userList = data.data.users
      // total是数据总数，获取他是为了后面做分页用的
      context.state.total = data.data.total
    },
    async initRightsList(context) {
      const { data } = await vue.$axios({
        url: '/rights/list',
        method: 'GET'
      })
      if (data.meta.status !== 200) {
        return vue.$message.error('获取权限列表失败')
      }
      context.state.rightsList = data.data
    },
    async initRolesList(context) {
      const { data } = await vue.axios({
        url: '/roles',
        method: 'GET'
      })
      if (data.meta.status !== 200) {
        return vue.$message.error('获取角色列表失败')
      }
      context.state.rolesList = data.data
    },
    // 获取树状权限结构
    async initRightsTreeList(context) {
      const { data } = await vue.$axios({
        url: 'rights/tree',
        method: 'GET'
      })
      if (data.meta.status !== 200) {
        return vue.$message.error('获取权限列表失败')
      }
      context.state.rightsTreeList = data.data
    }
  },
  modules: {}
})
