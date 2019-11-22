<template>
  <el-select v-model="sName" placeholder="请选择" @change="change">
    <el-option
      v-for="item in schoolNameArr"
      :key="item.tid"
      :label="item.schoolName"
      :value="item.schoolName"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  data() {
    return {
      schoolNameArr: [],
      sName: ''
    }
  },
  mounted() {
    this.getSchoolNameArr()
  },
  methods: {
    // 获取学校
    getSchoolNameArr() {
      this.$http
        .get(this.$api.selectSchoolEnum)
        .then(res => {
          this.schoolNameArr = res.data.data
          this.schoolNameArr.unshift({
            schoolName: '请选择',
            tid: 0
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 将选择的值传出去
    change(name) {
      let str = name === '请选择' ? '' : name
      this.$emit('setSchoolName', str)
    }
  }
}
</script>

<style scoped>
</style>
