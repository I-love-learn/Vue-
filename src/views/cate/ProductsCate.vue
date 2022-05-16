<template>
  <div class="cate">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- separator分隔符 separator-class图标分隔符 class -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 这里老师也用的栅格布局包裹按钮，依我看没必要 直接放个按钮好了 因为table默认独占一行 -->
      <el-button type="primary" @click="addClass">添加分类</el-button>
      <!-- table -->
      <!-- 这里用zk-table做 -->
      <!-- <el-table :data="productsList" border style="width: 100%">
        <el-table-column type="index" label="#" align="center"> </el-table-column>
        <el-table-column prop="cat_name" label="分支名称"> </el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效"> </el-table-column>
        <el-table-column prop="cat_level" label="排序"> </el-table-column>
        <el-table-column label="操作"> </el-table-column>
      </el-table> -->
      <!-- index-text数据索引名称 -->
      <!-- columns表格各列的配置 类型是一个数组 label当前列标题名称-->
      <!-- stripe是否显示间隔斑马纹 和el表格一样 -->
      <!-- show-header是否显示表头 和el一样 -->
      <!-- show-row-hover鼠标悬停时，是否高亮当前行 -->
      <!-- tree-type是否为树形表格 -->
      <!-- is-fold树形表格中父级是否默认折叠 -->
      <!-- expand-type是否为展开行类型表格（为 True 时，需要添加名称为 '$expand' 的作用域插槽, 它可以获取到 row, rowIndex) -->
      <!-- selection-type是否为多选类型表格 -->
      <zk-table ref="table" empty-text="暂无数据" index-text="#" :data="productsList" :columns="columns" :stripe="false" :border="true" :show-header="true" :show-row-hover="true" :show-index="true" :tree-type="true" :is-fold="true" :expand-type="false" :selection-type="false" v-loading="loading">
        <!-- 有些属性默认是true 想让他取消的话需要手动改成false  true可以省略 直接tree-type就是tree-type为tree 这一点和element ui一致-->
        <!-- 这里的columns和props都是定义在data中的数据源 -->

        <!-- @后面三列需要使用自定义模板渲染，因为他们不是直接渲染数据的 -->
        <template slot="isok" slot-scope="scope">
          <!-- 作用域插槽实际上是带有数据的插槽，可以获取到子组件传递的参数，将这些参数使用到子组件插槽里 -->
          <!-- scope可以获取当前行的数据 可以理解为scope获取数据然后渲染到每一列，每一列是父组件定义的插槽模板结构，放到子组件中-->
          <!-- 作用域插槽的概念里，父组件只提供了插槽模板的结构和样式，真正数据是由子组件插槽在定义时决定的。 -->
          <!-- slot=""是具名插槽 slot-scope是子组件传递的数据 这两个后来合二为一变成了v-slot #footer="slotProps" -->
          <!-- slot插槽名称这里是isok也就是下面定义的isok 后面可以用slot-scope也可以用scope -->
          <!-- v-slot不可直接用到标签身上，需要在外层套个template 然后在template上用 -->
          <!-- 这个slot和v-slot不同 v-slot指令用于指定template元素或组件使用哪个插槽，如果插槽名对不上v-slot指定的名，则不会插入 一个子组件可能有多个插槽 -->
          <!-- 这里的slot就是具名插槽 对应下面的template的名字 作用是把这个插槽内容渲染到对应名字的子组件位置 功能如下 -->
          <!-- slot的名字要和下面columns中数据的template的值对应，表示哪个列的值使用到了当前这个template自定义插槽 -->
          <!-- 自定义模板template -->
          <!-- 这里如果deleted属性值为false意思就是未删除就显示绿色钩子 删除了就显示红色叉号 这里的意思是有效性 未删除肯定有效 删除了肯定无效 -->
          <i class="el-icon-error" v-if="scope.row.cat_deleted" style="color: red"></i>
          <i class="el-icon-success" v-else style="color: lightgreen"></i>
          <!-- v-if一定要放到v-else的前面 -->
          <!-- 字体图标样式直接行内样式改颜色 -->
        </template>
        <!-- 排序模板 -->
        <template #sort="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1" size="mini">二级</el-tag>
          <el-tag type="info" v-else size="mini">三级</el-tag>
        </template>
        <!-- 操作按钮模板 -->
        <!-- zktable要用具名插槽+作用域插槽渲染列 eltable不需要具名插槽，估计是因为el的table-column是自己在table里手动写死的，没有自定义的模板，渲染时会循环渲染到对应列，因此不需要定义名字，而zktable是根据配置自己渲染的 这就多个插槽必须有名字才能渲染到对应的插槽处。 -->
        <template #operation="scope">
          <!-- scope当前行 -->
          <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row)" size="small">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="remove(scope.row.cat_id)" size="small">删除</el-button>
        </template>
      </zk-table>
      <!-- 分页 -->
      <!-- size-change-pageSize改变时会触发 -->
      <!-- current-change-currentPage改变时会触发 也就是点击更换其他页时触发 -->
      <!-- current-page当前页数 居然不写这个current-page也可以完成分页该有的功能 这是因为current-page不写默认就是1只要我们点击了分页的页码，当前页码就会变成我们点击的那个数字 page-size同理，也可以不写，最主要的还是size-change和current-change俩方法-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="params.pagnum" :page-size="params.pagesize" layout="total,sizes,  prev, pager, next, jumper" :total="total" :page-sizes="[5, 10, 15, 20]"> </el-pagination>
    </el-card>
    <!-- zk-table 感觉和element的表格无论从样式还是数据绑定方式，设置都很像，像是element table的拓展版DLC 但又有些地方大不相同 比如eltable的行是自己定义的，zktable的是自动渲染的，有的还要用到自定义模板 -->
    <!-- dialog添加分类 -->
    <!-- 验证规则如果是放在data中的 则在form标签上加上:rules="rules" rules是验证规则数组对象 el-form-item标签上加上props=xx（xx是rules数组中的验证规则对象名）如果比较少验证规则则可以直接写到el-form-item格式为:rules={} 因为单个验证规则不需要数组形式了 也要写prop=xx  prop是必不可少的 也是表单验证的必要参数 里面传递的参数是表单域 model 字段也就是当前行要验证的数据（字段） -->
    <el-dialog title="添加分类" :visible.sync="dialogAddVisible" @close="resetCascader" ref="addcate">
      <el-form :model="addForm" ref="addForm">
        <!-- label-width也可以直接写在el-form中 这样就不需要el-form-item每一项都写了 -->
        <el-form-item label="分类名称" label-width="80px" :rules="{ required: true, message: '请输入新添加的分类名', trigger: 'blur' }" prop="cat_name">
          <el-input v-model="addForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" label-width="80px">
          <!-- 级联选择器 -->
          <!-- 级联选择器不是必选项 不选则默认一级分类 -->
          <!-- options指定数据源 -->
          <!-- props是配置对象 value指定选项的值为选项对象的某个属性值 expandTrigger触发方式 label指定选项标签为选项对象的某个属性值 -->
          <!-- v-model选中项绑定值 应该是一个数组，因为级联选择有多个级，每一级都是一个对象，因此不应该是一个对象，而是一个数组，数组中可包含多个对象 -->
          <!-- multiple: true打开多选功能 -->
          <!-- 级联选择框默认只展示一级二级 -->
          <el-cascader v-model="cascaderList" :options="dataFromCascader" filterable :props="{ expandTrigger: 'hover', label: 'cat_name', value: 'cat_id', children: 'children', checkStrictly: true }" @change="handleChange" clearable></el-cascader>
          <!-- clearable清空功能 change选择框状态改变触发事件 比如清空选中内容 选中其他值等 从无到有选中等触发 -->
          <!-- 级联选择器默认只能选中最底层的级联，而不能直接选择一级，需要设置一下 -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitClass">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改分类 -->
    <el-dialog title="修改分类" :visible.sync="dialogEditVisible" ref="editcate">
      <!-- model表单数据对象 prop="cat_name"对应的是表单中的哪个属性 如果不需要prop表单验证那么model也可以省略 -->
      <el-form :model="editForm" ref="editForm">
        <!-- label-width也可以直接写在el-form中 这样就不需要el-form-item每一项都写了 -->
        <el-form-item label="分类名称" label-width="80px" :rules="{ required: true, message: '分类名不能为空', trigger: 'blur' }" prop="cat_name">
          <el-input v-model="editForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表
      productsList: [],
      // 请求参数 虽然这里api提供了type参数 让我们自选123 分别对应一层二层三层商品的响应数据，但这里我们是直接获取所有的商品列表然后渲染的，并没有先获取一层，等点击展开树级菜单再获取二三层。我们是直接一次性全部渲染完的。这种好处是只需要跟后端交互一次，缺点是，一次交互获取的数据量打，耗时会长一点，但肯定比分三次短。不过如果用户不点击展开菜单，那多请求的数据其实就是浪费了的。 type传3和不传都是直接获取三层数据的。
      // 请求参数
      params: {
        pagenum: 1,
        pagesize: 5
      },
      // 分页要用到的总数
      total: 0,
      columns: [
        // columns 列配置对象
        // @zktable和eltable不一样 zktable需要把配置写在columns中 有点像layui的表格配置 而el是直接写在table-column中 然后循环
        // label列标题名称
        // prop列对应内容的属性名
        // width宽度
        // template列类型为 'template'(自定义列模板) 时，对应的作用域插槽（它可以获取到 row, rowIndex, column, columnIndex）名称
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          // type列类型，可选值有且只有'template'(自定义列模板)，一般采用scope搭配template自定义模板渲染数据时用得到
          // template列类型为 'template'(自定义列模板) 时，对应的作用域插槽（它可以获取到 row, rowIndex, column, columnIndex）名称
          // 这里的cat_deleted是自定义模板名称
          template: 'isok'
          // template使用哪个作用域插槽
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation'
        }
      ],
      loading: true,
      dialogAddVisible: false,
      // add添加分类的收集信息对象
      addForm: {
        // cat_name分类名 cat_pid父级id 不选默认0就是没有父级 cat_level当前是几级分类 不选默认0 为一级分类，父级id0会生成一个新的一级分类在最后，每一层级对应一个父级id，通过这个父级id可以把对应的新增分类放到对应位置。
        // 如果我们在级联选择框中 只选择第一个选择框则默认把输入的分类添加到选中一级分类的二级分类中，如果第一个第二个分类都选中，则默认把输入的分类添加到选中的二级分类的三级分类中 什么都不选默认是一级分类
        cat_name: '',
        // pid是父级的id 之所以要传父级id是为了把添加的新分类放到对应的父级分类下，因此我们点击级联菜单下拉选项时传递的应该是当前的id 当前id作为父级id参数发起请求，这样添加的新分类就会放到当前id下了。 如果啥也不选默认pid为0 一级分类的pid为0
        cat_pid: 0,
        cat_level: 0
      },
      // 因为级联选择器只有两级，因此数据我们要重新请求 这次要携带type参数 值为2 意思是只显示2级 如果直接用productsList的数据则展示三层级联选择器了
      dataFromCascader: [],
      // 级联选择器双向绑定的数组
      cascaderList: [],
      // 修改分类的弹出框控制属性
      dialogEditVisible: false,
      editForm: {
        cat_name: '',
        // 初始值 编辑栏的初始值
        original: '',
        id: 0
      }
    }
  },
  methods: {
    // 获取商品分类信息列表的方法
    async initProductsCate() {
      const { data } = await this.$axios({
        url: 'categories',
        method: 'GET',
        params: this.params
      })
      if (data.meta.status !== 200) {
        return this.$message.error('获取商品分类信息失败')
      }
      this.productsList = data.data.result
      this.total = data.data.total
      this.loading = false
    },
    // 分页的回调方法 val是当前页码值
    handleCurrentChange(val) {
      this.loading = true
      this.params.pagenum = val
      this.initProductsCate()
    },
    // size改变时回调方法 每次触发这俩事件都出发loading val是当前显示条数
    handleSizeChange(val) {
      this.loading = true
      this.params.pagesize = val
      this.initProductsCate()
    },
    // 点击添加按钮的方法
    addClass() {
      this.dialogAddVisible = true
      this.initDataFromCascader()
    },
    handleChange() {
      // 级联选择框选择时触发事件 第一个是当前层级 当前层级其实就是这个cascaderList数组的长度，这很巧妙地运用了cascaderList数组长度和当前层级一致的组合。
      this.addForm.cat_level = this.cascaderList.length
      // 当前的父级id就是我们选择的那个option的value值，也就是cascaderList数组的最后一个元素的值。
      if (this.cascaderList.length !== 0) {
        this.addForm.cat_pid = this.cascaderList[this.cascaderList.length - 1]
      } else {
        this.addForm.cat_pid = 0
      }
      // 这里判断条件也可以用this.cascaderList.length>0 则证明选择了父级分类 else 没选
      // 这里老师做法思路跟我是一致的
    },
    // ajax请求添加新分类
    async ajaxAddCate() {
      const { data } = await this.$axios({
        url: '/categories',
        method: 'POST',
        data: this.addForm
      })
      if (data.meta.status !== 201) {
        return this.$message.error('添加分类失败')
      }
      this.$message.success('添加分类成功')
    },
    // 点击确定提交的执行事件
    submitClass() {
      // 判断是否通过表单验证规则 $refs['addForm'] eslint 建议写成$refs.addForm的形式
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.ajaxAddCate()
        } else {
          return false
        }
        this.dialogAddVisible = false
        this.initProductsCate()
        // 这里遇到添加新分类后页面不刷新的问题 原来是方法用错了 用了重新获取级联选择器数据的方法了，正确应该是用获取商品分类列表的方法
        // ajaxAddCate()和initProductsCate()都是异步函数 但是前者比较快 后者执行则比较慢 所以不用担心后者先执行，其实也可以直接await 前者 然后执行后者
        // 因为ajaxAddCate()在前 因此ajaxAddCate的await会先执行 然后等同步都执行完毕，回来再执行await中的resolve，然后才会执行initProductsCate()中的resolve 微任务执行顺序讲究先来后到 resolve前的都是同步任务 resolve后的属于微任务
      })
    },
    // 级联选择器获取option数据的方法
    async initDataFromCascader() {
      const { data } = await this.$axios({
        url: 'categories',
        method: 'GET',
        params: {
          type: 2
        }
      })
      if (data.meta.status !== 200) {
        return this.$message.error('获取下拉信息失败')
      }
      this.dataFromCascader = data.data
      // 这种不带分页请求回来的数据直接在data中 不需要再.result了
    },
    // 关闭dialog 触发关闭事件 将cascaderList恢复成空状态  cascaderList才是显示级联的双向绑定数据，addForm是我们请求的参数，所以要改前者，而不是后者
    // close事件是点击关闭时执行，也就是点击关闭时我们先看到级联选择框变空，后隐藏form，closed是关闭后执行，看不到级联选择框变空就隐藏了，隐藏在先  close事件和closed事件都是 dialog的可视数据在变成false时执行
    resetCascader() {
      /*  this.cascaderList = [] */
      // 这个是我们自己写的清空状态，我忘了element ui已经封装好了resetFields()重置方法
      // 不过resetFields() 只能清空名称的分类 由于级联选择器还是双向绑定的因此还是需要清空this.cascaderList
      this.$refs.addcate.resetFields()
      this.cascaderList = []
      // 请求参数addForm中的cat_pid和cat_level也要重置为0
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0
    },
    // 修改按钮点击执行事件
    edit(val) {
      this.dialogEditVisible = true
      this.editForm.original = val.cat_name
      this.editForm.cat_name = val.cat_name
      this.editForm.id = val.cat_id
    },
    // 修改点击确定执行事件
    submitEdit() {
      if (this.editForm.cat_name === this.editForm.original) {
        // 如果没有改变值而是保留了 则点击后直接隐藏
        return (this.dialogEditVisible = false)
      }
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.ajaxEditCate()
        } else {
          return false
        }
        this.dialogEditVisible = false
        this.initProductsCate()
      })
    },
    // ajax编辑当前分类
    async ajaxEditCate() {
      const { data } = await this.$axios({
        url: `categories/${this.editForm.id}`,
        method: 'PUT',
        data: {
          cat_name: this.editForm.cat_name
        }
      })
      if (data.meta.status !== 200) {
        return this.$message.error('修改分类信息失败')
      }
      this.$message.success('修改分类信息成功')
    },
    // 删除弹窗
    remove(id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        // 如果then里的代码写的有问题，导致无法执行，则点击确认，最后也是弹出已取消删除。
        .then(async () => {
          const { data } = await this.$axios({
            url: `categories/${id}`,
            method: 'DELETE'
          })
          if (data.meta.status !== 200) {
            return this.$message.error('删除失败')
          }
          this.initProductsCate()
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
    }
  },
  created() {
    this.initProductsCate()
  }
}
</script>

<style lang="less" scoped>
.cate {
  padding: 20px;
  .zk-table {
    margin-top: 10px;
    .zk-table--firstProp-header-inner {
      padding-left: 0px;
    }
  }
  .el-pagination {
    margin: 10px 0 0 0;
  }
  // 下拉框的高度，默认是有多少个option就显示多少 太长了 这里需要我们在全局样式中把高度写死。
  .el-cascader {
    width: 100%;
  }
}
</style>
