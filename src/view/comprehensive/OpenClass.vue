<template>
  <v-chart class="chartBox" :options="option" auto-resize></v-chart>
</template>

<script>
export default {
  data() {
    return {
      option: {
        title: {
          show: true,
          text: '职业技能课程开班统计',
          textStyle: {
            fontSize: '14',
            color: '#000'
          }
        }
      }
    }
  },
  created() {},
  mounted() {
    this.getData()
  },
  methods: {
    getArrayValue(array, key) {
      key = key || 'value'
      var res = []
      if (array) {
        array.forEach(function(t) {
          res.push(t[key])
        })
      }
      return res
    },
    array2obj(array, key) {
      var resObj = {}
      for (var i = 0; i < array.length; i++) {
        resObj[array[i][key]] = array[i]
      }
      return resObj
    },
    setData(data, sumValue) {
      var res = {
        series: [],
        yAxis: []
      }
      for (let i = 0; i < data.length; i++) {
        res.series.push({
          name: '统计',
          type: 'pie',
          clockWise: false, // 顺时加载
          hoverAnimation: false, // 鼠标移入变大
          radius: [65 - i * 15 + '%', 57 - i * 15 + '%'],
          center: ['30%', '55%'],
          label: {
            show: 0,
            position: 'outside'
          },
          itemStyle: {
            label: {
              show: false
            },
            labelLine: {
              show: 1
            },
            borderWidth: 5
          },
          data: [
            {
              value: data[i].value,
              name: data[i].name
            },
            {
              value: sumValue - data[i].value,
              name: '',
              itemStyle: {
                color: 'rgba(0,0,0,0)',
                borderWidth: 0
              },
              tooltip: {
                show: false
              },
              hoverAnimation: false
            }
          ]
        })
        res.series.push({
          name: '',
          type: 'pie',
          silent: true,
          z: 1,
          clockWise: false, // 顺时加载
          hoverAnimation: false, // 鼠标移入变大
          radius: [65 - i * 15 + '%', 57 - i * 15 + '%'],
          center: ['30%', '55%'],
          label: {
            show: 0,
            borderRadius: 5
          },
          itemStyle: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            borderWidth: 5
          },
          data: [
            {
              value: 7.5,
              itemStyle: {
                color: '#F2F2F2',
                borderWidth: 0,
                barBorderRadius: 7
              },
              tooltip: {
                show: false
              },
              hoverAnimation: false
            },
            {
              value: 2.5,
              name: '',
              itemStyle: {
                color: 'rgba(0,0,0,0)',
                borderWidth: 0
              },
              tooltip: {
                show: false
              },
              hoverAnimation: false
            }
          ]
        })
        res.yAxis.push(((data[i].value / sumValue) * 100).toFixed(0) + ' %')
      }
      return res
    },
    renderData(data) {
      var arrName = this.getArrayValue(data, 'name')
      var arrValue = this.getArrayValue(data, 'value')
      // eslint-disable-next-line
      var sumValue = eval(arrValue.join('+'))
      var objData = this.array2obj(data, 'name')
      var optionData = this.setData(data, sumValue)
      var option = {
        // backgroundColor: "#fff",
        title: {
          show: true,
          text: '职业技能课程开班统计',
          textStyle: {
            fontSize: '14',
            color: '#000'
          }
        },
        legend: {
          show: true,
          top: 'center',
          left: '60%',
          data: arrName,
          icon: 'circle',
          itemWidth: 4,
          itemHeight: 4,
          width: 30,
          padding: [0, 5],
          itemGap: 5,
          color: '#7A7B7E',
          formatter: function(name) {
            return '{title|' + name + '}{value|: ' + objData[name].value + ' 个}'
          },
          textStyle: {
            rich: {
              title: {
                fontSize: 12,
                lineHeight: 10,
                color: '#7A7B7E'
              },
              value: {
                fontSize: 12,
                lineHeight: 18,
                color: '#7A7B7E'
              }
            }
          }
        },
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: '{a}<br>{b}:{c}({d}%)'
        },
        color: ['#AA9EFF', '#7C9CFF', '#8AC4FF', '#FFBC4C', '#CA90FF', '#5667B8'],
        grid: {
          top: '20%',
          bottom: '48%',
          left: '30%',
          containLabel: false
        },
        yAxis: [
          {
            type: 'category',
            inverse: true,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0,
              inside: true,
              textStyle: {
                color: '#7A7B7E',
                fontSize: 10
              },
              show: true
            },
            data: optionData.yAxis
          }
        ],
        xAxis: [
          {
            show: false
          }
        ],
        series: optionData.series
      }

      this.option = option
    },
    getData() {
      this.$http
        .post(this.$api.trainWorkTypeData)
        .then(res => {
          let result = res.data.data
          let arr = []
          result.forEach((item, index) => {
            let obj = {
              name: item.workType,
              value: item.count
            }
            arr.push(obj)
            this.renderData(arr)
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
.chartBox {
  width: 100%;
  height: 100%;
}
</style>
