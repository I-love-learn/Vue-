<template>
  <div class="warp">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- separator分隔符 separator-class图标分隔符 class -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <!-- span栅格占据的列数 24 分栏 -->
        <!-- :gutter="20"写在row里可以指定 每个col的间隔 span前加不加:号都可以 -->
        <el-col :span="8">
          <!-- autocomplete 是一个可带输入建议的输入框组件，fetch-suggestions 是一个返回输入建议的方法属性，如 querySearch(queryString, cb)，在该方法中你可以在你的输入建议数据准备好时通过 cb(data) 返回到 autocomplete 组件中。 -->
          <!-- clearable可清空 clear事件清空时触发 -->
          <el-autocomplete placeholder="请输入内容" v-model.trim="params.query" :fetch-suggestions="querySearch" value-key="goods_name" clearable @clear="reset">
            <!-- value-key输入建议对象中用于显示的键名 这个设置后 列表的输入建议才会展示对应键名的值，否则默认会展示json中的value键的值 下面的createFilter方法中的value也要对应替换为对应的key 这个搜索貌似只能对应开头，无法搜索中间的关键字。 -->
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            <!-- 这里的search事件和上面的reset事件都可以省去创建事件，直接使用initTableData的那个请求事件即可 -->
            <!-- slot具名插槽 -->
          </el-autocomplete>
        </el-col>
        <!-- push栅格向右移动格数 span不写默认是24 -->
        <el-col :span="4">
          <el-button type="primary" @click="add" class="add">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- element ui和layui的表格分页还不相同 layui的表格分页是集成到一起的 而element ui表格和分页是两个不同的模块，分页会影响table显示的内容。 -->
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column type="index" label="#" align="center"> </el-table-column>
        <!-- 商品名称自适应 -->
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="120" align="center"> </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="90" align="center"> </el-table-column>
        <!-- :formatter用来格式化内容Function(row, column,cellValue, index) -->
        <el-table-column prop="add_time" label="创建时间" width="200" align="center" :formatter="formatTime">
          <!--  <template slot-scope="scope"> -->
          <!-- 插槽方式格式化时间使用过滤器 使用插槽的话上面的column不需要指定prop -->
          <!--   {{ scope.row.add_time | formatTime }} -->
          <!-- 这里过滤器的时间有问题 经过我的测试确实我那种自己算的方法的确有问题，我那种方法适合于做两个时间的倒计时效果，而不适合计算当前日期 -->
          <!-- /template> -->
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <!-- 俩按钮要放到scope插槽内接收当前的row -->
            <el-button type="primary" icon="el-icon-edit" size="small" @click="edit(scope.row.goods_id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="remove(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="params.pagenum" :page-sizes="[10, 20, 30, 40, 50]" :page-size="params.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" background> </el-pagination>
      <!-- background分页背景 -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 初始化表格数据的请求参数对象
      params: {
        // 搜索内容 双向绑定到搜索框
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 表格数据
      tableData: [],
      // 总数
      total: 0,
      // 搜索建议列表
      searchSuggestionList: []
    }
  },
  methods: {
    // ajax请求初始化表格数据
    async initTableData() {
      /* ************************************************
      @axios默认返回的data是一个对象格式如下
      {
      config: {transformRequest: {…}, transformResponse: {…}, timeout: 0, xsrfCookieName: 'XSRF-TOKEN', adapter: ƒ, …}
      data: {total: 926, pagenum: '1', goods: Array(10)}
      meta: {msg: '获取成功', status: 200}
      [[Prototype]]: Object
      headers: {content-length: '3655', content-type: 'application/json; charset=utf-8'}
      request: XMLHttpRequest {readyState: 4, timeout: 0, withCredentials: false, upload: XMLHttpRequestUpload, onreadystatechange: ƒ, …}
      status: 200
      statusText: "OK"
      }
      但我们通过网络的预览里面查看到的数据只包含服务器返回的数据，也就是data里面的内容，因此这里我们要把data解构出来的。
      #但jquery的ajax就不会多一层封装，得到的就是服务器返回的数据。
      ***************************************************** */
      const { data } = await this.$axios({
        url: 'goods',
        method: 'GET',
        params: this.params
      })
      if (data.meta.status !== 200) {
        return this.$message.error('初始化数据失败')
      }
      this.tableData = data.data.goods
      this.total = data.data.total
    },
    // 每页显示条数变化的回调
    handleSizeChange(val) {
      // val 当前显示条数
      this.params.pagesize = val
      this.initTableData()
    },
    // 页数变化的回调
    handleCurrentChange(val) {
      // val 当前页码
      this.params.pagenum = val
      this.initTableData()
    },
    // 格式化时间的方法
    formatTime(row) {
      return this.$dayjs(row.add_time).format('YYYY-MM-DD HH:mm:ss')
    },
    // 搜索建议事件
    querySearch(queryString, cb) {
      // queryString是我们输入的字符串
      const searchSuggestionList = this.searchSuggestionList
      // 要展示的建议列表，输入框为空就是展示所有建议列表，有匹配就展示匹配的内容
      // filter(function(item,index,arr))
      // filter方法里面的参数是函数
      const results = queryString ? searchSuggestionList.filter(this.createFilter(queryString)) : searchSuggestionList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (searchSuggestionList) => {
        /* toLowerCase，计算机术语，用途是字符串中的字母被转换为小写字母 */
        return searchSuggestionList.goods_name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    // 清空搜索框事件
    reset() {
      this.initTableData()
    },
    // 获取搜索建议列表事件
    async initSearchList() {
      const { data } = await this.$axios({
        url: 'goods',
        method: 'GET',
        params: {
          pagenum: 1,
          pagesize: 10000
        }
      })
      this.searchSuggestionList = data.data.goods
    },
    // 搜索事件
    search() {
      this.initTableData()
    },
    // 根据当前id删除商品的事件
    async remove(id) {
      /* this.$confirm返回一个promise对象 通过async await点击删除确定返回的值是confirm 点击取消报错，需要catch一下返回cancel */
      // 这是由于await默认返回的是promise执行成功的返回值，实际上就是 Promise 的回调函数 resolve 的参数，如果这个Promise rejected 了，await 表达式会把 Promise 的异常抛出，因此需要我们加上catch
      // $confirm的另一种写法
      const a = await this.$confirm('删除的商品不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (a !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
      const { data } = await this.$axios({
        url: `goods/${id}`,
        method: 'DELETE'
      })
      if (data.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      // 删除成功后，重新渲染列表
      this.initTableData()
      /* .then(async () => {
          const { data } = this.$axios({
            url: `goods/${id}`,
            method: 'DELETE'
          })
          if (data.meta.status !== 200) {
            return this.$message.error('删除失败')
          }
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
        }) */
    },
    add() {
      // 编程式导航api，跳转至商品添加页面
      this.$router.push('/home/goods/add')
    },
    // 跳转编辑商品页面
    edit(id) {
      // 编程式导航api，跳转至商品编辑页面
      this.$router.push({ path: '/home/goods/edit', query: { id: id } })
    }
  },
  created() {
    // created调用methods中方法要用this
    this.initTableData()
    this.initSearchList()
  }
}
</script>

<style lang="less" scoped>
.warp {
  padding: 20px;
  .el-table {
    margin-top: 15px;
  }
  .add {
    margin-left: 20px;
  }
  .el-pagination {
    margin-top: 10px;
    // text-align center 可以控制分页居中
    text-align: center;
  }
  .el-autocomplete {
    width: 100%;
  }
  .add {
    margin-left: 10px;
  }
}
</style>
