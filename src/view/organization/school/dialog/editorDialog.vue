<template>
  <el-dialog
    @open="open()"
    :custom-class="customClass"
    :visible.sync="dialogVisible"
    :width="width"
    :title="title"
  >
    <el-form class="serachForm" :size="size" v-loading="loading">
      <!--- 第一栏 -->
      <el-row :gutter="40">
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="分校名称：">
            <el-input v-model="formData.schoolName" placeholder="请输入学校名称"></el-input>
          </el-form-item>
        </el-col>

        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="机构地址：">
            <el-input
              placeholder="请选择所在区域"
              v-model="formData.schoolAreacode.fullName"
              @focus="$refs.tabAreaSelect.visible=true"
            ></el-input>
            <tab-area-select ref="tabAreaSelect" :areaData="formData.schoolAreacode"></tab-area-select>
          </el-form-item>
        </el-col>

        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="详细地址：">
            <el-input v-model="formData.schoolAddress" placeholder="请输入详细地址"></el-input>
          </el-form-item>
        </el-col>

        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="负责人：">
            <el-input v-model="formData.schoolMaster" placeholder="请输入负责人"></el-input>
          </el-form-item>
        </el-col>

        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="联系电话：">
            <el-input v-model="formData.schoolPhone" disabled placeholder="请输入联系电话"></el-input>
          </el-form-item>
        </el-col>

        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="学校性质：">
            <el-select v-model="formData.schoolKindTid" placeholder="请选择学校性质">
              <el-option
                v-for="item in schoolKindEnumList"
                :key="item.tid"
                :label="item.enumerValue"
                :value="item.tid"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="学校类型：">
            <el-select v-model="formData.schoolTypeTid" placeholder="请选择学校类型">
              <el-option
                v-for="item in schoolTypeEnumList"
                :key="item.tid"
                :label="item.enumerValue"
                :value="item.tid"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="主管部门：">
            <el-select v-model="formData.agenceTid" placeholder="请选择主管部门">
              <el-option
                v-for="item in agenceList"
                :key="item.tid"
                :label="item.agenceName"
                :value="item.tid"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        :loading="submitLoading"
        @click="updateSlaveSchoolInfo()"
      >{{submitLoading ? '执行中' : '更 改'}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import TabAreaSelect from '@/components/select/TabAreaSelect'
export default {
  components: {
    TabAreaSelect
  },
  data() {
    return {
      dialogVisible: false,
      customClass: 'dialog-add-slave-school',
      title: '编辑分校',
      width: '40%',
      size: 'mini',
      loading: false,
      submitLoading: false,
      tid: null,
      formData: {
        schoolName: null,
        schoolMaster: null,
        schoolAddress: null,
        schoolPhone: null,
        schoolKindTid: null,
        schoolTypeTid: null,
        agenceTid: null,
        schoolAreacode: {
          // 区域地址码
          province: '',
          city: '',
          county: '',
          fullName: '',
          lastLevel: ''
        }
      },
      schoolKindEnumList: [],
      schoolTypeEnumList: [],
      agenceList: []
    }
  },
  watch: {
    /*
    // 详细地址跟随区域地址变化
    'formData.schoolAreacode.fullName': {
      handler (val, oldval) {
        this.formData.schoolAddress = val.replace(/\//g, '')
      }
    },
    'formData.schoolAreacode.schoolArea': {
      handler (val, oldval) {
        this.formData.schoolArea = val
      }
    }
    */
  },
  methods: {
    // 回调 - dialog打开时
    open() {
      this.getAgenceList()
      this.findById().then(data => {
        console.log(data)
        this.formData.schoolName = data.schoolName
        this.formData.schoolMaster = data.schoolMaster
        this.formData.schoolPhone = data.schoolPhone
        this.formData.schoolKindTid = data.schoolKindTid
        this.formData.schoolTypeTid = data.schoolTypeTid
        this.formData.agenceTid = data.agenceTid
        this.formData.schoolAddress = data.schoolAddress
        this.formData.schoolArea = data.schoolAreacode
        this.getArea(data.schoolAreacode).then(res => {
          this.formData.schoolAreacode = {
            province: '',
            city: '',
            county: '',
            fullName: res.areaFullname,
            lastLevel: {
              areaCode: data.schoolAreacode
            }
          }
        })
      })
      this.schoolKindEnumList = JSON.parse(sessionStorage.getItem('school_kind') || '[]')
      this.schoolTypeEnumList = JSON.parse(sessionStorage.getItem('school_type') || '[]')
    },
    // 请求 - 修改学校信息
    updateSlaveSchoolInfo() {
      this.submitLoading = true
      return this.axios
        .post(this.$api.updateSlaveSchoolInfo, {
          agenceTid: this.formData.agenceTid,
          schoolAddress: this.formData.schoolAddress,
          schoolAreacode: this.formData.schoolAreacode.lastLevel.areaCode,
          schoolKindTid: this.formData.schoolKindTid,
          schoolMaster: this.formData.schoolMaster,
          schoolName: this.formData.schoolName,
          // schoolPhone: this.formData.schoolPhone,
          schoolTypeTid: this.formData.schoolTypeTid,
          tid: this.tid
        })
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }

          this.$message({
            message: '修改成功!',
            type: 'success'
          })

          this.dialogVisible = false
          this.$emit('submitOk')
          return res.data.data
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.submitLoading = false
        })
    },
    // 请求 - 获取政府机构
    getAgenceList() {
      return this.axios
        .get(this.$api.getAgenceList)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }
          this.agenceList = res.data.data
          return res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 请求 - 获取学校信息
    findById() {
      this.loading = true
      return this.axios
        .get(this.$api.findById + `?tid=${this.tid}`)
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
        .finally(() => {
          this.loading = false
        })
    },
    // 根据地址码获取详细地址
    getArea(areaCode) {
      return this.axios
        .get(this.$api.area + areaCode)
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

<style lang="scss">
/* dialog位于顶层，scoped局域是无法选中的， 所以最好定义dialog的类名 */
.dialog-add-slave-school {
  .el-dialog__header {
    border-bottom: 1px solid #f7f7f7;
  }
  .el-dialog__body {
    padding-left: 40px;
    padding-right: 40px;
  }
}

.el-form {
  .el-form-item {
    display: flex;
    flex-flow: row nowrap;
    label {
      width: 90px;
    }
    .el-form-item__content {
      flex: 1;
      .el-input {
        width: 100%;
      }
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

.el-row {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
