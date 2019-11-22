<template>
  <div class="wrapper-list">
    <div class="upload-wrapper" v-for="(item, index) in uploadList" :key="index">
      <el-upload
        class="avatar-uploader"
        :show-file-list="config.showFileList"
        :accept="config.accept"
        :action="config.action"
        :on-success="(response, file, fileList) => uploadSuccess(response, file, fileList, item)"
        :on-error="uploadError"
        :on-progress="(event, file, fileList) => upLoadProgress(event, file, fileList, item)"
        :on-preview="uploadPreview"
        :on-remove="uploadRemove"
        :before-upload="beforeUpload">
        <!--缩略图--->
        <img v-if="item.imageUrl" :src="item.imageUrl" class="img-preview">
        <el-progress
          v-if="item.percentage > 0 && item.percentage < 100"
          type="circle"
          :stroke-width="4"
          :width="70"
          :percentage="item.percentage">
        </el-progress>
        <i v-if="!item.percentage" slot="default" class="el-icon-camera-solid avatar-uploader-icon"></i>
      </el-upload>
      <p class="title" v-if="item.title">{{item.title}}</p>
      <!-- 显示大图
      <el-dialog :visible.sync="dialogVisible" dappend-to-boy>
        <img width="120px" :src="dialogImageUrl">
      </el-dialog>-->
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      config: {
        accept: 'image/jpeg,image/png',
        showFileList: false,
        action: `${this.$api.uploadImage}?folder=student`
      }
    }
  },
  props: {
    uploadList: {
      type: Array,
      required: true
    }
  },
  methods: {
    handlePreview (file) {
      /*
      this.dialogImageUrl = file.url
      this.dialogVisible = true
      */
    },
    // 上传成功
    uploadSuccess (response, file, fileList, imgObj) {
      if (response.result !== 'ok') {
        this.$message.error('上传图片失败')
      }

      this.$message({
        message: '图片上传成功',
        type: 'success'
      })

      console.log(response)
      console.log(file)
      console.log(fileList)
      // 将返回的图片地址保存到图片数组
      this.$set(imgObj, 'imageUrl', response.message)
    },
    // 上传失败
    uploadError (err, file, fileList) {
      console.log(err)
      this.$message.error('图片上传失败!')
    },
    // 上传预览
    uploadPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 上传移除
    uploadRemove () {
    },
    // 上传前钩子，做图片预处理（大小限制、压缩）
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      /*
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      */

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }

      return isLt2M
    },
    // 上传进度
    upLoadProgress (event, file, fileList, imgObj) {
      this.$set(imgObj, 'percentage', parseInt(event.percent))
    }
  }
}
</script>

<style lang="scss" scoped>
  .wrapper-list {
    width: auto;
    display: flex;
    flex-flow: row wrap;
    .upload-wrapper {
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      margin-right: 20px;
      margin-bottom: 20px;

      .title {
        text-align: center;
        margin: 0;
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        line-height:20px;
        margin-top: 10px;
      }

      /* 预览图片 */
      .img-preview {
        width: 100%;
        height: 100%;
      }

      /* 上传框样式 */
      .avatar-uploader /deep/ .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 110px;
        height: 110px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .avatar-uploader /deep/ .el-upload:hover {
        border-color: #409EFF;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
