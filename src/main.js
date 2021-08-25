// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import VCharts from 'v-charts'
import App from './App.vue'
import router from './router'
import store from './store/'
// import '@/components/bus'
import '@/assets/iconfont/iconfont.css'
import '@/assets/styles/index.less'
import 'normalize.css/normalize.css'
import './permission'

import 'element-ui/lib/theme-chalk/index.css';
import Element from 'element-ui'

// mock
const { mockXHR } = require('../mock')
mockXHR()

Vue.config.productionTip = false

Vue.use(VCharts)
Vue.use(Element)

// Vue.filter('dateFormat', (dateStr, pattern = 'YYYY-MM-DD') => {
// 	if (dateStr) {
// 		return moment(dateStr).format(pattern)
// 	} else {
// 		return dateStr
// 	}
// })

// 防止重复点击
// Vue.directive创建指令-----如果想间隔时间久一点可以自己传参数--binding.value传的参数的值----el是获取dom元素
// Vue.directive('repeatClick', {
// 	inserted(el, binding) {
// 		el.addEventListener('click', () => {
// 			if (!el.disabled) {
// 				el.disabled = true
// 				setTimeout(() => {
// 					el.disabled = false
// 				}, binding.value || 2000)
// 			}
// 		})
// 	},
// })
// 去除首尾空格
// Vue.directive('removeSpaces', {
// 	inserted(el, binding, vnode) {
// 		el.addEventListener('blur', (e) => {
// 			// console.log(vnode, '11')
// 			let content = e.target.value.replace(/(^\s*)|(\s*$)/g, '')
// 			if (vnode.componentInstance) {
// 				// 如果是自定义组件就触发自定义组件的input事件
// 				vnode.componentInstance.$emit('change.value', content)
// 				// vnode.componentInstance.value = content
// 			} else {
// 				// 如果是原生组件就触发原生组件的input事件
// 				el.value = e.target.value.replace(/(^\s*)|(\s*$)/g, '')
// 				el.dispatchEvent(new Event('input'))
// 			}
// 		})
// 	},
// })

// Vue.filter('filterSpaces', function(value) {
// 	if (!value) return ''
// 	value = value.replace(/(^\s*)|(\s*$)/g, '')
// 	return value
// })

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount('#app')
