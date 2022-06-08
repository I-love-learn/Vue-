<template>
  <div class="warp">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- separator分隔符 separator-class图标分隔符 class -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- center属性让文字水平居中。 -->
      <el-alert title="添加商品信息" type="info" show-icon center :closable="false"></el-alert>
      <!-- 步骤条组件 引入时steps和step都要引入 finish-status="success"属性可以改变已经完成的步骤的状态 process-status设置当前步骤的状态 -->
      <!-- 这里也可以不用计算属性 直接用字符串-0内联自动转换为数值型 -->
      <el-steps :active="activeNum" align-center finish-status="success" process-status="finish">
        <el-step title="步骤1" description="基本信息" icon="el-icon-edit-outline"></el-step>
        <el-step title="步骤2" description="商品参数" icon="el-icon-s-operation"></el-step>
        <el-step title="步骤3" description="商品属性" icon="el-icon-circle-plus-outline"></el-step>
        <el-step title="步骤4" description="商品图片" icon="el-icon-picture-outline"></el-step>
        <el-step title="步骤5" description="商品内容" icon="el-icon-tickets"></el-step>
        <el-step title="步骤6" description="完成" icon="el-icon-check"></el-step>
      </el-steps>
      <!-- tab栏 位置在左侧 tab栏完成与状态条完成是一一对应的 tab-position="left"位置 -->
      <!-- 这里我们可以发现tab的位置和步骤条的进度是有联动效果的 -->
      <!-- steps的选中状态是active绑定的 只能为数字 tabs的切换状态是v-model双向绑定的 点击不同的tab栏 v-model自动切换绑定tab-pane上的name值 只能是字符串 这就意味着我们不能通过同一个数据来绑定这俩了 用计算属性试试 可以 用计算属性完美解决 计算属性只有页面在使用到该计算属性时才计算 -->
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <!-- 如果el-tabs 给了固定高度 tab-pane中超出的部分会隐藏 -->
        <!-- tab-click是tab被选中时触发的事件，这个事件里可以修改active的值，并且这个事件的发生时机在v-model之后，也就是说虽然tab切换了 但active的值一直是0 step并不会变 -->
        <!-- before-leave是切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。是自定义标签因此要加v-bind执行methods中的函数 -->
        <el-tabs tab-position="left" v-model="active" :before-leave="toggleTab">
          <el-tab-pane label="基本信息" name="0">
            <!-- 想让label和表单各占一行 两种做法 第一种不设置label宽度 第二种在表单form上加上label-position top 表单域标签的位置，如果值为 left 或者 right 时，则需要设置 label-width 默认是right 删掉label-width 默认就是上下排列 如果遇到级联的话，除非设置级联的长度，否则默认还是一行显示，除非加label-position top 而设置lable-width 100%是不可以的 -->
            <el-form-item label="商品名称" prop="goods_name">
              <!-- rules中的名要和form中的名保持一致 -->
              <el-input v-model.trim="form.goods_name" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <!-- type="number" 可以给input加这个类型 这样输入除了数字外的东西会自动清空 -->
              <!-- v-model 加上number修饰符会导致无法输入小数点-->
              <el-input v-model.trim="form.goods_price" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.trim="form.goods_weight" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <!-- prop定义在el-form-item上 意味着使用验证规则中的哪一项来验证input 二者名字要保持一致 -->
              <el-input v-model.trim="form.goods_number" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 这里渲染不出默认值，原因是我们分割后的字符串每一项是字符串 而这里默认要求是数字 -->
              <el-cascader v-model="form.goods_cat" :options="options" @change="handleChange" :props="props" clearable></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 商品参数是根据manyAttrs数据渲染的复选框 循环渲染了，但是却不能双向绑定 -->
            <!-- 这里我忘了一个特别重要的事情就是你妈的商品参数的name是大项，大项里面的vals才是分类参数的每个小项 因此这里el-form-item要for循环 里面的checkbox是根据空格自动分割开的 这里这个分割的方法如果写在vuex中那也是极好的。 -->
            <el-form-item :label="item.attr_name" v-for="item of manyAttrs" :key="item.attr_id">
              <!-- 在checkbox组件中 v-model中不支持点语法 不能用属性的属性.checked 此处应当使用属性，解决办法是把v-model="XXX"改为:checked="XXX"就好了但是:checked并不能与原始值双向绑定就很拉跨 这里问题出自于vue的底层原理，之前有遇到过，就是vue页面无法监听到数组dataforeach增加的新属性渲染页面，解决办法是先创造一个新数组进行操作后再赋值给vue的data数组 -->

              <!-- @这里我是自己渲染checkbox的用v-for 老师的做法是先把vals转为一个数组，然后使用多选框组组件el-checkbox-group v-model="checkList" 这里的checkList是一个数组，数组的内容是选中的label值，这种做法的确更简单，因为直接获取到checkList选中的值了。 -->
              <el-checkbox v-model="val.checked" :label="val.itemName" border v-for="(val, index) in item.params" :key="index"></el-checkbox>
              <!-- 这里和item.attr_vals双向绑定，这样一打开页面 所有的checkbox都是打勾的，然后取消勾 attr_vals就会自动删一个数组元素，然后这个元素就无了，直接在页面不显示了（双向绑定的缘故，渲染也用的的item.attr_vals），这也太蛋疼了，这种不如我自己写的。这里如果想让默认都不绑定都定义一个空数组绑定在这，打个勾数组就+一个元素  -->
              <!-- <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="val" v-for="(val, index) in item.attr_vals" :key="index"></el-checkbox>
              </el-checkbox-group> -->
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 同一分类下动态参数有的有有的没有，但静态属性每个都有一样的静态属性，只不过值不同 分类是三级分类，在三级分类下又有n个商品 每个商品都有静态属性中的那些选项，只不过值不同，动态属性也是从三级分类提供的动态属性里选择，没有可以添加。 -->
            <!-- 添加商品属性时，服务器会提供一个默认的静态属性值供修改后上传。 -->
            <el-form-item :label="item.attr_name" v-for="item of onlyAttrs" :key="item.attr_id">
              <el-input v-model="item.attr_vals" placeholder="请输入内容" clearable></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 这里用的图片列表缩略图那个上传组件 -->
            <!-- on-preview点击文件列表中已上传的文件时的钩子 -->
            <!-- on-remove文件列表移除文件时的钩子 -->
            <!-- file-list上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}] 数组形式 这里就是默认已经上传的文件列表 暂时不需要 -->
            <!-- action上传的地址 上传图片api中提供的地址 这里用个计算属性 因为要获取当前的基准地址 也可以不用计算属性，直接写当前基准地址好了 这里要注意的是千万不要直接写upload 因为如果写成相对地址，那么upload会自动拼接当前的地址，也就是http://localhost:8080/#/home/goods/add/upload 因此这里写成绝对地址 我们的http基准地址为http://127.0.0.1:8888/api/private/v1/ 这个其实就是模拟的本地服务器地址 网页运行在一个地址上，服务器在另外一个地址上 -->
            <!-- 使用 list-type 属性来设置文件列表的样式 -->
            <el-upload :action="$axios.defaults.baseURL + 'upload'" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headers" :on-success="getResponse" :file-list="fileList">
              <!-- on-successs文件上传成功时的钩子 是属性不是方法 -->
              <!-- on-remove文件列表移除文件时的钩子function(file, fileList) -->
              <!-- 加了headers请求头才真正上传成功 -->
              <!-- 点击图片放大的效果element ui 并没有直接提供在upload组件中，这里需要我们自己用dialog做 -->
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 内容部分 富文本编辑器 -->
            <quill-editor v-model="form.goods_introduce"> </quill-editor>
            <!--  @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)"这里这些自带的事件都没用上 本身富文本编辑器自己就封装好了一整个组件，直接v-model绑个数据源就能用了ref="myQuillEditor" :options="editorOption"这些属性也用不到 -->

            <!-- 富文本编辑器的底部我们放一个提交按钮，放在这里意味着前四步都搞完了，第五步是最后一步，可以提交了 -->
            <el-button type="primary" class="pushInfo" @click="addGoodsInfo">提交商品信息</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="提示" :visible.sync="PicDialogVisible" width="60%" :before-close="handleClose">
      <img :src="picinfo" alt="" width="100%" />
    </el-dialog>
  </div>
</template>

<script>
// 导入lodash 官方推荐我们用_来代替lodash 就像jquery用$来代替jquery一样
import _ from 'lodash'
export default {
  data() {
    return {
      // 步骤条当前激活的值 0开始 索引
      active: '0',
      // 收集form表单信息的对象
      form: {
        // 这里类型定义什么无所谓 反正是对象内部，不会报错
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        // goods_cat 默认是数组形式的，但是我们像服务器发送时是逗号分隔的字符串形式把三级分类传递过去
        goods_cat: [],
        // 接收商品图片的数组，内容是服务器返回的图片地址
        pics: [],
        // 双向绑定内容,这个也是我们要上传的商品内容
        goods_introduce: '请输入商品内容'
      },
      // 图片显示列表数据
      fileList: [],
      // 动态参数
      manyAttrs: [],
      // 静态属性
      onlyAttrs: [],
      // 表单验证规则
      rules: {
        goods_name: [
          {
            required: true,
            message: '商品名称不能为空',
            trigger: 'blur'
          },
          { min: 2, max: 150, message: '商品名称在2-150个字符之间', trigger: 'blur' }
        ],
        goods_price: [
          {
            required: true,
            message: '商品价格不能为空',
            trigger: 'blur'
          },
          // type如果是number的话 min 和max 代表最大值与最小值 字符串的话代表位数
          // 如果type是number，就要v-model.number v-model.number又无法设置小数，这里还是自己写正则判断吧  而input 设置type=number 又能输入e这种字符，还是要通过正则判断
          // @表单验证最稳妥的方法还是正则表达式，其他的做法会出很多问题，除了上面说的，还有就是老是提示输入的不是字符串类型了，哪怕我把默认类型换成number，最稳妥的还是正则匹配好字符串，传给后台时再转为数字。
          // #正则是用来匹配字符串的 正则表达式中的0-9其实是字符串0-9而非数值型 这里是字符串类型的数值
          { min: 1, max: 5, message: '商品价格太过逆天', trigger: 'blur' },
          // 这个正则 正数且保留小数点后两位
          { pattern: /(^[1-9][0-9]{0,7}$)|(^((0\.0[1-9]$)|(^0\.[1-9]\d?)$)|(^[1-9][0-9]{0,7}\.\d{1,2})$)/, message: '商品价格格式不正确', trigger: 'blur' }
        ],
        goods_weight: [
          {
            required: true,
            message: '商品重量不能为空',
            trigger: 'blur'
          },
          { min: 1, max: 5, message: '商品重量太过逆天', trigger: 'blur' },
          { pattern: /(^[1-9][0-9]{0,7}$)|(^((0\.0[1-9]$)|(^0\.[1-9]\d?)$)|(^[1-9][0-9]{0,7}\.\d{1,2})$)/, message: '商品重量格式不正确', trigger: 'blur' }
        ],
        goods_number: [
          {
            required: true,
            message: '商品数量不能为空',
            trigger: 'blur'
          },
          // 正则 只允许输入正整数且不能为0开头
          { pattern: /^[1-9]\d*$/, message: '商品数量应为正整数', trigger: 'blur' },
          { min: 1, max: 5, message: '商品数量太大了', trigger: 'blur' }
        ],
        goods_cat: {
          required: true,
          message: '请选择商品分类',
          trigger: 'blur'
        }
      },
      // 级联选择的数据
      options: [],
      // 级联选择的配置选项
      props: { expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children: 'children' },
      // 请求头
      headers: {
        Authorization: localStorage.token
      },
      // 控制放大图片的弹窗显示
      PicDialogVisible: false,
      picinfo: '',
      // 富文本编辑器设置
      editorOption: {},
      goods_id: 0
    }
  },
  computed: {
    activeNum() {
      return this.active - 0
    },
    // 级联选中的当前三级分类id
    catId() {
      // 这里老师还进行了判断 判断当this.form.goods_cat.length===3时才return否则return null 我感觉没必要，到这一步时this.form.goods_cat必定是有值的
      return this.form.goods_cat[2]
    }
  },
  methods: {
    // 级联选中的事件
    handleChange() {
      // 老师在级联选择的事件中做了只能选择三级分类的处理 和之前的做法一样。
      if (this.form.goods_cat.length !== 3) {
        this.form.goods_cat = []
      }
    },
    // 这里又再次遇到了级联选择器需要请求商品分类的数据，如果一开始就把商品数据写在store中就好了，看来以后的项目少不了vuex
    async initOption() {
      const { data } = await this.$axios({
        url: 'categories',
        methods: 'GET'
      })
      if (data.meta.status !== 200) {
        return this.$message.error('获取参数信息失败')
      }
      this.options = data.data
    },
    // 切换tabs的执行事件 默认刚刷新页面不会执行，需要点击tab才执行。
    // activeName即将去往的标签页名称，oldActiveName之前的标签页名称
    toggleTab(activeName, oldActiveName) {
      if (this.form.goods_name === '' || this.form.goods_price === '' || this.form.goods_weight === '' || this.form.goods_number === '' || this.form.goods_cat.length === 0) {
        this.$message.error('当前页面还有必填项没有填写')
        return false
      }
      if (activeName === '1') {
        this.getParams()
      } else if (activeName === '2') {
        // else if 比再写一个if要少做一次判断
        this.getAttribute()
      }
    },
    // 根据商品的分类，获取当前分类的动态参数 这里的这个方法之前也用过，放到vuex中更佳
    async getParams() {
      // 这里两个地方可以调用它 一个是切换页面前选择好级联时，另一个是切换到这个tab时 可以放到tabs的那个钩子函数中执行 这里老师用的tab-click事件 在这个事件的处理函数中根据当前active判断执行其实跟这个钩子函数里写一样
      const { data } = await this.$axios({
        // #计算属性
        url: `categories/${this.catId}/attributes`,
        method: 'GET',
        params: {
          // 获取动态参数
          sel: 'many'
        }
      })
      if (data.meta.status !== 200) {
        return this.$message.error('获取动态参数失败')
      }
      const array = data.data
      // 为每个动态参数项添加一个属性来接受是否被选中
      /* *********************************************************
        今天遇到这种问题，查询文档后，发现是vue底层机制的问题，解决办法如下
        不要再forEach等方法中直接操作object可以先赋值如：
        {

        let testArray = []
        this.forEachArray.forEach(ele =>{

            testArray.push(ele)

        })

        this.useArray = testArray
     ********************************************************* */
      // 这里把attr_vals从字符串处理成一个数组对象形式，每一项存着一个参数值和checked状态
      // 这里其实也可以做一个判断 如果attr_vals为空 则不进行后续操作
      array.forEach((element) => {
        if (element.attr_vals !== '') {
          const params = []
          /* element.checked = true */
          // #字符串转数组方法，以空格分隔 这里老师错了 数据应该是以,分割的 而非空格。
          const arr = element.attr_vals.split(',')
          arr.forEach((item) => {
            const obj = {}
            obj.itemName = item
            obj.checked = true
            params.push(obj)
          })
          element.params = params
        }
      })
      this.manyAttrs = array
    },
    // 获取静态属性的方法
    async getAttribute() {
      const { data } = await this.$axios({
        // #计算属性
        url: `categories/${this.catId}/attributes`,
        method: 'GET',
        params: {
          // 获取动态参数
          sel: 'only'
        }
      })
      if (data.meta.status !== 200) {
        return this.$message.error('获取静态属性失败')
      }
      this.onlyAttrs = data.data
    },
    // 点击文件列表中已上传的文件的回调函数 在这里可以进行预览 放大事件
    handlePreview(file) {
      // 这里if判断不生效 明天看下为何
      if (!file.response) {
        // 这里图片的返回路径都是服务器路径不是临时路径 因此还不知道能不能修改图片呢，不行，如果添加时上传的图片路径不是临时路径而是服务器路径的话，会崩溃服务器
        this.picinfo = file.url
        this.PicDialogVisible = true
      } else {
        // 在这里可以进行预览 放大事件 显示dialog
        this.PicDialogVisible = true
        // file.response.data.url图片的服务器地址
        this.picinfo = file.response.data.url
        // 这里先写弹出框再给图片信息赋值，和先给图片信息赋值再弹出框没有区别，因为dom渲染都是执行完一轮宏任务后才渲染的，dom的更改都是实时的，但渲染到页面不是立即的，事件循环中的dom更改是立即的，但页面渲染不是。
        // vue的dom渲染是异步的。
      }
    },
    // 点击文件列表中x号回调函数，这里进行删除已上传的文件。
    handleRemove(file, fileList) {
      // file是当前删除的文件对象，fileList是所有文件对象
      // 在file对象身上有一个response属性，这个属性是一个对象，里面有一个键值对，键是data，值是一个对象，里面有一个键值对，键是url，值是一个字符串，这个字符串就是图片的地址 这里根据文档我们需要的不是url而是tmp_path属性（相对路径）。 但实际上开发中我们都是通过response.data.url获取到url（服务器绝对路径）
      // 在这里我们可以进行删除操作，把这个属性的值从数组中删除
      this.form.pics.forEach((item, index) => {
        // 如果pics中的某一项的tmp_path属性和file.response.data.tmp_path相等，则删除
        // index满足当前条件的item元素的索引
        if (item.pic === file.response.data.tmp_path) {
          // splice方法是从数组中删除指定的元素，这里我们删除当前索引的元素 第一项是索引，第二项是删除的个数
          // tmp_path是我们自己定义的属性，这个属性是用来存储图片的临时路径
          this.form.pics.splice(index, 1)
        }
        // findIndex方法是找到数组中满足条件的第一个元素的索引，这里我们找到当前删除的元素的索引 然后删除也可以 findIndex()括号里是一个函数，这个函数的参数是数组中的每一项，返回值是一个布尔值，如果返回true则表示找到了满足条件的元素，返回false则表示没有找到满足条件的元素。
        // findIndex最终返回的是一个数字，表示满足函数条件的当前元素的索引
      })
    },
    // 图片上传成功的回调函数
    getResponse(response, file, fileList) {
      // 服务器返回的数据
      // console.log(response)
      // 当前上传的文件
      // console.log(file)
      // 所有文件
      // console.log(fileList)
      // 这里根据API文档，我们还不能直接对fileList进行操作，需要对response进行操作 因为要上传的是tmp_path
      const obj = {
        pic: response.data.tmp_path
      }
      this.form.pics.push(obj)
    },
    handleClose() {
      // 关闭dialog
      this.PicDialogVisible = false
    },
    // 修改商品
    addGoodsInfo() {
      // 首先表单验证
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          const data = _.cloneDeep(this.form)
          // 根据api 对上传数据进行进一步处理
          // 字符串转为数字
          data.goods_price = this.form.goods_price / 1
          data.goods_weight = this.form.goods_weight / 1
          data.goods_number = this.form.goods_number / 1
          // 数组转字符串 这里老师在做这一步的时候报错了，因为级联选择器v-model的值是一个数组，但是我们需要的是一个字符串 这里转换完毕后，级联选择器v-model绑定的值是一个字符串了，就不对了，不过我并没有遇到这个报错。
          // 这里老师的解决办法是下载lodash包，利用深拷贝，把源对象拷贝到新对象上，然后处理新对象后，把新对象发到服务器。这样就不会报错了 老师提供的这个方法非常好，处理深拷贝的数据
          data.goods_cat = this.form.goods_cat.join(',')
          // attrs是一个数组形式，里面存着商品的参数，包含动态参数与静态属性 里面的数组元素是对象形式，属性为当前的参数或属性id，还有值
          data.attrs = []
          // id
          data.id = this.goods_id
          this.onlyAttrs.forEach((item) => {
            const obj = {}
            obj.attr_id = item.attr_id
            obj.attr_vals = item.attr_vals
            data.attrs.push(obj)
          })
          // 对于动态属性，我的做法是在动态属性每个属性内新增了一个params属性，里面是一个数组，把所有checked为true取出来，然后拼接为字符串
          // 老师对动态属性的处理是，直接foreach然后取出obj（id，vals），他没有进行checked判断，是由于老师不打勾是直接把动态参数里的那个值删掉的，所以动态参数是实时更新的。
          this.manyAttrs.forEach((item) => {
            if (item.attr_vals !== '') {
              const obj = {}
              obj.attr_id = item.attr_id
              const arr = []
              item.params.forEach((item2) => {
                if (item2.checked) {
                  arr.push(item2.attr_val)
                }
              })
              obj.attr_vals = arr.join(',')
              data.attrs.push(obj)
            }
          })
          // 发送请求 注意：商品名称必须是唯一的
          const { data: res } = await this.$axios({
            url: `goods${this.goods_id}`,
            method: 'PUT',
            data
          })
          if (res.meta.status !== 201) {
            return this.$message.error('修改失败')
          }
          this.$message.success('修改成功')
          // 成功后 跳转至商品列表
          this.$router.push('/home/goods')
        } else {
          this.$message.error('请按要求填写表单！')
          return false
        }
      })
    },
    // 根据id获取当前商品的数据
    async getGoodInfoById() {
      const { data } = await this.$axios.get(`goods/${this.$route.query.id}`)
      // axios.get()和axios.post()里不是对象不需要{}
      if (data.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.goods_id = data.data.goods_id
      this.form.goods_name = data.data.goods_name
      this.form.goods_price = data.data.goods_price + ''
      this.form.goods_weight = data.data.goods_weight + ''
      this.form.goods_number = data.data.goods_number + ''
      const strArr = data.data.goods_cat.split(',')
      const newArr = []
      strArr.forEach((item) => {
        // 级联选择器数组的元素要求是number类型 而服务器返回的是字符串
        newArr.push(Number(item))
      })
      // 这里最好是把数据处理后放到一个新数组里，然后把数组再赋值给form.goods_cat，至于为什么前面说过
      this.form.goods_cat = newArr
      const picArr = []
      const picsArr = []
      data.data.pics.forEach((item) => {
        const obj = {}
        obj.name = item.pics_id
        obj.url = item.pics_mid_url
        picArr.push(obj)
        const obj2 = {}
        obj2.pic = item.pics_mid_url
      })
      this.fileList = picArr
      this.form.pics = picsArr
      this.form.goods_introduce = data.data.goods_introduce
    }
  },
  created() {
    // 获取级联下拉数据
    this.initOption()
    // this.$axios.defaults.baseURL可以设置和获取当前基准地址
    /* console.log(this.$axios.defaults.baseURL); */
    // 初始化商品数据
    this.getGoodInfoById()
  }
}
</script>

<style lang="less" scoped>
.warp {
  padding: 20px;
  .el-steps {
    margin-top: 15px;
  }
  .el-tabs {
    margin-top: 20px;
  }
  .el-cascader {
    width: 300px;
  }
  .el-checkbox {
    margin: 0px 30px 10px 0px !important;
    // element ui 默认的checkbox margin有的只有左margin 有的只有右margin 这里我统一一下
    // 有些时候样式由于权重不够写了不会生效 加了important才行
  }
  // 为富文本编辑器设置一个最小高度。看起来好看
  /deep/ .ql-editor {
    min-height: 400px;
  }
  .pushInfo {
    margin-top: 20px;
  }
}
</style>
