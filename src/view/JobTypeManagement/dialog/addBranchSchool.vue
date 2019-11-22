<template>
  <el-dialog
    @open="open"
    :custom-class="customClass"
    :visible.sync="dialogVisible"
    :width="width"
    :title="title">

    <el-form class="addForm" :size="size" label-position="right" >
      <el-row>
        <el-col :span="24">
          <el-form-item label="工种名称：">
            <el-input v-model="personInfo.name"  placeholder="请输入工种名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addSlaveSchoolManager()">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      customClass: 'dialog-add-person',
      title: '新增工种',
      width: '450px',
      size: 'mini',
      schoolTid: null,
      originData: {},
      personInfo: {
        name: ''
      }
    }
  },
  methods: {
    // 初始化数据
    open() {
      this.personInfo.name = ''
    },
    // 请求添加分校管理员
    addSlaveSchoolManager () {
      return this.axios
        .post(this.$api.saveWorkType, {
          'enumerValue': this.personInfo.name
        })
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }
          this.$message({
            message: '添加成功',
            type: 'success'
          })

          this.$emit('submitOk')
          this.dialogVisible = false
          return res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss">
  /* dialog位于顶层，scoped局域是无法选中的， 所以最好定义dialog的类名 */
  .dialog-add-person {
    .el-dialog__header {
      border-bottom: 1px solid #F7F7F7;
    }
    .el-dialog__body {
      padding-left: 40px;
      padding-right: 40px;
      padding-bottom: 10px;
    }
    .el-form-item {
      display: flex;
      /* 使输入框自适应 */
      .el-form-item__label {
        width: 90px;
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
    .prompt {
      span {
        color: orange;
      }
    }
  }

  .el-row {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
</style>
