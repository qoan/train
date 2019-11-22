<template>
  <v-chart class="chart" :options="option" auto-resize></v-chart>
</template>

<script>
import { mapActions } from 'vuex'
import echarts from 'vue-echarts'
export default {
  props: ['areaCode'],
  data () {
    return {
      option: {
        title: {
          show: true,
          text: '结业班级就业情况',
          textStyle: {
            fontSize: '14',
            color: '#000'
          }
        },
        color: ['#3458C7', '#8ABBFF'],
        legend: {
          right: '15%',
          data: ['就业推荐', '推荐成功'],
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
        xAxis: [{
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
            inside: false,
            textStyle: {
              color: '#7A7B7E',
              fontWeight: 'normal',
              fontSize: '12'
            },
            interval: 0
            /* formatter: function (value) {
              let start = value.substring(0, 2)
              let end = value.substring(2)
              let str = start + '\n——\n' + end
              return str
            } */
          },
          data: ['贵安一班', '贵安一班', '贵安一班', '贵安一班', '贵安一班', '贵安一班', '贵安一班']
        }],
        yAxis: [{
          name: '人',
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
        }],
        series: [{
          name: '就业推荐',
          type: 'bar',
          stack: 1,
          barWidth: '10',
          data: [7218, 5721, 5821, 4928, 3827, 8813, 5271]
          /* data: [] */
        }, {
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
          data: [535, 492, 721, 521, 182, 421, 242]
          /* data: [] */
        }]
      }
    }
  },
  mounted () {
    // 开启真数据
    /* this.queryInfo(this.areaCode) */
  },
  methods: {
    ...mapActions(['empPushByMonthByCoGc']),
    async queryInfo(areaCode) {
      // 清空数据
      this.option.xAxis[0].data = []
      this.option.series[0].data = []
      this.option.series[1].data = []
      // 数据赋值
      const { data } = await this.empPushByMonthByCoGc(areaCode)
      data.empPushByMonthByCoGc.forEach((obj, index) => {
        // 年月
        this.option.xAxis[0].data.push(obj.month)

        // 推荐
        this.option.series[0].data.push(obj.pushCount)

        // 推荐成功
        this.option.series[1].data.push(obj.successPushCount)
      })
    }
  },
  watch: {
    areaCode(newVal, oldVal) {
      // 开启地区切换真数据
      /* this.queryInfo(newVal) */

      // 切换假数据
      // 月份
      this.option.xAxis[0].data = ['2018/11', '2018/12']
      // 数据值
      if (newVal === '520100000000') {
        // 贵阳
        // 推荐
        this.option.series[0].data = [3500, 5800]
        // 推荐成功
        this.option.series[1].data = [3000, 5000]
      } else if (newVal === '520300000000') {
        // 遵义
        // 推荐
        this.option.series[0].data = [4500, 6700]
        // 推荐成功
        this.option.series[1].data = [4000, 6000]
      } else if (newVal === '520600000000') {
        // 铜仁
        // 推荐
        this.option.series[0].data = [5400, 4600]
        // 推荐成功
        this.option.series[1].data = [5000, 4000]
      }
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
