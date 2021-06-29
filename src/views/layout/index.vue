<template>
  <div>
    <el-container class="layout-container">
      <el-aside class="aside" width="auto">
        <app-aside :is-collapse="isCollapse" class="aside-menu"></app-aside>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div>
            <i :class="{
              'el-icon-s-fold': !isCollapse,
              'el-icon-s-unfold': isCollapse
            }" @click="isCollapse = !isCollapse"></i>
            <span>zep教育科技有限公司</span>
          </div>
          <el-dropdown>
            <div class="avatar-wrap">
              <img class="avatar" :src="user.photo" alt="">
              <span>{{user.name}}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown" >
              <!--组件默认是不识别原生的事件的，除非内部做了处理-->
              <el-dropdown-item>设置</el-dropdown-item>
              <el-dropdown-item @click.native="onLogout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main class="main">
          <!--子路由出口-->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import AppAside from './components/aside'
import { getUserProfile } from '../../api/user'
import globalBus from '../../utils/global-bus.js'

export default {
  name: 'LayoutIndex',
  data () {
    return {
      user: {}, // 当前登录用户信息
      isCollapse: false // 侧边栏是否折叠
    }
  },
  components: {
    AppAside
  },
  created () {
    this.loadUserProfile()
    // 注册自定义事件
    // 当这个事件发布以后，这个注册函数就会被调用
    globalBus.$on('update-user', (data) => {
      // console.log('update-user', data)
      this.user.name = data.name
      this.user.photo = data.photo
    })
  },
  methods: {
    // 除了登录接口，其他所有接口都需要授权才能请求使用
    loadUserProfile () {
      getUserProfile().then(res => {
        console.log(res.data)
        this.user = res.data.data
      })
    },
    onLogout () {
      // console.log('onLogout')
      this.$confirm('确认退出吗？', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
        // 把用户的登录状态清除
        window.localStorage.removeItem('user')
        // 跳转到登录页面
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
  .aside {
    background-color: pink;
    .aside-menu {
      height: 100%;
    }
  }

  .header {
    background-color: #fff;
    border-bottom: 1px solid #ccc;
  }

  .main {
    background-color: #ffffff;
  }

  .layout-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .header {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .avatar-wrap {
    display: flex;
    align-items: center;
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
  .el-icon-s-fold, .el-icon-s-unfold{
    font-size: 25px;
  }
</style>
