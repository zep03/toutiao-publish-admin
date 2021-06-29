/* 素材请求相关模块 */

import request from '../utils/request'

/* 上传图片素材 */
export const uploadImage = (data) => {
  return request({
    method: 'post',
    url: '/mp/v1_0/user/images',
    // 一般文件上传的接口都要求把请求的Content-Types设置为multipart/form-data
    // 但是我们使用axios上传文件的话不需要手动设置，你只要给data一个formData对象即可
    // new formData()
    data: data
  })
}

/* 获取素材列表 */
export const getImages = (params) => {
  return request({
    method: 'get',
    url: '/mp/v1_0/user/images',
    params: params
  })
}

/* 收藏/取消收藏图片素材 */
export const collectImage = (imageId, collect) => {
  return request({
    method: 'put',
    url: `/mp/v1_0/user/images/${imageId}`,
    data: {
      collect: collect // 是否收藏，false-取消收藏，true-添加收藏
    }
  })
}

/* 删除图片素材 */
export const deleteImage = (imageId) => {
  return request({
    method: 'delete',
    url: `/mp/v1_0/user/images/${imageId}`
  })
}
