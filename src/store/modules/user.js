import Vue from 'vue'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getInfo, logout } from '@/api/user'
import router, { resetRouter } from '@/router'

const user = {
  state: {
    token: getToken(),
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    menuTree: {},
    userDatas: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_MENU: (state, menuTree) => {
      state.menuTree = menuTree
    },
    SET_USER: (state, userDatas) => {
      state.userDatas = userDatas
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        login({ username: username.trim(), password: password }).then(response => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(res => {
          const { data } = res
          const { roles, name, avatar, introduction } = data
          // commit('changeType', result.agentType);
          // commit('changeCode', result.agentDistCode);
          commit('SET_NAME', name)
          // commit('SET_INFO', result)
          // commit('SET_MENU', result.menuTree)
          commit('SET_ROLES', roles)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(res => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_USER', {})
          commit('SET_MENU', {})
          removeToken()
          resetRouter()
          resolve(res)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    ResetToken ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    }
  }
}

export default user
