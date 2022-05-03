<template>
  <div class="warp">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- separator分隔符 separator-class图标分隔符 class -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <!-- type：类型 index是索引列 align对齐方式 -->
        <el-table-column type="index" label="#" width="50" align="center"> </el-table-column>
        <!-- prop是data绑定数据对象的哪一项属性，不用加前缀的对象名，直接写属性即可-->
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <!-- 作用域插槽要放在el-table-column内而不是外 -->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  created() {
    this.$store.dispatch('initRightsList')
  },
  computed: {
    ...mapState(['rightsList'])
  },
  methods: {
    // 这里根据不同的level展示不同的级数，我的想法是弄一个方法传值进行判断，这样还麻烦了很多，老师这里的做法是直接写好三个tag按需渲染
    /* calculationLevel(val) {
      if (val === '0') {
        val = '一级'
        return ''
      } else if (val === '1') {
        val = '二级'
        return 'warning'
      }
    } */
  }
}
</script>

<style lang="less" scoped>
.warp {
  // 这些样式用的还是之前的样式，所以应该直接写到公共样式中
  padding: 20px;
  .el-table {
    margin-top: 10px;
  }
}
</style>
