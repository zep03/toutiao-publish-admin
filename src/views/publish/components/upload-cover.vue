<template>
  <div class="upload-cover" @click="showCoverSelect">
    <div class="cover-wrap">
<!--      <img :src="coverImage" class="cover-image" ref="cover-image">-->
      <img :src="value" class="cover-image" ref="cover-image">
    </div>
    <!--dialog弹出层-->
    <el-dialog
      title="选择封面"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      >
      <!--tab标签页-->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="first">
          <image-list ref="image-list" :is-show-selected="true" :is-show-add="false" :is-show-action="false"></image-list>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <input ref="file" type="file" @change="onFileChange">
          <img ref="preview-image" src="" width="100" alt="">
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onCoverConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ImageList from '../../image/components/image-list.vue'
import { uploadImage } from '../../../api/image.js'
export default {
  name: 'UploadCover',
  data () {
    return {
      dialogVisible: false,
      activeName: 'second'
    }
  },
  // props: ['cover-image'],
  props: ['value'],
  methods: {
    showCoverSelect () {
      // 展示选择封面的弹窗
      this.dialogVisible = true
    },
    onFileChange () {
      // 获取文件对象
      const fileObj = this.$refs.file.files[0]
      // 图片预览
      const blob = window.URL.createObjectURL(fileObj)
      this.$refs['preview-image'].src = blob
      // 防止用户选择同一个文件步触发 change事件
      // this.$refs.file.value = ''
    },
    onCoverConfirm () {
      // 如果tab是上传图片，并且input-file 有选择的文件
      // 才执行上传图片的操作
      if (this.activeName === 'second') {
        const fileObj = this.$refs.file.files[0]
        if (!fileObj) {
          this.$message({
            type: 'warning',
            message: '请选择文件！'
          })
          return false
        }
        // 执行上传文件的操作
        const fd = new FormData()
        fd.append('image', fileObj)
        uploadImage(fd).then(res => {
          console.log(res)
          // 关闭弹出层
          this.dialogVisible = false
          // 展示上传的图片
          // this.$refs['cover-image'].src = res.data.data.url
          // 将图片地址发送给父组件
          // this.$emit('update-cover', res.data.data.url)
          this.$emit('input', res.data.data.url)
        })
      } else if (this.activeName === 'first') {
        // 父组件访问子组件的数据
        const imageList = this.$refs['image-list']
        console.log(imageList.selected)
        const selected = imageList.selected
        // 如果没有选择封面图片
        if (selected === null) {
          this.$message({
            type: 'warning',
            message: '请选择封面图片'
          })
          return false
        }
        // 如果选择了封面图片
        // 关闭对话框
        this.dialogVisible = false
        // 修改父组件
        this.$emit('input', imageList.images[selected].url)
      }
    }
  },
  components: {
    ImageList
  }
}
</script>

<style scoped lang="less">
.cover-wrap {
  width: 150px;
  height: 120px;
  border: 1px solid #000;
  .cover-image {
    height: 120px;
    max-width: 100%;
  }
}
</style>
