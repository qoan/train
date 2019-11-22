<template>
  <div class="warp">
    <el-row style="height: 100%;">
      <el-col :span="18" style="height: 100%;padding-right: 20px">
        <div class="row">
          <div class="col br-right">
            <Sort></Sort>
          </div>
          <div class="col">
            <Age></Age>
          </div>
        </div>
        <div class="row br-top">
          <div class="col br-right">
            <ClassStatistics></ClassStatistics>
          </div>
          <div class="col">
            <Ratio></Ratio>
          </div>
        </div>
        <div class="row br-top">
          <div class="col br-right">
            <Education></Education>
          </div>
          <div class="col">
            <Employment></Employment>
          </div>
        </div>
      </el-col>
      <el-col :span="6" style="height: 100%;background-color: #fff;padding: 60px 24px">
        <el-col :span="24" class="statisticInfo">
          <p style="font-size: 14px">统计信息</p>
          <div class="item">
            <div class="left">
              <p>
                <span>57352</span> 人
              </p>
              <p>培训总人数</p>
            </div>
            <div class="right">
              <p>
                <span>环比</span>
                <i class="el-icon-caret-top"></i> 5.72%
              </p>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <p>
                <span>57352</span> 个
              </p>
              <p>开设班级数</p>
            </div>
            <div class="right">
              <p>
                <span>环比</span>
                <i class="el-icon-caret-top"></i> 5.72%
              </p>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <p>
                <span>57352</span> 个
              </p>
              <p>正在开班数</p>
            </div>
            <div class="right">
              <p>
                <span>环比</span>
                <i class="el-icon-caret-top"></i> 5.72%
              </p>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <p>
                <span>57352</span> 人
              </p>
              <p>今日培训人数</p>
            </div>
            <div class="right">
              <p>
                <span>环比</span>
                <i class="el-icon-caret-top"></i> 5.72%
              </p>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <p>
                <span>57352</span> %
              </p>
              <p>培训合格率</p>
            </div>
            <div class="right">
              <p>
                <span>环比</span>
                <i class="el-icon-caret-top"></i> 5.72%
              </p>
            </div>
          </div>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Sort from "./chart/Sort";
import Age from "./chart/Age";
import Education from "./chart/Education";
import Employment from "./chart/Employment";
import Ratio from "./chart/Ratio";
import ClassStatistics from "./chart/ClassStatistics";
export default {
  components: {
    Sort,
    Age,
    Education,
    Employment,
    Ratio,
    ClassStatistics
  }
};
</script>

<style scoped lang="scss">
.warp {
  width: 100%;
  height: 100%;
}
.br-top {
  border-top: 1px solid #e7e9f1;
}
.br-right {
  border-right: 1px solid #e7e9f1;
}
.row {
  height: 33.333%;
  display: flex;
  .col {
    height: 100%;
    flex: 1;
  }
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
    margin-top: 30px;
    .left {
      flex: 6;
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
      flex: 4;
      line-height: 45px;
      p {
        font-size: 20px;
        color: #77ba34;
        span {
          color: #ccc;
          font-size: 9px;
        }
      }
    }
  }
}
</style>
