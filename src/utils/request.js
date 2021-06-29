/*
* 基于axios封装的请求模块
* */
import axios from 'axios'
import JSONbig from 'json-bigint'
// 在非组件成员中想要使用router,则需要导入router模块
import router from '../router/index.js'
// 非组件模块可以这样加载使用element-ui中的message消息提示组件
import { Message } from 'element-ui'

// 创建一个axios实例,说白了就是复制了一个axios
// 我们通过这个实例去发请求，把需要的配置配置给这个实例
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net', // 请求的基础路径
  // 定制 后端返回的原始数据如何进行处理
  // 参数data就是后端返回的原始数据（未经处理过的数据）
  transformResponse: [function (data) {
    // console.log(data)
    // axios 默认在内容使用JSON.parse  来转换处理后端响应的原始数据
    // 为什么要try-catch？
    // 答：后端返回的数据可能不是json格式的字符串
    //    如果不是的话，那么JSONbig.parse 调用就会报错
    try {
      // 如果转换成功，则直接把结果返回
      return JSONbig.parse(data)
    } catch (e) {
      // 转换失败
      console.log('转换失败', e)
      return data
    }
  }]
})

// 请求拦截器
request.interceptors.request.use(
  // 所有请求会经过这里
  function (config) {
    console.log('来了，老弟')
    // config 是当前请求相关的配置对象，可以进行修改
    // 设置token
    const user = JSON.parse(window.localStorage.getItem('user'))
    // console.log(user)
    // 如果有登录用户信息，则统一设置token
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // return config 之后请求才会真正的发送出去
    return config
  },
  // 请求失败，会经过这里
  function (error) {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(function (response) {
  // 所有响应码为 2xx 的响应都会进入这里
  // 对响应数据做点什么
  // response是响应数据
  // 注意：一定要把响应结果return，否则前端（真正发请求的位置）拿不到后端响应的数据
  return response
}, function (error) {
  // 任何响应码 超出 2xx 的响应都会进入这里
  // 对响应错误做点什么
  console.log('状态码异常')
  console.dir(error)
  const status = error.response.status
  if (status === 401) {
    // 清除本地存储中的user数据
    window.localStorage.removeItem('user')
    // 跳转到登录页面
    router.push('/login')
    Message({
      type: 'warning',
      message: '登录状态无效，请重新登录！'
    })
  } else if (status === 403) {
    // 没有操作权限， token未携带或已过期
    Message({
      type: 'warning',
      message: '没有操作权限， token未携带或已过期！'
    })
  } else if (status === 400) {
    // 客户端参数错误
    Message({
      type: 'warning',
      message: '客户端请求参数错误,请检查请求参数！'
    })
  } else if (status >= 500) {
    // 服务端错误
    Message({
      type: 'error',
      message: '服务端内部异常，请稍后重试！'
    })
  }
  return Promise.reject(error)
})

// 导出请求模块
export default request
