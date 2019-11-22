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
          text: '学员学历比例',
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
          data: ['小学', '初中', '高中', '大专', '本科及以上']
        },
        series: [
          {
            name: '学员学历比例',
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
              { value: 335, name: '小学' },
              { value: 310, name: '初中' },
              { value: 234, name: '高中' },
              { value: 135, name: '大专' },
              { value: 1548, name: '本科及以上' }
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
