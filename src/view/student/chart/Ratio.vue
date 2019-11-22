<template>
    <v-chart :options="option" class="chart" auto-resize></v-chart>
</template>

<script>
export default {
  data() {
    return {
      option: {
        title: {
          text: '培训合格率/就业率环比'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['培训合格率', '就业率环比'],
          left: '60%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            data: ['7/17', '7/18', '7/19', '7/20', '7/21', '7/22', '7/23']
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '培训合格率',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: [120, 132, 101, 134, 90, 230, 210],
            color: '#8ABBFF'
          },
          {
            name: '就业率环比',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: [220, 182, 191, 234, 290, 330, 310],
            color: '#3458C7'
          }
        ]
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
