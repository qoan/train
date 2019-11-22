<template>
  <el-dialog
    :custom-class="customClass"
    :visible.sync="dialogVisible"
    :width="width"
    :title="title">

    <el-form class="upDatePassword" ref="form" :model="formData" :rules="rules" :size="size" status-icon>
      <!--- 第一栏 -->
      <el-row :gutter="40">
        <el-col :span="24">
          <el-form-item label="旧密码：" prop="oldPassword">
            <el-input v-model="formData.oldPassword"  maxlength="16" placeholder="请输入旧密码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="新密码：" prop="newPassword">
            <el-input v-model="formData.newPassword" type="password"  maxlength="16" placeholder="请输入新密码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="再次输入：" prop="rePassword">
            <el-input v-model="formData.rePassword" type="password" maxlength="16" placeholder="请确认新密码"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" :size="size" @click="$refs['form'].resetFields();">重 置</el-button>
      <el-button type="primary" :size="size" :loading="loading" @click="updatePassword()">{{loading ? '执行中...' : '修 改'}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import RegexUtil from '@/utils/regexUtils'
export default {
  data () {
    return {
      dialogVisible: false,
      customClass: 'dialog-update-password',
      title: '修改密码',
      width: '400px',
      size: 'mini',
      loading: false,
      formData: {
        oldPassword: '',
        newPassword: '',
        rePassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码由 6~16 位非中文字符组成', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (RegexUtil.isNotCzPwd(value)) {
                callback()
              } else {
                callback(new Error('密码由 6~16 位非中文字符组成'))
              }
            },
            trigger: 'blur'
          }
        ],
        rePassword: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码由 6~16 位非中文字符组成', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (RegexUtil.isNotCzPwd(value)) {
                callback()
              } else {
                callback(new Error('密码由 6~16 位非中文字符组成'))
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 请求 - 修改密码
    updatePassword () {
      // 判断两次密码输入是否一致
      if (this.formData.newPassword !== this.formData.rePassword) {
        this.$message.error('两次输入密码不一致请，重试!')
        return
      }

      this.loading = true
      return this
        .axios
        .post(this.$api.updatePassword + `?oldPassword=${this.formData.oldPassword}&newPassword=${this.formData.newPassword}`)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }

          this.$message({
            message: '修改密码成功',
            type: 'success'
          })

          this.dialogVisible = false
          this.$router.push({ name: 'login' })
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss">
  /* dialog位于顶层，scoped局域是无法选中的， 所以最好定义dialog的类名 */
  .dialog-update-password {
    .el-dialog__header {
      border-bottom: 1px solid #F7F7F7;
    }

    .el-dialog__body {
      padding-left: 40px;
      padding-right: 40px;
      .el-form {
        /deep/ .el-form-item {
          display: flex;
          .el-form-item__label {
            width: 100px;
          }
          .el-form-item__content {
            flex: 1;
            /* 使下拉框自适应 */
            .el-select {
              width: 100%;
            }
            /* 使时间选择器自适应 */
            .el-date-editor {
              width: 100%;
            }
          }
        }
      }
    }

    .el-row {
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
</style>
