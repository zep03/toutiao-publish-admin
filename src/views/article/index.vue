<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!--数据筛选表单-->
      <el-form ref="form" size="mini" :model="form" label-width="40px">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option  label="全部" :value="null"></el-option>
            <el-option v-for="(channel, index) in channels" :key="index" :label="channel.name" :value="channel.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :default-time="['12:00:00']">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="loading" type="primary" @click="loadArticles(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        根据筛选条件共查询到{{totalCount}}条结果：
      </div>
      <!--数据表格-->
      <el-table
        v-loading="loading"
        :data="articles"
        style="width: 100%"
        size="mini"
        class="list-table">
        <el-table-column
          label="封面">
          <template slot-scope="scope">
            <el-image
              lazy
              style="width: 100px; height: 100px"
              :preview-src-list="scope.row.cover.images"
              :src="scope.row.cover.images[0]"
              :fit="cover"></el-image>
<!--            <img v-if="scope.row.cover.images[0]" class="article-cover" :src="scope.row.cover.images[0]" alt="">-->
<!--            <img v-else class="article-cover" src="./img/no-cover.gif" alt="">-->
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题">
        </el-table-column>
        <el-table-column
          label="状态">
          <!--
            如果需要在自定义表格模板中获取当前遍历行数据，
            那么需要在template标签上加上slot-scope="scope"
          -->
          <template slot-scope="scope">
            <!--<el-tag type="info" v-if="scope.row.status === 0">草稿</el-tag>
            <el-tag  v-else-if="scope.row.status === 1">待审核</el-tag>
            <el-tag type="success" v-else-if="scope.row.status === 2">审核通过</el-tag>
            <el-tag type="warning" v-else-if="scope.row.status === 3">审核失败</el-tag>
            <el-tag type="danger" v-else-if="scope.row.status === 4">已删除</el-tag>-->
            <el-tag :type="articlesStatus[scope.row.status].type" >{{articlesStatus[scope.row.status].text}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布时间">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              circle
              type="primary"
              @click="$router.push('/publish?id=' + scope.row.id.toString())"
              ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="onDeleteArticle(scope.row.id)"
              ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <!--默认每页展示10条数据-->
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="onCurrentChange"
        :page-size="pageSize"
        :disabled="loading"
        :current-page.sync="page"
        :total="totalCount">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  getArticles,
  getArticleChannels,
  deleteArticle
} from '../../api/article'
import JSONbig from 'json-bigint'
export default {
  name: 'ArticleIndex',
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      articles: [], // 文章数据列表
      articlesStatus: [
        { status: 0, text: '草稿', type: 'info' },
        { status: 1, text: '待审核', type: '' },
        { status: 2, text: '审核通过', type: 'success' },
        { status: 3, text: '审核失败', type: 'warning' },
        { status: 4, text: '已删除', type: 'danger' }
      ],
      totalCount: 0, // 数据总条数
      pageSize: 20, // 每页数据条数
      status: null, // 查询文章的状态，不传就是查询全部文章
      channels: [], // 文章频道列表
      channelId: null, // 查询文章的频道
      rangeDate: [], // 筛选文章的日期范围
      loading: true, // 表格数据加载中，显示loading
      page: 1 // 当前页码
    }
  },
  methods: {
    loadArticles (page = 1) {
      // 显示加载中 loading
      this.loading = true
      getArticles({
        page: page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 开始日期
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null // 截止日期
      }).then(res => {
        console.log(res)
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount
        // 隐藏加载中loding
        this.loading = false
      })
    },
    onCurrentChange (page) {
      console.log(page)
      this.loadArticles(page)
    },
    loadChannels () {
      getArticleChannels().then(res => {
        // console.log(res)
        this.channels = res.data.data.channels
      })
    },
    onDeleteArticle (articleId) {
      console.log(articleId.toString())
      console.log(JSONbig.stringify(articleId))
      this.$confirm('确定删除这篇文章吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认删除执行这里的代码
        deleteArticle(JSONbig.stringify(articleId)).then(res => {
          console.log(res)
          // 删除成功，更新文章数据列表
          this.loadArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // 找到数据接口

      // 封装请求方法
      // 删除请求调用
      // 处理响应结果
    }
  },
  created () {
    this.loadChannels()
    this.loadArticles()
  }
}
</script>

<style scoped>
.filter-card {
  margin-bottom: 30px;
}
.list-table{
  margin-bottom: 20px;
}
  .article-cover {
    width: 100px;
    background-size: cover;
  }
</style>
