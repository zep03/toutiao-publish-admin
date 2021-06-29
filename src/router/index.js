import Vue from 'vue'
import VueRouter from 'vue-router'
// @是src目录的路径别名
import Login from '@/views/login/index.vue'
import Home from '@/views/home/index.vue'
import Layout from '@/views/layout/index.vue'
import Article from '@/views/article/index.vue'
import Publish from '@/views/publish/index.vue'
import Image from '@/views/image/index.vue'
import Comment from '@/views/comment/index.vue'
import Settings from '@/views/settings/index.vue'
import Fans from '@/views/fans/index.vue'

Vue.use(VueRouter)

// 路由配置表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // name: 'layout',
    component: Layout,
    children: [
      {
        path: '', // path 为空，会作为默认子路由渲染
        name: 'home',
        component: Home
      },
      {
        path: '/article', // path 为空，会作为默认子路由渲染
        name: 'article',
        component: Article
      },
      {
        path: '/publish', // path 为空，会作为默认子路由渲染
        name: 'publish',
        component: Publish
      },
      {
        path: '/image', // path 为空，会作为默认子路由渲染
        name: 'image',
        component: Image
      },
      {
        path: '/comment', // path 为空，会作为默认子路由渲染
        name: 'comment',
        component: Comment
      },
      {
        path: '/settings', // path 为空，会作为默认子路由渲染
        name: 'settings',
        component: Settings
      },
      {
        path: '/fans', // path 为空，会作为默认子路由渲染
        name: 'fans',
        component: Fans
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫： 说白了所有页面的导航都会经过这里,用来守卫页面的导航的
// to: 要去的路由页面的信息
// from: 来自哪里的路由信息
// next: 放行方法
router.beforeEach((to, from, next) => {
  console.log('页面进来了')
  // 如果要访问的页面不是 /login，则需要校验登录状态
  // 如果没有登录，则跳转到登录页面
  // 如果登录了，则允许通过
  // 校验 非登录页面的登录状态
  const user = JSON.parse(window.localStorage.getItem('user'))
  if (to.path !== '/login') {
    if (user) {
      // 已登录，允许通过
      next()
    } else {
      // 没有登录，跳转到登录页面
      next('/login')
    }
  } else {
    // 访问登录页面，正常允许通过
    next()
  }
})
// 我们在组件中使用的this.$router就是这个模块导出的router
export default router
