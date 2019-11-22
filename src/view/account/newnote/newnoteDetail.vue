<template>
  <el-dialog class="a" title="系统版本日志" :visible.sync="dialogTableVisible" @open="open">
    <hr style="margin-top: -30px; margin-bottom: 20px; opacity: .5;" />
    <!--  -->
    <div class="chary">
      <span class="span chary-p">系统版本号:{{teacherInfo.versionNumber}}</span>
      <span class="span chary-p" style="margin-left:100px;">更新时间:{{teacherInfo.createTime}}</span>
      <p class="chary-p">{{teacherInfo.content}}</p>
      <el-divider></el-divider>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'newnoteDetail',
  data() {
    return {
      Tid: 0,
      teacherInfo: [],
      dialogTableVisible: false
    }
  },
  methods: {
    open() {
      console.log(this.Tid)
      this.loading = true
      return this.axios
        .get(this.$api.getRizhiByTid + this.Tid)
        .then(res => {
          if (res.data.result === 'not_ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }

          this.teacherInfo = res.data.data
          console.log(this.teacherInfo)
          return res.data.data
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.chary {
  width: 100%;
  .chary-p {
    line-height: 25px;
    color: #444;
  }
  .span {
    line-height: 30px;
  }
}
</style>

