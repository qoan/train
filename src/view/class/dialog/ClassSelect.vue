<template>
  <div class="vant-my-select">
    {{practice}}
    <el-select value-key="teacherId" v-model="result" placeholder="请选择实操老师" @change="onConfirm">
      <el-option
        v-for="item in teacherListType"
        :key="item.teacherId"
        :label="item.teacherName"
        :value="item"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: ['setData', ' practice', 'thoery'],
  data() {
    return {
      teacherArray: [],
      result: '',
      teacherListType: []
    }
  },
  mounted() {
    this.getTeacherList(1).then(data => {
      this.teacherListType = data
      console.log(this.practice)
      if (this.practice) {
        this.teacherListType.push(this.practice)
      }
      if (this.thoery) {
        this.teacherListType.push(this.thoery)
      }
    })
  },
  methods: {
    // 获取教师下拉列表
    getTeacherList(tid) {
      return this.axios
        .post(this.$api.getTeacherListBySchoolId)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }
          return res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    onConfirm(value) {
      this.setData(value)
      this.result = value
    }
  },
  watch: {
    selectValue: function(newVal) {
      this.result = newVal
    },
    result(newVal) {
      this.$emit('input', newVal)
    }
  }
}
</script>
<style scoped lang="scss">
.vant-my-select {
  margin: 0;
  padding: 0;
  .van-cell {
    padding-right: 0 !important;
  }
}
</style>

