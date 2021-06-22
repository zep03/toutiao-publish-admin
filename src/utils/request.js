/*
* 基于axios封装的请求模块
* */
import axios from 'axios'

// 创建一个axios实例,说白了就是复制了一个axios
// 我们通过这个实例去发请求，把需要的配置配置给这个实例
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net' // 请求的基础路径
})

// 导出请求模块
export default request
