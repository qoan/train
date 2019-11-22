<template>
  <div class="export-wrapper">
    <section class="step-wapper">
      <el-steps :active="active" align-center finish-status="success" process-status="finish">
        <el-step title="选择表格类型"></el-step>
        <el-step title="选择导出班级"></el-step>
        <el-step title="选择地区模板"></el-step>
        <el-step title="完成导出"></el-step>
      </el-steps>
    </section>
    <!-- 选择类型页 -->
    <section class="select-type export-menu" v-if="active === 0">
      <div class="top">
        <p class="menu-title">请选择要导出的表格类型</p>
      </div>
      <div class="card-wrapper">
        <div
          class="padding-wrapper"
          v-for="(item, index) in exportMenuList"
          :key="index"
          @click="selectTableType(index, item.alias)"
          style="cursor: pointer"
        >
          <el-card shadow="hover" :class="{bgColor: item.check}">
            <p>{{item.title}}</p>
          </el-card>
        </div>
      </div>
      <div class="bottom">
        <el-button
          type="primary"
          size="mini"
          @click="active++"
          v-if="params.excelMudName !== ''"
        >下一步</el-button>
      </div>
    </section>

    <!-- 选择导出班级页 -->
    <section class="select-class export-menu" v-if="active === 1">
      <div class="top">
        <p class="menu-title">请选择要导出的班级</p>
        <el-form
          ref="form"
          :inline="true"
          label-position="left"
          label-width="90px"
          style="width: 100%; font-size: 16px; margin-top: 20px"
        >
          <el-row>
            <el-form-item label="班级名称：" style="margin-right: 60px">
              <el-input placeholder="请输入班级名称" v-model="className" size="mini" style="width: 220px"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" size="mini" @click="getDataList">查 询</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>

      <div class="card-wrapper">
        <div
          class="padding-wrapper"
          v-for="(item, index) in classData"
          :key="index"
          @click="checkStatus(item.tid)"
        >
          <el-card shadow="hover" style="cursor: pointer">
            <div>
              <p>{{item.className}}</p>
              <el-badge is-dot class="item">
                <p
                  :style="item.clazzStatus | getClassStatuColor"
                >{{item.clazzStatus | getClassStatu}}</p>
              </el-badge>
            </div>
            <div>
              <i
                class="iconfont icon-school"
                style="color: rgba(0, 0, 0, 0.49); padding-right: 10px;"
              ></i>
              <p>{{item.schoolName}}</p>
            </div>
            <el-checkbox v-model="item.selectStatus"></el-checkbox>
          </el-card>
        </div>
      </div>
      <!-- 分页导航 -->
      <el-pagination
        :background="true"
        @current-change="pageChange"
        :total="pageTotal"
        :current-page="pageIndex"
        :page-size="pageSize"
        style="text-align: center;"
        layout="prev, pager, next"
      ></el-pagination>
      <div class="bottom" style="margin-top: 20px">
        <el-button type="primary" size="mini" @click="active--">上一步</el-button>
        <el-button type="primary" size="mini" @click="active++" v-if="params.classId !== 0">下一步</el-button>
      </div>
    </section>

    <!-- 选择地区页 -->
    <section class="select-area export-menu" v-if="active === 2">
      <div class="top">
        <p class="menu-title">请选择要导出的地区模板</p>
      </div>
      <div class="card-wrapper">
        <div
          class="padding-wrapper"
          v-for="(item, index) in exportAreaList"
          :key="index"
          @click="selectAreaTemplate(index, item.alias)"
          style="cursor: pointer"
        >
          <el-card shadow="hover" :class="{bgColor: item.check}">
            <p>{{item.title}}</p>
          </el-card>
        </div>
      </div>
      <div class="bottom">
        <el-button type="primary" size="mini" @click="active--">上一步</el-button>
        <el-button type="primary" size="mini" @click="downloadExcel" v-if="params.area !== ''">下一步</el-button>
      </div>
    </section>

    <!-- 完成导出页页 -->
    <section class="export-finish export-menu" v-if="active === 3">
      <div class="top">
        <p class="menu-title">导出成功</p>
      </div>
      <div class="card-wrapper">
        <i class="iconfont icon-success" style="font-size: 100px; color: #3CC66C"></i>
      </div>
      <div class="bottom">
        <el-button type="primary" size="mini" @click="$router.go(0)">确 认</el-button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      downloadUrl: '',
      pageIndex: 1,
      pageSize: 8,
      pageTotal: 0,
      className: '',
      classData: [],
      active: 0,
      value: '',
      params: {
        excelMudName: '',
        area: '',
        classId: 0
      },
      exportMenuList: [
        /* {
          title: '学生培训申请表',
          alias: 'peixunshenqin',
          check: false
        },
        {
          title: '学生推荐统计表',
          alias: 'tuijiantongji',
          check: false
        },
        {
          title: '学生就业统计表',
          alias: 'jiuyetongji',
          check: false
        },
        {
          title: '学生结业花名册',
          alias: 'jieyehuamingce',
          check: false
        },
        */
        {
          title: '班级学员花名册',
          alias: 'xueyuanhuamingce',
          check: false
        },
        {
          title: '开班申请表',
          alias: 'kaibanshenqing',
          check: false
        },
        {
          title: '学员个人申请表',
          alias: 'peixunshenqing',
          check: false
        },
        {
          title: '学员岗位推荐统计表',
          alias: 'gangweituijian',
          check: false
        },
        {
          title: '学员考勤记录表',
          alias: 'xueyuankaoqin',
          check: false
        }
      ],
      exportAreaList: [
        {
          title: '贵阳市模板',
          alias: 'guiyang',
          check: false
        },
        {
          title: '贵安新区模板',
          alias: 'guian',
          check: false
        }

        /*
        {
          title: '铜仁市模板',
          alias: 'tongren',
          check: false
        },
        {
          title: '系统通用模板',
          alias: 'tongyong',
          check: false
        } */
      ]
    }
  },
  filters: {
    getClassStatu(val) {
      if (val === 0) return '未开班'
      if (val === 1) return '开班中'
      if (val === 2) return '已结束'
    },
    getClassStatuColor(val) {
      if (val === 0) return { color: '#F5A623' }
      if (val === 1) return { color: '#4A90E2' }
      if (val === 2) return { color: 'rgba(0, 0, 0, 0.49)' }
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    // 下载
    downloadExcel() {
      this.downloadUrl = this.$api.exportExcel + '?classId=' + this.params.classId + '&excelMudName=' + this.params.excelMudName + '&area=' + this.params.area
      this.active++
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', this.downloadUrl)
      a.click()
    },
    // 选择地区模板
    selectAreaTemplate(i, alias) {
      this.params.area = alias
      this.exportAreaList.forEach((item, index) => {
        if (i === index) {
          this.exportAreaList[index].check = true
        } else {
          this.exportAreaList[index].check = false
        }
      })
    },
    // 选择表格类型
    selectTableType(i, alias) {
      this.params.excelMudName = alias
      this.exportMenuList.forEach((item, index) => {
        if (i === index) {
          this.exportMenuList[index].check = true
        } else {
          this.exportMenuList[index].check = false
        }
      })
    },
    // 选择班级状态
    checkStatus(tid) {
      this.params.classId = tid
      this.classData.forEach((item, index) => {
        if (item.tid === tid) {
          if (this.classData[index].selectStatus) {
            this.classData[index].selectStatus = false
            this.params.classId = 0
          } else {
            this.classData[index].selectStatus = true
            this.params.classId = tid
          }
        } else {
          this.classData[index].selectStatus = false
        }
      })
    },
    // 获取数据
    getDataList() {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        paramObj: {
          className: this.className
        }
      }
      this.$http
        .post(this.$api.classSelectPage, params)
        .then(res => {
          let result = res.data.data.records
          this.pageTotal = res.data.data.total

          result.forEach((item, index) => {
            result[index].selectStatus = false
          })

          this.classData = result
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 事件 - 分页导航页面改变
    pageChange(val) {
      this.pageIndex = val
      this.getDataList()
    }
  }
}
</script>

<style lang="scss" scoped>
.export-wrapper {
  width: 100%;
  height: 100%;
  padding: 30px 30px 70px;
  box-sizing: border-box;
  display: flex;
  flex-flow: column nowrap;
  /* 进度条 */
  .step-wapper {
    .el-steps {
      margin: 50px 140px;
      .el-step {
        /deep/ .el-step__head {
          .el-step__icon {
            border-width: 12px;
            .el-step__icon-inner {
              color: #fff;
            }
          }
          .el-step__line {
            left: 80%;
            right: -20%;
            background-color: transparent;
            .el-step__line-inner {
              border-top: none !important;
              border-style: dotted;
              border-width: 5px !important;
              width: 100% !important;
            }
          }
        }
      }
    }
  }

  /* 选择表格类型  选择地区类型 */
  .select-type,
  .select-area {
    position: relative;
    width: 100%;
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
    overflow: auto;
    padding: 30px;
    box-sizing: border-box;
    background-color: #fff;
    .top {
      .menu-title {
        font-size: 16px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.7);
        line-height: 31px;
      }
    }
    .card-wrapper {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(auto-fill, 20%);
      grid-template-rows: repeat(auto-fill, 170px);
      .padding-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .el-card {
        width: 260px;
        height: 110px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f5f6fc;
        border-radius: 0px;
        border: 1px solid rgba(52, 88, 199, 0.2);
        p {
          font-size: 18px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.7);
          line-height: 31px;
        }
        &:hover {
          background-color: #3458c7;
        }
      }
      .bgColor {
        background-color: #3458c7;
      }
    }
    .bottom {
      text-align: center;
    }
  }

  /* 选择导出班级 */
  .select-class {
    position: relative;
    width: 100%;
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
    overflow: auto;
    padding: 30px;
    box-sizing: border-box;
    background-color: #fff;
    .top {
      .menu-title {
        font-size: 16px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.7);
        line-height: 31px;
      }
    }
    .card-wrapper {
      flex: 1;
      display: grid;
      overflow: auto;
      grid-template-columns: repeat(auto-fill, 25%);
      grid-template-rows: repeat(auto-fill, 170px);
      .padding-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .el-card {
        width: 360px;
        height: 120px;
        display: flex;
        flex-flow: column;
        border-radius: 0px;
        position: relative;
        div:nth-child(1) {
          display: flex;
          justify-content: space-between;
          p:nth-child(1) {
            font-size: 18px;
            font-family: PingFangSC-Regular;
            font-weight: 500;
            color: rgba(52, 88, 199, 1);
            letter-spacing: 3px;
            line-height: 31px;
          }
          .el-badge {
            /deep/ .el-badge__content {
              top: 50%;
              left: -50%;
            }
          }
          p:nth-child(2) {
            font-size: 15px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(245, 166, 35, 1);
            line-height: 31px;
          }
        }
        div:nth-child(2) {
          display: flex;
          align-items: center;
          p:nth-child(1) {
            font-size: 15px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.49);
            line-height: 31px;
          }
        }
        .el-checkbox {
          position: absolute;
          bottom: 0;
          right: 0;
          /deep/ .el-checkbox__inner {
            width: 0;
            height: 0;
            border-left: 15px solid transparent;
            border-top: 15px solid transparent;
            border-right: 15px solid #2756c4;
            border-bottom: 15px solid #2756c4;
          }
        }
        .el-checkbox.is-checked /deep/ .el-checkbox__inner {
          background-color: transparent;
        }
      }
    }
    .bottom {
      text-align: center;
    }
  }

  /* 导出完成 */
  .export-finish {
    height: 100%;
    display: flex;
    flex-flow: column;
    .card-wrapper {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
    }
    .bottom {
      text-align: center;
    }
  }
}
</style>
