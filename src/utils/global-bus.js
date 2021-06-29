/*
* 全局通信总线
* 作用：可以让任何组件之间进行通信
* */
import Vue from 'vue'

export default new Vue()

// 假设 a组件 要给 b组件发送数据

// b 组件要注册通信的事件
// import globalBus from '@/utils/golbal-bus'
// globalBus.$on('自定义事件名称', (data) => {})

// a 组件发布通信事件
// import globalBus from '@/utils/golbal-bus'
// globalBus.$emit('自定义事件名称', 可选的数据)
