<template>
  <v-chart :options="option" class="chart" auto-resize></v-chart>
</template>

<script>
export default {
  data() {
    return {
      pageIndex: 1, // 页数
      pageSize: 5, //  每页条数
      total: 0, // 总条数
      Total: 0, // 总条数
      currentPage: 1,
      intervalFlag: false,
      option: {
        title: {
          show: true,
          text: '职业技能课程开班统计',
          top: 10,
          textStyle: {
            fontSize: '14',
            color: '#444',
            opacity: 0.7
          }
        },
        grid: {
          left: '3%',
          right: '20%',
          top: '20%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          show: false,
          type: 'value',
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
        series: {
          type: 'bar',
          barWidth: 25,
          data: [],
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
              let str = value.data + '个'
              return str
            }
          },
          itemStyle: {
            normal: {
              color: new this.$ECharts.graphic.LinearGradient(1, 0, 0, 0, [{ offset: 0, color: '#8ABBFF' }]),
              barBorderRadius: 4
            }
          }
        }
      }
    }
  },
  mounted() {
    this.getData()
    setInterval(this.setData, 5000)
    setInterval(this.getData, 5000)
  },
  methods: {
    getData() {
      this.$http
        .post(this.$api.trainWorkTypeData)
        .then(res => {
          let result = res.data.data
          console.log(result)
          this.Total = res.data.data.length / this.pageSize
          let y = String(this.Total).indexOf('.') + 1 // 获取小数点的位置
          if (y > 0) {
            this.total = this.Total + 1
          } else {
            this.total = this.Total
          }
          console.log(this.total)
          result.forEach((item, index) => {
            this.option.yAxis.data.push(item.workType)
            this.option.series.data.push(item.count)
          })

          let begin = (this.currentPage - 1) * this.pageSize
          let end = this.currentPage * this.pageSize
          this.option.yAxis.data = this.option.yAxis.data.slice(begin, end)
          this.option.series.data = this.option.series.data.slice(begin, end)
        })

        .catch(err => {
          console.log(err)
        })
    },
    setData() {
      if (this.currentPage > this.total) {
        this.currentPage = 1
      } else {
        this.currentPage++
      }
      console.log(this.currentPage)
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
