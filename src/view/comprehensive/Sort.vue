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
          top: 10,
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
          itemWidth: 4, // 设置宽度
          itemHeight: 4, // 设置高度
          x: '55%',
          y: 'center',
          icon: 'circle',
          data: []
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
            data: []
          }
        ],
        color: ['#CA90FF', '#87B9FF', '#FFBC4C', '#7C9CFF', '#B8E986', '#5667B8']
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http
        .post(this.$api.trainPersonnelTypeData)
        .then(res => {
          const result = res.data.data
          this.option.legend.data = []
          this.option.series[0].data = []
          result.forEach((item, index) => {
            this.option.legend.data.unshift(item.personnelType)
            let obj = {
              value: item.count,
              name: item.personnelType
            }
            this.option.series[0].data.unshift(obj)
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
