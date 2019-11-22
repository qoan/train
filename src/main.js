import Vue from 'vue'
import App from '@/App.vue'
import api from '@/api/index'
import store from '@/store/store'
import router from '@/router/index'
import VueAxios from 'vue-axios'
import axiosConfig from '@/config/axios.config'
import ElementUI from 'element-ui'
import ECharts from 'vue-echarts'
import 'element-ui/lib/theme-chalk/index.css' // 默认主题
import 'element-ui/lib/theme-chalk/display.css'
import '@/assets/iconfont/iconfont.css' // 引入阿里字体图标
import '@/assets/css/icon.css'
import '@/components/common/directives'
import 'babel-polyfill'

Vue.use(VueAxios, axiosConfig)
Vue.use(ElementUI, {
  size: 'small'
})
Vue.component('v-chart', ECharts)
Vue.prototype.$api = api
Vue.prototype.$ECharts = ECharts
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
