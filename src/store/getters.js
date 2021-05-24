const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,

  token: state => state.user.token,

  id: state => state.user.id,
  extend: state => state.user.extend,

  name: state => state.user.name,
  userid: state => state.user.userid,
  roles: state => JSON.parse(state.user.roles)
}
export default getters
