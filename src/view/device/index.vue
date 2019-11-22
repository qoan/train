<template>
  <div class="warp">
    <el-row>
      <el-col :gutter="20">
        <el-form :inline="true" class="demo-form-inline searchFrom">
          <el-row>
            <el-col :lg="8">
              <el-form-item label="设备名称：">
                <el-input v-model="searchForm.deviceName" placeholder="请输入设备名称" style="width: 108%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="8">
              <el-form-item label="设备编号：">
                <el-input
                  v-model="searchForm.deviceNumber"
                  placeholder="请输入设备编号"
                  style="width: 108%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="8">
              <el-form-item label="设备序列号：">
                <el-input
                  v-model="searchForm.deviceSerial"
                  placeholder="请输入设备序列号"
                  style="width: 108%"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :lg="8">
              <el-form-item label="设备状态：">
                <el-select v-model="searchForm.deviceState" placeholder="请选择">
                  <el-option
                    v-for="item in device"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
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
      <el-button type="primary" @click="dialogFormVisible = true" style="margin-left:30px">新增设备</el-button>
    </el-row>
    <el-row style="margin-top: 20px;padding-left:30px">
      <el-table :data="dataTable" height="570" stripe>
        <el-table-column align="center" prop="deviceName" label="设备名称"></el-table-column>
        <el-table-column align="center" prop="deviceNumber" label="设备编号"></el-table-column>
        <el-table-column align="center" prop="deviceSerial" label="设备序列号"></el-table-column>
        <el-table-column align="center" prop="deviceState" label="设备状态">
          <template slot-scope="scope">
            <span
              v-if="scope.row.deviceState === '使用中'"
              style="color:#7ED321"
            >{{ scope.row.deviceState }}</span>
            <span
              v-else-if="scope.row.deviceState === '空闲'"
              style="color: #409EFF"
            >{{ scope.row.deviceState }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="className" label="使用班级"></el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" round @click="editDeviceInfo(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" round @click="deleteDevice(scope.row.tid)">删除设备</el-button>
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

    <!--新增设备弹窗-->
    <el-dialog
      title="新增设备"
      @open="initDialogFrom"
      :visible.sync="dialogFormVisible"
      width="50%"
      style="border-radius: 10px;"
    >
      <hr style="margin-top: -30px; margin-bottom: 20px; opacity: .5;" />
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="addDevice" :rules="rules" ref="ruleForm">
            <el-form-item label="设备名称：" class="w45" prop="deviceName">
              <el-input v-model="addDevice.deviceName" placeholder="请输入设备名称" style="width: 108%;"></el-input>
            </el-form-item>
            <el-form-item label="设备序列号：" class="w45" prop="deviceSerial">
              <el-input
                v-model="addDevice.deviceSerial"
                placeholder="请输入设备序列号"
                style="width: 108%;"
              ></el-input>
            </el-form-item>
            <el-form-item label="设备编号：" class="w45" prop="deviceNumber">
              <el-input v-model="addDevice.deviceNumber" placeholder="请输入设备编号" style="width: 108%;"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="24" style="text-align: left;margin-top: 45px">
                <el-button type="primary" @click="submitForm('ruleForm')">确认提交</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>

    <!--编辑设备弹窗-->
    <el-dialog
      title="编辑设备"
      @open="initDialogFrom"
      :visible.sync="editDialog"
      width="50%"
      style="border-radius: 10px;"
    >
      <hr style="margin-top: -30px; margin-bottom: 20px; opacity: .5;" />
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="editDevice" :rules="rules" ref="editRuleForm">
            <el-form-item label="设备名称：" class="w45" prop="deviceName">
              <el-input v-model="editDevice.deviceName" placeholder="请输入设备名称" style="width: 108%;"></el-input>
            </el-form-item>
            <el-form-item label="设备序列号：" class="w45" prop="deviceSerial">
              <el-input
                v-model="editDevice.deviceSerial"
                placeholder="请输入设备序列号"
                style="width: 108%;"
              ></el-input>
            </el-form-item>
            <el-form-item label="设备编号：" class="w45" prop="deviceNumber">
              <el-input
                v-model="editDevice.deviceNumber"
                placeholder="请输入设备编号"
                style="width: 108%;"
              ></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="24" style="text-align: left;margin-top: 45px">
                <el-button type="primary" @click="submitEditForm('editRuleForm')">确认提交</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageIndex: 1,
      pageSize: 11,
      total: 0,
      dialogFormVisible: false,
      editDialog: false,
      device: [
        {
          label: '请选择',
          value: 0
        },
        {
          label: '使用中',
          value: 1
        },
        {
          label: '空闲',
          value: 2
        }
      ],
      searchForm: {
        deviceName: '',
        deviceNumber: '',
        deviceSerial: '',
        deviceState: 0,
        pageIndex: 0,
        pageSize: 0
      },
      dataTable: [],
      addDevice: {
        deviceName: '',
        deviceNumber: '',
        deviceSerial: ''
      },
      editDevice: {
        deviceName: '',
        deviceNumber: '',
        deviceSerial: '',
        tid: 0
      },
      rules: {
        deviceName: [{ required: true, message: '必填', trigger: 'blur' }],
        deviceNumber: [{ required: true, message: '必填', trigger: 'blur' }],
        deviceSerial: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getDataTable()
  },
  methods: {
    // 关闭弹窗清空数据
    initDialogFrom() {
      this.$refs['ruleForm'].resetFields()
      this.$refs['editRuleForm'].resetFields()
    },
    // 获取表格数据
    getDataTable() {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        deviceName: this.searchForm.deviceName,
        deviceNumber: this.searchForm.deviceNumber,
        deviceSerial: this.searchForm.deviceSerial,
        deviceState: this.searchForm.deviceState
      }
      this.$http
        .post(this.$api.pageDevice, params)
        .then(res => {
          this.dataTable = res.data.data.records
          console.log(res)
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
        .post(this.$api.deviceSave, this.addDevice)
        .then(res => {
          this.$message.success('保存成功！')
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
      this.editDevice.deviceName = item.deviceName
      this.editDevice.deviceNumber = item.deviceNumber
      this.editDevice.deviceSerial = item.deviceSerial
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
        .post(this.$api.deviceUpdate, this.editDevice)
        .then(res => {
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
      this.$http
        .post(this.$api.deviceDelete + tid)
        .then(res => {
          let result = res.data
          if (result.result === 'not_ok') {
            this.$message.error(result.error.message)
          } else {
            this.$message.success(result.message)
          }

          this.getDataTable()
          this.editDialog = false
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
