<template>
  <div>
    <el-menu
      :default-active="$route.path"
      background-color="#545c64"
      text-color="#fff"
      router
      :collapse="isCollapse"
      active-text-color="#ffd04b" class="el-menu">
      <h2 class="logo">Zep头条</h2>
      <el-menu-item index="/">
        <i class="el-icon-menu"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/article">
        <i class="el-icon-document"></i>
        <span slot="title">内容管理</span>
      </el-menu-item>
      <el-menu-item index="/image">
        <i class="el-icon-picture-outline-round"></i>
        <span slot="title">素材管理</span>
      </el-menu-item>
      <el-menu-item index="/publish">
        <i class="el-icon-postcard"></i>
        <span slot="title">发布文章</span>
      </el-menu-item>
      <el-menu-item index="/comment">
        <i class="el-icon-chat-dot-round"></i>
        <span slot="title">评论管理</span>
      </el-menu-item>
      <el-menu-item index="/fans">
        <i class="el-icon-sugar"></i>
        <span slot="title">粉丝管理</span>
      </el-menu-item>
      <el-menu-item index="/settings">
        <i class="el-icon-setting"></i>
        <span slot="title">个人设置</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'AppAside',
  methods: {
  },
  data () {
    return {
    }
  },
  props: ['is-collapse']
}
</script>

<style scoped>
.el-menu {
  height: 100%;
}
  .logo {
    display: flex;
    justify-content: center;
    color: #ffffff;
  }
</style>
