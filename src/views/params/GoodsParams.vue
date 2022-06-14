<template>
  <div class="warp">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- separator分隔符 separator-class图标分隔符 class -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
      <!-- 我们多次使用到了面包屑导航，其实可以把面包屑导航二次封装一下，然后通过插槽插入文字。 -->
    </el-breadcrumb>
    <el-card>
      <!-- 这里的提示要用到el的一个新组件 alert -->
      <!-- closable控制是否可关闭 默认true 可关闭 -->
      <!-- show-icon展示图标 -->
      <el-alert title="注意：只允许为第三季分类设置相关参数！" type="warning" show-icon> </el-alert>
      <el-row>
        <el-col :span="11">
          <label>选择商品分类：</label>
          <el-cascader v-model="selectValue" :options="dataSource" :props="props" @change="handleChange" filterable clearable></el-cascader>
          <!-- value/v-model选中项绑定值 -->
        </el-col>
      </el-row>
      <!-- value/v-model绑定值，选中选项卡的name 默认是'0' :value单向绑定可指定当前选中 v-model双向绑定可切换 -->
      <!-- name与选项卡绑定值value对应的标识符，表示选项卡别名 唯一的，每个选项卡都是唯一的name区分 -->
      <!-- tab-click点击tab切换的执行事件，点击同一个tab也会触发该事件 label：tab的显示文字。 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加动态参数tab -->
        <el-tab-pane label="动态参数" name="0">
          <!-- disabled与否与下面的selectValue是否为空有关 -->
          <!-- 这里老师用的计算属性 由于这个判断用的不多 我直接写成内联了 -->
          <el-button type="primary" :disabled="selectValue.length !== 3" size="small" @click="add">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="showTabInfo" border stripe style="width: 100%" v-if="activeName == 0">
            <!-- 展开按钮 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 这里要把scope.row.attr_vals转为数组 -->
                <!-- el-tag组件 -->
                <!-- disable-transitions是否禁用渐变动画 -->
                <!-- attr_vals是一个由空格分割的字符串 -->
                <el-tag :key="tag" v-for="tag in scope.row.attr_vals ? scope.row.attr_vals.split(',') : []" closable :disable-transitions="false" @close="removeTag(scope.row, tag)">
                  {{ tag }}
                </el-tag>
                <!-- input v-if和button v-else来动态控制切换 -->
                <!-- 这里组件如果没有.native则不会触发keyup.enter事件 这个事件是原生HTML5事件 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model.trim="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"> </el-input>
                <!--  你可能想在某个组件的根元素上监听一个原生事件。可以使用 v-on 的修饰符 .native 。通俗点讲：就是在父组件中给子组件绑定一个原生的事件，就将子组件变成了普通的HTML标签，不加'. native'事件是无法触发的。 -->
                <!-- @ 1自定义组件没有任何事件，需用$emit提供 2加.native变为HTML对象，触发原生H5的事件 -->
                <!-- native在Vue.js官方的大致意思是监听自定义标签根标签的事件， -->
                <!-- 这里keyup.enter事件是绑定在子组件的input上的属于深层了，input的外层还有个div包裹着，因此不加.native 修饰符的时候， 是调用不到父组件方法的。 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#" align="center"> </el-table-column>
            <!-- prop对应列内容的字段名，也可以使用property属性 -->
            <!-- 这里一定不要混淆了table和form的绑定方式，form：:model绑定数据源 每一行的el-form-item用prop绑定表单model中的字段，用来指定验证规则验证哪个字段的。 el-input用v-model绑定数据源.属性 验证规则如果写在el-form-item行内则直接写成数组形式，如果卸载data中在form上引用rules对象，则要写成对象形式，验证规则的字段名要和绑定数据的字段名一一对应。 table是:data绑定数据源 每一行el-table-column用prop=属性名来绑定值。 -->
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 作用域插槽 为编辑和删除提供参数 -->
                <el-button type="primary" icon="el-icon-edit" size="small" @click="edit(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="small" @click="remove(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- @如果表格的data=[]则只会渲染表头 不会报错 -->
        <!-- 添加静态属性tab -->
        <el-tab-pane label="静态属性" name="1">
          <el-button type="primary" :disabled="selectValue.length !== 3" size="small" @click="add">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="showTabInfo" border stripe style="width: 100%" v-if="activeName == 1">
            <!-- 展开按钮 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 这里要把scope.row.attr_vals转为数组 -->
                <!-- el-tag组件 -->
                <!-- disable-transitions是否禁用渐变动画 -->
                <!-- attr_vals是一个由空格分割的字符串 -->
                <el-tag :key="tag" v-for="tag in scope.row.attr_vals ? scope.row.attr_vals.split(',') : []" closable :disable-transitions="false" @close="removeTag(scope.row, tag)">
                  {{ tag }}
                </el-tag>
                <!-- input v-if和button v-else来动态控制切换 -->
                <!-- 这里组件如果没有.native则不会触发keyup.enter事件 这个事件是原生HTML5事件 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model.trim="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"> </el-input>
                <!--  你可能想在某个组件的根元素上监听一个原生事件。可以使用 v-on 的修饰符 .native 。通俗点讲：就是在父组件中给子组件绑定一个原生的事件，就将子组件变成了普通的HTML标签，不加'. native'事件是无法触发的。 -->
                <!-- @ 1自定义组件没有任何事件，需用$emit提供 2加.native变为HTML对象，触发原生H5的事件 -->
                <!-- native在Vue.js官方的大致意思是监听自定义标签根标签的事件， -->
                <!-- 这里keyup.enter事件是绑定在子组件的input上的属于深层了，input的外层还有个div包裹着，因此不加.native 修饰符的时候， 是调用不到父组件方法的。 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#" align="center"> </el-table-column>
            <!-- prop对应列内容的字段名，也可以使用property属性 -->
            <!-- 这里一定不要混淆了table和form的绑定方式，form：:model绑定数据源 每一行的el-form-item用prop绑定表单model中的字段，用来指定验证规则验证哪个字段的。 el-input用v-model绑定数据源.属性 验证规则如果写在el-form-item行内则直接写成数组形式，如果卸载data中在form上引用rules对象，则要写成对象形式，验证规则的字段名要和绑定数据的字段名一一对应。 table是:data绑定数据源 每一行el-table-column用prop=属性名来绑定值。 -->
            <el-table-column prop="attr_name" label="属性名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 作用域插槽 为编辑和删除提供参数 -->
                <el-button type="primary" icon="el-icon-edit" size="small" @click="edit(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="small" @click="remove(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加弹出框 -->
    <!-- 这里三元表达式也可写在计算属性中，然后这里放计算属性 -->
    <el-dialog :title="activeName === '0' ? '添加动态参数' : '添加静态属性'" :visible.sync="addFormVisible" @close="resetAddForm">
      <!-- 验证表单三要素 model prop rules 因此无论传一个值还是多个值都要放在一个对象中好用model绑定 -->
      <el-form :model="addparams" :rules="rules" ref="addForm">
        <el-form-item :label="activeName === '0' ? '动态参数' : '静态属性'" label-width="80px" prop="attr_name">
          <el-input v-model.trim="addparams.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改弹出框 -->
    <el-dialog :title="activeName === '0' ? '修改参数' : '修改属性'" :visible.sync="editFormVisible">
      <el-form :model="editparams" :rules="rules" ref="editForm">
        <el-form-item :label="activeName === '0' ? '动态参数' : '静态属性'" label-width="80px" prop="attr_name">
          <el-input v-model.trim="editparams.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 级联选择器选中的值 数组形式，因为每一级都是数组中的每一项，如果有三级就有三个对象包含在数组中。 这里定义空数组或者''都可以，最后选择后都会v-model绑定为数组
      selectValue: [],
      dataSource: [],
      // props配置选项
      props: { expandTrigger: 'hover', label: 'cat_name', value: 'cat_id' },
      // 当前被激活的页签名称 默认是字符串0
      activeName: '',
      // data预期定义的数据类型和接收的数据类型要保持一致，否则会报错 比如这里定义一个对象，最后赋值了一个数组就会报错。 定义一个数字复制一个num也会报错
      showTabInfo: [],
      // 编辑弹框是否显示控制
      addFormVisible: false,
      // form的数据源
      addparams: {
        attr_name: ''
      },
      rules: {
        attr_name: [
          // 计算属性中的值不可用在data中 同样一个data里也不能用另外一个data
          // #vue中data属性里的数据不能相互引用，如果必须引用，建议使用computed计算属性关联。
          { required: true, message: '不能输入为空', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ]
      },
      // 控制修改显示和隐藏
      editFormVisible: false,
      // data中的复杂数据类型中的数据可以定义字符串接收其他类型 但最外层不行，定义什么类型就要接受什么类型。
      editparams: {
        attr_name: '',
        attr_id: ''
      },
      // tag输入框和按钮是否显示控制
      // 双向绑定的输入值
      tags: []
    }
  },
  methods: {
    // 获取级联参数的ajax请求
    async initDataSource() {
      // 这个如果写在store中可复用 因为商品分类模块也请求了同样的请求获取同样的内容。
      const { data } = await this.$axios({
        url: 'categories',
        methods: 'GET'
      })
      if (data.meta.status !== 200) {
        return this.$message.error('获取商品分类信息失败')
      }
      this.dataSource = data.data
    },
    // 级联选择的触发事件
    handleChange() {
      // 级联选择器默认只能选到叶子节点，如果一个选项还有额外叶子，则不能选中当前项。
      // 这里我们人为干预一下，只要双向绑定选中数组长度不等于3，则清空该数组，意思是无法选中一级二级。 这是为了应对我们有些自己添加的测试分类只有一级和二级
      // 如果选中不是三级 则return出去 不执行后续操作了
      if (this.selectValue.length !== 3) {
        return (this.selectValue = [])
      }
      // 选择级联时触发 点击tab切换也触发
      this.ajaxParams(this.selectValue[this.selectValue.length - 1], this.activeName)
    },
    handleClick() {
      // 点击tabs栏触发的事件，点击同一个也触发，并不是切换才触发。
      // 这里的this.selectValue[this.selectValue.length - 1]可以放到计算属性中 id(){return this.selectValue[this.selectValue.length - 1]}  这里老师写法是this.selectValue[2] 也对，因为总共就三级，写死也是可以的，老师还在计算属性中做了个判断，只有this.selectValue=3时，id才为this.selectValue[2] 否则id为null 我感觉没有必要，因为我们选级联的handleChange中 只要不等于3 this.selectValue就等于空 我们可以在ajax请求中判断this.selectValue为空就提示没有选择分类。
      // @计算属性：被监听的属性一旦改变立即重新计算
      this.ajaxParams(this.selectValue[this.selectValue.length - 1], this.activeName)
    },
    // 获取动/静态属性的ajax请求 这里老师跟我做法一样 封装一个ajax请求方法 tabs切换和级联选择都调用
    // 两个参数 id就是当前三级分类的id sel通过 only或many来获取分类静态参数还是动态参数
    async ajaxParams(id) {
      const { data } = await this.$axios({
        url: `categories/${id}/attributes`,
        method: 'GET',
        params: {
          // 0和1可以直接在替换成many和only这么做更简单不需要判断
          sel: this.activeName === '0' ? 'many' : 'only'
        }
      })
      if (this.selectValue.length === 0) {
        return this.$message.error('请先选择商品分类')
      }
      if (data.meta.status !== 200) {
        return this.$message.error('获取参数信息失败')
      }
      // 这里要先修改服务器返回的数据后再赋值给data中的数据源，而不能先赋值给数据源再修改数据源
      // 原因是先赋值给数据，再遍历修改数据源，数据是修改了，但页面没有刷新，这是由于vue对某些数据的深入修改，并不会触发页面的重新渲染，因此我们最好是先处理数据再赋值给数据源
      data.data.forEach((item) => {
        item.inputVisible = false
        item.inputValue = ''
      })
      this.showTabInfo = data.data
      // 这里老师还做了判断 静态挂载到一个data上，动态挂载到另外一个data上，没有必要我感觉，因为切换的时候会重新请求，携带的参数跟当前tab也是一一对应的。
    },
    // 编辑按钮点击事件
    add() {
      // 这里我们只写一个dialog，根据当前的selectValue值来判断显示哪些文字和传递哪些值。
      this.addFormVisible = true
    },
    //
    async addSubmit() {
      // 表单预校验
      this.$refs.addForm.validate((valid) => {
        if (!valid) {
          return false
        }
      })
      // 这里的this.selectValue[2]更适合写在计算属性中，因为我们多次用到这个值。
      const { data } = await this.$axios({
        url: `categories/${this.selectValue[2]}/attributes`,
        method: 'POST',
        data: {
          attr_name: this.addparams.attr_name,
          attr_sel: this.activeName === '0' ? 'many' : 'only'
        }
      })
      if (data.meta.status !== 201) {
        return this.$message.error('添加失败')
      }
      this.$message.success('添加成功')
      // 重新渲染页面
      this.ajaxParams(this.selectValue[this.selectValue.length - 1], this.activeName)
      this.addFormVisible = false
    },
    resetAddForm() {
      // 关闭重置表单事件
      this.$refs.addForm.resetFields()
    },
    // edit修改参数事件
    edit(row) {
      this.editparams.attr_id = row.attr_id
      this.editparams.attr_name = row.attr_name
      this.editFormVisible = true
    },
    async editSubmit() {
      // 表单预校验
      this.$refs.editForm.validate((valid) => {
        if (!valid) {
          return false
        }
      })
      const { data } = await this.$axios({
        url: `categories/${this.selectValue[2]}/attributes/${this.editparams.attr_id}`,
        method: 'PUT',
        data: {
          attr_name: this.editparams.attr_name,
          attr_sel: this.activeName === '0' ? 'many' : 'only'
        }
      })
      if (data.meta.status !== 200) {
        return this.$message.error(this.activeName === '0' ? '修改动态参数失败' : '修改静态属性失败')
      }
      this.$message.success(this.activeName === '0' ? '修改动态参数成功' : '修改静态属性成功')
      this.editFormVisible = false
      // 重新渲染页面
      this.ajaxParams(this.selectValue[this.selectValue.length - 1], this.activeName)
    },
    // 删除事件
    remove(row) {
      this.$confirm(`此操作将永久删除该${this.activeName === '0' ? '参数' : '属性'}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data } = await this.$axios({
            url: `categories/${row.cat_id}/attributes/${row.attr_id}`,
            method: 'DELETE'
          })
          if (data.meta.status !== 200) {
            return this.$message.error('删除失败')
          }
          // 重新渲染页面
          this.ajaxParams(this.selectValue[this.selectValue.length - 1], this.activeName)
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
    // 这里为了页面不刷新 所有操作都是基于本地数据+组件渲染的，重新请求后不再重新赋值，以防页面重新赋值导致页面刷新
    // 点击关闭删除tag的执行事件
    // 删除更简单的方法是第二个参数传索引 这样不需要写成数组.splice(数组.indexof(tag),1) 直接数组.splice(index,1)
    async removeTag(row, tag) {
      // 删除匹配到的字符串
      const arr = row.attr_vals.split(',')
      // splice改变原数组 返回值是删掉的元素组成的数组
      arr.splice(arr.indexOf(tag), 1)
      row.attr_vals = arr.join()
      const { data } = await this.$axios({
        url: `categories/${row.cat_id}/attributes/${row.attr_id}`,
        method: 'PUT',
        data: {
          // 不仅动态参数可以添加删除，静态属性也可以
          attr_name: row.attr_name,
          attr_sel: this.activeName === '0' ? 'many' : 'only',
          attr_vals: row.attr_vals
        }
      })
      if (data.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
    },
    // 点击+New tag执行事件
    showInput(row) {
      // 注意添加的动态参数值不要重复。否则会报错 因为我们key绑定的是item 如果item重复了 key便重复了。可以把key换成index可破之
      row.inputVisible = true
      // $nextTick DOM渲染后执行的代码。这里为什么要把代码放到$nextTick中呢，这是由于我们点击button后 row.inputVisible切换为true 意味着input要显示了，按钮要隐藏了，但是vue是异步渲染的，并不会属性刚改变 dom就重新渲染 $nextTick就是解决这个问题的。
      this.$nextTick((_) => {
        // 显示input并焦点落入input
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 输入完毕回车或者离开焦点触发事件
    async handleInputConfirm(row) {
      // 赋值 为了防止bug 因为我们转数组是以空格分隔的 为了防止bug 要把用户输入的空格全部替换掉
      const value = row.inputValue.replace(/,/g, ' ')
      const inputValue = value
      if (inputValue) {
        // 将新添加的数据存到数组中
        // 这里判断一下 如果row.attr_vals为空则直接把传入的值放到row.attr_vals上
        if (row.attr_vals === '') {
          row.attr_vals = inputValue
        } else {
          const attrVals = row.attr_vals.split(',')
          attrVals.push(inputValue)
          // 数组转字符串是join() 括号里是用什么符号分割 什么都不屑默认就是逗号
          row.attr_vals = attrVals.join()
        }
        // 添加和删除的ajax其实最好单独写在外面的 因为用的相同接口，传的值不同。
        // 这里接口是编辑而不是新增
        const { data } = await this.$axios({
          url: `categories/${row.cat_id}/attributes/${row.attr_id}`,
          method: 'PUT',
          data: {
            attr_name: row.attr_name,
            attr_sel: this.activeName === '0' ? 'many' : 'only',
            attr_vals: row.attr_vals
          }
        })
        if (data.meta.status !== 200) {
          return this.$message.error('添加失败')
        }
        row.inputVisible = false
        row.inputValue = ''
      }
    }
  },
  created() {
    this.initDataSource()
  }
}
</script>

<style lang="less" scoped>
.warp {
  padding: 10px;
  .el-row {
    margin-top: 15px;
  }
  .el-cascader {
    width: 260px;
  }
  .el-tabs {
    margin-top: 15px;
  }
  .el-table {
    margin-top: 10px;
  }
  .el-tag {
    margin-left: 0px !important;
    margin-right: 10px !important;
  }
  .button-new-tag {
    margin: 5px 0;
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    margin: 5px 0;
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .el-tag {
    margin: 5px 0;
  }
}
</style>
