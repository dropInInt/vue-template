import { axios } from '@/utils/request'
import {
  BasicLayout
} from '@/layouts'

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout

  // 你需要动态引入的页面组件
  dashbord: () => import('@/views/dashboard/home/homePage')

  // ...more
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*',
  redirect: '/404',
  hidden: true
}

/**
 * 获取后端路由信息的 axios API
 * @returns {Promise}
 */
export const getRouterByUser = () => {
  return axios({
    url: '/user/dynamic-menu',
    method: 'get'
    /* headers: {
              'Access-Token': 'xxx'
            }
            */
  })
}

/**
 * 获取路由菜单信息
 *
 * 1. 调用 getRouterByUser() 访问后端接口获得路由结构数组
 *    @see https://github.com/sendya/ant-design-pro-vue/blob/feature/dynamic-menu/public/dynamic-menu.json
 * 2. 调用
 * @returns {Promise<any>}
 */
export const generatorDynamicRouter = () => {
  return new Promise((resolve, reject) => {
    // ajax
    getLoginMenu()
      .then(res => {
        const result = [res.data]
        const routers = generator(result)
        routers.push(notFoundRouter)
        resolve(routers)
      })
      .catch(err => {
        reject(err)
      })
    // getLeftTree().then(res => {
    //   console.info(res)
    //   const result = res.result
    //   const routers = generator(result)
    //   routers.push(notFoundRouter)
    //   resolve(routers)
    // }).catch(err => {
    //   reject(err)
    // })
  })
}

/**
 * 格式化 后端 结构信息并递归生成层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    // console.info('item---',item)
    const currentRouter = {
      // 路由地址 动态拼接生成如 /dashboard/workplace
      path: `${(parent && parent.path) || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      key: item.menuNo,
      // 该路由对应页面的 组件
      component: constantRouterComponents[item.component || item.key],
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: item.title,
        icon: item.icon || undefined,
        permission: (item.key && [item.key]) || null,
        metaNo: item.menuNo,
        keepAlive: true
      }
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    currentRouter.path = currentRouter.path.replace('//', '/')

    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    // console.log(currentRouter)
    return currentRouter
  })
}
