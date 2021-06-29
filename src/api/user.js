/*
* 用户相关请求模块
* */

// 用户登录
import request from '../utils/request'

export const login = (data) => {
  return request({
    method: 'post',
    url: '/mp/v1_0/authorizations',
    // data用来设置post请求体
    data: data
  })
}

// 获取用户信息
export const getUserProfile = () => {
  // 拿到浏览器本地存储的用户数据
  // const user = JSON.parse(window.localStorage.getItem('user'))
  // console.log(user)
  return request({
    method: 'get',
    url: '/mp/v1_0/user/profile'
    // 后端接口要求需要把授权的用户身份放到请求头中
    // axios 可以通过headers选项设置请求头
    // headers: {
    //   Authorization: `Bearer ${user.token}`
    // }
  })
}
//
// // 修改用户信息
// export const updateUser = () => {
//
// }

// 修改用户头像
// 注意： data必须传递FormData对象
export const updateUserPhoto = (data) => {
  return request({
    method: 'patch',
    url: '/mp/v1_0/user/photo',
    data: data
  })
}

// 修改用户基本信息
// 注意： data必须传递FormData对象
export const updateUserProFile = (data) => {
  return request({
    method: 'patch',
    url: '/mp/v1_0/user/profile',
    data: data
  })
}
