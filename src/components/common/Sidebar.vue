<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :collapse="collapse"
      background-color="#fff"
      text-color="#8D8D8D"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in MenuList">
        <!-- 带展开一级菜单 -->
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title" style="margin-left: 15px">{{ item.title }}</span>
            </template>
            <!-- 二级菜单 -->
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem,i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >{{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
            </template>
          </el-submenu>
        </template>

        <!-- 不展开一级菜单 -->
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title" style="margin-left: 15px">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import menuConfig from '../../data/menuConfig'
import bus from '../common/bus'
export default {
  data() {
    return {
      collapse: false,
      MenuList: []
    }
  },
  /* computed: {
    onRoutes() {
      return this.$route.path.replace('/', '')
    }
  }, */
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
  },
  mounted() {
    // 根据身份类型获取菜单列表
    if (!sessionStorage.getItem('userInfo')) return
    let roleTid = JSON.parse(sessionStorage.getItem('userInfo')).roleTid
    switch (parseInt(roleTid)) {
      case 1:
        console.log('admin超级管理员登录')
        this.MenuList = menuConfig.ADMIN
        break
      case 2:
        console.log('政府总管理员登录')
        this.MenuList = menuConfig.MAIN_GOV
        break
      case 3:
        console.log('学校总校管理员登录')
        this.MenuList = menuConfig.MAIN_SCHOOL
        break
      case 4:
        console.log('政府总分支管理员登录')
        this.MenuList = menuConfig.PART_GOV
        break
      case 5:
        console.log('学校分校管理员登录')
        this.MenuList = menuConfig.PART_SCHOOL
        break
      default:
        console.log('登录身份认证出错')
        this.MenuList = menuConfig.ADMIN
    }
  }
}
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
