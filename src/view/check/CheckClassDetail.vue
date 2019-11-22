<template>
  <div class="warp">
    <el-row style="height: 100%;">
      <el-col :span="18" style="height: 100%;padding: 0 20px">
        <div class="calendarBox">
          <calendar :nowDate="nowDate" @queryCheckFun="queryCheckFun">
            <p slot="calendar-title">
              <el-date-picker
                class="fl"
                :clearable="false"
                @change="changeEvent"
                v-model="nowDate"
                type="month"
              />
            </p>
          </calendar>
        </div>
        <div class="listBox">
          <div class="btnBox">
            <el-button :type="btn1" @click="switchType(1)">全部</el-button>
            <el-button :type="btn2" @click="switchType(2)">正常</el-button>
            <el-button :type="btn3" @click="switchType(3)">异常</el-button>
          </div>
          <el-table
            :data="dataTables"
            height="300"
            stripe
            align="center"
            style="width: 100%"
            v-loading="loading"
          >
            <el-table-column prop="studentName" label="学员姓名" width="200"></el-table-column>
            <el-table-column prop="checkInTime" label="上午考勤时间" width="200"></el-table-column>
            <el-table-column prop="checkOutTime" label="下午考勤时间" width="200"></el-table-column>
            <el-table-column prop="checkDate" label="考勤日期" width="200"></el-table-column>
            <el-table-column prop="checkState" label="是否异常" width="200">
              <template slot-scope="scope" v-if="isFlase">
                <span v-if="scope.row.checkState === 1" style="color:#7ED321">正常</span>
                <span v-else-if="scope.row.checkState === 2" style="color: #FFBC4C">异常</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  round
                  @click.native.prevent="goStudentDetail(scope.row.studentId, scope.row.studentIdcard, scope.row.classId)"
                >查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            style="text-align: center;margin-top: 20px"
            @current-change="changePage"
          ></el-pagination>
        </div>
      </el-col>
      <el-col :span="6" style="height: 100%;background-color: #fff;">
        <div class="top">
          <p>
            <img src="../../assets/img/icon/icon-class.png" alt />
            {{classInfo.className}}
          </p>
          <p>{{classInfo.trainAreacode}}</p>
          <p>机构名称：{{classInfo.schoolName}}</p>
          <p>培训工种：{{classInfo.workType}}</p>
          <p>培训课时：理论{{classInfo.theoryCount}}节 实操{{classInfo.practiceCount}}节</p>
          <p>培训类别：{{classInfo.workType}}</p>
          <p>培训上课时间：{{classInfo.classBeginTime}}</p>
          <p>培训下课时间：{{classInfo.classOverTime}}</p>
          <p>培训开始时间：{{classInfo.trainDateStart}}</p>
          <p>培训结束时间：{{classInfo.trainDateEnd}}</p>
        </div>
        <div class="bottom">
          <div>
            <div>班级人数</div>
            <div>
              {{classObj.studentCount}}
              <span>人</span>
            </div>
          </div>
          <div>
            <div>今日应到人数</div>
            <div>
              {{classObj.ydCount}}
              <span>人</span>
            </div>
          </div>
          <div>
            <div>今日实到人数</div>
            <div>
              {{classObj.checkCount}}
              <span>人</span>
            </div>
          </div>
          <div>
            <div>异常考勤人数</div>
            <div>
              {{abnormal}}
              <span>人</span>
            </div>
          </div>
          <div>
            <div>考勤率</div>
            <div>
              {{ parseInt((classObj.checkCount / classObj.studentCount).toFixed(2) * 100) }}
              <span>%</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import '../../assets/css/index.scss'
import calendar from './calendar.vue'
export default {
  components: { calendar },
  data() {
    return {
      isFlase: true,
      pageIndex: 1,
      loading: false,
      pageSize: 8,
      total: 1, // 总页数
      classObj: {
        classId: 0,
        schoolName: '',
        className: '',
        workType: '',
        studentCount: 0,
        checkCount: 0,
        ydCount: 0
      },
      abnormal: 0, // 异常人数
      btn1: 'primary',
      btn2: 'text',
      btn3: 'text',
      nowDate: '', // 当前需要显示的日期
      dataTables: [],
      classInfo: {
        className: '电竞培训班',
        trainDateStart: '2019-08-11',
        trainDateEnd: '2019-09-21',
        workType: '营养师',
        trainAreacode: '贵州省遵义市红花岗区老城街道办事处大兴路社区居委会',
        theoryCount: 50,
        practiceCount: 50,
        schoolName: '新启航教育培训学校'
      },
      day1: '', // 获取今天日期
      classOverTime: 0, // 获取当前班级下课时间
      studentOverTime: 0, // 获取学生下午考勤时间
      studentOverTimeList: []
    }
  },
  mounted() {
    this.classObj.classId = this.$route.query.classId || 0
    this.classObj.studentCount = this.$route.query.studentCount || 0
    this.classObj.checkCount = this.$route.query.checkCount || 0
    this.classObj.ydCount = this.$route.query.ydCount || 0
    this.getDataTables()
    this.getClassById()
    this.getAbnormalFun()
    this.newDateTime()
  },
  methods: {
    newDateTime() {
      let date = new Date()
      // 获取当前时间的年份转为字符串
      let year = date.getFullYear().toString() // '2019'
      // 获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
      let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString() // '04'
      // 获取天，判断是否小于10，如果是在字符串前面拼接'0'
      let da = date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate().toString() // '12'

      let newDay = year + '-' + month + '-' + da
      this.day1 = newDay
    },
    // 判断是否异常的显示
    isgetData() {
      let date = new Date()
      // 获取当前时间的年份转为字符串
      let year = date.getFullYear().toString() // '2019'
      // 获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
      let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString() // '04'
      // 获取天，判断是否小于10，如果是在字符串前面拼接'0'
      let da = date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate().toString() // '12'

      let newDay = year + '-' + month + '-' + da
      console.log(this.day1)
      console.log(newDay)
      let time = this.classOverTime
      var hour = time.split(':')[0]
      var min = time.split(':')[1]
      var sec = time.split(':')[2]
      let newhour = date.getHours().toString() // '2019'
      // 获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
      let newmin = date.getMinutes() + 1 < 10 ? '0' + (date.getMinutes() + 1).toString() : (date.getMinutes() + 1).toString() // '04'
      // 获取天，判断是否小于10，如果是在字符串前面拼接'0'
      let newsec = date.getSeconds() < 10 ? '0' + date.getSeconds().toString() : date.getSeconds().toString() // '12'
      // let a = newhour + ':' + newmin + ':' + newsec
      let b = hour * 60 * 60 * 1000 + min * 60 * 1000 + sec * 1000 // 下课时间毫秒
      let c = newhour * 60 * 60 * 1000 + newmin * 60 * 1000 + newsec * 1000 // 当前时间毫秒
      console.log(b)

      if (this.day1 === newDay) {
        let d, e
        d = c - b
        e = d / (60 * 60 * 1000)
        if (c < b) {
          this.isFlase = false
          console.log(this.isFlase)
        }
        if (e > 2) {
          this.isFlase = true
          console.log(this.isFlase)
        } else {
          this.isFlase = false
          console.log(this.isFlase)
        }
      } else if (this.day1 > newDay) {
        this.isFlase = false
      } else {
        this.isFlase = true
      }
    },
    // 根据日期查询table数据
    queryCheckFun(day) {
      this.day1 = day
      console.log(this.day)
      this.getDataTables()
    },
    // 获取异常人数
    getAbnormalFun() {
      this.$http
        .get(this.$api.checkCountByState + this.classObj.classId)
        .then(res => {
          this.abnormal = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 查询班级信息
    getClassById() {
      this.$http
        .post(this.$api.getClassDetail + this.classObj.classId)
        .then(res => {
          this.classInfo = res.data.data
          this.classOverTime = res.data.data.classOverTime
          console.log(this.classInfo)
          this.isgetData()
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 查询dataTables
    getDataTables(checkState) {
      this.loading = true
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        checkDate: this.day1,
        classId: parseInt(this.classObj.classId)
      }

      if (checkState) {
        params.checkState = checkState
      }

      this.$http
        .post(this.$api.pageStudentCheckByClass, params)
        .then(res => {
          this.dataTables = res.data.data.records
          this.isgetData()
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 分页事件
    changePage(page) {
      this.pageIndex = page
      this.getDataTables()
    },

    changeEvent() {},
    handleClick(tab, event) {
      console.log(tab, event)
    },
    goStudentDetail(studentId, studentIdcard, classId) {
      this.$router.push({ path: '/check/student/detail', query: { studentId, studentIdcard, classId } })
    },
    switchType(n) {
      switch (n) {
        case 1:
          this.btn1 = 'primary'
          this.btn2 = 'text'
          this.btn3 = 'text'
          this.getDataTables()
          break
        case 2:
          this.btn1 = 'text'
          this.btn2 = 'primary'
          this.btn3 = 'text'
          this.getDataTables(1)
          break
        case 3:
          this.btn1 = 'text'
          this.btn2 = 'text'
          this.btn3 = 'primary'
          this.getDataTables(2)
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
    }
  },
  created() {
    this.defaultDate()
    this.nowDate = new Date()
  }
}
</script>

<style scoped lang="scss">
.table-th {
  color: red;
}
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
.calendarBox,
.listBox {
  height: 50%;
}
.top {
  height: 30%;
  padding-top: 60px;
  padding-left: 24px;
  padding-right: 24px;
  p {
    font-size: 12px;
    color: #494a4b;
    line-height: 22px;
    &:nth-of-type(1) {
      font-size: 16px;
      img {
        margin-right: 12px;
      }
    }
    &:nth-of-type(2) {
      padding-left: 25px;
    }
    &:nth-of-type(3) {
      margin-top: 20px;
    }
  }
}
.bottom {
  height: 70%;
  padding: 24px;
  overflow: hidden;
  > div {
    height: 65px;
    line-height: 65px;
    border: 1px solid #3458c7;
    margin-top: 15px;
    display: flex;
    > div {
      &:first-of-type {
        flex: 6;
        font-size: 12px;
        color: #7a7b7e;
        padding-left: 24px;
      }
      &:last-of-type {
        flex: 4;
        font-size: 18px;
        font-weight: bold;
        span {
          font-size: 12px;
          color: #7a7b7e;
        }
        a {
          color: #3559c7;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
