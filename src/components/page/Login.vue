<template>
  <el-row class="login-wapper">
    <div class="login-bg-wapper">
      <img src="@/assets/img/login-bg@2x.png" />
      <img src="@/assets/img/logo@2x.png" />
    </div>
    <div class="login-box">
      <p>职业技能培训人员管理系统</p>
      <el-input placeholder="账号为注册手机号" v-model="userLogin.username">
        <i slot="prefix" class="iconfont icon-login" style="color: #387BBF; line-height: 30px;"></i>
      </el-input>
      <el-input
        placeholder="请输入密码"
        type="password"
        @keyup.enter.native="clickLogin()"
        v-model="userLogin.password"
      >
        <i slot="prefix" class="iconfont iconpassword" style="color: #387BBF; line-height: 30px;"></i>
      </el-input>
      <p v-show="false">忘记密码</p>
      <el-button @click="clickLogin" :loading="loading">{{loading ? '登录中...' : '登录'}}</el-button>
      <p>
        <span style="color: red; margin-right: 5px;">*</span>请使用您本人的账号和密码登录
      </p>
    </div>
  </el-row>
</template>

<script>
import CryptoJS from 'crypto-js'
import { BACK_STAGE_ENUM } from '@/data/backStageEnum'
export default {
  data: function() {
    return {
      loading: false,
      userLogin: {
        username: null,
        password: null
      }
    }
  },
  mounted() {
    try {
      let isPortalJump = JSON.parse(this.decrypt(this.$route.query.token))
      // token和用户名存在就放行, 不存在什么都不做
      this.clickLogin()
      if (isPortalJump && isPortalJump.data.username && isPortalJump.data.token) {
        // 获取枚举列表
        BACK_STAGE_ENUM.forEach(key => {
          this.getEnumList(key).then(data => {
            sessionStorage.setItem(key, JSON.stringify(data))
          })
        })

        // 存储个人信息
        sessionStorage.setItem('userInfo', JSON.stringify(isPortalJump.data))
        // 跳转主页或指定网页
        this.$message({
          message: '登录成功!',
          type: 'success'
        })
        this.$router.push({ name: 'comprehensive' })
      }
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    decrypt(str) {
      // 解密 base64
      console.log(str)
      var words = CryptoJS.enc.Base64.parse(str)
      var parseStr = words.toString(CryptoJS.enc.Utf16)
      return parseStr
    },

    // 事件 - 点击登录
    clickLogin() {
      this.loading = true
      return this.axios
        .post(this.$api.accountLogin + `?username=${this.userLogin.username}&password=${this.userLogin.password}`)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }

          // 获取枚举列表
          BACK_STAGE_ENUM.forEach(key => {
            this.getEnumList(key).then(data => {
              sessionStorage.setItem(key, JSON.stringify(data))
            })
          })

          // 存储个人信息
          sessionStorage.setItem('userInfo', JSON.stringify(res.data.data))

          // 跳转主页或指定网页
          this.$message({
            message: '登录成功!',
            type: 'success'
          })

          this.$router.push({ path: '/comprehensive' })

          if (this.$route.query.redirect) {
            console.log(this.$route.query.redirect)
            this.$router.push({ path: this.$route.query.redirect })
          } else {
            this.$router.push({ path: '/' })
          }
          return Promise.resolve(res.data.data)
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 请求 - 拉取后台枚举值
    getEnumList(type) {
      return this.axios
        .get(this.$api.selectOption + type)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }
          return res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-wapper {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  .login-bg-wapper {
    position: relative;
    height: 100%;
    margin-right: 40px;
    flex: 1;
    img:nth-child(1) {
      height: calc(100% - 100px);
      width: 100%;
    }
    img:nth-child(2) {
      height: 45px;
      width: 140px;
      position: absolute;
      left: 40px;
      bottom: 40px;
    }
  }
  .login-box {
    width: 500px;
    height: 100;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    box-sizing: border-box;
    padding: 60px;

    p:nth-child(1) {
      font-size: 28px;
      font-family: PingFangSC-Semibold;
      font-weight: 600;
      color: rgba(56, 123, 191, 1);
      line-height: 28px;
      margin-bottom: 40px;
    }
    .el-input {
      width: 100%;
      border: none;
      margin-bottom: 20px;
      font-family: PingFangSC-Semibold;
      font-weight: 400;
      color: rgba(56, 123, 191, 1);
      background-color: transparent;
      line-height: 17px;
      font-size: 14px;
      /deep/ .el-input__inner {
        border: none;
        border-bottom: 1px solid #387bbf;
        border-radius: 0;
        background-color: transparent;
        &::placeholder {
          color: #387bbf;
        }
      }
      /* 处理input type = number的上下箭头 */
      /deep/ input::-webkit-outer-spin-button,
      /deep/ input::-webkit-inner-spin-button {
        -webkit-appearance: none;
      }
      /deep/ input[type='number'] {
        -moz-appearance: textfield;
      }
    }
    p:nth-child(4) {
      width: 100%;
      font-size: 10px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(56, 123, 191, 1);
      line-height: 14px;
      margin-bottom: 50px;
      text-align: left;
    }
    .el-button {
      width: 100%;
      height: 35px;
      color: #fff;
      font-size: 16px;
      letter-spacing: 5px;
      font-weight: 500;
      margin-bottom: 40px;
      border-radius: 20px;
      border: none;
      background: linear-gradient(to right, #69b2e1 0%, #387bbf 100%);
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#69B2E1', endColorstr='#387BBF',GradientType=0 );
    }
    p:nth-child(6) {
      width: 100%;
      font-size: 11px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.5);
      line-height: 16px;
      text-align: left;
    }
  }
}
</style>
