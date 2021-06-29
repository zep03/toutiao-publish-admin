/*
* 文章相关请求模块
* */
import request from '../utils/request'
/* 获取文章列表 */
export const getArticles = (params) => {
  return request({
    method: 'get',
    url: '/mp/v1_0/articles',
    // body参数使用 data设置
    // query参数使用 params设置
    params: params
  })
}

/* 获取文章频道 */
export const getArticleChannels = () => {
  return request({
    method: 'get',
    url: '/mp/v1_0/channels'
  })
}

/* 删除文章 */
export const deleteArticle = (articleId) => {
  return request({
    method: 'delete',
    // 接口文章当中写的路径参数需要在url中进行传递
    url: `/mp/v1_0/articles/${articleId}`
  })
}

/* 发布文章 */
export const addArticle = (data, draft = false) => {
  return request({
    method: 'post',
    url: '/mp/v1_0/articles',
    params: {
      draft: draft // 是否存为草稿（true 为草稿）
    },
    data: data
  })
}

/* 编辑文章 */
export const updateArticle = (articleID, data, draft = false) => {
  return request({
    method: 'put',
    url: `/mp/v1_0/articles/${articleID}`,
    params: {
      draft: draft // 是否存为草稿（true 为草稿）
    },
    data: data
  })
}

/* 获取指定文章 */
export const getArticle = (articleID) => {
  return request({
    method: 'get',
    url: `/mp/v1_0/articles/${articleID}`
  })
}

/* 修改文章评论状态 */
export const updateCommentStatus = (articleId, allowComment) => {
  return request({
    method: 'put',
    url: '/mp/v1_0/comments/status',
    params: {
      article_id: articleId
    },
    data: {
      allow_comment: allowComment // 是否允许评论
    }
  })
}
