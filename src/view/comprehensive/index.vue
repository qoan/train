<template>
  <div class="warp">
    <el-row style="height: 100%;">
      <el-col :span="18" style="height: 100%;">
        <el-row style="height: 33%;">
          <el-col :span="24" style="height: 100%">
            <TrainNumber></TrainNumber>
          </el-col>
        </el-row>
        <el-row style="height: 40%;">
          <el-col
            :span="12"
            style="height: 100%;border-top: 1px solid #E7E9F1;border-right: 1px solid #E7E9F1;"
          >
            <Nation></Nation>
          </el-col>
          <el-col :span="12" style="height: 100%;border-top: 1px solid #E7E9F1;">
            <Sort></Sort>
          </el-col>
        </el-row>
        <el-row style="height: 40%;">
          <el-col
            :span="12"
            style="height: 100%;border-top: 1px solid #E7E9F1;border-right: 1px solid #E7E9F1;"
          >
            <NationFirst></NationFirst>
          </el-col>
          <el-col :span="12" style="height: 100%;border-top: 1px solid #E7E9F1;">
            <Employment></Employment>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6" style="height: 63%;">
        <el-row style="height: 100%;">
          <el-col :span="24" class="statisticInfo">
            <p style="font-size: 14px">统计信息</p>
            <div class="item">
              <div class="left">
                <p>
                  <span>{{statisticsObj.trainCount}}</span> 人次
                </p>
                <p>培训总人次</p>
              </div>
              <div class="right">
                <p :class="{down: trainCountProportion < 0}">
                  <span>环比</span>
                  <i v-if="trainCountProportion > 0" class="el-icon-caret-top"></i>
                  <i v-if="trainCountProportion < 0" class="el-icon-caret-bottom"></i>
                  {{trainCountProportion}}%
                </p>
              </div>
            </div>
            <div class="item">
              <div class="left">
                <p>
                  <span>{{statisticsObj.trainClassCount}}</span> 个
                </p>
                <p>开设班级数</p>
              </div>
              <div class="right">
                <p :class="{down: classCountProportion < 0}">
                  <span>环比</span>
                  <i v-if="classCountProportion > 0" class="el-icon-caret-top"></i>
                  <i v-if="classCountProportion < 0" class="el-icon-caret-bottom"></i>
                  {{classCountProportion}}%
                </p>
              </div>
            </div>
            <div class="item">
              <div class="left">
                <p>
                  <span>{{ statisticsObj.classCount }}</span> 个
                </p>
                <p>正在开班数</p>
              </div>
              <div class="right">
                <p :class="{down: trainClassCountProportion < 0}">
                  <span>环比</span>
                  <i v-if="trainClassCountProportion > 0" class="el-icon-caret-top"></i>
                  <i v-if="trainClassCountProportion < 0" class="el-icon-caret-bottom"></i>
                  {{trainClassCountProportion}}%
                </p>
              </div>
            </div>
            <div class="item">
              <div class="left">
                <p>
                  <span>{{statisticsObj.checkOnNow}}</span> 人
                </p>
                <p>今日培训人数</p>
              </div>
              <div class="right">
                <p :class="{down: checkOnNowCountProportion < 0}">
                  <span>环比</span>
                  <i v-if="checkOnNowCountProportion > 0" class="el-icon-caret-top"></i>
                  <i v-if="checkOnNowCountProportion < 0" class="el-icon-caret-bottom"></i>
                  {{checkOnNowCountProportion}}%
                </p>
              </div>
            </div>
            <div class="item">
              <div class="left">
                <p>
                  <span>{{employmentRate}}</span>
                </p>
                <p>培训就业率</p>
              </div>
              <div class="right">
                <p>
                  <span>环比</span>
                  <i v-if="(parseFloat(QOQ)) > parseFloat('0%')" class="el-icon-caret-top"></i>
                  <i v-if="(parseFloat(QOQ)) > parseFloat('0%')" class="el-icon-caret-bottom"></i>
                  {{QOQ}}
                </p>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row style="height: 40%;">
          <el-col :span="24" style="height: 100%;">
            <p style="margin-top: 20px;font-size: 14px;">预警信息</p>
            <div style="margin-left: 30%;">
              <el-button :type="btnType1" round size="mini" @click="switchType(1)">全部</el-button>
              <el-button :type="btnType2" round size="mini" @click="switchType(2)">就业预警</el-button>
              <el-button :type="btnType3" round size="mini" @click="switchType(3)">考勤预警</el-button>
            </div>
            <scroll style="margin-top: 20px" :earlyWarning="earlyWarning"></scroll>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TrainNumber from './TrainNumber'
// import ClassStatistics from './ClassStatistics'
import Sort from './Sort'
// import OpenClass from './OpenClass'
import Employment from './Employment'
import scroll from './scroll'
import Nation from './Nation'
import NationFirst from './NationFirst'
export default {
  components: {
    TrainNumber,
    // ClassStatistics,
    Sort,
    // OpenClass,
    Employment,
    Nation,
    NationFirst,
    scroll
  },
  data() {
    return {
      status: false,
      Refresh: true,
      btnType1: 'primary',
      btnType2: 'text',
      btnType3: 'text',
      statisticsObj: {
        checkOnNow: 0,
        checkOnPre: 0,
        classCount: 0,
        classCountPre: 0,
        trainClassCount: 0,
        trainCount: 0,
        trainPass: 0,
        trainPreClassCount: 0,
        trainPreCount: 0,
        trainPrePass: 0
      },
      trainCountProportion: 0, // 培训总人数环比
      classCountProportion: 0, // 开设班级数环比
      trainClassCountProportion: 0, // 正在开班数环比
      checkOnNowCountProportion: 0, // 今日培训人数环比
      earlyWarning: 1, // 预警
      QOQ: 0, // 学校就业率
      employmentRate: 0 // 学校就业率环比
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 查询统计信息
    getData() {
      this.$http
        .post(this.$api.countInfo)
        .then(res => {
          let result = res.data.data
          this.statisticsObj = result
          // 培训总人数环比 环比增长率=（本期数-上期数）/上期数×100%
          if (result.trainPreCount !== 0 && result.trainPreCount) {
            this.trainCountProportion = (((result.trainCount - result.trainPreCount) / result.trainPreCount) * 100).toFixed(2)
          }

          // 开设班级数环比
          if (result.classCountPre !== 0 && result.classCountPre) {
            this.classCountProportion = (((result.classCount - result.classCountPre) / result.classCountPre) * 100).toFixed(2)
          }

          // 正在开班数环比
          if (result.trainPreClassCount !== 0 && result.trainPreClassCount) {
            this.trainClassCountProportion = (((result.trainClassCount - result.trainPreClassCount) / result.trainPreClassCount) * 100).toFixed(2)
          }

          // 今日培训人数环比
          if (result.checkOnPre !== 0 && result.checkOnPre) {
            this.checkOnNowCountProportion = (((result.checkOnNow - result.checkOnPre) / result.checkOnPre) * 100).toFixed(2)
          }
        })
        .catch(err => {
          console.log(err)
        })
      this.axios.get(this.$api.getEmploymentRateBySchool).then(res => {
        this.QOQ = res.data.data.QOQ
        this.employmentRate = res.data.data.employmentRate
        console.log(this.QOQ)
        console.log(this.employmentRate)
      })
    },

    // 按钮切换
    switchType(n) {
      if (n === 1) {
        this.btnType1 = 'primary'
        this.btnType2 = 'text'
        this.btnType3 = 'text'
        this.earlyWarning = n
      } else if (n === 2) {
        this.btnType1 = 'text'
        this.btnType2 = 'primary'
        this.btnType3 = 'text'
        this.earlyWarning = n
      } else {
        this.btnType1 = 'text'
        this.btnType2 = 'text'
        this.btnType3 = 'primary'
        this.earlyWarning = n
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    // 超级管理员不能跳转到综合管理页
    let userType = parseInt(JSON.parse(sessionStorage.getItem('userInfo')).roleTid)
    if (userType === 1) {
      next({ path: '/account/govenment' })
    } else next()
  }
}
</script>

<style scoped lang="scss">
.warp {
  width: 100%;
  height: 100%;
  // overflow: hidden;
}

.statisticInfo {
  > p {
    color: #494a4b;
    font-size: 14px;
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  > .item {
    border: 1px solid #3458c7;
    height: 40px;
    display: flex;
    padding: 20px 40px;
    margin-top: 20px;
    .left {
      flex: 4;
      p {
        &:first-of-type {
          span {
            font-size: 20px;
            font-weight: bold;
          }
        }
        &:last-of-type {
          color: #494a4b;
          font-size: 10px;
        }
      }
    }
    .right {
      flex: 6;
      line-height: 45px;
      p {
        font-size: 20px;
        color: #77ba34;
        span {
          color: #ccc;
          font-size: 9px;
        }
      }
      p.down {
        font-size: 20px;
        color: #f5a623;
        span {
          color: #ccc;
          font-size: 9px;
        }
      }
    }
  }
}
</style>
