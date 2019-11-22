<template>
  <div class="warp">
    <el-row>
      <el-col :gutter="20">
        <el-form :inline="true" class="demo-form-inline searchFrom">
          <el-row>
            <el-col :lg="8">
              <el-form-item label="系统版本号：">
                <el-input
                  v-model="searchForm.versionNumber"
                  placeholder="请输入系统版本号"
                  style="width: 108%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="8">
              <el-form-item label="更新时间：">
                <el-input v-model="searchForm.createTime" placeholder="请输入更新时间" style="width: 108%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="8">
              <el-form-item>
                <el-button type="primary" @click="getDataTable">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-button type="primary" @click="dialogFormVisible = true" style="margin-left:30px">新增系统日志</el-button>
    </el-row>
    <el-row style="margin-top: 20px;padding-left:30px">
      <el-table :data="dataTable" height="570" stripe>
        <el-table-column align="center" prop="versionNumber" label="系统版本号"></el-table-column>
        <el-table-column align="center" prop="createTime" label="更新时间"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              round
              @click="$refs.newnotedetail.dialogTableVisible=true;$refs.newnotedetail.Tid=scope.row.tid;hide(scope.row.tid)"
            >查看</el-button>
            <el-button type="text" size="mini" round @click="editDeviceInfo(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" round @click="deleteDevice(scope.row.tid)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        style="text-align: center;margin-top: 20px"
        @current-change="changePage"
        :current-page="pageIndex"
        :page-size="pageSize"
      ></el-pagination>
    </el-row>

    <!--新增弹窗-->
    <el-dialog
      title="新增系统版本日志"
      @open="initDialogFrom"
      :visible.sync="dialogFormVisible"
      style="border-radius: 10px;"
    >
      <hr style="margin-top: -30px; margin-bottom: 20px; opacity: .5;" />
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="addDevice" :rules="rules" ref="ruleForm">
            <el-form-item label="系统版本：" class="w45" prop="versionNumber">
              <el-input v-model="addDevice.versionNumber" placeholder="请输入" style="width: 108%;"></el-input>
            </el-form-item>
            <el-form-item label="更新时间：" class="w45" prop="createTime">
              <el-input v-model="addDevice.createTime" placeholder="请输入" style="width: 108%;"></el-input>
            </el-form-item>
            <el-form-item label="日志内容：" class="w45" prop="content">
              <el-input
                style="width:345%;"
                type="textarea"
                :rows="12"
                v-model="addDevice.content"
                placeholder="请输入..."
              ></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="24" style="text-align: center;margin-top: 45px">
                <el-button type="primary" @click="submitForm('ruleForm')">确认提交</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>

    <!--编辑设备弹窗-->
    <el-dialog
      title="编辑系统版本日志"
      @open="initDialogFrom"
      :visible.sync="editDialog"
      style="border-radius: 10px;"
    >
      <hr style="margin-top: -30px; margin-bottom: 20px; opacity: .5;" />
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="editDevice" :rules="rules" ref="editRuleForm">
            <el-form-item label="系统版本：" class="w45" prop="versionNumber">
              <el-input v-model="editDevice.versionNumber" placeholder="请输入" style="width: 108%;"></el-input>
            </el-form-item>
            <el-form-item label="更新时间：" class="w45" prop="createTime">
              <el-input v-model="editDevice.createTime" placeholder="请输入" style="width: 108%;"></el-input>
            </el-form-item>
            <el-form-item label="日志内容：" class="w45" prop="content">
              <el-input
                type="textarea"
                :rows="12"
                v-model="editDevice.content"
                placeholder="请输入..."
                style="width: 340%;"
              ></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="24" style="text-align: center;margin-top: 45px">
                <el-button type="primary" @click="submitEditForm('editRuleForm')">确认提交</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
    <newnote-detail ref="newnotedetail"></newnote-detail>
  </div>
</template>

<script>
import NewnoteDetail from './newnoteDetail'
export default {
  components: {
    NewnoteDetail
  },
  data() {
    return {
      pageIndex: 1,
      pageSize: 11,
      total: 0,
      dialogFormVisible: false,
      editDialog: false,

      searchForm: {
        createTime: '',
        versionNumber: ''
      },
      dataTable: [],
      addDevice: {
        content: '',
        createTime: '',
        versionNumber: ''
      },
      editDevice: {
        content: '',
        createTime: '',
        versionNumber: '',
        tid: 0
      },
      rules: {
        content: [{ required: true, message: '必填', trigger: 'blur' }],
        createTime: [{ required: true, message: '必填', trigger: 'blur' }],
        versionNumber: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getDataTable()
  },
  methods: {
    hide(tid) {
      console.log(tid)
    },
    // 关闭弹窗清空数据
    initDialogFrom() {
      // this.$refs['ruleForm'].resetFields()
      // this.$refs['editRuleForm'].resetFields()
    },
    // 获取表格数据
    getDataTable() {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        createTime: this.searchForm.createTime,
        versionNumber: this.searchForm.versionNumber
      }
      this.$http
        .post(this.$api.pageVersionLog, params)
        .then(res => {
          this.dataTable = res.data.data.records
          console.log(this.dataTable)
          this.total = res.data.data.total
          console.log(this.total)
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 分页事件
    changePage(page) {
      this.pageIndex = page
      this.getDataTable()
    },

    // 新增设备
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addSaveDevice()
        } else {
          return false
        }
      })
    },

    addSaveDevice() {
      this.$http
        .post(this.$api.saveRizhi, this.addDevice)
        .then(res => {
          console.log(res)
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }
          this.$message({
            message: '添加成功!',
            type: 'success'
          })
          this.getDataTable()
          this.dialogFormVisible = false
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 编辑设备
    editDeviceInfo(item) {
      this.editDialog = true
      this.editDevice.tid = item.tid
      this.editDevice.content = item.content
      this.editDevice.createTime = item.createTime
      this.editDevice.versionNumber = item.versionNumber
    },

    submitEditForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editSaveDevice()
        } else {
          return false
        }
      })
    },

    editSaveDevice() {
      this.$http
        .post(this.$api.saveRizhi, this.editDevice)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }
          this.$message.success('保存成功！')
          this.getDataTable()
          this.editDialog = false
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 删除
    deleteDevice(tid) {
      this.$confirm('删除后不能恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .get(this.$api.delete + tid)
            .then(res => {
              let result = res.data
              if (result.result === 'not_ok') {
                this.$message.error(result.error.message)
              }
              this.$message.success('删除成功')
              this.getDataTable()
              this.editDialog = false
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped lang="scss">
.pl-10 {
  padding-left: 10px;
}
.m-10 {
  margin: 10px;
  padding: 10px;
}
.p-10 {
  padding: 10px;
}
.warp {
  width: 100%;
  height: 100%;
}
.searchFrom {
  height: 80px;
  border-radius: 5px;
  margin: 10px;
  padding: 20px;
}
@media screen and(min-width:1200px) and(max-width:1600px) {
  .el-table {
    height: 300px !important;
    overflow: auto;
  }
}
.nameColor {
  color: #3559c7;
}
.w45 {
  width: 45%;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #8c939d;
}
.avatar-uploader-icon {
  font-size: 14px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  line-height: 84px;
  text-align: center;
}
.avatar {
  width: 100%;
  height: 100%;
  display: inline-block;
}
.el-upload--text {
  width: 84px;
  height: 84px;
}
</style>
