<template>
  <div class="image-list">
    <!--radio单选按钮组-->
    <div class="action-head">
      <el-radio-group v-model="collect" size="mini" @change="onCollectChange">
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button>
      </el-radio-group>
      <el-button v-if="isShowAdd" size="mini" type="success" @click="dialogUploadVisible = true">上传素材</el-button>
    </div>
    <!--素材列表-->
    <el-row :gutter="10">
      <el-col class="image-item" @click.native="selected = index" v-for="(img, index) in images" :key="index" :xs="12" :sm="6" :md="6" :lg="4">
        <el-image
          style="height: 100px"
          :src="img.url"
          fit="cover">
        </el-image>
        <div class="selected" v-if="isShowSelected && selected === index"></div>
        <!--收藏 删除按钮-->
        <div class="image-action" v-if="isShowAction">
          <el-button size="small" type="warning" :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'" circle @click="onCollect(img)" :loading="img.loading"></el-button>
          <el-button size="small" type="danger" icon="el-icon-delete-solid" circle @click="onDelete(img)" :loading="img.loading"></el-button>
          <!--            <i :class="{'el-icon-star-on': img.is_collected, 'el-icon-star-off': !img.is_collected}" @click="onCollect(img)"></i>-->
          <!--            <i class="el-icon-delete-solid"></i>-->
        </div>
      </el-col>
    </el-row>
    <!--数据分页-->
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="onPageChange"
      :current-page.sync="page"
      :page-size="pageSize"
      :total="totalCount">
    </el-pagination>
    <!--弹出层-->
    <el-dialog title="上传素材" :append-to-body="true" :visible.sync="dialogUploadVisible">
      <!--拖拽上传文件-->
      <el-upload
        v-if="dialogUploadVisible"
        class="upload-demo"
        drag
        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
        :headers="uploadHeaders"
        name="image"
        :on-success="onUploadSuccess"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImages, collectImage, deleteImage } from '../../../api/image.js'
export default {
  name: 'ImageList',
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false, // 默认查询全部素材列表
      images: [], // 图片素材列表
      dialogUploadVisible: false, // 弹出层是否显示
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      totalCount: 0, // 数据总条数
      pageSize: 10, // 每页的条数
      page: 1, // 当前页码
      selected: null // 选中的索引
    }
  },
  props: {
    // 是否显示上传素材按钮
    isShowAdd: {
      type: Boolean,
      default: true
    },
    // 是否显示收藏删除按钮
    isShowAction: {
      type: Boolean,
      default: true
    },
    // 是否显示图片的选中状态（绿色的√）
    isShowSelected: {
      type: Boolean,
      default: false
    }

  },
  created () {
    // 页面初始化加载第1页的数据
    this.loadImages(1)
  },
  methods: {
    loadImages (page = 1) {
      // 重置高亮页码，防止数据和高亮页码不对应
      this.page = page
      getImages({
        collect: this.collect,
        page: page,
        per_page: this.pageSize
      }).then(res => {
        // console.log(res)
        const results = res.data.data.results
        // img 对象本来没有 loading 数据
        // 我们这里手动的往里面添加该数据是用来控制每个收藏按钮的loading状态
        results.forEach(img => {
          img.loading = false
        })
        this.images = results
        this.totalCount = res.data.data.total_count
      })
    },
    onCollectChange (value) {
      // console.log(value)
      this.loadImages(1, value)
    },
    onUploadSuccess () {
      // 关闭弹出层
      this.dialogUploadVisible = false
      // 刷新全部图片素材列表
      this.loadImages(this.page)

      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },
    onPageChange (page) {
      // console.log(page)
      this.loadImages(page)
    },
    onCollect (img) {
      // console.log(img)
      // 展示loading图标
      img.loading = true
      collectImage(img.id, !img.is_collected).then(res => {
        // console.log(res)
        // 更新视图状态
        img.is_collected = !img.is_collected
        // 关闭loading图标
        img.loading = false
      })
      // // 已收藏，则取消收藏
      // if (img.is_collected) {
      //   collectImage(img.id, false).then(res => {
      //     // console.log(res)
      //   })
      // } else {
      //   // 未收藏，则添加收藏
      //   collectImage(img.id, true).then(res => {
      //     // console.log(res)
      //   })
      // }
    },
    onDelete (img) {
      img.loading = true
      deleteImage(img.id).then(res => {
        console.log(res)
        // 删除成功后，重新加载数据列表
        this.loadImages(this.page)
        img.loading = false
      })
    }
  }
}
</script>

<style scoped>
  .action-head {
    padding-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
  .image-item {
    position: relative;
  }
  .image-action {
    height: 40px;
    background-color: rgba(204,204,204,.5);
    position: absolute;
    bottom: 4px;
    left: 5px;
    right: 5px;
    font-size: 25px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    color: #ffffff;
  }
  .selected {
    background: url("./img/selected.png") no-repeat;
    background-size: cover;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
