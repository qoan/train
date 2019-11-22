<template>
  <div class="photo-image_preview">
    <el-image
      :style="{'width': width + 'px', 'height': height + 'px'}"
      :src="imgUrl"
      :preview-src-list="[imgUrl]"
      :fit="fit">
      <!-- 占位内容 -->
      <div slot="placeholder" class="image-slot">
        <i class="el-icon-picture-outline"></i>
        加载中...
      </div>
      <!-- 加载失败 -->
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline"></i>
        <!--加载失败-->
      </div>
    </el-image>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: {
    fit: {
      type: String,
      default: 'fill'
    },
    height: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    imgUrl: {
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-image {
    border-radius: 3px;
  }
  .image-slot {
    height: 100%;
    width: 100%;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    background-color: #F5F7FA;
    color: #C0C4CC;
    i {
      font-size: 18px;
      padding: 10px;
    }
  }
</style>
