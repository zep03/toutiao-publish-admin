<template>
  <div class="image-container">
    <!--卡片-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
<!--          <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
        </el-breadcrumb>
      </div>
      <!-- 图片列表 -->
      <image-list></image-list>
      <!-- /图片列表 -->
    </el-card>
  </div>
</template>

<script>
import ImageList from './components/image-list.vue'
export default {
  name: 'ImageIndex',
  data () {
    return {
    }
  },
  components: {
    ImageList
  },
  created () {
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
