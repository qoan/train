<template>
  <el-dialog
    :custom-class="customClass"
    :visible.sync="dialogVisible"
    :width="width"
    :title="title">

    <el-form class="addForm" :size="size" label-position="right" >
      <el-row>
        <el-col :span="24">
          <el-form-item label="成员姓名：">
            <el-input v-model="personInfo.name"  placeholder="请输成员姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="成员手机号：">
            <el-input v-model="personInfo.phone"  placeholder="请输入成员手机号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="所在区域：">
            <el-select v-model="personInfo.phone"  placeholder="请选择成员所在区域"></el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <p class="prompt">注：当你完成新增后，该用户可使用录入的手机号进行登录，默认密码为：<span>123456</span></p>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible = false">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      customClass: 'dialog-editor-person',
      title: '编辑人员',
      width: '450px',
      size: 'mini',
      originData: {},
      personInfo: {
        name: '',
        phone: '',
        area: ''
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
  /* dialog位于顶层，scoped局域是无法选中的， 所以最好定义dialog的类名 */
  .dialog-editor-person {
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
