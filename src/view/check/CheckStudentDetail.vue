<template>
  <div class="warp">
    <el-row style="height: 100%;">
      <el-col :span="18" style="height: 100%;padding: 0 20px">
        <div class="calendarBox">
          <AnalysisPie ref="pie" :idCard="studentIdcard" :classId="classId" :studentId="studentId"></AnalysisPie>
          <el-button class="btn" type="primary" @click="recoverCheck" v-if="roleTid === 5">一键恢复考勤</el-button>
        </div>
        <div class="listBox">
          <!--<div class="btnBox">
            <el-button :type="btn1" @click="switchType(1)">全部</el-button>
            <el-button :type="btn2" @click="switchType(2)">正常</el-button>
            <el-button :type="btn3" @click="switchType(3)">异常</el-button>
          </div>-->
          <p style="line-height: 30px">考勤详情列表</p>
          <el-table :data="dataTables" height="300" stripe align="center" style="width: 100%">
            <el-table-column align="center" prop="studentName" label="学员姓名"></el-table-column>
            <el-table-column align="center" prop="checkInTime" label="上午考勤时间"></el-table-column>
            <el-table-column align="center" prop="checkOutTime" label="下午考勤时间"></el-table-column>
            <el-table-column align="center" prop="checkDate" label="考勤日期"></el-table-column>
            <el-table-column align="center" prop="checkState" label="是否异常">
              <template slot-scope="scope">
                <span v-if="scope.row.checkState === 1" style="color:#7ED321">正常</span>
                <span v-else-if="scope.row.checkState === 2" style="color: #FFBC4C">异常</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            style="text-align: center;margin-top: 20px"
            @current-change="changePage"
            :page-size="pageSize"
          ></el-pagination>
        </div>
      </el-col>
      <el-col :span="6" style="height: 100%;background-color: #fff;">
        <div class="top">
          <div class="head">
            <div>
              <img class="headImg" src="../../assets/img/icon/icon-class.png" alt />
            </div>
            <div>
              <p>{{studentInfo.name}}</p>
              <p>{{studentInfo.className}}</p>
            </div>
          </div>
          <p>
            <span>身份证号：</span>
            {{studentInfo.idCard}}
          </p>
          <p>
            <span>联系电话：</span>
            {{studentInfo.phone}}
          </p>
          <p>
            <span>文化程度：</span>
            {{studentInfo.education}}
          </p>
          <p>
            <span>培训对象类别：</span>
            {{studentInfo.personnelType}}
          </p>
          <p>
            <span>所在学校：</span>
            {{studentInfo.schoolName}}
          </p>
          <p>
            <span>家庭住址：</span>
            {{studentInfo.address}}
          </p>
        </div>
        <div class="bottom">
          <calendar @queryCheckFun="queryCheckFun" :nowDate="nowDate">
            <p slot="calendar-title">
              <el-date-picker class="fl" :clearable="false" v-model="nowDate" type="month" />
            </p>
          </calendar>
          <div class="b-info">
            <div>
              <p>{{clockDate.checkInTime}}</p>
              <p>上午打卡时间</p>
            </div>
            <div>
              <p>{{clockDate.checkOutTime}}</p>
              <p>下午打卡时间</p>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import '../../assets/css/index.scss'
import calendar from './calendarStudent'
import AnalysisPie from './AnalysisPie'
export default {
  components: {
    calendar,
    AnalysisPie
  },
  data() {
    return {
      roleTid: 0, // 权限检测
      pageIndex: 1,
      pageSize: 6,
      total: 0, // 总条数
      btn1: 'primary',
      btn2: 'text',
      btn3: 'text',
      nowDate: '', // 当前需要显示的月份
      dataTables: [],
      day: '', // 获取今天日期
      studentIdcard: '',
      studentId: 0,
      classId: 0,
      studentInfo: {
        name: '',
        className: '',
        idCard: '',
        phone: '',
        education: '',
        personnelType: '',
        schoolName: '',
        address: ''
      },
      clockDate: {
        checkInTime: '',
        checkOutTime: ''
      }
    }
  },
  mounted() {
    this.getDataTables()
    this.getStudentInfoFun()
    this.defaultDate()
    // 获取角色等级
    this.roleTid = parseInt(JSON.parse(sessionStorage.getItem('userInfo')).roleTid)
  },
  methods: {
    // 一键还原考勤
    recoverCheck() {
      this.$http
        .get(this.$api.processStuCheck + this.studentId + '/' + this.classId)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
          } else {
            this.$message.success(res.data.message)
          }
          // 刷新页面
          window.location.reload()
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 根据日期查询table数据
    queryCheckFun(day) {
      this.day = day
      this.getcheckDateFun(this.day)
    },

    // 根据日期查询学员打卡时间
    getcheckDateFun(day) {
      this.$http
        .get(this.$api.checksByDay + this.studentIdcard + '/' + day)
        .then(res => {
          if (res.data.data) {
            this.clockDate = res.data.data[0]
          } else {
            this.clockDate = {
              checkInTime: '',
              checkOutTime: ''
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 查询学员信息
    getStudentInfoFun() {
      this.$http
        .post(this.$api.getStudentInfo + this.studentId)
        .then(res => {
          this.studentInfo = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 查询dataTables
    getDataTables() {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        studentId: this.studentId,
        classId: this.classId
      }

      this.$http
        .post(this.$api.checkPageByStudent + params.studentId + '/' + params.classId + '/' + params.pageIndex + '/' + params.pageSize)
        .then(res => {
          this.dataTables = res.data.data.records
          this.total = res.data.data.total
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 分页事件
    changePage(page) {
      this.pageIndex = page
      this.getDataTables()
    },

    switchType(n) {
      switch (n) {
        case 1:
          this.btn1 = 'primary'
          this.btn2 = 'text'
          this.btn3 = 'text'
          break
        case 2:
          this.btn1 = 'text'
          this.btn2 = 'primary'
          this.btn3 = 'text'
          break
        case 3:
          this.btn1 = 'text'
          this.btn2 = 'text'
          this.btn3 = 'primary'
          break
      }
    },

    // 设置默认日期
    defaultDate() {
      let date = new Date()
      // 获取当前时间的年份转为字符串
      let year = date.getFullYear().toString() // '2019'
      // 获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
      let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString() // '04'
      // 获取天，判断是否小于10，如果是在字符串前面拼接'0'
      let da = date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate().toString() // '12'
      // 字符串拼接，开始时间，结束时间
      /* let end = year + '-' + month + '-' + da  // 当天'2019-04-12'
      let beg = year + '-' + month + '-01'    // 当月第一天'2019-04-01' */
      this.day = year + '-' + month + '-' + da

      this.getcheckDateFun(this.day)
    }
  },
  created() {
    this.nowDate = new Date()
    this.studentIdcard = this.$route.query.studentIdcard
    this.studentId = parseInt(this.$route.query.studentId)
    this.classId = parseInt(this.$route.query.classId)
  }
}
</script>

<style scoped lang="scss">
.warp {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.title {
  margin-top: 40px;
  margin-bottom: 40px;
}
.btnBox {
  text-align: left;
  padding-bottom: 20px;
}
.calendarBox {
  position: relative;
  > .btn {
    position: absolute;
    right: 100px;
    bottom: 100px;
  }
}

@media screen and(min-width: 1200px) and(max-width: 1600px) {
  .btn {
    right: 0px !important;
  }
  .headImg {
    transform: translateX(2px) !important;
  }
  .el-table {
    height: 250px !important;
    overflow: auto;
  }
  .b-info {
    margin-top: 5px !important;
  }
}
.calendarBox,
.listBox {
  height: 50%;
}
.top {
  height: 30%;
  padding-top: 60px;
  padding-left: 24px;
  padding-right: 24px;
  > .head {
    display: flex;
    > div {
      &:first-of-type {
        flex: 2;
        img {
          width: 44px;
          height: 44px;
          border-radius: 100%;
          transform: translateX(10px);
        }
      }
      &:last-of-type {
        flex: 8;
        p {
          line-height: 25px;
          &:first-of-type {
            font-size: 16px;
          }
        }
      }
    }
  }
  > p {
    font-size: 12px;
    color: #494a4b;
    line-height: 22px;
    &:nth-of-type(1) {
      margin-top: 20px;
    }
    &:nth-of-type(3) {
      margin-top: 10px;
    }
    &:nth-of-type(5) {
      margin-top: 10px;
    }
    span {
      letter-spacing: 6px;
    }
    &:nth-of-type(4) {
      span {
        letter-spacing: 0px;
        margin-right: 5px;
      }
    }
  }
}
.bottom {
  .b-info {
    width: 80%;
    height: 93px;
    background: rgba(249, 249, 251, 1);
    display: flex;
    margin: 30px auto;
    div {
      flex: 1;
      text-align: center;
      padding-top: 20px;
      p {
        &:first-of-type {
          font-size: 20px;
          color: rgba(0, 0, 0, 0.7);
        }
        &:last-of-type {
          margin-top: 8px;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.7);
        }
      }
    }
  }
}
</style>
