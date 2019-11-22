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
          formatter: '{a}<br />{c}万',
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
          data: ['7/11', '7/12', '7/13', '7/14', '7/15', '7/16'],
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
            name: '发放金额',
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
            data: [120, 132, 101, 134, 90, 230]
          }
        ]
      }
    }
  },
  mounted () {},
  methods: {
    getData () {
      this.$http.post()
        .then(res => {
          const result = res.data.data
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
