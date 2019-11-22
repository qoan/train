<template>
  <div class="vant-my-select">
    {{theory}}
    {{practice}}
    <el-select value-key="teacherId" v-model="result" placeholder="请选择实操老师" @change="onConfirm">
      <el-option
        v-for="item in teacherList"
        :key="item.teacherId"
        :label="item.teacherName"
        :value="item"
      ></el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  props: ['setData', 'teacherList', 'theory', 'practice'],
  data() {
    return {
      teacherArray: [],
      result: '',
      teacherList: []
    }
  },
  mounted() {
    this.onConfirm()
  },
  methods: {
    onConfirm(value) {
      this.setData(value)
      this.result = value
    }
  },
  watch: {
    selectValue: function(newVal) {
      this.result = newVal
      console.log(newVal)
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
