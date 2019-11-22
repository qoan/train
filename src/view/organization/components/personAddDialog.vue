<template>
  <div>
    <!-- 政府 -->
    <el-dialog
      v-if="roler === 'gov'"
      title="新增人员"
      :visible.sync="dialogVisible"
      width="450px">
      <el-form :inline="true" class="add-form">
        <el-form-item label="人员名称：">
          <el-input placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <p>注: 当你完成新增后，该用户可使用录入的手机号进行登录，默认密码为：123456</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 学校 -->
    <el-dialog
      v-if="roler === 'edu'"
      title="新增人员"
      :visible.sync="dialogVisible"
      width="500px">
      <el-form :inline="true" class="add-form">
        <el-form-item label="人员名称：">
          <el-input placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <p>注: 当你完成新增后，该用户可使用录入的手机号进行登录，默认密码为：123456</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roler: '',
      dialogVisible: false
    }
  },
  created () {
    this.roler = sessionStorage.getItem('roler')
  }
}
</script>
