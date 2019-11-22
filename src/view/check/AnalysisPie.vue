<template>
    <v-chart ref="myChart" @mouseover="mouseoverPie" @mouseout="mouseoutPie" class="chart" :options="option" auto-resize></v-chart>
</template>

<script>
export default {
  props: {
    'idCard': String,
    'classId': Number,
    'studentId': Number
  },
  data () {
    return {
      normalDays: 0, // 正常天数
      abnormalDays: 0, // 异常天数
      option: {
        title: {
          show: true,
          text: '考勤分析',
          textStyle: {
            fontSize: '14',
            color: 'rgba(0, 0, 0, 0.7)'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: '70%',
          y: '60%',
          itemWidth: 4,  // 设置宽度
          itemHeight: 4, // 设置高度
          selectedMode: false,
          icon: 'circle',
          data: ['正常', '异常'],
          formatter: (name) => {
            let str = ''
            if (name === '正常') {
              str = name + ' ' + this.normalDays + ' 天'
            } else {
              str = name + ' ' + this.abnormalDays + ' 天'
            }
            return str
          }
        },
        series: [
          {
            name: '出勤率',
            type: 'pie',
            radius: ['60%', '70%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center',
                formatter: '{d}%\n{b}',
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: []
          }
        ]
      }
    }
  },
  mounted () {
    setTimeout(this.setDefult, 1000)
    this.getDayCheckCountFun()
  },
  methods: {
    // 获取学员考勤天数
    getDayCheckCountFun () {
      this.$http.get(this.$api.checksCountNow + this.studentId + '/' + this.classId)
        .then(res => {
          let result = res.data.data
          this.option.series[0].data = []
          result.forEach((item, index) => {
            if (item.checkState === '正常') {
              let obj = {
                name: item.checkState,
                value: item.checkCount,
                itemStyle: {
                  color: '#7ED321'
                }
              }
              this.option.series[0].data.push(obj)
              this.normalDays = item.checkCount
            } else {
              let obj = {
                name: item.checkState,
                value: item.checkCount,
                itemStyle: {
                  color: '#FFBC4C'
                }
              }
              this.option.series[0].data.push(obj)
              this.abnormalDays = item.checkCount
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },

    setDefult() {
      const that = this
      that.$refs.myChart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: 0 })
    },
    mouseoverPie(v) {
      if (v.dataIndex !== 0) {
        const that = this
        that.$refs.myChart.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: 0
        })
      }
    },
    mouseoutPie() {
      const that = this
      that.$refs.myChart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: 0 })
    }
  }
}
</script>

<style scoped>
.chart{
    width: 100%;
    height: 100%;
}
</style>
