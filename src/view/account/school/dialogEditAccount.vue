<template>
  <!-- 编辑学校弹窗 -->
  <el-dialog
    title="编辑学校账号"
    :visible.sync="editSchoolDialog"
    @close="closeDialog"
    @open="getData"
    width="50%"
    style="border-radius: 10px;"
  >
    <hr style="margin-top: -30px; margin-bottom: 20px; opacity: .5;" />
    <el-form :inline="true">
      <h3 style="margin-bottom: 20px;">基础信息</h3>
      <el-form-item label="学校名称：" class="w45">
        <el-input v-model="editSchoolInfo.schoolName" placeholder="请输入学校名称" class="w108"></el-input>
      </el-form-item>
      <el-form-item label="负责人：" class="w45" label-position="right">
        <el-input v-model="editSchoolInfo.schoolMaster" placeholder="请输入负责人" class="w108"></el-input>
      </el-form-item>
      <el-form-item label="联系电话：" class="w45">
        <el-input v-model="editSchoolInfo.schoolPhone" placeholder="请输入联系电话" class="w108"></el-input>
      </el-form-item>
      <el-form-item label="学校地址：" class="w100">
        <selectArea :areaObj="areaObj" @areaObj="getAddress"></selectArea>
      </el-form-item>
      <el-form-item label="详细地址：" class="w100">
        <el-input v-model="editSchoolInfo.schoolAddress" placeholder="请输入详细地址"  style="width: 500px"></el-input>
      </el-form-item>
      <div>
        <el-button type="primary" @click="saveSchool">确认提交</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import selectArea from '../../../components/select/selectArea'
export default {
  components: {
    selectArea
  },
  props: {
    editSchoolInfo: {
      type: Object,
      default: function () {
        return {
          schoolMaster: '',
          schoolStatus: 0,
          schoolPhone: '',
          schoolAreacode: '',
          createTime: '',
          schoolType: '',
          agenceName: '',
          schoolAddress: '',
          schoolKind: '',
          schoolName: '',
          tid: 0
        }
      }
    }
  },
  data() {
    return {
      editSchoolDialog: false,
      areaObj: {
        city: '',
        county: '',
        town: '',
        village: ''
      },
      areaCodeArr: [] // 回显时记录每一层的code
    }
  },
  methods: {
    // 获取最后一级的code
    getAddress(code) {
      console.log('获取的地区信息', code)
      if (code.village !== '') {
        this.editSchoolInfo.schoolAreacode = code.village
      } else if (code.town !== '') {
        this.editSchoolInfo.schoolAreacode = code.town
      } else if (code.county !== '') {
        this.editSchoolInfo.schoolAreacode = code.county
      } else if (code.city !== '') {
        this.editSchoolInfo.schoolAreacode = code.city
      }
    },
    // 根据当前code查询父级code
    setAreaCode (code) {
      console.log('回显', code)
      if (code !== '520000000000' && code !== '') {
        this.areaCodeArr.push(code) // 记录本级code
        this.$http.get(this.$api.area + code)
          .then(res => {
            let preAreaCode = res.data.data.preAreaCode
            console.log('父级', preAreaCode)
            if (preAreaCode !== '520000000000' && preAreaCode) {
              this.setAreaCode(preAreaCode) // 递归到顶级
            } else {
              this.setCode(this.areaCodeArr.reverse())
              this.areaCodeArr = []
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    // 回显地区赋值
    setCode() {
      console.log('准备赋值', this.areaCodeArr)
      const len = this.areaCodeArr.length
      switch (len) {
        case 4:
          this.areaObj.city = this.areaCodeArr[0]
          this.areaObj.county = this.areaCodeArr[1]
          this.areaObj.town = this.areaCodeArr[2]
          this.areaObj.village = this.areaCodeArr[3]
          break
        case 3:
          this.areaObj.city = this.areaCodeArr[0]
          this.areaObj.county = this.areaCodeArr[1]
          this.areaObj.town = this.areaCodeArr[2]
          this.areaObj.village = ''
          break
        case 2:
          this.areaObj.city = this.areaCodeArr[0]
          this.areaObj.county = this.areaCodeArr[1]
          this.areaObj.town = ''
          this.areaObj.village = ''
          break
        case 1:
          this.areaObj.city = this.areaCodeArr[0]
          this.areaObj.county = ''
          this.areaObj.town = ''
          this.areaObj.village = ''
          break
        default:
          this.areaObj.city = ''
          this.areaObj.county = ''
          this.areaObj.town = ''
          this.areaObj.village = ''
          break
      }
    },
    // 保存编辑信息
    saveSchool() {
      delete this.editSchoolInfo.createTime
      // 发送请求
      this.$http
        .post(this.$api.update, this.editSchoolInfo)
        .then(res => {
          if (res.data.message) {
            let msg = res.data.message
            this.$message({
              message: msg,
              type: 'success'
            })
            this.closeDialog()
          } else {
            let errMsg = res.data.error.message
            this.$message({
              message: errMsg,
              type: 'error'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 关闭Dialog
    closeDialog() {
      // 清空列表
      this.editSchoolInfo = {
        schoolMaster: '',
        schoolStatus: 0,
        schoolPhone: '',
        schoolAreacode: '',
        createTime: '',
        schoolType: '',
        agenceName: '',
        schoolAddress: '',
        schoolKind: '',
        schoolName: ''
      }
      // 刷新父组件表格
      this.$emit('refreshTable')
    },
    getData () {
      this.setAreaCode(this.editSchoolInfo.schoolAreacode)
    }
  }
}
</script>

<style scoped lang="scss">
  .w45{
    width: 45%;
  }
  .w100{
    width: 100%;
  }

</style>
