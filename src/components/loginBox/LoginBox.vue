<template>
  <div class="login_box">
    <!-- 头像区域 -->
    <div class="avatar_box">
      <img src="@/assets/touxiang.png" alt="" />
    </div>
    <!-- el 表单开始标签 -->
    <!-- label-width label宽度 -->
    <!-- 一个验证规则不可缺少的attribute :model="ruleForm" :rules="rules" prop="username" v-model="ruleForm.username"四个-->
    <!-- # :model="ruleForm" model是表单数据对象 form标签上有这个标签意味着 form标签属性和data中的 ruleForm对象是双向绑定的 然后再对表单中的每一项再单独v-model绑定对象中的属性-->
    <el-form :rules="rules" ref="ruleForm" label-width="0" class="form" :model="ruleForm">
      <el-form-item prop="username">
        <!-- Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。 -->
        <!-- prop 选择要校验的规则 prop写在item上而非 input上 -->
        <el-input v-model="ruleForm.username" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="ruleForm.password" show-password placeholder="请输入密码" prefix-icon="el-icon-lock"></el-input>
      </el-form-item>
      <el-form-item>
        <!-- 按钮不同type 对应不同颜色 -->
        <!-- 这里参数传的是字符串 所以可以用obj[key] 如果不是字符串则要obj.key -->
        <el-button type="primary" @click="submitForm('ruleForm')" round>立即登录</el-button>
        <el-button @click="resetForm('ruleForm')" type="info" round>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'login-box',
  data() {
    return {
      // 表单的数据绑定对象 elementui是把表单数据统统放在一个表单对象中，使用时先给表单绑定上对象名，再给每个表单元素双向绑定 对象中的属性
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        // 表单验证规则 也是定义到data中的
        username: [
          // required 必填项 trigger 失去焦点时验证
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 登录时的预验证 通过验证才会发起ajax请求 未通过直接弹窗提示错误
    submitForm(formName) {
      // 和重置一样，需要先获取到表单，再调用validate方法 里面放一个回调函数 valid是一个布尔值 判断是否通过验证 true为通过
      // 判断的规则还是用的rules的规则 只不过我们可以利用回调函数在里面进行一些通过验证或未通过进行一些交互譬如弹窗
      this.$refs[formName].validate(async (valid) => {
        // validate任一表单项被校验后触发 被校验的表单项prop值，校验是否通过，错误消息（如果存在）
        // validate对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个promise，Function(callback: Function(boolean, object))
        if (valid) {
          // 先发起请求 得到结果 再弹出登陆成功
          // @$.post和$.get 发起请求时 直接(url,{参数}) 不可写成{params:值}以及{data:值形式}
          // @而axios.get 则是(地址,{params:值})  发送请求带参数 携带请求参数必须加上params axios.post则和$.post一致 不需要加data
          // ? $.ajax post或者get 参数都是data 而axios get是params post是data 规定 混用不执行
          // !以上全为固定写法 不可更改 否则不执行
          const { data } = await this.$axios.post('login', this.ruleForm)
          // { username: this.ruleForm.username, password: this.ruleForm.password }就是this.ruleForm
          // await 只能用在异步函数中 这里的异步函数是指包裹着await的亲父亲函数 是validate里的回调函数 而不是最外面的submitForm
          if (data.meta.status !== 200) {
            return this.$message({
              showClose: true,
              message: data.meta.msg,
              type: 'error'
            })
          }
          this.$message({
            showClose: true,
            message: data.meta.msg,
            type: 'success'
          })
          // 登陆成功，登陆成功要执行的操作 1把服务器返回的token 存入到本地存储中，老师存入的是sessionStorage关闭页面或浏览器后清除token，我的做法是存在localStorage中，只有退出登录才会清除token，长久保存。
          const token = data.data.token
          // 存储token登陆令牌
          localStorage.setItem('token', token)
          // 项目中除了登陆之外的其他api接口，都需要登陆后才能访问
          // token只应在当前网站打开期间生效，所以存放到sessionStorage中，比如博杉的就是存到sessionStorage中的，每次关闭网页再打开就要重新登陆，这里为了防止这种情况我们学b站，存到localStorage中，长久存放
          // 登陆成功后通过编程式导航$router.push()跳转至主页home
          // 这里加不加/虽然都可以 但还是推荐加上 这是因为和router-link一样的问题，如果是很深的hash地址了，再次点击按钮会和当前hash地址拼接，而加上/ 每次都可以保证是根目录地址
          this.$router.push('/home')
        } else {
          // 提示信息也可以不用对象形式 如果是单个属性可缩写为this.$message.error()
          return this.$message({
            showClose: true,
            message: '输入不正确',
            type: 'warning'
          })
        }
      })
    },
    // 重置表单 elementui封装好的方法resetFields() 获取表单对象执行resetFields事件即可清空表单
    resetForm(formName) {
      // 参数是表单对象
      // 获取对象属性 可以obj.属性名 或者obj['属性名']
      console.log(formName)
      // ref获得的就是dom元素
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login_box {
  position: absolute;
  left: 50%;
  top: 20%;
  border-radius: 5%;
  transform: translateX(-50%);
  width: 450px;
  height: 300px;
  // linear-gradient(颜色朝向，第一个颜色结束，第二个颜色开始，第二个颜色结束，第三个颜色开始，第三个颜色结束，第四个颜色开始)
  background: linear-gradient(45deg, rgba(204, 255, 51, 0.2), rgba(153, 102, 255, 0.2));
  z-index: 99999;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  .avatar_box {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 130px;
    height: 130px;
    border: 2px solid #ccc;
    border-radius: 50%;
    padding: 3px;
    box-shadow: 0 0 15px #ddd;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      /* 如果是透明png的话 图片是可以加背景色的 background */
    }
  }
  .form {
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    /deep/ .el-form-item__content {
      text-align: center;
    }
  }
}
</style>
