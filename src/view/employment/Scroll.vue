<template>
    <div class="warp">
        <p class="t-head">
            <span>推荐班级</span>
            <span>推荐时间</span>
            <span>推荐人</span>
        </p>
        <div class="scroll-box" style="height: 300px;overflow: hidden;">
            <ul :class="{animate_top: animate}">
                <li v-for="(item, index) in listData" :key="index">
                    <span><i class="icon"></i>{{item.clazzName}}</span>
                  <span>{{item.createTime}}</span>
                  <span>{{item.userName}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    Refresh: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tid: 0,
      isRefresh: false,
      log_pageIndex: 1,
      log_pageSize: 100,
      log_total: 0, // 总条数
      animate: false,
      listData: []
    }
  },
  created: function () {
    this.tid = this.$route.query.tid
    if (this.listData.length > 10) {

    }
    setInterval(this.showMarquee, 2000)
    // 获取推送记录
    this.getPushLogs()
  },
  methods: {
    showMarquee: function () {
      this.animate = true
      setTimeout(() => {
        this.listData.push(this.listData[0])
        this.listData.shift()
        this.animate = false
      }, 500)
    },

    // 获取推送记录
    getPushLogs () {
      let params = {
        'pageIndex': this.log_pageIndex,
        'pageSize': this.log_pageSize,
        'paramObj': {
          jobTid: this.tid
        }
      }

      // 发送请求
      this.$http.post(this.$api.queryJobPushListByJobTid, params)
        .then(res => {
          this.listData = res.data.data
          this.log_total = res.data.paging.total
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  watch: {
    Refresh: {
      handler: function (newValue) {
        if (newValue) {
          console.log('推送进来1111111')
          // 获取推送记录
          this.getPushLogs()
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
.warp{
    width: 100%;
    height: 100%;
    margin-top: 25px;
    overflow: hidden;
}
.t-head{
    font-size: 10px;
    color: #494A4B;
    display: flex;
    span{
        flex: 1;
        &:first-of-type{
            flex: 2;
        }
        &:last-of-type{
          text-align: center;
        }
    }
}
.scroll-box{
    margin-top: 20px;
    position: relative;
    overflow: hidden;
    height: 100%;
}
.icon{
    display: inline-block;
    width: 5px;
    height: 5px;
    background-color: #E4922E;
}
ul{
    width: 100%;
    height: 100%;
    position: absolute;
}
li{
    font-size: 10px;
    display: flex;
    line-height: 30px;
    span{
        flex: 1;
        &:first-of-type{
            flex: 2;
        }
        &:last-of-type{
          text-align: center;
        }
    }
}
.animate_top{
    transition: all .5s;
    margin-top: -30px;
}

</style>
