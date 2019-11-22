<template>
  <el-dialog
    title="编辑就业信息"
    :visible.sync="dialogVisible"
    width="50%"
    style="border-radius: 10px;"
  >
    <hr style="margin-top: -30px; margin-bottom: 20px; opacity: .5;" />
    <el-row>
      <el-col :span="24">
        <el-form :inline="true">
          <h3 style="margin-bottom: 20px;">就业信息</h3>
          <el-col :span="12">
            <el-form-item label="就业岗位：">
              <el-input placeholder="请输入就业岗位" style="width: 108%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="就业时间：">
              <el-select v-model="value" placeholder="请选择">
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位名称：">
              <el-input placeholder="请输入单位名称" style="width: 108%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="就业渠道：">
              <el-select v-model="value" placeholder="请选择">
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="就业地址：">
              <el-input placeholder="请输入就业地址" style="width: 108%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="月收入：">
              <el-input placeholder="请输入月收入" type="number" style="width: 108%;"></el-input>
            </el-form-item>
          </el-col>
          <h3 style="margin-bottom: 20px;">就业证明</h3>
          <el-row>
            <el-col :span="24">
              <div class="uplodeBox">
                <div>
                  <el-upload
                    class="avatar-uploader"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :show-file-list="false"
                  >
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <img v-else src="@/assets/img/photo.png" class="avatar" />
                  </el-upload>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="text-align: left;margin-top: 45px">
              <el-button type="primary">确认提交</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <!--<div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
    </div>-->
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      value: '',
      imageUrl: ''
    }
  }
}
</script>
