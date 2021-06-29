<template>
  <div class="login-container">
    <div class="login-header">
      <h2>Zep头条</h2>
    </div>
    <!--
    手动触发表单验证：
    1. 给 el-form 设置 ref="form"
    2. 通过ref获取el-form组件，调用组件的validate方法进行表单验证
    -->
    <el-form class="login-form" ref="login-form" :model="user" :rules="formRoles">
      <el-form-item prop="mobile">
        <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onLogin" :loading="loginLoading" class="login-btn">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import request from '../../utils/request'
import { login } from '../../api/user.js'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810', // 验证码
        agree: false // 是否同意协议
      },
      // checked: true, // 是否同意协议的选中状态
      loginLoading: false, // 登录的loading状态
      formRoles: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空',
            trigger: 'change'
          },
          {
            pattern: /^1[3|5|7|8|9]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: 'change'
          }
        ],
        code: [
          {
            required: true,
            message: '验证码不能为空',
            trigger: 'change'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码为6位数字',
            trigger: 'change'
          }
        ],
        agree: [
          {
            // 自定义校验规则
            // 验证通过：callback()
            // 验证失败: callback(new Error(错误消息))
            validator: (rule, value, callback) => {
              // console.log(rule, value)
              if (value) {
                callback()
              } else {
                callback(new Error('请同意用户协议'))
              }
            },
            message: '请勾选同意用户协议',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    onLogin () {
      // 获取表单数据
      // 表单验证
      this.$refs['login-form'].validate((valid, err) => {
        // console.log(valid)
        // console.log(err)
        // 如果表单验证失败，停止请求提交
        if (!valid) {
          return
        }
        // 验证通过，请求登录
        this.login()
      })

      // 验证通过,提交登录
      // 开启登录中loading
    },
    login () {
      this.loginLoading = true
      login(this.user).then(res => {
        console.log(res)
        this.$message({
          message: '恭喜你，登录成功！',
          type: 'success'
        })
        // 关闭
        this.loginLoading = false

        // 将接口返回的用户相关数据（token）放到本地存储，方便应用数据共享
        // 本地存储只能存储字符串
        // 存储对象、数组类型的数据，则需要把他们转为JSON格式字符串来存储
        window.localStorage.setItem('user', JSON.stringify(res.data.data))
        // 跳转到首页
        // this.$router.push('/')
        this.$router.push({
          name: 'home'
        })
      }).catch(err => {
        console.log('登录失败', err)
        this.$message.error('登录失败，手机号或验证码错误！')
        // 关闭
        this.loginLoading = false
      })
      // 处理后端响应结果
      //  成功
      //  失败
    }
  }
}
</script>

<style scoped>
  .login-container {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background: url("./img/login_bg.jpg") no-repeat;
    background-size: cover;
  }

  .login-form {
    background-color: #fff;
    padding: 50px;
    min-width: 300px;
  }

  .login-btn {
    width: 100%;
  }

  .login-header {
    color: #409EFF;
    font-size: 20px;
    font-weight: bold;
  }
</style>
