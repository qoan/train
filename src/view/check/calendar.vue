<template>
  <div class="calendar">
    <header>
      <slot name="calendar-title" />
    </header>
    <div class="calendar-day clearfix">
      <!--<ul class="fl">
        <li v-for="(item, idx) of totalList" :key="idx">
          <span>{{item.value}}</span>
          <p>{{item.label}}</p>
        </li>
      </ul>-->
      <ul class="fr" style="top: -30px">
        <!--正常异常图例<li v-for="(item,idx) of colorList" :key="idx">
          <i :style="{'backgroundColor': item.color}"></i>
          <span :title="types[item.type]">{{types[item.type]}}</span>
        </li>-->
      </ul>
    </div>
    <!-- <ul class="calendar-label clearfix">
      <li v-for="(item, idx) of weeks" :key="idx">{{item}}</li>
    </ul>-->
    <ul class="calendar-num clearfix">
      <li v-for="(item,idx) of dateArr" :key="idx" @click="queryCheckByDate(item.day, idx)">
        <!--<el-tooltip v-if="item.attendStatus" :visible-arrow="false"
          placement="top" effect="light">
          &lt;!&ndash;<div slot="content">
            <Tips :abnormal="item.abnormal" :overTime="item.overTime" :vacation="item.vacation"/>
          </div>&ndash;&gt;
          <span :class="item.isSchedul? '': 'gray'">
            <i
              v-for="(i,idx) of colorList"
              :style="{'backgroundColor': i.color}"
              :key="idx">
              <i class="cirle" v-if="i.type === item.attendStatus">
                {{item.num}}
              </i>
            </i>
            <i class="cirle" v-if="item.attendStatus ==='1'">{{item.num}}</i>
           <i class="cirle" v-if="item.attendStatus === '2'">{{item.num}}</i>
          </span>
        </el-tooltip>-->
        <span
          :class="[{'cirle': item.num===index}, {'gray': !item.isSchedul}, {'bottom_point': item.isPint}]"
          style="position: relative;cursor: pointer;"
        >{{item.num}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
/* import Tips from './calendar-tips.vue' */
export default {
  name: 'calendar',
  /* components: { Tips }, */
  props: {
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 考勤类型
    types: {
      type: Object,
      default: () => {
        return {
          '1': '正常',
          '2': '异常'
        }
      }
    },
    // 考勤类型代表的颜色
    colorList: {
      type: Array,
      default: () => {
        return [{ color: '#7ED321', type: '1' }, { color: '#F5A623', type: '2' }]
      }
    },
    // 考勤总计
    attendanceTotal: {
      type: Array,
      default: () => {
        return [{ label: '出勤天数', value: 0 }, { label: '加班时长', value: 0 }, { label: '请假天数', value: 0 }, { label: '异常', value: 0 }]
      }
    },
    // 当前需要的月份
    nowDate: {
      type: Date,
      default: () => {
        return new Date()
      }
    },
    // 自定义事件
    event: {
      type: Function,
      dafault: () => {}
    },
    // 自定义星期名
    weeks: {
      type: Array,
      default: () => {
        return ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      }
    }
  },
  computed: {
    totalList() {
      return this.attendanceTotal
    }
  },
  data() {
    return {
      dateArr: [],
      currentYear: '', // 当前的年数
      currentMonth: '', // 当前月份
      firstDay: '', // 第一天
      firstnow: '', // 当前的星期几
      lineNumber: 6,
      EveryMonthDays: [], // 每个月的天数
      strArr: [],
      str: '',
      index: 0 // 今天的索引，默认选中今天
    }
  },
  created() {
    this.defaultDate()
    this.initDate(this.index)
  },
  methods: {
    // 根据日期查考勤
    queryCheckByDate(day, index) {
      this.dateArr.forEach((item, index) => {
        this.dateArr[index].isSchedul = false
      })
      this.dateArr[index].isSchedul = true
      // this.index = index + 1
      this.$emit('queryCheckFun', day)
    },

    // 初始化日历
    initDate(index) {
      if (!this.nowDate) {
        this.nowDate = new Date()
      }
      this.currentYear = this.nowDate.getFullYear()
      this.currentMonth = this.nowDate.getMonth()
      // 当前月份的第一天
      this.firstDay = new Date(this.currentYear, this.currentMonth, 1)
      // 第一天是星期几
      this.firstnow = this.firstDay.getDay()
      if (this.firstnow > 0) this.firstnow = this.firstnow - 1
      else if (this.firstnow === 0) this.firstnow = 6
      this.EveryMonthDays = [31, 28 + this.isLeap(this.currentYear), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      this.creatTable(index)
    },
    isLeap(year) {
      // 判断是否为闰年
      return year % 100 === 0 ? (year % 400 === 0 ? 1 : 0) : year % 4 === 0 ? 1 : 0
    },
    creatTable(index) {
      // 创建日历
      this.dateArr = []
      var idx = ''
      var dateStr = ''
      var dateObj = {}
      for (let i = 0; i < this.lineNumber; i++) {
        for (let k = 0; k < 7; k++) {
          idx = i * 7 + k
          dateStr = idx - this.firstnow + 1
          dateStr <= 0 || dateStr > this.EveryMonthDays[this.currentMonth] ? (dateStr = '') : (dateStr = new Date(this.currentYear, this.currentMonth, dateStr).getDate())
          // 获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
          let month = this.currentMonth + 1 < 10 ? '0' + (this.currentMonth + 1).toString() : (this.currentMonth + 1).toString()
          // 获取天，判断是否小于10，如果是在字符串前面拼接'0'
          let da = dateStr < 10 ? '0' + dateStr.toString() : dateStr.toString()
          let day = this.currentYear + '-' + month + '-' + da
          dateObj = { num: dateStr, day: day }
          this.dateArr.push(dateObj)
        }
      }
      /* this.event() */
      this.dateArr = this.dateArr.map(x => ({ ...x, ...this.dataList.find(y => y.num === x.num) }))
      // ajax请求数据,获取有考勤数据的日期
      this.classId = this.$route.query.classId || 0
      let month = parseInt(this.currentMonth + 1) < 10 ? '0' + parseInt(this.currentMonth + 1).toString() : parseInt(this.currentMonth + 1).toString()
      this.$http
        .get(this.$api.getCheckDateListByClass + this.classId + '/' + this.currentYear + '-' + month)
        .then(res => {
          let pintArr = res.data.data || []

          // 过滤掉空字符串
          let arr = this.dateArr.filter(item => {
            return item.num !== ''
          })

          // 对有考勤数据的日期打点
          arr.forEach((item, index) => {
            if (item.num < 10) {
              let v = item.day.substring(8)
              if (pintArr.indexOf(v) > -1) {
                arr[index].isPint = true
              } else {
                arr[index].isPint = false
              }
            } else {
              let v = item.day.substring(8)
              if (pintArr.indexOf(v) > -1) {
                arr[index].isPint = true
              } else {
                arr[index].isPint = false
              }
            }
          })

          this.dateArr = arr // 过滤后重新赋值
        })
        .catch(err => {
          console.log(err)
        })

      // 选中今天
      if (index !== undefined) {
        this.dateArr[index].isSchedul = true
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
      this.index = parseInt(da)
    }
  },
  watch: {
    nowDate(val) {
      val && this.initDate()
    }
  }
}
</script>
<style lang="scss">
.calendar {
  /*background: #fff;*/
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  margin: 0 auto;
  header {
    height: 60px;
    line-height: 60px;
  }
  i {
    font-style: normal;
  }
  .calendar-day {
    border-top: 1px solid #eef0f4;
    .fl {
      li {
        float: left;
        padding-right: 40px;
        text-align: center;
        span:nth-child(1) {
          display: inline-block;
          height: 30px;
          line-height: 30px;
          font-size: 24px;
          color: #253551;
          font-weight: bold;
        }
        p:nth-child(2) {
          font-size: 13px;
          color: #707786;
          line-height: 16px;
          max-width: 80px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    .fr {
      float: right;
      position: relative;
      top: 30px;
      li {
        float: left;
        i {
          margin: 0 5px;
          display: inline-block;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #cfcfcf;
        }
        span {
          font-size: 12px;
          color: #767c93;
          letter-spacing: 0.2px;
        }
      }
    }
  }
  .calendar-label {
    li {
      float: left;
      width: 14.285%;
      height: 32px;
      line-height: 32px;
      font-size: 12px;
      color: #767c93;
      text-align: center;
      @media (min-device-width: 1920px) {
        width: 14.285%;
      }
    }
  }
  .calendar-num {
    li {
      float: left;
      width: 14.285%;
      height: 30px;
      line-height: 30px;
      padding: 5px 0;
      text-align: center;
      @media (min-device-width: 1920px) {
        width: 14.285%;
      }
    }
    .gray {
      color: #b9bece;
    }
    .cirle {
      cursor: pointer;
      color: #fff;
      display: inline-block;
      width: 30px;
      border-radius: 50%;
      background-color: #3458c7;
    }
    .bottom_point:after {
      content: '';
      display: inline-block;
      width: 3px;
      height: 3px;
      background-color: #7ed321;
      border-radius: 100%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: -5px;
    }
  }
}
.pop-box {
  height: 60px;
  p {
    box-sizing: border-box;
    font-size: 12px;
    color: #253551;
    line-height: 22px;
  }
}
.el-tooltip__popper.is-light {
  border: 1px solid #eef0f4;
  box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.05);
  border-radius: 2px;
}
</style>
