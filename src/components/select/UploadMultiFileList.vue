<template>
  <div class="multi-upload-wrapper">
    <el-upload
      list-type="picture-card"
      :accept="accept"
      :limit="limit"
      :action="action"
      :on-exceed="uploadMaxCall"
      :before-upload="beforeUploadCall"
      :on-preview="uploadPreviewCall"
      :on-remove="uploadRemoveCall"
      :on-success="uploadSuccessCall"
      ref="upload"
      @clearFiles="clearFiles"
    >
      <i slot="default" :class="icon"></i>
    </el-upload>
    <p :style="{width: width + 'px', 'margin-top': '5px', 'text-align': 'center'}">{{title}}</p>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  props: {
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    },
    icon: {
      type: String,
      default: 'el-icon-camera-solid'
    },
    title: {
      type: String,
      default: '其它凭证'
    },
    accept: {
      type: String,
      default: 'image/jpeg,image/png'
    },
    limit: {
      type: Number,
      default: 9
    },
    action: {
      type: String,
      required: true
    }
  },
  methods: {
    // 事件 - 上传前回调钩子 - 验证图片格式和大小
    beforeUploadCall(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 1

      if (!isJPG && !isPng) {
        this.$message.error('只能上传jpg、png、pdf格式的文件！')
      }
      if (!isLt1M) {
        this.$message.error('上传图片大小不能超过 1MB！')
      }
      return isJPG || isPng || isLt1M
    },
    // 事件 - 上传图片成功
    uploadSuccessCall(response, file, fileList) {
      this.$emit('input', fileList)
    },
    // 事件 - 移除图片
    uploadRemoveCall(file, fileList) {
      this.$emit('input', fileList)
    },
    // 事件 - 查看大图
    uploadPreviewCall(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 事件 - 上传超时限制事件
    uploadMaxCall(files, fileList) {
      this.$message({
        message: `最多只能上传${this.limit}张照片`,
        type: 'warning'
      })
    },
    // 事件 - 上传回调
    upLoadProgress(event, file, fileList, imgObj) {
      this.$set(imgObj, 'percentage', parseInt(event.percent))
    },
    clearFiles() {
      this.$refs.upload.clearFiles()
    }
  }
}
</script>

<style lang="scss" scoped>
.multi-upload-wrapper {
  /deep/ .el-upload--picture-card {
    height: 110px;
    width: 110px;
  }
  /deep/ .el-upload-list--picture-card {
    .el-upload-list__item {
      width: 110px;
      height: 110px;
      margin-right: 20px;
    }
  }
}
</style>
