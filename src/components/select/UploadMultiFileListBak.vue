<template>
  <div class="multi-upload-wrapper">
    <el-upload
      multiple
      list-type="picture-card"
      ref="multiUpload"
      :file-list="fileList"
      :accept="accept"
      :limit="limit"
      :action="action"
      :on-exceed="uploadMaxCall"
      :before-upload="beforeUploadCall"
      :on-preview="uploadPreviewCall"
      :on-remove="uploadRemoveCall"
      :on-error="uploadErrorCall"
      :on-success="uploadSuccessCall"
      @clearFiles="clearFiles"
    >
      <i slot="default" :class="icon"></i>
    </el-upload>

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
  model: {
    prop: 'fileList',
    event: 'change'
  },
  props: {
    icon: {
      type: String,
      default: 'el-icon-camera-solid'
    },
    accept: {
      type: String,
      default: 'image/*'
    },
    limit: {
      type: Number,
      default: 9
    },
    sizeLimit: {
      type: Number,
      default: 2 * 1024 * 1024
    },
    action: {
      type: String,
      required: true
    },
    fileList: {
      type: Array,
      required: true
    }
  },
  methods: {
    // 事件 - 上传前回调钩子 - 验证图片大小、格式以及压缩
    beforeUploadCall(file) {
      const isLt1M = file.size < this.sizeLimit

      if (!isLt1M) {
        this.$message.error(
          `上传图片大小不能超过${this.sizeLimit / 1024 / 1024}MB!`
        )
      }

      return isLt1M
    },
    // 事件 - 上传图片成功
    uploadSuccessCall(response, file, fileList) {
      this.$emit(
        'change',
        fileList
      )
    },
    // 事件 - 移除图片
    uploadRemoveCall(file, fileList) {
      console.log(file)
      if (file.response) {
        this.$emit('changePicture', file.response.message)
      } else if (file.url) {
        this.$emit('changePicture', file.url)
      } else if (file.url.url) {
        this.$emit('changePicture', file.url.url)
      }
    },
    // 事件 - 查看大图
    uploadPreviewCall(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 事件 - 上传限制事件
    uploadMaxCall(files, fileList) {
      this.$message({
        message: `最多只能上传${this.limit}张照片`,
        type: 'warning'
      })
    },
    // 事件 - 上传图片失败
    uploadErrorCall(err, files, fileList) {
      console.log('图片上传失败: ' + err)
      this.$message.error('有图片上传失败!')
    },
    // 事件 - 清空
    clearFiles() {
      this.$refs.multiUpload.clearFiles()
    }
  }
}
</script>

<style lang="stylus" scoped>
$item-width = 110px;
$item-height = 110px;

.multi-upload-wrapper {
  position:relative
  /* 大小控制 */
  /deep/ .el-upload--picture-card {
    height: $item-width;
    width: $item-height;
    line-height: $item-height;
  }

  /deep/ .el-upload-list--picture-card {
    .el-upload-list__item {
      height: $item-width;
      width: $item-height;
      line-height: $item-height;
    }

    /* 结果图标 */
    .el-upload-list__item-status-label {
      i {
        position: absolute;
        margin: 0;
        top: 10px;
        right: 14px;
      }
    }

    /* 进度条 */
    .el-progress {
      display: flex;
      align-items: center;
      justify-content: center;

      .el-progress-circle {
        height: ($item-width / 2) !important;
        width: ($item-height / 2) !important;
      }

      .el-progress__text {
        font-size: 12px !important;
      }
    }
  }
}
</style>
<style>
  .el-upload-list__item.is-success .el-upload-list__item-status-label{
    display: none;
  }
</style>
