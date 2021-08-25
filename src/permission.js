import Vue from 'vue'
import router from './router'
import store from './store'
import { Message } from 'element-ui'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'register', 'registerResult'] // no redirect whitelist
router.beforeEach(async (to, from, next) => {
  NProgress.start() // start progress bar
  document.title = getPageTitle(to.meta.title)
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/user/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          const { roles } = await store.dispatch('GetInfo')
          const accessRoutes = await store.dispatch('GenerateRoutes', roles)
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('Logout')
          Message.error({
            message: error || 'Has Error'
          })
          next({ path: '/login' })
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      next()
    } else {
      next({ path: '/login' })
      NProgress.done()
    }
  }
})

// 跳转到目的路由 如果在详情页跳转到对应的列表页面
// const newPath = redirect.split('/')
// let newRedirect = ''
// if (
//   newPath[3].indexOf('_Detail') !== -1 ||
//                     newPath[3].indexOf('_Edit') !== -1
// ) {
//   let newName = ''
//   if (newPath[3].indexOf('_Detail') !== -1) {
//     newName = newPath[3].replace('_Detail', '')
//   } else if (newPath[3].indexOf('_Edit') !== -1) {
//     newName = newPath[3].replace('_Edit', '')
//   }
//   newRedirect =
//                         newPath[0] +
//                         '/' +
//                         newPath[1] +
//                         '/' +
//                         newPath[2] +
//                         '/' +
//                         newName

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

/**
 * Action 权限指令
 * 指令用法：
 *  - 在需要控制 action 级别权限的组件上使用 v-action:[method] , 如下：
 *    <i-button v-action:add >添加用户</a-button>
 *    <a-button v-action:delete>删除用户</a-button>
 *    <a v-action:edit @click="edit(record)">修改</a>
 *
 *  - 当前用户没有权限时，组件上使用了该指令则会被隐藏
 *  - 当后台权限跟 pro 提供的模式不同时，只需要针对这里的权限过滤进行修改即可
 *
 *  @see https://github.com/sendya/ant-design-pro-vue/pull/53
 */
const action = Vue.directive('action', {
  bind: function (el, binding, vnode) {
    const actionName = binding.arg
    const roles = store.getters.roles
    const elVal = vnode.context.$route.meta.permission
    const permissionId = (elVal instanceof String && [elVal]) || elVal
    roles.permissions.forEach(p => {
      if (!permissionId.includes(p.permissionId)) {
        return
      }
      if (p.actionList && !p.actionList.includes(actionName)) {
        ; (el.parentNode && el.parentNode.removeChild(el)) ||
          (el.style.display = 'none')
      }
    })
  }
})

export { action }
