import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import settings from './modules/settings'
import errorLog from './modules/errorLog'
import tagsView from './modules/tagsView'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    settings,
    errorLog,
    tagsView
  },
  state: {
    collapsed: false
  },
  mutations: {
    changeSidebar (state) {
      state.collapsed = !state.collapsed
    }
  },
  actions: {
    changeSidebar (context) {
      context.commit('changeSidebar')
    }
  },
  getters
})
