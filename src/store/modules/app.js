import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    device: 'desktop',
    size: Cookies.get('size') || 'medium'
  },
  mutations: {
    SET_SIDEBAR_TYPE: (state, type) => {
      state.sidebar = !state.sidebar
      if (state.sidebar) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
    },
    CLOSE_SIDEBAR: (state) => {
      Cookies.set('sidebarStatus', 0)
      state.sidebar = false
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_SIZE: (state, size) => {
      state.size = size
      Cookies.set('size', state.size)
    }
  },
  actions: {
    setSidebar ({ commit }) {
      commit('SET_SIDEBAR_TYPE')
    },
    closeSideBar ({ commit }) {
      commit('CLOSE_SIDEBAR')
    },
    toggleDevice ({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    setSize ({ commit }, size) {
      commit('SET_SIZE', size)
    }
  }
}

export default app
