import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router/index' // 这里返回的实例，因为没有涉及SSR，如果是返回的function就不能这样用，

// 添加默认配置
const instance = axios.create({
  timeout: 100000 // 请求超时时间
})

/* 请求拦截器 */
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  // 登录直接放行，不需要加token
  /*
  if (config.url === '/account/login') {
    return config
  }
  */

  // 携带token
  let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  if (userInfo && userInfo.token) {
    config.headers.token = userInfo.token
  }

  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

/* 响应拦截器 */
instance.interceptors.response.use(function (response) {
  // Do something with response data - 捕获200 - 后台自定义的状态码
  return response
}, function (error) {
  // Do something with response error - 捕获错误请求状态码
  if (error.response) {
    switch (error.response.status) {
      case 401:
        // 返回 401 清除token信息并跳转到登录页面
        sessionStorage.removeItem('userInfo')
        router.push({
          path: '/login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
    }
  }

  // 返回接口返回的错误信息
  Message.error(error.response.data.message)
  return Promise.reject(error.response.data.message)
})

export default instance
