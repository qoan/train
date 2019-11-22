<template>
  <div class="sigle-upload-wrapper">
    <el-upload
      multiple
      :accept="accept"
      :action="action"
      :show-file-list="false"
      :on-preview="upLoadPreview"
      :on-progress="upLoadProgress"
      :on-success="upLoadSuccess"
      :before-upload="beforUpload"
      ref="multiUpload"
      @clearFiles="clearFiles"
    >
      <!-- 默认显示图标 -->
      <i slot="default" v-if="!fileThumPreview && !fileData.url" :class="icon"></i>
      <!-- 自定义缩略图 -->
      <div class="sigle-upload-item" :style="{'width': `${width}px`, 'height': `${height}px`}">
        <!--图片-->
        <img
          v-if="fileThumPreview || fileData.url"
          class="sigle-upload-item-thumbnail"
          :src="fileThumPreview || fileData.url"
        />
        <!--进度条-->
        <el-progress
          class="sigle-upload-item-progress"
          v-if="progress.show"
          type="circle"
          style="z-index: 10"
          :stroke-width="4"
          :width="50"
          :percentage="progress.percent"
        ></el-progress>
        <!--成功提示-->
        <label v-if="uploadStatu&&fileData.url" class="sigle-upload-item-status">
          <i class="upload-success el-icon-check"></i>
        </label>
        <!--遮罩层-->
        <div class="mask">
          <div>
            <span>
              <i @click.stop="uploadPreviewCall(fileData.url)" class="el-icon-zoom-in"></i>
            </span>
            <span>
              <i @click.stop="uploadRemoveCall(fileData.url)" class="el-icon-delete"></i>
            </span>
            <span>
              <i class="el-icon-edit-outline"></i>
            </span>
          </div>
        </div>
      </div>
    </el-upload>
    <p
      style="width: 100%; text-align: center"
      class="title"
    >{{fileData.title ? fileData.title : ''}}</p>
    <!--大图弹窗-->
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" />
    </el-dialog>
  </div>
</template>

<script>
// 检查限制
const check = file => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt1M = file.size / 1024 / 1024 < 1

  if (!isJPG && !isPNG) {
    this.$message.error('上传图片只能是 JPG/PNG 格式!')
  }

  if (!isLt1M) {
    this.$message.error('上传图片大小不能超过 1MB!')
  }

  return (isJPG || isPNG) && isLt1M
}

// File对象转dataUrl
const filetoDataURL = (file, fn) => {
  var reader = new FileReader()
  reader.onloadend = function(e) {
    fn(e.target.result)
  }
  reader.readAsDataURL(file)
}

export default {
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      // 缩略图
      fileThumPreview: null,
      // 进度条
      progress: {
        percent: 0,
        show: false
      },
      // 上传结果图标
      uploadStatu: false
    }
  },
  model: {
    prop: 'fileData',
    event: 'change'
  },
  props: {
    width: {
      type: Number,
      default: 110
    },
    height: {
      type: Number,
      default: 110
    },
    icon: {
      type: String,
      default: 'el-icon-camera-solid'
    },
    accept: {
      type: String,
      default: 'image/jpeg,image/png'
    },
    action: {
      type: String,
      required: true
    },
    fileData: {
      type: Object,
      required: true
    }
  },
  methods: {
    // 事件 - 移除图片
    uploadRemoveCall(url) {
      this.fileThumPreview = null
      this.fileData.url = null
      this.$emit('changePicture', url)
    },
    // 事件 - 查看大图
    uploadPreviewCall(url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    // 回调 - 上传前
    beforUpload(file) {
      // 检查上传限制
      if (!check(file)) return

      // 将缩略图显示
      filetoDataURL(file, base64 => {
        this.fileThumPreview = base64
      })
    },
    // 回调 - 点击文件列表中已上传的文件时的钩子
    upLoadPreview(file) {
      console.log('哈哈哈哈')
    },

    // 回调 - 上传进度
    upLoadProgress(event, file, fileList) {
      if (event.percent > 0) {
        this.progress.show = true
        this.uploadStatu = false
        this.progress.percent = parseInt(event.percent)
      }

      if (event.percent >= 100) {
        this.progress.show = false
        this.progress.percent = 0
      }
    },
    // 回调 - 上传成功
    upLoadSuccess(response, file, fileList) {
      this.uploadStatu = true
      file.url = file.response.message
      this.$emit('change', Object.assign(this.fileData, file))
    },
    clearFiles() {
      this.$refs.multiUpload.clearFiles()
    }
  }
}
</script>

<style lang="scss" scoped>
.sigle-upload-wrapper {
  width: auto;
  height: auto;
  /deep/ .el-upload--text {
    width: auto;
    height: auto;
    i {
      font-size: 28px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -14px;
      margin-left: -14px;
    }
    .sigle-upload-item {
      .sigle-upload-item-thumbnail {
        width: 100%;
        height: 100%;
      }
      .sigle-upload-item-progress {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -25px;
        margin-left: -25px;
      }
      .sigle-upload-item-status {
        position: absolute;
        right: -15px;
        top: -6px;
        width: 40px;
        height: 24px;
        background: #13ce66;
        text-align: center;
        transform: rotate(45deg);
        box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
        .upload-success {
          font-size: 12px;
          position: absolute;
          top: 25px;
          right: 8px;
          cursor: pointer;
          opacity: 1;
          color: #fff;
          transform: rotate(-45deg);
        }
      }
      .mask {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        > div {
          height: 100%;
          display: flex;
          span {
            position: relative;
            flex: 1;
            color: #fff;
            i {
              text-align: center;
              font-size: 20px;
              font-family: element-icons !important;
              speak: none;
              font-style: normal;
              font-weight: 400;
              font-variant: normal;
              text-transform: none;
              line-height: 1;
              vertical-align: baseline;
              display: inline-block;
              -webkit-font-smoothing: antialiased;
            }
          }
        }
      }
      &:hover .mask {
        display: block;
      }
    }
  }
}
</style>
<style>
.mask:hover {
  display: block;
}
</style>
