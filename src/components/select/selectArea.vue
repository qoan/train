<template>
  <div>
    <el-select v-model="province" disabled placeholder="请选择省" class="w100">
      <el-option
        v-for="item in provinceArr"
        :key="item.areaCode"
        :label="item.areaName"
        :value="item.areaCode"
      ></el-option>
    </el-select>
    <el-select v-model="areaObj.city" placeholder="请选择市" @change="getCounty" class="w100">
      <el-option
        v-for="item in cityArr"
        :key="item.areaCode"
        :label="item.areaName"
        :value="item.areaCode"
      ></el-option>
    </el-select>
    <el-select v-model="areaObj.county" placeholder="请选择区县" @change="getTown" class="w100">
      <el-option
        v-for="item in countyArr"
        :key="item.areaCode"
        :label="item.areaName"
        :value="item.areaCode"
      ></el-option>
    </el-select>
    <el-select v-model="areaObj.town" placeholder="请选择乡镇" @change="getVillage" class="w100">
      <el-option
        v-for="item in townArr"
        :key="item.areaCode"
        :label="item.areaName"
        :value="item.areaCode"
      ></el-option>
    </el-select>
    <el-select v-model="areaObj.village" placeholder="请选择村" @change="flag = false" class="w100">
      <el-option
        v-for="item in villageArr"
        :key="item.areaCode"
        :label="item.areaName"
        :value="item.areaCode"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    areaObj: {
      type: Object,
      default: function() {
        return {
          city: '',
          county: '',
          town: '',
          village: ''
        }
      }
    }
  },
  data() {
    return {
      flag: true,
      province: '520000000000',
      provinceArr: [
        {
          areaName: '贵州省',
          areaCode: '520000000000'
        }
      ],
      cityArr: [], // 市
      countyArr: [], // 县
      townArr: [], // 乡
      villageArr: [] // 村
    }
  },
  mounted() {
    this.getAreaByCode(this.province, 'cityArr') // 默认贵州省
  },
  methods: {
    // 获取区县
    getCounty(code) {
      this.flag = false
      this.areaObj.county = ''
      this.areaObj.town = ''
      this.areaObj.village = ''
      this.getAreaByCode(code, 'countyArr')
    },
    // 获取乡镇
    getTown(code) {
      this.flag = false
      this.areaObj.town = ''
      this.areaObj.village = ''
      this.getAreaByCode(code, 'townArr')
    },
    // 获取村
    getVillage(code) {
      this.flag = false
      this.getAreaByCode(code, 'villageArr')
    },
    // 请求地区信息
    getAreaByCode(code, result) {
      if (!code) return
      this.$http
        .get(this.$api.subArea + code)
        .then(res => {
          this[result] = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  watch: {
    // 监听父组件传值的变化
    areaObj: {
      handler(val, oldval) {
        if (this.flag) {
          if (val.village !== '') {
            this.getAreaByCode(val.city, 'countyArr')
            this.getAreaByCode(val.county, 'townArr')
            this.getAreaByCode(val.town, 'villageArr')
          } else if (val.town !== '') {
            this.getAreaByCode(val.city, 'countyArr')
            this.getAreaByCode(val.county, 'townArr')
          } else if (val.county !== '') {
            this.getAreaByCode(val.city, 'countyArr')
          }
        }
        this.$emit('areaObj', this.areaObj)
      },
      immediate: true, // 关键
      deep: true
    }
  }
}
</script>

<style scoped>
.w100 {
  width: 100px;
}
</style>
