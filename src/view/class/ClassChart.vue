<template>
  <div class="warp">
    <el-row style="height: 100%">
      <el-col :span="18" style="height: 100%">
        <div class="l-top">
          <OpenClass></OpenClass>
        </div>
        <div class="l-bottom">
          <div>
            <Employment></Employment>
          </div>
          <div>
            <ClassStatistics></ClassStatistics>
          </div>
        </div>
      </el-col>
      <el-col :span="6" style="height: 100%;padding: 40px 24px">
        <div class="r-top">
          <p>统计信息</p>
          <div>
            <p>培训总人数</p>
            <p>
              <span>57,352</span> 人
            </p>
          </div>
          <div>
            <p>开设班级数</p>
            <p>
              <span>724</span> 个
            </p>
          </div>
        </div>
        <div class="r-bottom">
          <p>近期开班列表</p>
          <Scroll></Scroll>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import OpenClass from './chart/OpenClass'
import Employment from './chart/Employment'
import ClassStatistics from './chart/ClassStatistics'
import Scroll from './chart/Scroll'
export default {
  components: {
    OpenClass,
    Employment,
    ClassStatistics,
    Scroll
  },
  data() {
    return {
      status: false,
      btnType1: 'text',
      btnType2: 'primary'
    }
  }
}
</script>

<style scoped lang="scss">
.warp {
  width: 100%;
  height: 100%;
}
.l-top,
.l-bottom {
  height: 50%;
}
.l-bottom {
  border-top: 1px solid #e7e9f1;
  display: flex;
  > div {
    height: 100%;
    flex: 1;
    &:first-of-type {
      border-right: 1px solid #e7e9f1;
    }
  }
}
.r-top {
  height: 40%;
  > p {
    font-size: 14px;
  }
  > div {
    height: 52px;
    margin-top: 20px;
    border: 1px solid rgba(52, 88, 199, 0.2);
    padding: 10px 20px;
    background: url("../../assets/img/tj.png") no-repeat 90% center;
    p {
      font-size: 10px;
      color: #7a7b7e;
      margin-top: 5px;
      span {
        font-size: 18px;
        color: #000;
      }
    }
  }
}
.r-bottom {
  height: 60%;
}
</style>
