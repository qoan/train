<template>
  <el-dialog :visible.sync="dialogVisible" width="900px" title="培训经费计算器" @open="getClassDetail">
    <hr style="margin-top: -30px; margin-bottom: 20px; opacity: .5;" />
    <div v-loading="loading">
      <el-row :gutter="60">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            培训工种：
            <span>{{computerClass.workType}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            培训层次：
            <span>{{computerClass.trainLevel}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            培训课时：
            <span>{{computerClass | getTrainTime}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="60">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            培训时间：
            <span>{{computerClass.trainDateStart}}至{{computerClass.trainDateEnd}}</span>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="grid-content bg-purple">
            培训地点：
            <span>{{computerClass.classAddress}}</span>
          </div>
        </el-col>
      </el-row>
      <div class="contaier">
        <span class="title">培训补贴标准：</span>
        <div class="contaier-one">
          <span>贫困户补助标准</span>
          <span>
            <input
              class="Moneryinput"
              v-model="trainPrice.liveStandard"
              type="text"
              placeholder="请输入补助标准"
            />
          </span>
          <span style="margin-left:225px">培训补贴标准</span>
          <span>
            <input
              class="Moneryinput"
              v-model="trainPrice.trainStandard"
              type="text"
              placeholder="请输入补贴标准"
            />
          </span>
        </div>
        <span class="title">学员考核情况：</span>
        <div class="contaier-one">
          <span>班级申报人数</span>
          <span>
            <input v-model="computerList.studentCount" type="text" placeholder="请输入人数" />
          </span>
          <span>实际培训人数</span>
          <span>
            <input v-model="computerList.studentCountTrue" type="text" placeholder="请输入人数" />
          </span>
          <span>参加考核人数</span>
          <span>
            <input v-model="computerList.studentCountTrue" type="text" placeholder="请输入人数" />
          </span>
          <span>建档立卡贫困户人数</span>
          <span>
            <input v-model="computerList.poorCount" type="text" placeholder="请输入人数" />
          </span>
        </div>
        <div class="contaier-one">
          <span>考核合格人数</span>
          <span>
            <input v-model="computerList.passCount" type="text" placeholder="请输入人数" />
          </span>
          <span>就业创业人数</span>
          <span>
            <input v-model="computerList.employmentCount" type="text" placeholder="请输入人数" />
          </span>

          <span style="border:none!important">
            <el-button style="margin-left:153px" type="primary" @click="Calculato">开始计算</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
          </span>
        </div>
        <h3>申请培训补贴金额</h3>
        <table cellspacing="0" cellpadding="0" id="out-table">
          <tr>
            <th>项目/金额</th>
            <th>补贴标准(元/人)</th>
            <th>补贴人数(人)</th>
            <th>培训天数(天)</th>
            <th>补贴金额(元)</th>
          </tr>
          <tr>
            <td>生活补助(仅建档立卡贫困户)</td>
            <td>{{trainPrice.liveStandard||0}}元/人</td>
            <td>{{computerList.poorCount}}人</td>
            <td>{{iDays}}天</td>
            <td>{{trainPrice.liveTotal}}元</td>
          </tr>
          <tr>
            <td>培训补贴</td>
            <td>{{trainPrice.trainStandard||0}}元/人</td>
            <td>{{computerList.passCount}}人</td>
            <td>{{iDays}}天</td>
            <td>{{trainPrice.trainTotal}}元</td>
          </tr>
          <tr>
            <td>合计</td>
            <td colspan="4" align="center">{{trainPrice.total}}元/人</td>
          </tr>
        </table>
      </div>

      <a
        @click="exportExcel"
        class="el-button el-button--small el-button--primary"
        style="margin-top:20px"
      >导出培训经费申请表</a>
    </div>
  </el-dialog>
</template>
<script>
import ClassModel from '@/model/class'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  name: '',
  data() {
    return {
      loading: false,
      dialogVisible: false,
      tid: 0,
      computerClass: {},
      iDays: 0,
      computerList: {
        employmentCount: 0,
        passCount: 0,
        studentCount: 0,
        studentCountTrue: 0,
        poorCount: 0
      },
      trainPrice: {
        liveStandard: '',
        liveTotal: 0,
        total: 0,
        trainStandard: '',
        trainTotal: 0
      }
    }
  },
  filters: {
    getTrainTime(computerClass) {
      if (!computerClass) return '无'
      return `理论${computerClass.theoryCount}节，实操${computerClass.practiceCount}节`
    }
  },
  methods: {
    // 计算价格
    Calculato() {
      this.trainPrice.liveTotal = this.trainPrice.liveStandard * this.computerList.poorCount * this.iDays
      this.trainPrice.trainTotal = this.trainPrice.trainStandard * this.computerList.passCount * this.iDays
      this.trainPrice.total = this.trainPrice.liveTotal + this.trainPrice.trainTotal
    },
    // 重置
    reset() {
      this.axios
        .get(this.$api.findTrueCountbyClassId + this.tid)
        .then(res => {
          if (res.data.result === 'not_ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }
          this.computerList = res.data.data
          console.log(this.computerList)
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
      this.trainPrice.liveStandard = ''
      this.trainPrice.trainStandard = ''
      this.trainPrice.liveTotal = 0
      this.trainPrice.trainTotal = 0
      this.trainPrice.total = 0
    },
    getClassDetail() {
      this.tid = this.$route.query.tid
      this.loading = true
      ClassModel.getClassInfo({
        classId: this.$route.query.tid
      })
        .then(res => {
          this.computerClass = res
          console.log(res)
          // let dateSpan, tempDate, iDays
          // let sDate1 = Date.parse(res.trainDateStart)
          // let sDate2 = Date.parse(res.trainDateEnd)
          // dateSpan = sDate2 - sDate1
          // dateSpan = Math.abs(dateSpan)
          // iDays = Math.floor(dateSpan / (24 * 3600 * 1000))
          // return (this.iDays = iDays)
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
      this.axios
        .get(this.$api.findTrainCountbyClassId + this.tid)
        .then(res => {
          if (res.data.result === 'not_ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }
          this.computerList = res.data.data
          console.log(this.computerList)
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
      this.axios
        .post(this.$api.getTrainTotalDaysByClassId + this.tid)
        .then(res => {
          let result = res.data.data
          this.iDays = result || 0
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 导出表
    // exportExcel() {
    //   let params = {}
    //   params.practiceCount = this.computerClass.practiceCount
    //   params.theoryCount = this.computerClass.theoryCount
    //   params.trainAddress = this.computerClass.trainAddress
    //   params.trainCount = this.computerList
    //   params.trainDateEnd = this.computerClass.trainDateEnd
    //   params.trainDateStart = this.computerClass.trainDateStart
    //   params.trainLevel = this.computerClass.trainLevel
    //   params.trainType = this.computerClass.trainType
    //   params.workType = this.computerClass.workType
    //   params.trainPrice = this.trainPrice
    //   this.axios.post(this.$api.exportTrainPay, params).then(res => {
    //     console.log(res)
    //   })
    // }
    exportExcel() {
      //按村导出人员
      let params = {}
      params.practiceCount = this.computerClass.practiceCount
      params.theoryCount = this.computerClass.theoryCount
      params.trainAddress = this.computerClass.trainAddress
      params.trainCount = this.computerList
      params.trainDateEnd = this.computerClass.trainDateEnd
      params.trainDateStart = this.computerClass.trainDateStart
      params.trainLevel = this.computerClass.trainLevel
      params.trainType = this.computerClass.trainType
      params.workType = this.computerClass.workType
      params.trainPrice = this.trainPrice
      this.$http
        .post(this.$api.exportTrainPay, params, {
          responseType: 'blob'
        })
        .then(res => {
          console.log(res, 'res')
          this.popDownLoadBox(res.data, '培训经费表.xls')
        })
    },
    popDownLoadBox(data, filename) {
      if (data) {
        var blob = new Blob([data])
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, filename)
        } else {
          var a = document.createElement('a')
          a.download = filename
          a.href = window.URL.createObjectURL(blob)
          a.click()
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.contaier {
  width: 855px;
  height: 440px;
  background: #f5f7fd;
  margin-top: 20px;
  input {
    border: none;
    height: 20px;
    width: 50px;
    background: #f5f7fd;
    margin-left: 3px;
  }
  .Moneryinput {
    width: 130px !important;
  }
  .contaier-one {
    width: 85%;
    margin: 0 auto;
    height: 50px;
    // background: red;
    border-bottom: 1px solid #dfe5f6;
    span {
      line-height: 50px;
      font-size: 14px;
      padding-left: 5px;
      padding-right: 5px;
      border-left: 1px solid #dfe5f6;
    }
  }
  .title {
    border: none !important;
    font-size: 14px;
    color: #000000;
    font-weight: bold;
    padding: 30px;
    line-height: 30px;
    margin-left: 30px;
  }
  h3 {
    text-align: center;
    color: #000000;
    line-height: 50px;
    font-size: 12px;
    font-weight: bold;
  }
  table {
    width: 75%;
    margin: 0 auto;
    border: 1px solid #e8e8e8;
    border-right: none;
    tr {
      height: 40px;
      line-height: 40px;
    }
    th {
      border: 1px solid #e8e8e8;
      border-bottom: none;
      border-left: none;
      border-top: none;
      background: #ffffff;
    }
    td {
      border: 1px solid #e8e8e8;
      border-bottom: none;
      border-left: none;
      text-align: center;
      line-height: 40px;
    }
  }
}
</style>