<template>
  <div class="warp">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- separator分隔符 separator-class图标分隔符 class -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <!-- span栅格占据的列数 24 分栏 -->
        <!-- :gutter="20"写在row里可以指定 每个col的间隔 span前加不加:号都可以 -->
        <el-col :span="8">
          <!-- autocomplete 是一个可带输入建议的输入框组件，fetch-suggestions 是一个返回输入建议的方法属性，如 querySearch(queryString, cb)，在该方法中你可以在你的输入建议数据准备好时通过 cb(data) 返回到 autocomplete 组件中。 -->
          <!-- clearable可清空 clear事件清空时触发 -->
          <el-autocomplete placeholder="请输入内容" v-model.trim="params.query" :fetch-suggestions="querySearch" value-key="order_number" clearable @clear="reset" :trigger-on-focus="false">
            <!-- :trigger-on-focus聚焦就弹出建议还是打字了再弹出建议，这里选择打字后 -->
            <!-- value-key输入建议对象中用于显示的键名 这个设置后 列表的输入建议才会展示对应键名的值，否则默认会展示json中的value键的值 下面的createFilter方法中的value也要对应替换为对应的key 这个搜索貌似只能对应开头，无法搜索中间的关键字。 -->
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            <!-- 这里的search事件和上面的reset事件都可以省去创建事件，直接使用initTableData的那个请求事件即可 -->
            <!-- slot具名插槽 -->
          </el-autocomplete>
        </el-col>
      </el-row>
      <el-table :data="tableDate" style="width: 100%" border stripe align="center">
        <el-table-column type="index" label="#" align="center"> </el-table-column>
        <!-- header-align="center"只设置表头居中 align="center" 设置表格居中 -->
        <el-table-column prop="order_number" label="订单编号"> </el-table-column>
        <el-table-column prop="order_price" label="价格" width="120" align="center"> </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="80" align="center">
          <template slot-scope="scope">
            <!-- 如果是1已付款 -->
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80" align="center"> </el-table-column>
        <!-- 时间的格式化老师用的作用域插槽+过滤器 这里我们用dayjs+el提供的formatter属性 -->
        <el-table-column prop="create_time" label="下单时间" width="180" align="center" :formatter="formatterTime"> </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改地址" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="small" @click="edit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="物流进度" placement="top">
              <el-button type="success" icon="el-icon-location-information" size="small" @click="logistics(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="params.pagenum" :page-sizes="[10, 20, 30, 40]" :page-size="params.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </el-card>
    <!-- 修改地址的dialog -->
    <el-dialog title="修改地址" :visible.sync="editDialogVisible" @close="resetForm">
      <!-- label-width既可以写在每个el-form-item上，也可直接卸载el-form上 写在el-form上 好处是一次写，里面的每个都用 -->
      <el-form :model="form" ref="formRef" :rules="adressRules" label-width="90px">
        <el-form-item label="省市区/县" prop="region">
          <!-- 级联选择器 -->
          <!-- option是数据源 props是配置 -->
          <el-cascader v-model="form.region" :props="{ expandTrigger: 'hover' }" :options="cityData"></el-cascader>
        </el-form-item>
        <el-form-item label="具体地址" prop="detailed">
          <el-input v-model="form.detailed" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdress">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="logisticsDialogVisible">
      <!-- 物流进度只有查询功能，因此不需要底部的按钮部分 -->
      <!-- 物流进度需要一个新组件时间线 -->
      <el-timeline>
        <!-- timestamp时间戳 placement时间戳位置 -->
        <el-timeline-item :timestamp="item.time" placement="top" v-for="(item, index) in logisticData" :key="index">
          <el-card>
            <h4>{{ item.context }}</h4>
            <p>平台 更新于 {{ item.time }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import cityData from '@/utils/citydata'
export default {
  data() {
    return {
      tableDate: [],
      params: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        user_id: '',
        pay_status: '',
        is_send: '',
        order_fapiao_title: '',
        order_fapiao_company: '',
        order_fapiao_content: '',
        consignee_addr: ''
      },
      suggestions: [],
      // 总数
      total: 0,
      editDialogVisible: false,
      // 修改地址的数据对象
      form: {
        region: [],
        detailed: ''
      },
      // 表单验证规则
      adressRules: {
        region: [{ required: true, message: '请选择地区', trigger: 'change' }],
        detailed: [{ required: true, message: '请输入具体地址', trigger: 'blur' }]
      },
      // 可直接使用上面引入的cityData 应该导出的是一个对象变量
      cityData: cityData,
      logisticsDialogVisible: false,
      // 物流数据
      logisticData: []
    }
  },
  methods: {
    // 初始化表格数据
    async initTableDate() {
      const { data } = await this.$axios({
        url: 'orders',
        method: 'GET',
        params: this.params
      })
      if (data.meta.status !== 200) {
        this.$message.error('获取数据失败')
        return
      }
      this.tableDate = data.data.goods
      this.total = data.data.total
    },
    querySearch(queryString, cb) {
      var suggestions = this.suggestions
      var results = queryString ? suggestions.filter(this.createFilter(queryString)) : suggestions
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      // suggestion 参数
      return (suggestions) => {
        return suggestions.order_number.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    // 建议列表信息初始化
    async initSuggestionsList() {
      const params = _.cloneDeep(this.params)
      params.pagesize = 10000
      const { data } = await this.$axios({
        url: 'orders',
        method: 'GET',
        params: params
      })
      if (data.meta.status !== 200) {
        this.$message.error('获取数据失败')
        return
      }
      this.suggestions = data.data.goods
    },
    // 重置搜索
    reset() {},
    search() {
      // 搜索事件
    },
    formatterTime(row) {
      // 格式化时间
      return this.$dayjs(row.create_time).format('YYYY-MM-DD HH:mm:ss')
    },
    handleSizeChange(val) {
      // 每页条数改变
      this.params.pagesize = val
      this.initTableDate()
    },
    handleCurrentChange(val) {
      // 当前页改变
      this.params.pagenum = val
      this.initTableDate()
    },
    // 修改地址的按钮
    edit() {
      this.editDialogVisible = true
    },
    // 提交修改后的地址
    submitAdress() {
      // 表单验证
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$message.success('修改成功')
          this.editDialogVisible = false
        } else {
          this.$message.error('修改失败')
          return false
        }
      })
    },
    // 重置表单
    resetForm() {
      this.$refs.formRef.resetFields()
    },
    logistics() {
      // 物流信息展示
      this.logisticsDialogVisible = true
      // vue数据变化不会立即渲染dom 异步渲染。
      // 这里的id是写死的
      this.getLogistics(1106975712662)
    },
    async getLogistics(id) {
      // 获取物流信息
      /*  const { data } = await this.$axios({
        url: `kuaidi/${id}`,
        method: 'GET'
      })
      if (data.meta.status !== 200) {
        this.$message.error('获取物流信息失败')
        return
      } */
      // 服务器有问题 这里把数据直接写死吧
      this.logisticData = [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: ''
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: ''
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-09 23:05:00',
          ftime: '2018-05-09 23:05:00',
          context: '快件到达 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 21:21:00',
          ftime: '2018-05-09 21:21:00',
          context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 13:07:00',
          ftime: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: ''
        },
        {
          time: '2018-05-09 12:25:03',
          ftime: '2018-05-09 12:25:03',
          context: '卖家发货',
          location: ''
        },
        {
          time: '2018-05-09 12:22:24',
          ftime: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          location: ''
        },
        {
          time: '2018-05-08 21:36:04',
          ftime: '2018-05-08 21:36:04',
          context: '商品已经下单',
          location: ''
        }
      ]
    }
  },
  created() {
    this.initTableDate()
    this.initSuggestionsList()
  }
}
</script>

<style lang="less" scoped>
/* @import '../../../../common/css/common'; */
/* timeline样式也可以用less语法在这里导入 */
.warp {
  padding: 20px;
  .el-table {
    margin-top: 15px;
  }
  .el-autocomplete {
    width: 100%;
  }
  .el-pagination {
    margin-top: 15px;
    text-align: center;
  }
  .el-cascader {
    width: 100%;
  }
}
</style>
