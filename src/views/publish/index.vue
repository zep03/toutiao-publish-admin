<template>
  <div class="publish=container">
    <!--card 卡片-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.query.id ? '修改文章' : '发布文章' }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!--form表单-->
      <el-form ref="publish-form" :rules="formRules"  :model="article" label-width="60px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title" placeholder="请输入文章标题"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
<!--          <el-input type="textarea" v-model="article.content"></el-input>-->
          <el-tiptap placeholder="请输入文章内容" height="400" lang="zh" :extensions="extensions" v-model="article.content"></el-tiptap>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <template v-if="article.cover.type > 0">
            <!--
              默认的当你给事件处理函数传递了自定义参数以后，就无法得到原本的那个数据参数
              如果想要在事件处理函数自定义传参以后还想要原来的那个事件本身的参数，则手动添加$event，它就代表了那个事件本身的参数
              当我们给子组件提供的数据既需要使用，又需要修改时，这个时候我们可以使用v-model简化
              v-model="article.cover.images[index]相当于下面两行代码：
              ：value = "article.cover.images[index]" 给子组件传递了一个名字叫value的数据
              @input = "article.cover.images[index]"  默认监听input事件，当事件发生时，
              他会绑定数据 = 事件参数
            -->
            <!--<upload-cover :cover-image="article.cover.images[index]"
                          @update-cover="onUpdateCover(index, $event)"
                          :key="cover" v-for="(cover, index) in article.cover.type">
            </upload-cover>-->
            <upload-cover v-model="article.cover.images[index]"
                          :key="cover"
                          v-for="(cover, index) in article.cover.type">
            </upload-cover>
          </template>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option v-for="(channel, index) in channels" :key="index" :label="channel.name" :value="channel.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">发表</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getArticleChannels, addArticle, getArticle, updateArticle } from '../../api/article'
import {
  ElementTiptap,
  // 需要的 extensions
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline, // 下划线
  Italic, // 斜体
  Strike, // 删除线
  ListItem,
  BulletList, // 无序列表
  OrderedList, // 有序列表
  TodoItem,
  TodoList,
  HorizontalRule, // 分割线
  Fullscreen, // 全屏
  TableHeader,
  TableCell,
  TableRow,
  Table,
  Preview,
  TextColor,
  TextHighlight,
  CodeView,
  Link,
  CodeBlock,
  Blockquote,
  FontSize,
  Image
} from 'element-tiptap'
import 'element-tiptap/lib/index.css'
import { uploadImage } from '../../api/image'
import UploadCover from './components/upload-cover.vue'
export default {
  name: 'PublishIndex',
  data () {
    return {
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: { // 文章封面
          type: 1, // 封面类型-1:自动，0-无图，1-1张，3-3张
          images: [] // 封面图片的地址
        }
      },
      channels: [], // 文章频道列表
      channel_id: null, // 选中的频道id
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(),
        new Strike(),
        new Image({
          // 默认会把图片生成base64，如果需要自定义图片上传
          uploadRequest (file) {
            // console.log(file)
            const fd = new FormData()
            fd.append('image', file)
            return uploadImage(fd).then(res => {
              // console.log(res)
              return res.data.data.url
            })
          } // 图片的上传方法，返回一个Promise<url>
        }),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new HorizontalRule(),
        new Fullscreen(),
        new TableHeader(),
        new TableCell(),
        new TableRow(),
        new Table(),
        new Preview(),
        new TextColor(),
        new TextHighlight(),
        new CodeView(),
        new Link(),
        new CodeBlock(),
        new Paragraph(),
        new FontSize(),
        new Blockquote()
      ],
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' },
          {
            validator (rule, value, callback) {
              if (value === '<p></p>') {
                // 验证失败
                callback(new Error('请输入文章内容'))
              } else {
                // 验证通过
                callback()
              }
            }
          }
        ],
        channel_id: [
          { required: true, message: '请选择文章频道', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onPublish (draft = false) {
      this.$refs['publish-form'].validate(valid => {
        // 验证失败，停止提交表单
        if (!valid) {
          return false
        } else {
          // 如果是修改文章，则执行修改操作
          // 否则，执行添加操作
          const articleId = this.$route.query.id
          if (articleId) {
            // 执行修改操作
            updateArticle(articleId, this.article, draft).then(res => {
              console.log(res)
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              // 跳转到内容管理页面
              this.$router.push('/article')
            })
          } else {
            addArticle(this.article, draft).then(res => {
              // console.log(res)
              this.$message({
                message: `${draft ? '存入草稿' : '发表'}成功`,
                type: 'success'
              })
              // 跳转到内容管理页面
              this.$router.push('/article')
            })
          }
        }
      })
    },
    loadChannels () {
      getArticleChannels().then(res => {
        console.log(res.data)
        this.channels = res.data.data.channels
      })
    },
    loadArticle () {
      getArticle(this.$route.query.id).then(res => {
        // console.log(res)
        this.article = res.data.data
      })
    },
    onUpdateCover (index, url) {
      console.log('onUpdateCover', index, url)
      this.article.cover.images[index] = url
    }
  },
  components: {
    'el-tiptap': ElementTiptap,
    UploadCover
  },
  created () {
    this.loadChannels()

    // 由于我们让发表文章和编辑文章使用同一个页面
    // 所以这里要进行判断
    // 如果路由路径参数中有id，则请求展示文章内容
    if (this.$route.query.id) {
      this.loadArticle()
    }
  }
}
</script>

<style scoped>

</style>
