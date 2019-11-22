<template>
  <el-dialog
      title="导入学员成绩"
      :visible.sync="dialogVisible"
      width="30%"
      @close="clearFilesFun"
    >
      <el-upload
        v-loading="loading"
        ref="uploadExcel"
        name="excel"
        :headers="headers"
        class="upload-box"
        drag
        :on-progress = 'uploadIng'
        :on-success="successFun"
        :limit="limit"
        :action="$api.studentScoreInport + classId"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip">只能上传xls、xlsx文件</div>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <p>注：若您没有学员名单，请下载班级学员模板后，录入成绩</p>
        <!--<el-button type="primary" size="mini" @click="downloadFile">下载模板</el-button>-->
        <a :href="downloadUrl" download class="el-button el-button--small el-button--primary">下载模板</a>
      </span>
    </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      downloadUrl: '',
      headers: {
        'token': JSON.parse(sessionStorage.getItem('userInfo')).token
      },
      dialogVisible: false,
      limit: 5,
      fileList: [],
      classId: ''
    }
  },
  mounted () {
    this.classId = this.$route.query.tid
    this.downloadUrl = this.$api.exportStudentScore + '?classId=' + this.classId
  },
  methods: {
    uploadIng () {
      this.loading = true
    },
    // 上传成功
    successFun (response, file, fileList) {
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
    // 清除上传列表
    clearFilesFun () {
      console.log('aaaaaaaaaaaaa')
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
        width:  100%;
        height: 250px;
        .el-upload-dragger{
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
