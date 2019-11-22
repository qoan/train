<template>
  <el-dialog class="Diaindex" title="系统版本日志" :visible.sync="dialogTableVisible" @open="open">
    <hr style="margin-top: -30px; margin-bottom: 20px; opacity: .5;" />
    <div class="chary" v-for="(item,index) in teacherInfo" :key="index">
      <span class="span chary-p">系统版本号:{{item.versionNumber}}</span>
      <span class="span chary-p" style="margin-left:100px;">更新时间:{{item.createTime}}</span>
      <p class="chary-p">{{item.content}}</p>
      <el-divider></el-divider>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      Tid: 0,
      teacherInfo: [],
      dialogTableVisible: false,
      pageIndex: 1,
      pageSize: 5,
      searchForm: {
        createTime: '',
        versionNumber: '',
        content: ''
      }
    }
  },
  methods: {
    open() {
      this.loading = true
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        createTime: this.searchForm.createTime,
        versionNumber: this.searchForm.versionNumber,
        content: this.searchForm.content
      }
      this.axios
        .post(this.$api.pageVersionLog, params)
        .then(res => {
          if (res.data.result === 'not_ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }

          this.teacherInfo = res.data.data.records
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
<style scoped>
.chary {
  width: 100%;
}
.chary-p {
  line-height: 25px;
  color: #444;
}
.span {
  line-height: 30px;
}
</style>
