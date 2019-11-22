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
          text: '培训人员类别同比',
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
          data: ['登记失业人员', '农村劳动力', '高校毕业生', '初高中毕业生', '被征地农民', '其他群体']
        },
        series: [
          {
            name: '人员类别比例',
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
              { value: 335, name: '登记失业人员' },
              { value: 310, name: '农村劳动力' },
              { value: 234, name: '高校毕业生' },
              { value: 135, name: '初高中毕业生' },
              { value: 1548, name: '被征地农民' },
              { value: 1548, name: '其他群体' }
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
