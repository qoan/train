<template>
  <v-chart class="chartBox" :options="option" auto-resize></v-chart>
</template>

<script>
export default {
  data () {
    return {
      option: {
        title: {
          text: '每日培训人数趋势',
          textAlign: 'left',
          textStyle: {
            fontSize: 12
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{a}<br />{c}人',
          padding: 10,
          textStyle: {
            fontSize: 14
          }
        },
        grid: {
          left: '5%',
          top: '20%',
          right: '15%',
          height: '60%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          name: '日期',
          nameTextStyle: {
            color: '#9D9D9E',
            fontsize: 10
          },
          boundaryGap: false,
          data: [],
          axisLine: {
            lineStyle: {
              color: '#3458C7'
            }
          },
          axisLabel: {
            fontSize: 10,
            color: '#9D9D9E'
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          name: '(人)',
          minInterval: 1, // 设置成1保证坐标轴分割刻度显示成整数
          nameTextStyle: {
            color: '#9D9D9E',
            fontsize: 10
          },
          type: 'value',
          axisLine: {
            show: false,
            lineStyle: {
              color: '#9D9D9E'
            }
          },
          axisTick: {
            show: false, // 刻度
            inside: false // 刻度朝向
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#3458C7'
            }
          }
        },
        series: [
          {
            name: '培训人数',
            type: 'line',
            areaStyle: {
              color: new this.$ECharts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(121, 104, 255, 1)'
              }, {
                offset: 1,
                color: 'rgba(6,218,253,0)'
              }])
            },
            stack: '总量',
            itemStyle: {
              normal: {
                color: new this.$ECharts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(121, 104, 255, 1)'
                }, {
                  offset: 1,
                  color: 'rgba(6,218,253,0)'
                }])
              }
            },
            data: []
          }
        ]
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.$http.post(this.$api.trainDaysData)
        .then(res => {
          const result = res.data.data
          this.option.xAxis.data = []
          this.option.series[0].data = []
          result.forEach((item, index) => {
            this.option.xAxis.data.unshift(item.days)
            this.option.series[0].data.unshift(item.count)
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
  .chartBox{
    width: 100%;
    height: 100%;
  }
</style>
