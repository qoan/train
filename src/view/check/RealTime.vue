<template>
    <div class="warp">
        <p class="t-head">
            <span>姓名</span>
            <span>性别</span>
            <span>培训课程</span>
            <span>培训班级</span>
            <span>考勤时间</span>
        </p>
        <div class="scroll-box">
            <ul :class="{animate_top: animate}">
                <li v-for="(item, index) in listData" :key="index">
                    <span><i class="icon"></i>{{item.name}}</span>
                    <span>{{item.sex}}</span>
                    <span>{{item.curriculum}}</span>
                    <span>{{item.className}}</span>
                    <span>{{item.checkTime}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      animate: false,
      listData: [
        {
          name: '张三',
          sex: '男',
          curriculum: '美容美发',
          className: '美容二班',
          checkTime: '9:38'
        },
        {
          name: '张三',
          sex: '男',
          curriculum: '美容美发',
          className: '美容二班',
          checkTime: '9:38'
        },
        {
          name: '张三',
          sex: '男',
          curriculum: '美容美发',
          className: '美容二班',
          checkTime: '9:38'
        },
        {
          name: '张三',
          sex: '男',
          curriculum: '美容美发',
          className: '美容二班',
          checkTime: '9:38'
        },
        {
          name: '张三',
          sex: '男',
          curriculum: '美容美发',
          className: '美容二班',
          checkTime: '9:38'
        },
        {
          name: '张三',
          sex: '男',
          curriculum: '美容美发',
          className: '美容二班',
          checkTime: '9:38'
        },
        {
          name: '张三',
          sex: '男',
          curriculum: '美容美发',
          className: '美容二班',
          checkTime: '9:38'
        },
        {
          name: '张三',
          sex: '男',
          curriculum: '美容美发',
          className: '美容二班',
          checkTime: '9:38'
        },
        {
          name: '张三',
          sex: '男',
          curriculum: '美容美发',
          className: '美容二班',
          checkTime: '9:38'
        },
        {
          name: '张三',
          sex: '男',
          curriculum: '美容美发',
          className: '美容二班',
          checkTime: '9:38'
        },
        {
          name: '张三',
          sex: '男',
          curriculum: '美容美发',
          className: '美容二班',
          checkTime: '9:38'
        },
        {
          name: '张三',
          sex: '男',
          curriculum: '美容美发',
          className: '美容二班',
          checkTime: '9:38'
        },
        {
          name: '张三',
          sex: '男',
          curriculum: '美容美发',
          className: '美容二班',
          checkTime: '9:38'
        },
        {
          name: '张三',
          sex: '男',
          curriculum: '美容美发',
          className: '美容二班',
          checkTime: '9:38'
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
    margin-top: 25px;
    overflow: hidden;
}
.t-head{
    font-size: 10px;
    color: #494A4B;
    display: flex;
    span{
        flex: 1;
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
    background-color: #5DB85B;
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
    }
}
.animate_top{
    transition: all .5s;
    margin-top: -30px;
}

</style>
