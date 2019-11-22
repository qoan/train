<template>
  <el-dialog title="导入学员" :visible.sync="dialogVisible" width="30%" @close="clearFilesFun">
    <el-upload
      v-loading="loading"
      ref="uploadExcel"
      name="excel"
      :headers="headers"
      class="upload-box"
      drag
      :on-success="successFun"
      :on-progress="uploadIng"
      :limit="limit"
      :action="url"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div slot="tip">只能上传xls、xlsx文件</div>
    </el-upload>

    <span slot="footer" class="dialog-footer">
      <p>注：点击这里下载导入模板</p>
      <a download :href="$api.exportMod" class="el-button el-button--small el-button--primary">下载模板</a>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      url: this.$api.classInport + this.$route.query.tid,
      headers: {
        token: JSON.parse(sessionStorage.getItem('userInfo')).token
      },
      dialogVisible: false,
      limit: 1,
      fileList: []
    }
  },
  methods: {
    uploadIng() {
      this.loading = true
    },
    successFun(response, file, fileList) {
      console.log(response)
      this.loading = false
      if (response.result === 'not_ok') {
        this.$alert(response.error.message + '请重新上传！', '错误提示', {
          confirmButtonText: '确定',
          callback: () => {
            this.$refs.uploadExcel.clearFiles()
          }
        })
      } else {
        this.$message.success(response.message)
        this.$emit('getTableData')
      }
    },
    clearFilesFun() {
      this.$refs.uploadExcel.clearFiles()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  .upload-box {
    width: 100%;
    /deep/ .el-upload {
      width: 100%;
      height: 250px;
      .el-upload-dragger {
        width: 100%;
        height: 100%;
      }
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    p {
      color: #606266;
      font-size: 14px;
      margin-right: 20px;
    }
  }
}
</style>
