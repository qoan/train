<template>
    <div class="warp">
        <ul :class="{animate_top: animate}">
            <li v-for="(item, index) in listData" :key="index">
                <span><i class="icon"></i>{{item.className}}</span>
                <span>{{item.dateString}}</span>
                <span><el-button type="text">立即处理</el-button></span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
  data () {
    return {
      animate: false,
      listData: [
        {
          className: '贵安就业培训12班考勤率过低',
          dateString: '2019/07/12 9:38'
        },
        {
          className: '贵安就业培训12班考勤率过低',
          dateString: '2019/07/12 9:38'
        },
        {
          className: '贵安就业培训12班考勤率过低',
          dateString: '2019/07/12 9:38'
        },
        {
          className: '贵安就业培训12班考勤率过低',
          dateString: '2019/07/12 9:38'
        },
        {
          className: '贵安就业培训12班考勤率过低',
          dateString: '2019/07/12 9:38'
        },
        {
          className: '贵安就业培训12班考勤率过低',
          dateString: '2019/07/12 9:38'
        },
        {
          className: '贵安就业培训12班考勤率过低',
          dateString: '2019/07/12 9:38'
        },
        {
          className: '贵安就业培训12班考勤率过低',
          dateString: '2019/07/12 9:38'
        },
        {
          className: '贵安就业培训12班考勤率过低',
          dateString: '2019/07/12 9:38'
        },
        {
          className: '贵安就业培训12班考勤率过低',
          dateString: '2019/07/12 9:38'
        }
      ]
    }
  },
  created: function () {
    setInterval(this.showMarquee, 2000)
  },
  methods: {
    showMarquee: function () {
      this.animate = true
      setTimeout(() => {
        this.listData.push(this.listData[0])
        this.listData.shift()
        this.animate = false
      }, 500)
    }
  }
}
</script>

<style scoped lang="scss">
.warp{
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
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
    }
}
.animate_top{
    transition: all .5s;
    margin-top: -30px;
}

</style>
