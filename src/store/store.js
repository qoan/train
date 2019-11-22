import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    contentWidth: 0, // 中间内容区域的宽度
    contentHeight: 0 // 中间内容区域的高度
  },
  mutations: {
    Set_contentWidth (state, value) {
      state.contentWidth = value
    },
    Set_contentHeight (state, value) {
      state.contentHeight = value
    }
  },
  actions: {

  },
  modules: {

  }
})
