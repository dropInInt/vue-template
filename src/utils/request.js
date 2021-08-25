import axios from 'axios'
import store from '@/store'
import { Notification } from 'element-ui'
import { setToken } from '@/utils/auth'

// 创建 axios 实例
const service = axios.create({
  baseURL: '/dev-api', // api base_url
  timeout: 60000 // 请求超时时间
})

const err = (error) => {
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use((config) => {
  const token = store.getters.token
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  // 更新token
  if (response.data.token) {
    setToken()
  }
  return response.data
}, err)

// const installer = {
//   vm: {},
//   install (Vue) {
//     Vue.use(VueAxios, service)
//   }
// }

// export { installer as VueAxios, service as axios }
export default service
