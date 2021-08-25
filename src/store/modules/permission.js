import { asyncRoutes, constantRoutes } from '@/router'
// import { generatorDynamicRouter } from '@/utils/routerUntil'
/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */
function hasPermission (roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  }
  return true
}

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
// function hasRole(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return route.meta.roles.includes(roles.id)
//   } else {
//     return true
//   }
// }

function filterAsyncRouter (routes, roles) {
  const res = []
  routes.forEach((route) => {
    const tmp = [...route]
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

const permission = {
  state: {
    routes: [],
    addRoutes: []
  },
  mutations: {
    SET_ROUTERS: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, roles) {
      return new Promise(resolve => {
        let accessedRoutes
        if (roles.includes('admin')) {
          accessedRoutes = asyncRoutes || []
        } else {
          accessedRoutes = filterAsyncRouter(asyncRoutes, roles)
        }
        // generatorDynamicRouter(data).then(routers => {
        //   // debugger
        //   console.log(routers,78778)
        //   commit('SET_ROUTERS', routers)
        //   resolve()
        // })
        commit('SET_ROUTERS', accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }
}

export default permission
