<template>
    <el-select v-model="schoolType"  placeholder="请选择" @change="setSchoolType">
        <el-option
                v-for="item in schoolTypeArr"
                :key="item.tid"
                :label="item.enumerValue"
                :value="item.enumerValue">
        </el-option>
    </el-select>
</template>

<script>
export default {
  props: {
    setCallBack: String
  },
  data () {
    return {
      schoolType: '',
      schoolTypeArr: [] // 下拉选项-学校类型
    }
  },
  mounted() {
    this.getSchoolType()
  },
  methods: {
    // 获取学校类型
    getSchoolType () {
      // 发送请求
      this.$http.get(this.$api.selectOption + 'school_type')
        .then(res => {
          this.schoolTypeArr = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 下拉框点击事件
    setSchoolType() {
      /* 子组件通过事件发射向父组件传递事件及参数，$emit即为发射事件
             第一个参数为向父组件传递的事件名，第二个参数为向父组件传递的参数 */
      this.$emit(this.setCallBack, this.schoolType)
    }
  }
}
</script>

<style scoped>

</style>
