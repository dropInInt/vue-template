const getters = {
  device: state => state.app.device,
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  menuTree: state => state.menuTree,
  userDatas: state => state.user.userDatas,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs
}

export default getters
