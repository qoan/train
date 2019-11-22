<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i class="el-icon-menu"></i>
    </div>
    <div class="logo" style="margin-top: 8px">
      <img src="@/assets/logo.png" alt />
    </div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <!-- <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
        </div>-->
        <!-- 消息中心 -->
        <div class="btn-bell">
          <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
            <router-link
              to="/tabs"
              style="width:200px;display: inline-block;margin-left:-80px;font-size:14px;color:#444"
            >
              <img class="Waring" src="@/assets/img/Group.png" />
              <span>消息预警</span>
              <i class="el-icon-bell"></i>
            </router-link>
          </el-tooltip>
          <!-- <span class="btn-bell-badge" v-if="message"></span> -->
        </div>
        <!-- 用户头像 -->
        <div class="user-avator icon-hide">
          <img class="rizhi" src="@/assets/img/rz.png" />
          <span class="text-span" @click="$refs.diaindexUpdate.dialogTableVisible=true">更新日志</span>
          <!-- <div class="num">2</div> -->
        </div>
        <div class="user-avator">
          <img src="@/assets/img/img.jpg" />
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{username}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!--- 修改密码弹窗 --->
    <dialog-update-password ref="dialogUpdatePassword"></dialog-update-password>
    <diaindex-rizhi-update ref="diaindexUpdate"></diaindex-rizhi-update>
  </div>
</template>
<script>
import bus from '../bus'
import DialogUpdatePassword from '../header/DialogUpdatePassword'
import DiaindexRizhiUpdate from '../header/DiaindexRizhiUpdate'
import '../../../assets/iconfont/iconfont.css' // 引入阿里字体图标

export default {
  components: {
    DialogUpdatePassword,
    DiaindexRizhiUpdate
  },
  data() {
    return {
      collapse: false,
      fullscreen: false,
      name: '',
      message: 2
    }
  },
  computed: {
    username() {
      let username = localStorage.getItem('accountMaster')
      return username || this.name
    }
  },
  methods: {
    // 获取中间内容区域的宽高
    getWidthAndHeight() {
      let o = document.getElementById('warp')
      let w = o.clientWidth || o.offsetWidth
      let d = document.getElementById('warp')
      let h = d.clientHeight || d.offsetHeight
      console.log(w)
      console.log(h)
      this.$store.commit('Set_contentWidth', w)
      this.$store.commit('Set_contentHeight', h)
    },
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command === 'loginout') {
        // 移除个人信息
        sessionStorage.removeItem('userInfo')
        localStorage.removeItem('ms_username')
        this.$router.push('/login')
      } else if (command === 'updatePassword') {
        this.$refs.dialogUpdatePassword.dialogVisible = true
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse
      bus.$emit('collapse', this.collapse)
      // 获取内容区域宽高,小于1500就隐藏username
      // this.getWidthAndHeight()
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    }
  },
  mounted() {
    if (document.body.clientWidth < 1500) {
      this.collapseChage()
    }
    this.name = JSON.parse(sessionStorage.getItem('userInfo')).accountMaster
  }
}
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #000;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  float: left;
  width: 250px;
  line-height: 70px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}

.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #000;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}

.icon-hide {
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 15px;
}
.num {
  width: 13px;
  height: 13px;
  background: red;
  position: absolute;
  top: 0px;
  right: 65px;
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 13px;
  font-size: 12px;
}
.text-span {
  font-size: 14px;
  margin-left: 5px;
  cursor: pointer;
}
.rizhi {
  border-radius: 0% !important;
}
.Waring {
  width: 20px;
  height: 25px;
  position: absolute;
  left: -45px;
  top: 3px;
}
</style>
