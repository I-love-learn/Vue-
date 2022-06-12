<template>
  <div class="warp">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- separator分隔符 separator-class图标分隔符 class -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 弹出框用的是dialog 提示框才是messagebox -->
    <el-dialog title="添加新角色" :visible.sync="dialogFormVisible" @close="resetAddForm">
      <el-form :model="rolesparam" :rules="addRules" ref="addRolesForm">
        <!-- label-width设置了 label才会和input同一行 不设置label-width 默认两行 -->
        <el-form-item label="角色名称" label-width="80px" prop="roleName">
          <el-input v-model="rolesparam.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="80px" prop="roleDesc">
          <!-- prop不需要加: 也不需要加addRules.xx 直接属性名 prop加载el-form-item上而非input上 -->
          <el-input v-model="rolesparam.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </div>
    </el-dialog>
    <el-card>
      <!-- 这里老师也用的栅格布局包裹按钮，依我看没必要 直接放个按钮好了 -->
      <el-button type="primary" @click="dialogFormVisible = true">添加角色</el-button>
      <el-table :data="$store.state.rolesList" border stripe>
        <!-- table data是一个数组 el-table-column的prop对应的是数组中每一个子元素的某个属性 -->
        <!-- prop对应列内容的字段名，也可以使用 property 属性 -->
        <!-- 当el-table元素中注入data对象数组后，在el-table-column中用prop属性来对应对象中的键名即可填入数据，用label属性来定义表格的列名。可以使用width属性来定义列宽。 -->
        <el-table-column type="expand">
          <!-- 里面可以写隐藏的内容 然后可展开 -->
          <!-- 权限在rolesList数组元素的children属性中 这里可以用作用域插槽获取children属性，也可用$store.state.rolesList.children -->
          <template slot-scope="scope">
            <!-- ************************************************************ -->
            <!--  <el-table :data="scope.row.children" style="width: 100%">
                <el-table-column prop="authName"></el-table-column>
                <el-table-column> -->
            <!-- scope.row.children.children为空，获得不了children的children -->
            <!-- {{ scope.row.children.children }} -->
            <!--  <el-table :data="scope.row.children.children" style="width: 100%">
                    <el-table-column prop="authName"></el-table-column>
                  </el-table> -->
            <!--  </el-table-column>
              </el-table> -->
            <!-- ************************************************************ -->
            <!-- 这里老师做法是用栅格系统布局 每一列代表一级权限 -->
            <!-- for循环权限列表 每个children元素是一个row 一级权限占一个col 二级三级占一个col 先把一级权限循环显示出来 -->
            <template v-for="item of scope.row.children">
              <!-- 既要满足自己孩子length不能为零 又要满足孙子数组的length不能为空 -->
              <el-row class="el-row-one" v-if="item.children.length !== 0" :key="item.id">
                <!-- 不确定？ 明天测试 有bug 这种方式也不推荐-->
                <!-- 目前只能实现删除所有三级二级自动隐藏以及删除所有二级一级自动隐藏，做不到删除所有三级一级自动隐藏，这个实现不了。 -->
                <!-- 这是一级权限 -->
                <!-- @不要用v-if来操纵这里的渲染会有bug 正确应该是处理数据在方法中 -->
                <el-col :span="5">
                  <!-- 我用的这个elementui版本 el-tag没有生成的过渡动画效果 -->
                  <!-- close 关闭事件 -->
                  <el-tag closable @close="removeRightsById(scope.row, item.id)">
                    {{ item.authName }}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>

                <!-- 二级三级的写一起 -->
                <el-col :span="19">
                  <!-- 要注意的是这里span是19 里面的col再划分还是24总数 -->
                  <!-- 里面再嵌套el-row 区分二级和三级 -->
                  <!-- 依然for循环循环二级 -->
                  <template v-for="item2 of item.children">
                    <el-row :key="item2.id" class="el-row-two" v-if="item2.children.length !== 0">
                      <el-col :span="6">
                        <el-tag closable type="success" @close="removeRightsById(scope.row, item2.id)">
                          {{ item2.authName }}
                        </el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>

                      <el-col :span="18">
                        <!-- 继续for循环 渲染3级 -->
                        <el-tag closable type="danger" v-for="item3 of item2.children" :key="item3.id" @close="removeRightsById(scope.row, item3.id)">
                          {{ item3.authName }}
                        </el-tag>
                      </el-col>
                    </el-row>
                  </template>
                </el-col>
              </el-row>
            </template>
          </template>
        </el-table-column>
        <!-- type对应列的类型。如果设置了 selection 则显示多选框；如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 expand 则显示为一个可展开的按钮 -->
        <!-- type设置的列 不会和没设置type的列评分行的宽度，type有自己默认的宽度 -->
        <el-table-column type="index" label="#" align="center"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 因为方法要传递数据 这里用到作用域插槽 -->
            <!-- @scope.row 相当于每一行渲染的数据集合 -->
            <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditForm(scope.row)">编辑</el-button>
            <!-- 编辑角色 -->
            <el-button type="danger" icon="el-icon-delete" size="small" @click="removeRights(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="small" @click="showAssignRights(scope.row)">分配权限</el-button>
            <!-- dialog不要放到按钮之间否则会清空按钮间的空袭，最好放到按钮最后。 -->
            <el-dialog title="编辑角色" :visible.sync="dialogEditVisible" @close="resetEditForm">
              <el-form :model="editData" :rules="addRules" ref="editRolesForm">
                <!-- label-width设置了 label才会和input同一行 不设置label-width 默认两行 -->
                <el-form-item label="角色名称" label-width="80px" prop="roleName">
                  <el-input v-model="editData.roleName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" label-width="80px" prop="roleDesc">
                  <!-- prop不需要加: 也不需要加addRules.xx 直接属性名 prop加载el-form-item上而非input上 -->
                  <el-input v-model="editData.roleDesc" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogEditVisible = false">取 消</el-button>
                <!-- @这里有一个重大错误需要指出，就是只有表格，每一行的内容才可以获取到当前这一行的scope.row 而弹出框不能，不管弹出框是否写在template slot-scope中 即便写在了slot-scope中 传地的scope.row也是本页面最后一行的row值 不卸载template中就是报错报rowisundefined -->
                <el-button type="primary" @click="editRoles">确 定</el-button>
              </div>
            </el-dialog>
            <el-dialog title="分配权限" :visible.sync="dialogAssignVisible" width="50%" @close="emptyRightsChecked">
              <!-- 树形控件 -->
              <el-tree :data="$store.state.rightsTreeList" show-checkbox node-key="id" :default-checked-keys="defKeys" :props="defaultProps" :default-expand-all="true" v-loading="loading" ref="tree"> </el-tree>
              <!-- defKeys是默认哪些展开的数组，里面的元素都是id -->
              <!-- 只要设置了:data数据绑定对象和:props数据配置对象后，基本的树形结构就可以渲染出来了 -->
              <!-- props配置选项 默认展示哪个文本遇到子节点嵌套哪个是子节点的声明-->
              <!-- node-key每个树节点用来作为唯一标识的属性，整棵树应该是唯一的 这里我们把id作为node-key便于接下来我们选中的看起来是文本其实是id -->
              <!-- default-expanded-keys默认展开的节点的 key 的数组 -->
              <!-- default-checked-keys默认勾选的节点的 key 的数组 -->
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAssignVisible = false">取 消</el-button>
                <!-- id传过来 每一行的scope.row都不同，这个id传的就是本行的 -->
                <!-- ?这里拿不到scope.row.id 估计是 -->
                <el-button type="primary" @click="assignRights">确 定</el-button>
              </div>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogFormVisible: false,
      // 发起请求的参数 添加角色
      rolesparam: {
        roleName: '',
        roleDesc: ''
      },
      addRules: {
        roleName: [
          { required: true, message: '角色名是必须的', trigger: 'blur' },
          { min: 2, max: 18, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '角色描述是必须的', trigger: 'blur' },
          { min: 2, max: 18, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ]
      },
      editData: {
        id: 0,
        roleName: '',
        roleDesc: ''
      },
      dialogEditVisible: false,
      dialogAssignVisible: false,
      // label指定节点标签为节点对象的某个属性值
      // children指定子树为节点对象的某个属性值
      // 属性控件的属性配置对象
      defaultProps: { children: 'children', label: 'authName' },
      defKeys: [],
      // 默认选中项 这里我的思路是forin遍历对象 然后把遍历到id放到defkeys中 遇到children就迭代。明天写一下 这里老师提供的思路是只要获取到三级权限的id即可因为二级一级会随着三级选中自动选中
      loading: true,
      // 授权数组 这个可以写在data中也可以直接写在方法里。
      authorized: [],
      authorizedId: 0
    }
  },
  created() {
    this.$store.dispatch('initRolesList')
    // this.$store.dispatch('initRightsTreeList')
    // #this.$nextTick 将回调延迟到下次DOM更新循环之后执行。在修改数据之后立即使用它，然后等待DOM更新。总的来说，假设我们更改了某个 dom 元素内部的文本，而这时候我们想直接打印这个更改之后的文本是需要 dom 更新之后才会实现的，就像我们把将要打印输出的代码放在 setTimeout(fn, 0) 中this.$nextTick这个方法作用是，当数据被修改后使用这个方法，会回调获取更新后的dom再渲染出来
    // @this.$nextTick 是用来操作我们更改了dom内的数据，dom不会立即更新，这时候想操作这个dom，里面的数据还不是最新的，这时候就要用到this.$nextTick等dom更新后再操作dom了 因此这个玩意和异步数据获取没有任何关系
    /* this.$nextTick(() => {
      console.log(this.$store.state.rightsTreeList)
    }) */
  },
  methods: {
    // 根据id删除对应权限 该方法需要两个参数 当前角色id和当前权限id 权限id就是for循环时候item项的id即可，角色id即是scope.row.id,
    removeRightsById(roles, rightsid) {
      this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data } = await this.$axios({
            url: `roles/${roles.id}/rights/${rightsid}`,
            method: 'DELETE'
          })
          // 返回的数据是删除过的最新权限数据结构
          if (data.meta.status !== 200) {
            return this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
          // 重新渲染页面 此时会有问题就是每次我们删除了 都会重新渲染页面，而不是直接局部替换数据。
          // this.$store.dispatch('initRolesList')
          // 这里做法是把返回的data直接赋值给scope.row.children 确实可以 不过这种修改是直接修改了本地的scope.row.children 然后重新渲染scope.row.children的部分，对实际的数据roles数据并没有影响，除非刷新页面，roles才从服务器获取的最新数据
          // 我们修改scope.row会驱动页面的重新渲染 数据驱动视图，可以把scope看作是data中的数据，我们本身渲染利用的就是scope.row.children
          // data中对象属性绑定到视图，对象属性变化，视图也会重新渲染，但是watch不会，watch需要开启深度监听才会。其实data本身就是一个对象，我们定义的数据都是在data对象的属性中
          // “forEach不能改变数组本身,无论是基础数据类型还是引用数据类型都不可以。”
          // @这里我实现出了老师没有实现的效果，就是删除全部三级二级一级权限也会自动消失，做法是v-if搭配处理后的数据，这里我们知道后端返回的数据，如果三级权限都删了，默认二级权限children为0 这里直接v-if 让二级权限chilren长度不为0时才渲染，轻松解决。
          // @最难的就是这个二级删除后一级还在的bug了，这个是后端返回的数据就有问题，三级全删了，二级还存在，只能用前端的方法解决了，这里我新建了一个arr数组，来过滤后端返回的数据，里面的filter用来筛选出每一个item项（一级权限）的二级权限数组，条件是三级权限不为空的，如果三级条件为空，那么这个二级权限数组此时就是[]，然后我们在外面的filter过滤掉二级权限为空[]的一级权限，此时就可以过滤掉三级权限为空，但二级权限还存在的选项了，此时二级一级同生共死，你在我在，你亡我亡
          const arr = data.data.filter((item) => {
            // filter() 方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。
            // !这里发现新大陆 filter里面还可以嵌套filter
            /*   const a1 = item.children.filter((ele) => {
              return ele.children.length !== 0
            })
            return a1.length !== 0 */
            // filter不会改变原始数组，生成一个新数组，这里是return的每一个item 必须符合阔号中的条件的return出去。
            // return 二级权限数组不为[]的一级权限 也就是二级权限不为空的
            return (
              // 过滤二级权限数组
              item.children.filter((ele) => {
                // 三级权限数组不为空 如果三级权限为空了，那二级权限数组过滤后就变成[]了
                return ele.children.length !== 0
              }).length !== 0
            )
          })
          roles.children = arr
          /* console.log(arr) */
          // 试着在这里动data.data好了
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 重置添加表单
    resetAddForm() {
      this.$refs.addRolesForm.resetFields()
    },
    // 重置编辑表单数据
    resetEditForm() {
      this.$refs.editRolesForm.resetFields()
    },
    // 提交添加表单
    addRoles() {
      this.$refs.addRolesForm.validate(async (valid) => {
        if (valid) {
          const { data } = await this.$axios({
            url: 'roles',
            method: 'POST',
            data: this.rolesparam
          })
          if (data.meta.status !== 201) {
            return this.$message.error('添加角色失败')
          }
          this.$store.dispatch('initRolesList')
          this.$message.success('添加角色成功')
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
    showEditForm(val) {
      this.dialogEditVisible = true
      this.editData.id = val.id
      this.editData.roleName = val.roleName
      this.editData.roleDesc = val.roleDesc
    },
    editRoles() {
      this.$refs.editRolesForm.validate(async (valid) => {
        if (valid) {
          const { data } = await this.$axios({
            url: `roles/${this.editData.id}`,
            data: {
              roleName: this.editData.roleName,
              roleDesc: this.editData.roleDesc
            },
            method: 'PUT'
          })
          if (data.meta.status !== 200) {
            return this.$message.error('修改角色信息失败')
          }
          this.$message.success('修改角色信息成功')
          this.$store.dispatch('initRolesList')
          this.dialogEditVisible = false
        } else {
          return false
        }
      })
    },
    removeRights(id) {
      this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data } = await this.axios({
            url: `roles/${id}`,
            method: 'DELETE'
          })
          if (data.meta.status !== 200) {
            return this.$message.error('删除失败')
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$store.dispatch('initRolesList')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 分配权限按钮的点击事件
    async showAssignRights(roles) {
      this.authorizedId = roles.id
      this.loading = true
      // #传递的参数是scope.row 也就是当前角色列表的item项
      // 每次点击按钮时选中数组先清空
      this.dialogAssignVisible = true
      // 在这里获取所有权限的树形结构，我们前面获取的是列表的在权限列表组件中
      // 这里是异步请求 因此我们接下来操作数组要放到settimeout或者$nextTick中来延迟进行,这里我发现不可以 即便使用settimeout或者$nextTick也不能获取到数组，数组为空，于是乎我采用了async和await的操作，发现就可以了 我想应该是dispatch执行顺序要在settimeout和$nextTick之后吧。
      // 计时器0秒打印就是空 2秒就是有
      // ?await this.$store.dispatch('initRightsTreeList')
      // ?每次点击权限管理都会执行这个方法获取tree列表，没必要，直接在刚进页面时执行一次好了，反正tree不会经常变。 虽然每次都执行但是其实就第一次慢，后续虽然也请求数据，但是vue渲染是就地渲染，所有也会觉得非常快，不卡。
      // @但是会出现问题，就是每次this.defKeys更新了 树状图还是没变，应该是vue就地更新弄得，保险起见还是放到这里吧
      await this.$store.dispatch('initRightsTreeList')
      // 一级权限数组
      const arr = []
      /*  roles.children.forEach((element) => {
        // 这里的element是一级权限
        if (element.children) {
          // 二级权限数组
          element.children.forEach((_element) => {
            // 这里的_element是二级权限
            if (_element.children) {
              _element.children.forEach((ele) => {
                // this.defKeys.push(ele.id)
                arr.push(ele.id)
              })
            }
          })
        }
      }) */
      // 递归获取三级权限 这里我以为是传一个空arr 之后再赋值给defkeys 结果老师直接传了个defkeys，我试一下。 我这么写可以给defkeys添加元素，老样子，添加完成不刷新页面，必须得传给一个数组，然后数组重新赋值才可以，估计是因为我这里用了store的方法，而老师是直接方法写在本函数中的，无所谓，做出来就行。
      this.getTertiaryRights(roles, arr)
      this.defKeys = arr
      // vue多层循环，动态改变数据后渲染的很慢或者不渲染可在动态改变数据的方法，第一行加上this.$forceUpdate(); 亲测没用 还是赋值牛逼，老师也是这么做的
      // 加个settimeout 让权限更新前闪一下不加计时器的话会先闪一下 然后过几毫秒才dom更新 证明在请求数据 elementui真是yyds
      setTimeout(() => {
        this.loading = false
      }, 0)

      // @重大发现：数据循环遍历出来,就将这个元素push进data属性中的List数组中,这种方法数据视图是不会更新的
      // @这时,可以创建一个变量新数组,将数据先push进变量中,然后再将变量赋值到data的List中，这是我百度CSDN发现别人也遇到这种问题，估计是循环太深了，没有检测出数组变化吧。
    },
    // 递归获取三级权限的方法
    getTertiaryRights(item, arr) {
      // 如果不存在children属性了，证明到底了，就是三级权限则添加id
      if (!item.children) {
        arr.push(item.id)
      } else {
        // 如果还存在children证明是一级二级权限则foreach遍历children数组，继续执行该方法，形成递归。
        item.children.forEach((val) => {
          this.getTertiaryRights(val, arr)
        })
      }
    },
    emptyRightsChecked(id) {
      // 每次关闭dialog自动清空上次的选中状态，本来是写在渲染选中状态事件中的，但发现每次执行事件时，并没有先清空选中再重新选中，而是直接覆盖了原先的渲染。 没鸡巴用 写在这里和写在渲染的最开始一样，都是覆盖，而不是从无到有的渲染。  好吧 其实就是我电脑卡，浏览器渲染慢，就这样，正常的话是看不出来的，不卡的电脑看着就是从无到有渲染。
      // #其实这个方法完全可以省略直接把下面代码写在 渲染方法的最前面好了
      this.defKeys = []
      this.authorized = []
    },
    async assignRights() {
      /* console.log(this.authorizedId) */
      // 触发el提供的组件内部方法的方式是refs.xx.方法 getCheckedKeys只能获得被选中的叶子节点的 keys getHalfCheckedKeys若节点可被选择（即show-checkbox为 true），则返回目前半选中的节点的 key 所组成的数组
      // 合并俩数组，选中的和半选中的包括123级
      this.authorized = [...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree.getHalfCheckedKeys()]
      // 发请求上传本数组即可。  将数组转换为逗号分开的字符串传递
      // params是添加到url的请求字符串中的，用于get请求。data是添加到请求体（body）中的，用于post请求。post才有请求体，get是查询参数最终都是拼接到url中
      const authorizedStr = this.authorized.join(',')
      const { data } = await this.$axios({
        url: `roles/${this.authorizedId}/rights`,
        method: 'POST',
        // data就是请求体body中的数据
        data: { rids: authorizedStr }
      })
      if (data.meta.status !== 200) {
        return this.$message.error('权限设置失败，请重试')
      }
      this.$message.success('权限设置成功')
      // 此时角色列表已经更新，重新渲染页面
      this.$store.dispatch('initRolesList')
      this.dialogAssignVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.warp {
  padding: 20px;
  .el-table {
    margin-top: 10px;
  }
  .el-row-one {
    // 让tag居中显示
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    // less语法写 el-row:first-child的语法
    &:first-child {
      border-top: 1px solid #eee;
    }
    .el-row-two {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #eee;
      &:last-child {
        border-bottom: none;
      }
    }
  }
  .el-tag {
    margin: 7px;
  }
}
</style>
