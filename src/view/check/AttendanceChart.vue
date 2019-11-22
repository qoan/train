<template>
    <div class="warp">
        <el-row style="height: 100%">
            <el-col :span="18" style="height: 100%">
                <div style="height: 50%">
                    <Statistics></Statistics>
                </div>
                <div style="height: 50%" class="botton">
                    <div>
                        <TrainNumber></TrainNumber>
                    </div>
                    <div>
                        <p  class="tit">
                            <span>实时考勤信息展示</span>
                            <span><img src="../../assets/img/icon/icon-date.png" alt="">2019-05-08</span>
                        </p>
                        <RealTime></RealTime>
                    </div>
                </div>
            </el-col>
            <el-col :span="6" style="height: 100%;">
                <el-row style="height: 60%;">
                    <el-col :span="24" class="statisticInfo">
                        <p style="font-size: 14px">统计信息</p>
                        <div class="item">
                            <div class="left">
                                <p><span>57352</span> 人</p>
                                <p>培训总人数</p>
                            </div>
                            <div class="right">
                                <!--<p><span>环比 </span><i class="el-icon-caret-top"></i> 5.72%</p>-->
                            </div>
                        </div>
                        <div class="item">
                            <div class="left">
                                <p><span>57352</span> 个</p>
                                <p>开设班级数</p>
                            </div>
                            <div class="right"></div>
                        </div>
                        <div class="item">
                            <div class="left">
                                <p><span>57352</span> 个</p>
                                <p>正在开班数</p>
                            </div>
                            <div class="right"></div>
                        </div>
                        <div class="item">
                            <div class="left">
                                <p><span>57352</span> 人</p>
                                <p>今日培训人数</p>
                            </div>
                            <div class="right"></div>
                        </div>
                        <div class="item">
                            <div class="left">
                                <p><span>57352</span> %</p>
                                <p>培训合格率</p>
                            </div>
                            <div class="right"></div>
                        </div>
                    </el-col>
                </el-row>
                <el-row style="height: 40%;">
                    <el-col :span="24" style="height: 100%;">
                        <p style="margin-top: 20px;font-size: 14px;">预警信息</p>
                        <div style="margin-left: 50%;">
                            <el-button :type="btnType1"  round size="mini" @click="switchType">就业预警</el-button>
                            <el-button :type="btnType2" round size="mini" @click="switchType">考勤预警</el-button>
                        </div>
                        <Scroll style="margin-top: 20px"></Scroll>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Scroll from './Scroll'
import Statistics from './Statistics'
import TrainNumber from './TrainNumber'
import RealTime from './RealTime'
export default {
  components: {
    Scroll,
    Statistics,
    TrainNumber,
    RealTime
  },
  data() {
    return {
      status: false,
      btnType1: 'text',
      btnType2: 'primary'
    }
  },
  methods: {
    switchType() {
      this.status = !this.status
      if (this.status) {
        this.btnType1 = 'primary'
        this.btnType2 = 'text'
      } else {
        this.btnType1 = 'text'
        this.btnType2 = 'primary'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.warp{
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.botton{
    display: flex;
    div{
        flex: 1;
        &:last-of-type{
            .tit{
                font-size: 12px;
                display: flex;
                padding-right: 50px;
                span{
                    flex: 1;
                    &:first-of-type{
                        font-weight: bold
                    }
                    &:last-of-type{
                        text-align: right;
                        img{
                            vertical-align: middle;
                        }
                    }
                }
            }
        }
    }
}
.statisticInfo{
    >p{
        color: #494A4B;
        font-size: 14px;
        font-weight: bold;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    >.item{
        border: 1px solid #3458C7;
        height: 40px;
        display: flex;
        padding: 20px 40px;
        margin-top: 10px;
        .left{
            flex: 6;
            p{
                &:first-of-type{
                    span{
                        font-size: 20px;
                        font-weight: bold;
                    }
                }
                &:last-of-type{
                    color: #494A4B;
                    font-size: 10px;
                }
            }
        }
        .right{
            background: url("../../assets/img/tj.png")no-repeat center center;
            flex: 4;
            line-height: 45px;
            p{
                font-size: 20px;
                color: #77BA34;
                span{
                    color: #ccc;
                    font-size: 9px;
                }
            }
        }
    }
}
</style>
