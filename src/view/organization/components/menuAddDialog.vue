<template>
  <div>
    <!-- 政府 -->
    <el-dialog
      v-if="roler === 'gov'"
      title="新增区县"
      :visible.sync="dialogVisible"
      width="450px">
      <el-form :inline="true" class="add-form">
        <el-form-item label="区县名称：">
          <el-input placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item>
          <p>注: 当你完成新增后，可在该区县增加成员，则视为为该成员添加账号</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 学校
    <el-dialog v-else-if="roler === 'edu'" title="新建学校账号" :visible.sync="addSchoolDialog" @close="closeDialog" width="50%" style="border-radius: 10px;">
      <hr style="margin-top: -30px; margin-bottom: 20px; opacity: .5;">
      <el-form :inline="true">
        <h3 style="margin-bottom: 20px;">基础信息</h3>
        <el-form-item label="学校名称：" class="w45">
            <el-input v-model="addSchoolInfo.schoolName" placeholder="请输入就业岗位" class="w108"></el-input>
        </el-form-item>
        <el-form-item label="学校地址：" class="w45">
            <el-cascader
              :options="areaArr"
              @expand-change="handleItemChange"
              :props="props"
            ></el-cascader>
        </el-form-item>
        <el-form-item label="负责人：" class="w45" label-position="right">
            <el-input v-model="addSchoolInfo.schoolMastrer" placeholder="请输入负责人" class="w108"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" class="w45">
            <el-input v-model="addSchoolInfo.phone" placeholder="请输入联系电话" class="w108"></el-input>
        </el-form-item>
        <el-form-item label="详细地址：" class="w45">
            <el-input v-model="addSchoolInfo.phone" placeholder="请输入详细地址" class="w108"></el-input>
        </el-form-item>
        <div>
            <el-button type="primary" @click="saveSchool">确认提交</el-button>
        </div>
      </el-form>
    </el-dialog>
    -->
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
