<template>
  <div class="warp">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- separator分隔符 separator-class图标分隔符 class -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="10">
        <!-- gutter:col与col的间距 -->
        <!-- el-row 默认分成24份 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" v-model.trim="$store.state.params.query" clearable>
            <!-- 可以在执行clearable事件时触发回调函数重置列表 这里我为了好看加了个重置按钮clearable只用来清空文字 -->
            <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="dialogFormVisible = true">添加用户</el-button>
          <el-button @click="resetUser" size="small">重置</el-button>
        </el-col>
        <!-- dialog 弹出框 弹出框内可嵌套表单表格等 -->
        <!-- visible是否显示 Dialog -->
        <!-- .sync修饰符可以实现子组件与父组件的双向绑定，并且可以实现子组件同步修改父组件的值。 -->
        <el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="50%" @close="resetInfo">
          <!-- dialog关闭时会触发close关闭事件 此时我们重置表单信息 close：Dialog 关闭的回调 -->
          <el-form :model="data" ref="formUser">
            <el-form-item
              label="用户名"
              label-width="65px"
              prop="username"
              :rules="[
                { required: true, message: '用户名不能为空', trigger: 'blur' },
                { pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/, message: '用户名只能使用3-12位中英文数字下划线', trigger: 'blur' },
                { min: 3, max: 12, message: '用户名只能使用3-12位中英文数字下划线', trigger: 'blur' }
              ]"
            >
              <!-- label-width表单域标签的宽度，例如 '50px'。 -->
              <!-- rules和prop搭配才能开启表单验证 rules是规则prop是规则对应的input绑定的哪个数据要验证的 -->
              <el-input v-model="data.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item
              label="密码"
              label-width="65px"
              prop="password"
              :rules="[
                { required: true, message: '密码不能为空', trigger: 'blur' },
                { pattern: /^[a-zA-Z]\w{5,17}$/, message: '密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线', trigger: 'blur' }
              ]"
            >
              <el-input v-model="data.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item
              label="邮箱号"
              label-width="65px"
              prop="email"
              :rules="[
                { required: true, message: '邮箱号不能为空', trigger: 'blur' },
                { type: 'email', message: '格式错误', trigger: 'blur' }
              ]"
            >
              <el-input v-model="data.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item
              label="手机号"
              label-width="65px"
              prop="mobile"
              :rules="[
                { required: true, message: '手机号不能为空', trigger: 'blur' },
                // 通过pattern指定自定义的正则表达式验证规则：
                { pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/, message: '格式不正确', trigger: 'blur' }
              ]"
            >
              <!-- 验证规则也可以直接写在行内 -->
              <el-input v-model="data.mobile" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="checkRule">确 定</el-button>
            <el-button type="info" @click="resetInfo" size="small">重置</el-button>
          </div>
        </el-dialog>
        <el-col :span="10">
          <el-button @click="resetDateFilter">清除日期过滤器</el-button>
          <el-button @click="clearFilter">清除所有过滤器</el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table ref="filterTable" :data="$store.state.userList" style="width: 100%" stripe>
        <!-- 当el-table元素中注入data对象数组后，在el-table-column中用prop属性来对应对象中的键名即可填入数据，用label属性来定义表格的列名。可以使用width属性来定义列宽。 -->
        <el-table-column type="index" width="60" label="#"> </el-table-column>
        <!-- type='index'索引列 -->
        <el-table-column prop="username" label="用户名" width="120"> </el-table-column>
        <!-- column 的 key，如果需要使用 filter-change 事件，则需要此属性标识是哪个 column 的筛选条件 -->

        <el-table-column prop="mobile" label="联系电话" width="150"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
        <el-table-column prop="create_time" label="创建时间" :formatter="formatter" sortable width="130" column-key="create_time" :filters="$store.getters.filterDateList" :filter-method="filterHandler"> </el-table-column>
        <el-table-column prop="mg_state" label="状态" width="80">
          <template slot-scope="scope">
            <!-- 这里原理其实就是插槽那部分的内容 插槽v-slot传值 然后使用插槽时可使用scope/slot-scope获取v-slot上的值 然后在插槽内部使用 -->
            <!-- 这里也可以直接传scope.row 然后到下面的方法中再.id .mg_state -->
            <el-switch v-model="scope.row.mg_state" :change="changeUserState(scope.row.id, scope.row.mg_state)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="130" :filters="$store.getters.filterRoleList" :filter-method="filterTag" filter-placement="bottom-end">
          <!-- filter-placement过滤弹出框的定位 -->
          <template slot-scope="scope">
            <!-- “slot-scope=“scope” 的scope是el 生成的一个对象,里面不仅包含了那一行的数据row, 还包含了一些其他有用的属性。 通过scope.row.data,我们就可以读取到每一行中的data。” -->
            <!-- @其实说到底这个东西的出现 我们可以只在el-table-column的 prop处传一次值，el-table-column中的所有标签都可以通过scope.row来读取使用这些属性 不对，准确来说scope.row中本身就包含对象的所有属性了，因此可以删掉prop 只保留scope即可 -->
            <el-tag :type="scope.row.role_name === '超级管理员' ? 'primary' : 'success'" disable-transitions>{{ scope.row.role_name }}</el-tag>
          </template>
        </el-table-column>
        <!-- 操作部分需要用到多个属性，因此用scope作用域插槽比较好而不是prop -->
        <el-table-column label="操作">
          <!-- scope/slot-scop作用域插槽 -->
          <template slot-scope="scope">
            <!-- enterable鼠标是否可进入到 tooltip 中 false就是鼠标放到tooltip上是会隐藏el-tooltip -->
            <el-tooltip class="item" effect="dark" content="编辑用户" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" @click="editInfo(scope.row.id, scope.row.mobile, scope.row.email, scope.row.username)" size="small"></el-button>
            </el-tooltip>
            <el-dialog title="修改用户信息" :visible.sync="dialogEditUser" width="50%" @close="resetEditUser">
              <!-- dialog关闭时会触发close关闭事件 此时我们重置表单信息 close：Dialog 关闭的回调 -->
              <el-form :model="editData" ref="editFormRef">
                <el-form-item label="用户名" label-width="65px">
                  <!-- label-width表单域标签的宽度，例如 '50px'。 -->
                  <!-- rules和prop搭配才能开启表单验证 rules是规则prop是规则对应的input绑定的哪个数据要验证的 -->
                  <el-input v-model="username" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item
                  label="邮箱号"
                  label-width="65px"
                  prop="email"
                  :rules="[
                    { required: true, message: '邮箱号不能为空', trigger: 'blur' },
                    { type: 'email', message: '格式错误', trigger: 'blur' }
                  ]"
                >
                  <el-input v-model="editData.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                  label="手机号"
                  label-width="65px"
                  prop="mobile"
                  :rules="[
                    { required: true, message: '手机号不能为空', trigger: 'blur' },
                    // 通过pattern指定自定义的正则表达式验证规则：
                    { pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/, message: '格式不正确', trigger: 'blur' }
                  ]"
                >
                  <!-- 验证规则也可以直接写在行内 -->
                  <el-input v-model="editData.mobile" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogEditUser = false">取 消</el-button>
                <el-button type="primary" @click="edit">确 定</el-button>
              </div>
            </el-dialog>
            <el-tooltip class="item" effect="dark" content="删除用户" placement="top" :enterable="false">
              <!--作用域插槽传递id -->
              <el-button type="danger" icon="el-icon-delete" size="small" @click="removeUser(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="角色分配" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="small" @click="roleAssign(scope.row)"></el-button>
            </el-tooltip>
            <!-- 角色分配的弹出框 -->
            <!-- @dialog最好最好放到最外层容器内，与其他元素同级，这么做好处是不会出bug，放在table和el-table-column标签中就就不会显示，放template slot-scope标签中则会显示 -->
            <el-dialog title="角色分配" :visible.sync="dialogroleAssignVisible">
              <el-form :model="roleAssignData">
                <el-form-item label="当前用户：" label-width="100px"> {{ roleAssignData.username }} </el-form-item>
                <el-form-item label="当前角色：" label-width="100px"> {{ roleAssignData.role_name }} </el-form-item>
                <el-form-item label="角色设置：" label-width="100px">
                  <el-select v-model="roleAssignData.roleid" placeholder="请选择要更改的角色">
                    <!-- 老师这里没有用el-form以及el-form-item 而是自己用p画的页面 <p>当前用户：{{scope.row.username}}</p> <p>请选择：<el-select></el-select></p>-->
                    <template v-for="item in $store.state.rolesList">
                      <!-- 这里可以省略template 直接在option上for循环。 -->
                      <el-option :label="item.roleName" :value="item.id" :key="item.id"></el-option>
                    </template>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogroleAssignVisible = false">取 消</el-button>
                <el-button type="primary" @click="assignRole">确 定</el-button>
              </div>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[2, 3, 4, 5]" :page-size="$store.state.params.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="$store.state.total" background> </el-pagination>
      <!-- current-change:currentPage 改变时会触发 可以在分页时触发，然后发起ajax请求 -->
      <!-- size-change：pageSize 改变时会触发 这个是调整分页显示条数时触发 -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 控制弹出框是否显示
      dialogFormVisible: false,
      // 添加用户的表单数据，后面要发起ajax请求的携带参数
      data: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editData: {
        id: 0,
        email: '',
        mobile: ''
      },
      username: '',
      // 控制编辑用户框隐藏or显示
      dialogEditUser: false,
      // 角色分配控制显示隐藏
      dialogroleAssignVisible: false,
      roleAssignData: {
        id: 0,
        username: '',
        role_name: '',
        roleid: ''
      }
    }
  },
  methods: {
    resetDateFilter() {
      this.$refs.filterTable.clearFilter('create_time')
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter()
    },
    // formatter属性，它用于格式化指定列的值 就是把后端传递的值 放到formatter的方法中经过计算后再使用
    formatter(row, column) {
      // 这里row指代的是 table使用的数据源中的每一项
      // column指代的是当前标签 这里的标签是create_time 这一竖行标签中的每一个
      const newDate = new Date(row.create_time)
      return newDate.getFullYear() + '-' + newDate.getMonth() + '-' + newDate.getDate()
    },
    filterTag(value, row) {
      return row.role_name === value
    },
    filterHandler(value, row, column) {
      // 在列中设置filtersfilter-method属性即可开启该列的筛选，filters 是一个数组，filter-method是一个方法，它用于决定某些数据是否显示，会传入三个参数：value, row 和 column。
      const property = column.property
      const newDate = new Date(row[property])
      return newDate.getFullYear() + '-' + newDate.getMonth() + '-' + newDate.getDate() === value
    },
    // 修改显示条数触发回调
    handleSizeChange(val) {
      // val是当前条数
      // 这里我是直接修改了pagesize 按理说不应该 应该把修改pagesize方法写在store中 然后这里执行那个方法把val传过去
      // this.$store.state.params.pagesize = val
      this.$store.commit('changePage', val)
      this.$store.dispatch('initUserList')
    },
    // 改变当前页执行方法
    handleCurrentChange(val) {
      this.$store.commit('changePageNum', val)
      this.$store.dispatch('initUserList')
    },
    // 状态开关change事件的回调函数
    async changeUserState(id, val) {
      const { data } = await this.$axios({
        url: `users/${id}/state/${val}`,
        // put更新修改
        method: 'PUT'
      })
      if (data.meta.status !== 200) {
        return this.$message.error('更新用户状态失败')
      }
    },
    // 这里通过修改对象属性的方式与store中的state的query属性双向绑定
    searchUser() {
      this.$store.dispatch('initUserList')
    },
    resetUser() {
      // 不推荐直接修改store中的值，这是里练习没关系
      this.$store.state.params.query = ''
      this.$store.dispatch('initUserList')
    },
    resetInfo() {
      // 这个是我们自己手动写的重置事件，自己写的重置事件确实清空内容了，但是提示没有清空，官方有封装好的通过ref直接调用resetFields()方法既清空内容也清空提示
      /*  this.data = {
        username: '',
        password: '',
        email: '',
        mobile: ''
      } */
      this.$refs.formUser.resetFields()
    },
    // 点击确定按钮的表单预校验，通过校验才隐藏表单，然后发起ajax请求的
    checkRule() {
      // validate对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
      // 第一个参数 是否通过 第二个参数未通过的value是哪个
      this.$refs.formUser.validate(async (success, value) => {
        if (success) {
          const { data } = await this.$axios({
            url: 'users',
            method: 'POST',
            data: this.data
          })
          // 把返回值添加到userlist数组中
          if (data.meta.status !== 201) {
            return this.$message.error('添加用户数据失败')
          }
          this.$message.success('添加用户数据成功')
          this.$store.dispatch('initUserList')
          this.dialogFormVisible = false
        }
      })
    },
    editInfo(id, mobile, email, name) {
      // 将传递过来的name作为表单用户名的值 将传递过来的id作为参数对象的id
      // 这里老师做法是只获取id然后根据id 发起请求再获取其他的数据项，那没必要 因为scope.row里面已经包含其他项了
      this.username = name
      this.editData.id = id
      this.editData.mobile = mobile
      this.editData.email = email
      this.dialogEditUser = true
    },
    edit() {
      // 这里有个bug 就是this.editData的值与修改前的值是一模一样的
      // 但打印单独的项 却又是修改后的数据，真神奇
      this.$refs.editFormRef.validate(async (success, value) => {
        if (success) {
          const { data } = await this.$axios({
            url: `users/${this.editData.id}`,
            method: 'PUT',
            data: { email: this.editData.email, mobile: this.editData.mobile }
          })
          // 把返回值添加到userlist数组中
          if (data.meta.status !== 200) {
            return this.$message.error('修改用户数据失败')
          }
          this.$message.success('修改用户数据成功')
          this.$store.dispatch('initUserList')
          // 这边代码之前有问题 排错拍了一个小时 只是由于多写了一行this.dialogFormVisible = false
          this.dialogEditUser = false
        }
      })
    },
    // 重置编辑栏的修改
    resetEditUser() {
      // 这个ref必须是form上的 不是dialog上的
      this.$refs.editFormRef.resetFields()
    },
    // 根据id删除对应用户
    removeUser(id) {
      console.log(id)
      //  this.$confirm执行结果是个promise对象，既然是promise对象，就能用async和await转换为同步执行，执行的结果，如果确定结果是confirm字符串，取消结果是cancel字符串
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // 小图标的样式
        type: 'warning'
      })
        .then(async () => {
          const { data } = await this.$axios({
            url: `users/${id}`,
            method: 'DELETE'
          })
          if (data.meta.status !== 200) {
            return this.$message.error('删除失败')
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$store.dispatch('initUserList')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 点击权限管理的事件
    roleAssign(row) {
      // 这里老师由于没有用store的缘故，又在这里重新写了一次获取角色列表的ajax请求，这里可以看出store还是挺方便的。
      this.$store.dispatch('initRolesList')
      this.dialogroleAssignVisible = true
      this.roleAssignData.username = row.username
      this.roleAssignData.role_name = row.role_name
      this.roleAssignData.id = row.id
      this.roleAssignData.roleid = ''
    },
    // 分配角色的确定按钮
    async assignRole() {
      if (this.roleAssignData.role !== '') {
        const { data } = await this.$axios({
          url: `users/${this.roleAssignData.id}/role`,
          // 除了get用params 其他的我们都用data
          method: 'PUT',
          data: { rid: this.roleAssignData.roleid }
        })
        if (data.meta.status !== 200) {
          return this.$message.error('权限更新失败')
        }
        this.$message.success('权限更新成功')
      }
      this.dialogroleAssignVisible = false
      this.$store.dispatch('initUserList')
    }
  },
  created() {
    this.$store.dispatch('initUserList')
  }
}
</script>

<style lang="less" scoped>
.warp {
  padding: 20px;
  /* element 标签不可直接拿过来样式覆盖 要加. 一般标签名默认自带类名*/
  .el-card {
    height: 448px;
    .el-table {
      margin-top: 10px;
    }
  }
  .cell {
    .el-button/deep/ {
      margin: 0 5px;
    }
  }
  .el-pagination {
    margin-top: 10px;
  }
  /deep/.el-table .el-table__cell {
    padding: 10px 0;
  }
  .el-pagination {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
  }
}
</style>
