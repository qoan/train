<template>
  <el-dialog
    @open="open"
    @close="close"
    :visible.sync="dialogVisible"
    :custom-class="customClass"
    title="教师详情"
    width="40%"
    style="border-radius: 10px;"
  >
    <el-row v-loading="loading">
      <section class="baseInfo">
        <photo
          style="padding: 0 30px 0 20px"
          v-bind="{imgUrl: teacherInfo.photoUrl, width: 130, height: 164}"
        ></photo>
        <!-- <img :src="teacherInfo.photoUrl" style="width: 130px; height: 164px; margin: 10px 40px 10px 20px;"> --->
        <div class="right">
          <p class="name">{{teacherInfo.name}}</p>
          <div style="border-bottom: 1px solid #E7E9F1;">
            <p>录入时间：{{teacherInfo.createTime | getCreateTime}}</p>
            <p>身份证：{{teacherInfo.idCard}}</p>
            <p>
              当前状态：
              <span
                :style="{color: getworkStatusColor(teacherInfo.workStatus)}"
              >{{teacherInfo.workStatus | getworkStatusType(workStatusEnumList)}}</span>
            </p>
          </div>
          <div style="display: flex;">
            <div style="display: flex;  flex-flow: column;">
              <p>性别：{{teacherInfo.sex | getSexType}}</p>
              <p>文化程度：{{teacherInfo.education}}</p>
            </div>
            <div style="display: flex;  flex-flow: column; margin-left: 40px;">
              <p>年龄：{{teacherInfo.age}}岁</p>
              <p>联系电话：{{teacherInfo.phone}}</p>
            </div>
          </div>
        </div>
      </section>
      <section
        class="qualifyInfo"
        style="padding: 20px; border-bottom: 1px solid #E7E9F1; position: relative"
      >
        <div style="display: flex; align-items: flex-end; margin-bottom: 20px;">
          <h3>教师资质</h3>
          <!-- 暂时屏蔽 -->
          <el-button type="text" round size="mini" class="editBtn" style="padding-bottom: 0">
            <i class="el-icon-edit-outline" @click="downTeacherQualify(getOtherFileUrl)">下载</i>
          </el-button>
        </div>
        <div
          v-if="getOtherFileUrl"
          style="display: flex; flex-flow: row wrap;"
          class="demo-image__lazy"
        >
          <photo
            style="margin:0 40px 20px 0;"
            v-bind="{imgUrl: item.url, width: 150, height: 100}"
            v-for="(item, index) in getOtherFileUrl"
            :key="index"
            lazy
          ></photo>
        </div>
        <p v-else style="text-align: center; width: 100%; color: #C0C4CC; padding: 30px 0">暂无记录</p>
      </section>
      <section class="history">
        <h3>历史授课记录</h3>
        <div
          v-if="teacherInfo.teachersCourseDTOList && teacherInfo.teachersCourseDTOList.length > 0"
          class="wrapper"
        >
          <div v-for="(item, index) in teacherInfo.teachersCourseDTOList" :key="index">
            <p>{{item.className}}</p>
            <p>{{item.workType}}</p>
            <p>{{`${item.trainDateStart.replace(/-/g, '/')} - ${item.trainDateEnd.replace(/-/g, '/')}`}}</p>
            <el-button
              type="text"
              @click="$router.push({ name: 'classDetail', query: {tid: item.classId}});dialogVisible=false"
            >查看详情</el-button>
          </div>
        </div>
        <p v-else style="text-align: center; width: 100%; color: #C0C4CC; padding: 30px 0">暂无记录</p>
      </section>
    </el-row>
  </el-dialog>
</template>

<script>
import Photo from '@/components/select/Photo'
import DownUtil from '@/utils/downUtil.js'
export default {
  components: {
    Photo
  },
  data() {
    return {
      customClass: 'teacher-dialog',
      title: '教师详情',
      dialogVisible: false,
      loading: false,
      teacherTid: null,
      teacherInfo: {},
      workStatusEnumList: [
        {
          tid: 0,
          color: '#7ED321',
          enumerValue: '空闲'
        },
        {
          tid: 1,
          color: 'red',
          enumerValue: '工作中'
        }
      ]
    }
  },
  computed: {
    getOtherFileUrl() {
      if (!this.teacherInfo.otherFileUrl) {
        return false
      }

      let images = JSON.parse(this.teacherInfo.otherFileUrl)
      if (images.length <= 0) {
        return false
      }
      return images
    }
  },
  filters: {
    getCreateTime(time) {
      return time ? time.slice(0, 10) : ''
    },
    getworkStatusType(statu, enumList) {
      return statu === undefined ? '' : enumList[statu].enumerValue
    },
    getSexType(val) {
      return parseInt(val) === 1 ? '男' : '女'
    }
  },
  methods: {
    // dialog打开钩子
    open() {
      this.loading = true
      return this.axios
        .post(this.$api.getTeacherInfoById + this.teacherTid)
        .then(res => {
          console.log(res)
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }

          this.teacherInfo = res.data.data
          return res.data.data
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    close() {
      this.teacherInfo = {}
    },
    getworkStatusColor(statu) {
      return statu === undefined ? '' : this.workStatusEnumList[statu].color
    },
    // 下载教师资质
    downTeacherQualify(getOtherFileUrl) {
      if (this.teacherInfo.personFileList && this.teacherInfo.personFileList.length > 0) {
        DownUtil.batchDown(this.teacherInfo.personFileList.map(item => item.fileUrl))
      }
      var a = document.createElement('a')
      a.download = getOtherFileUrl.name
      a.href = getOtherFileUrl.url
      a.click()
      console.log(getOtherFileUrl)
    },
    showBox() {
      var a = document.createElement('a')
      a.download = '下载.png'
      a.href = 'http://training-prod.oss-cn-qingdao.aliyuncs.com/pictures/teacherQuelify/f42302d83be24aff8c76ffe9eeea8abe.png'
      a.click()
    }
  }
}
</script>

<style lang="scss">
/* dialog位于顶层，scoped局域是无法选中的， 所以最好定义dialog的类名 */
.teacher-dialog {
  .el-dialog__header {
    border-bottom: 1px solid #f7f7f7;
  }
  .el-dialog__body {
    padding-left: 40px;
    padding-right: 40px;
  }

  .baseInfo {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #e7e9f1;
    .right {
      font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
      display: flex;
      flex-flow: column;
      width: 100%;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.7);
      line-height: 31px;
      .name {
        font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
        font-size: 18px;
        color: rgba(0, 0, 0, 0.7);
        line-height: 35px;
        border-bottom: 1px solid #e7e9f1;
      }
    }
  }
  .history {
    padding: 20px;
    h3 {
      margin-bottom: 20px;
    }
    .wrapper {
      height: 200px;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 6px; // 横向滚动条
        height: 6px; // 纵向滚动条 必写
      }
      &::-webkit-scrollbar-thumb {
        background-color: grey;
        border-radius: 5px;
      }
      div {
        display: grid;
        grid-template-columns: 1fr 1fr 2fr 0.5fr;
        p {
          font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.7);
          line-height: 31px;
        }
      }
    }
  }
}
</style>
