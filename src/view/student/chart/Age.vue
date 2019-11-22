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
          text: '学员年龄比例',
          textStyle: {
            fontSize: '14',
            color: '#000'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          textStyle: {
            color: '#7A7B7E'
          },
          itemWidth: 4,  // 设置宽度
          itemHeight: 4, // 设置高度
          x: '55%',
          y: 'center',
          icon: 'circle',
          data: ['18岁', '30岁', '50岁', '60岁', '70岁', '80岁']
        },
        series: [
          {
            name: '学员年龄比例',
            type: 'pie',
            center: ['30%', '50%'],
            radius: ['55%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '16', // 选中后文字中心显示的字体样式
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 335, name: '18岁' },
              { value: 310, name: '30岁' },
              { value: 234, name: '50岁' },
              { value: 135, name: '60岁' },
              { value: 1548, name: '70岁' },
              { value: 1548, name: '80岁' }
            ]
          }
        ],
        color: ['#CA90FF', '#87B9FF', '#FFBC4C', '#7C9CFF', '#B8E986', '#5667B8']
      }
    }
  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style scoped>
  .chart{
    width: 100%;
    height: 100%;
  }
</style>
