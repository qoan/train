<template>
  <div class="warp">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" class="demo-form-inline searchFrom">
          <el-row>
            <el-col :lg="8">
              <el-form-item label="班级名称：">
                <el-input v-model="searchForm.className" placeholder="请输入班级名称" style="width: 108%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="8">
              <el-form-item label="设备名称：">
                <el-input v-model="searchForm.deviceName" placeholder="请输入设备名称" style="width: 108%"></el-input>
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
              <el-form-item label="设备编号：">
                <el-input
                  v-model="searchForm.deviceNumber"
                  placeholder="请输入设备编号"
                  style="width: 108%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="8">
              <el-form-item label="设备状态：">
                <el-select v-model="searchForm.useState" placeholder="请选择">
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
      <el-button type="primary" @click="dialogFormVisible = true" style="margin-left:30px">设备绑定</el-button>
    </el-row>
    <el-row style="margin-top: 20px;padding-left:30px">
      <el-table :data="dataTables" height="570" stripe>
        <el-table-column align="center" prop="className" label="班级名称"></el-table-column>
        <el-table-column align="center" prop="deviceName" label="绑定设备名称"></el-table-column>
        <el-table-column align="center" prop="deviceNumber" label="设备编号"></el-table-column>
        <el-table-column align="center" prop="deviceSerial" label="设备序列号"></el-table-column>
        <el-table-column align="center" prop="startTime" label="起始时间"></el-table-column>
        <el-table-column align="center" prop="endTime" label="结束时间"></el-table-column>
        <el-table-column align="center" prop="useMonth" label="使用月份"></el-table-column>
        <el-table-column align="center" prop="useState" label="使用状态">
          <template slot-scope="scope">
            <span v-if="scope.row.useState === '使用中'" style="color:#7ED321">{{ scope.row.useState }}</span>
            <span
              v-else-if="scope.row.useState === '过期'"
              style="color: #FFBC4C"
            >{{ scope.row.useState }}</span>
            <span
              v-else-if="scope.row.useState === '停用'"
              style="color: #F56C6C"
            >{{ scope.row.useState }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.useState === '使用中' "
              type="text"
              size="mini"
              round
              @click="replaceDeviceFun(scope.row)"
            >更换</el-button>
            <el-button
              v-if="scope.row.useState === '使用中' "
              type="text"
              size="mini"
              round
              @click="stopDeviceFun(scope.row)"
            >停用</el-button>
            <el-button
              v-if="scope.row.useState === '过期' "
              type="text"
              size="mini"
              round
              @click="relatDeviceFun(scope.row)"
            >续租</el-button>
            <el-button
              v-if="scope.row.useState === '停用' "
              type="text"
              size="mini"
              round
              @click="openDeviceFun(scope.row)"
            >恢复</el-button>
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

    <!--设备绑定弹窗-->
    <el-dialog
      title="设备绑定"
      @open="initDialogFrom"
      :visible.sync="dialogFormVisible"
      width="50%"
      style="border-radius: 10px;"
    >
      <hr style="margin-top: -30px; margin-bottom: 20px; opacity: .5;" />
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="bindDevice" :rules="rules" ref="bindDevice">
            <el-form-item label="选择班级：" class="w45" prop="className">
              <el-select v-model="classObj" placeholder="请选择" @change="setClassInfo">
                <el-option
                  v-for="item in classListArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择设备：" class="w45" label-width="109px" prop="deviceSerial">
              <el-select v-model="bindDevice.deviceSerial" placeholder="请选择">
                <el-option
                  v-for="item in deviceArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="起止时间：" class="w45" required>
              <el-date-picker
                @change="setDateInfo"
                style="width: 220px"
                v-model="dateArr"
                value-format="yyyy/MM/dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="使用月份：" label-width="109px" prop="useMonth">
              <el-input v-model="bindDevice.useMonth" style="width: 108%;"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="24" style="text-align: left;margin-top: 45px">
                <el-button type="primary" @click="submitBindDeviceForm('bindDevice')">确认提交</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>

    <!--更换设备弹窗-->
    <el-dialog title="更换设备" :visible.sync="editDialog" width="50%" style="border-radius: 10px;">
      <hr style="margin-top: -30px; margin-bottom: 20px; opacity: .5;" />
      <el-row>
        <el-col :span="24">
          <div class="replaceBox">
            <p>班级名称：{{editDevice.className}}</p>
            <p>
              <span>原始设备：{{editDevice.deviceName}}</span>
              <span>设备编号：{{editDevice.deviceNumber}}</span>
              <span>设备序列号：{{editDevice.deviceSerial}}</span>
            </p>
            <p>
              <span>
                <i style="color: red">*</i>
                更换设备：
                <el-select v-model="editDeviceObj" placeholder="请选择" style="width: 150px">
                  <el-option
                    v-for="item in deviceArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item"
                  ></el-option>
                </el-select>
              </span>
              <span>设备编号：{{editDeviceObj.deviceNumber}}</span>
              <span>设备序列号：{{editDeviceObj.value}}</span>
            </p>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: left;margin-top: 45px">
          <el-button type="primary" @click="submitReplace">确认提交</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!--续租设备弹窗-->
    <el-dialog title="续租设备" :visible.sync="renewalDialog" width="50%" style="border-radius: 10px;">
      <hr style="margin-top: -30px; margin-bottom: 20px; opacity: .5;" />
      <el-row>
        <el-col :span="24">
          <div class="replaceBox">
            <el-form :inline="true" :model="reletDeviceObj" :rules="rules" ref="reletDeviceObj">
              <el-form-item label="班级名称：" class="w45">
                <span>{{reletDeviceObj.className}}</span>
              </el-form-item>
              <el-form-item label="选择设备：" prop="deviceSerial">
                <el-select
                  v-model="reletDeviceObj.deviceSerial"
                  @change="reletSelectDeviceFun"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in deviceArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设备编号：" class="w45">
                <span>{{reletDeviceObj.deviceNumber}}</span>
              </el-form-item>
              <el-form-item label="设备序列号：" class="w45">
                <span>{{reletDeviceObj.deviceSerial}}</span>
              </el-form-item>
              <el-form-item label="起止时间：" required class="w45">
                <el-date-picker
                  @change="setReletDateInfo"
                  v-model="relatDate"
                  style="width: 220px"
                  value-format="yyyy/MM/dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="使用月份：" prop="useMonth">
                <el-input v-model="reletDeviceObj.useMonth" style="width: 220px"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: left;margin-top: 45px">
          <el-button type="primary" @click="submitRelatFrom('reletDeviceObj')">确认提交</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogFormVisible: false,
      editDialog: false,
      renewalDialog: false,
      pageIndex: 1,
      pageSize: 12,
      total: 0,
      searchForm: {
        className: '',
        deviceName: '',
        deviceNumber: '',
        deviceSerial: '',
        pageIndex: 0,
        pageSize: 0,
        useState: 0
      },
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
          label: '过期',
          value: 2
        },
        {
          label: '停用',
          value: 3
        }
      ],
      dataTables: [],
      bindDevice: {
        className: '',
        classTid: 0,
        deviceSerial: '',
        endTime: '',
        startTime: '',
        useMonth: 0
      },
      classObj: {}, // 用于拆分班级名称和ID
      classListArr: [],
      dateArr: [], // 起止时间
      deviceArr: [], // 设备列表
      editDevice: {
        className: '',
        classTid: 0,
        deviceNumber: '',
        deviceSerial: '',
        endTime: '',
        startTime: '',
        useMonth: 0
      },
      editDeviceObj: {}, // 保存编辑的设备对象，用于赋值
      // 续租对象
      reletDeviceObj: {
        className: '',
        classTid: 0,
        deviceNumber: '',
        deviceSerial: '',
        endTime: '',
        startTime: '',
        useMonth: 0
      },
      relatDate: [],
      rules: {
        className: [{ required: true, message: '必填', trigger: 'blur' }],
        deviceSerial: [{ required: true, message: '必填', trigger: 'blur' }],
        useMonth: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getDataTable()
    this.getBaseInfoList()
    this.getDeviceList()
  },
  methods: {
    // 关闭弹窗清空数据
    initDialogFrom() {
      this.classObj = {}
      this.dateArr = []
      this.$refs['bindDevice'].resetFields()
    },

    // 续租设备
    relatDeviceFun(item) {
      this.renewalDialog = true
      this.reletDeviceObj = item
      this.relatDate[0] = item.startTime
      this.relatDate[1] = item.endTime
    },

    submitRelatFrom(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submitRelatFun()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    submitRelatFun() {
      let params = {
        classTid: this.reletDeviceObj.classTid,
        deviceSerial: this.reletDeviceObj.deviceSerial,
        endTime: this.relatDate[0],
        startTime: this.relatDate[1],
        useMonth: this.reletDeviceObj.useMonth
      }

      this.$http
        .post(this.$api.relet, params)
        .then(res => {
          if (res.data.result === 'not_ok') {
            this.$message.error(res.data.error.message)
          } else {
            this.$message.success(res.data.message)
          }
          this.getDataTable()
          this.getDeviceList()
          this.renewalDialog = false
        })
        .catch(err => {
          console.log(err)
        })
    },

    reletSelectDeviceFun(code) {
      this.deviceArr.forEach((item, index) => {
        if (item.value === code) {
          this.reletDeviceObj.deviceNumber = item.deviceNumber
        }
      })
    },

    // 设置续租起止日期
    setReletDateInfo() {
      let start = this.relatDate[0].split('/')
      let end = this.relatDate[1].split('/')
      let startDate = parseInt(start[0]) * 12 + parseInt(start[1])
      let endDate = parseInt(end[0]) * 12 + parseInt(end[1])
      this.reletDeviceObj.useMonth = parseInt(endDate) - parseInt(startDate) > 0 ? parseInt(endDate) - parseInt(startDate) : 1
    },

    // 启用设备
    openDeviceFun(item) {
      this.$http
        .get(this.$api.updateState + item.deviceSerial + '/' + 1)
        .then(res => {
          if (res.data.result === 'not_ok') {
            this.$message.error(res.data.error.message)
          } else {
            this.$message.success(res.data.message)
          }
          this.getDataTable()
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 停用设备
    stopDeviceFun(item) {
      this.$http
        .get(this.$api.updateState + item.deviceSerial + '/' + 3)
        .then(res => {
          if (res.data.result === 'not_ok') {
            this.$message.error(res.data.error.message)
          } else {
            this.$message.success(res.data.message)
          }
          this.getDataTable()
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 更换设备
    replaceDeviceFun(item) {
      this.editDialog = true
      this.editDevice = item
    },

    submitReplace() {
      if (!this.editDeviceObj.value) {
        this.$message.warning('请选择需要替换的设备')
        return
      }

      let params = {
        classTid: this.editDevice.classTid,
        deviceSerial: this.editDeviceObj.value
      }

      this.$http
        .post(this.$api.change, params)
        .then(res => {
          if (res.data.result === 'not_ok') {
            this.$message.error(res.data.error.message)
          } else {
            this.$message.success(res.data.message)
          }
          this.getDataTable()
          this.getDeviceList()
          this.editDialog = false
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 绑定设备
    submitBindDeviceForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bindDeviceFun()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    bindDeviceFun() {
      this.$http
        .post(this.$api.bind, this.bindDevice)
        .then(res => {
          if (res.data.result === 'not_ok') {
            this.$message.error(res.data.error.message)
          } else {
            this.$message.success(res.data.message)
          }
          this.getDataTable()
          this.getDeviceList()
          this.dialogFormVisible = false
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 获取表格数据
    getDataTable() {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        deviceName: this.searchForm.deviceName,
        deviceNumber: this.searchForm.deviceNumber,
        deviceSerial: this.searchForm.deviceSerial,
        useState: this.searchForm.useState,
        className: this.searchForm.className
      }
      this.$http
        .post(this.$api.pageDeviceClass, params)
        .then(res => {
          this.dataTables = res.data.data.records
          this.total = res.data.data.total
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

    // 获取班级列表
    getBaseInfoList() {
      this.$http
        .get(this.$api.getFreeClass)
        .then(res => {
          let result = res.data.data
          this.classListArr = []
          // 遍历所有班级名称
          result.forEach((item, index) => {
            let obj = {
              label: item.className,
              value: item.classId
            }
            this.classListArr.push(obj)
          })
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 设置班级信息
    setClassInfo() {
      this.bindDevice.className = this.classObj.label
      this.bindDevice.classTid = this.classObj.value
    },

    // 设置起止日期
    setDateInfo() {
      this.bindDevice.startTime = this.dateArr[0]
      this.bindDevice.endTime = this.dateArr[1]
      let start = this.dateArr[0].split('/')
      let startDate = parseInt(start[0]) * 12 + parseInt(start[1])
      let end = this.dateArr[1].split('/')
      let endDate = parseInt(end[0]) * 12 + parseInt(end[1])
      this.bindDevice.useMonth = parseInt(endDate) - parseInt(startDate) > 0 ? parseInt(endDate) - parseInt(startDate) : 1
    },

    // 获取设备列表
    getDeviceList() {
      this.$http
        .get(this.$api.getFreeDevice)
        .then(res => {
          let result = res.data.data
          this.deviceArr = []
          // 遍历所有班级名称
          result.forEach((item, index) => {
            let obj = {
              label: item.deviceName,
              value: item.deviceSerial,
              deviceNumber: item.deviceNumber
            }
            this.deviceArr.push(obj)
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
.replaceBox {
  p {
    display: flex;
    line-height: 50px;
    span {
      flex: 1;
    }
  }
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
