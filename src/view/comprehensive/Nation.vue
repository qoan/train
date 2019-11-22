<template>
  <v-chart :options="option" class="chart" auto-resize></v-chart>
</template>

<script>
export default {
  data() {
    return {
      intervalFlag: false,
      option: {
        title: {
          show: true,
          text: '班级考勤质量排行榜',
          top: 10,
          textStyle: {
            fontSize: '14',
            color: '#444',
            opacity: 0.7
          }
        },
        color: ['#3458C7', '#8ABBFF'],
        legend: {
          right: '15%',
          data: ['班级应到人数', '班级实到人数'],
          top: 10,
          right: 0,
          textStyle: {
            color: '#7A7B7E',
            fontSize: '12'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '20%',
          top: '20%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          show: false,
          type: 'value',
          name: '万人',
          nameTextStyle: {
            color: '#000',
            fontSize: 10,
            verticalAlign: 'bottom'
          },
          nameLocation: 'end',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#000'
            },
            formatter: function(v) {
              return parseInt(v) // 表示整数。其他数值类型以此类推
            }
          },
          splitLine: { show: false }
        },
        yAxis: {
          type: 'category',
          data: [],
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#000',
            fontSize: 10
          }
        },
        series: [
          {
            type: 'bar',
            barWidth: 20,
            name: '班级实到人数',
            z: 10,
            encode: {
              // Map the "amount" column to X axis.
              x: 'amount',
              // Map the "product" column to Y axis
              y: 'product'
            },
            data: [],

            label: {
              show: false, // 顶上数字是否显示
              position: 'right',
              // distance: 450,
              color: '#000',
              fontSize: 10,

              formatter: function(value) {
                let str = value.data
                return str
              }
            },
            itemStyle: {
              normal: {
                color: new this.$ECharts.graphic.LinearGradient(1, 0, 0, 0, [{ offset: 0, color: '#3023AE' }])
              }
            }
          },
          {
            type: 'bar',
            barWidth: 20,
            name: '班级应到人数',
            barGap: '-100%',
            encode: {
              // Map the "amount" column to X axis.
              x: 'amount',
              // Map the "product" column to Y axis
              y: 'product'
            },
            data: [],
            label: {
              show: true,
              position: 'right',
              color: '#000',
              fontSize: 10,
              padding: [0, 0, 0, 10],
              formatter: function(value) {
                let str = value.data + '人'
                return str
              }
            },
            itemStyle: {
              normal: {
                color: '#ddd'
                // color: new this.$ECharts.graphic.LinearGradient(1, 0, 0, 0, [{ offset: 0, color: '#3023AE' }, { offset: 1, color: '#786DD7' }])
              }
            }
          }
        ]
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http
        .post(this.$api.trainCheckOnTop)
        .then(res => {
          this.option.yAxis.data.source = []
          const result = res.data.data.reverse()
          result.forEach(item => {
            // let arr = []
            // arr.push(item.count)
            // arr.push(item.className)
            this.option.yAxis.data.push(item.className)
            this.option.series[0].data.push(item.count)
            this.option.series[1].data.push(item.studentcount)
            console.log(this.option.series[0].data)
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
.chart {
  width: 100%;
  height: 100%;
}
</style>
