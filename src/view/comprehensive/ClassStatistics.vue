<template>
  <v-chart :options="option" class="chart" auto-resize></v-chart>
</template>

<script>
export default {
  data() {
    return {
      option: {
        title: {
          show: true,
          text: '各班级今日出勤人数统计',
          textStyle: {
            fontSize: '14',
            color: '#000'
          }
        },
        dataset: {
          source: [['amount', 'product']]
        },
        grid: {
          right: '20%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          show: false,
          type: 'value',
          name: '人',
          nameTextStyle: {
            color: '#fff',
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
              color: '#fff'
            },
            formatter: function(v) {
              return parseInt(v) // 表示整数。其他数值类型以此类推
            }
          },
          splitLine: { show: false }
        },
        yAxis: {
          type: 'category',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#7A7B7E',
            fontSize: 10
          }
        },
        series: [
          {
            type: 'bar',
            barWidth: 10,
            encode: {
              // Map the "amount" column to X axis.
              x: 'amount',
              // Map the "product" column to Y axis
              y: 'product'
            },
            label: {
              show: true,
              position: 'right',
              color: '#000',
              fontSize: 10,
              formatter: function(value) {
                let str = value.data[0] + '个'
                return str
              }
            },
            itemStyle: {
              normal: {
                color: new this.$ECharts.graphic.LinearGradient(1, 0, 0, 0, [{ offset: 0, color: '#4A90E2' }, { offset: 1, color: '#4A90E2' }])
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
          this.option.dataset.source = []
          this.option.dataset.source.push(['amount', 'product'])
          const result = res.data.data.reverse()
          result.forEach(item => {
            let arr = []
            arr.push(item.count)
            arr.push(item.className)
            this.option.dataset.source.push(arr)
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
