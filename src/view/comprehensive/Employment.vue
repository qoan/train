<template>
  <v-chart class="chart" :options="option" auto-resize></v-chart>
</template>

<script>
import { mapActions } from 'vuex'
import echarts from 'vue-echarts'
export default {
  props: ['areaCode'],
  data() {
    return {
      pageIndex: 1, // 页数
      total: 0, // 总条数
      option: {
        title: {
          show: true,
          text: '班级就业情况统计',
          top: 10,
          textStyle: {
            fontSize: '14',
            color: '#000'
          }
        },
        color: ['#3458C7', '#8ABBFF'],
        legend: {
          right: '15%',
          data: ['就业推荐', '推荐成功'],
          top: 10,
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
          containLabel: true,
          top: '20%',
          right: '15%',
          bottom: '12%',
          textStyle: {
            color: '#7A7B7E'
          }
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true,
              show: false
            },
            name: '班级',
            nameTextStyle: {
              color: '#7A7B7E'
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              interval: 0,
              inside: false,
              textStyle: {
                color: '#7A7B7E',
                fontWeight: 'normal',
                fontSize: '12'
              },
              formatter: function(value) {
                let str = value.substring(0, 4) + '...'
                return str
              }
            },
            data: []
          }
        ],
        yAxis: [
          {
            name: '人',
            minInterval: 1, // 设置成1保证坐标轴分割刻度显示成整数
            nameTextStyle: {
              color: '#7A7B7E'
            },
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#2F336A'
              }
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#7A7B7E',
                fontWeight: 'normal',
                fontSize: '12'
              }
            }
          }
        ],
        series: [
          {
            name: '就业推荐',
            type: 'bar',
            stack: 1,
            barWidth: '25%',
            data: []
          },
          {
            name: '推荐成功',
            type: 'bar',
            stack: 1,
            barWidth: '20',
            label: {
              show: false, // 顶上数字是否显示
              textStyle: {
                color: '#ffffff',
                fontSize: 12
              }
            },
            data: []
          }
        ]
      }
    }
  },
  mounted() {
    this.getData()
    setInterval(this.getData, 5000)
  },
  methods: {
    getData() {
      this.$http
        .post(this.$api.trainClassAndEmpData + '?pageIndex=' + this.pageIndex)
        .then(res => {
          this.total = res.data.data.total
          let result = res.data.data.records
          this.option.xAxis[0].data = []
          this.option.series[0].data = []
          this.option.series[1].data = []
          console.log(res)
          result.forEach((item, index) => {
            this.option.xAxis[0].data.push(item.className)
            this.option.series[0].data.push(item.studentCount)
            this.option.series[1].data.push(item.empCount)
          })
          if (this.pageIndex >= this.total / 5) {
            this.pageIndex = 1
          } else {
            this.pageIndex++
          }
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
