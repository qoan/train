<template>
  <div class="warp">
    <el-row style="height: 100%;">
      <el-col :span="18" style="height: 100%;padding: 40px 20px">
        <!---分页--->
        <el-tabs v-model="active" type="card" @tab-click="handleClick">
          <el-tab-pane label="班级管理" name="classManage">
            <div class="table-wrapper" v-loading="loading">
              <img v-if="len===0" src="@/assets/img/no.png" class="Img" />
              <el-table v-else :data="classData" height="600" stripe style="width: 100%">
                <el-table-column prop="className" label="班级名称"></el-table-column>
                <el-table-column prop="trainAreacode" label="培训地址">
                  <template slot-scope="scope">
                    <p
                      style="width: 100%; text-overflow:ellipsis; white-space:nowrap; overflow:hidden;"
                    >{{scope.row.trainAddress}}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="workType" label="培训工种" align="center"></el-table-column>
                <el-table-column prop="teacherName" label="培训老师" align="center">
                  <template slot-scope="scope">
                    <p>{{scope.row.teacherName | getTeacherString}}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="trainDateStart" label="开始时间" align="center"></el-table-column>
                <el-table-column prop="trainDateEnd" label="结束时间" align="center"></el-table-column>
                <el-table-column prop="studentCount" label="班级人数" align="center"></el-table-column>
                <el-table-column prop="status" label="班级状态" align="center">
                  <template slot-scope="scope">
                    <p
                      :style="{color: trainStatusEnumList[scope.row.clazzStatus].color}"
                    >{{classStatusType[scope.row.clazzStatus]}}</p>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="mini"
                      round
                      @click.native.prevent="$router.push({ name: 'classDetail', query: { tid: scope.row.tid } })"
                    >查看详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="教师管理" name="teacherManage" v-loading="loading">
            <div class="table-wrapper">
              <img v-if="len_one===0" src="@/assets/img/no.png" class="Img" />
              <el-table
                v-else
                :data="teacherData"
                height="600"
                stripe
                align="center"
                style="width: 100%"
              >
                <el-table-column prop="name" label="教师名称" width="150" align="center"></el-table-column>
                <el-table-column prop="sex" label="性别" width="150" align="center"></el-table-column>
                <el-table-column prop="education" label="文化程度" width="100" align="center"></el-table-column>
                <el-table-column prop="phone" label="联系电话" width="180" align="center"></el-table-column>
                <el-table-column prop="workStatus" label="当前状态" width="200" align="center">
                  <template slot-scope="scope">
                    <p
                      :style="{color: trainStatusEnumList[scope.row.workStatus].color}"
                    >{{teacherStatusEnumList[scope.row.workStatus].enumerValue}}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="className" label="所在班级" align="center"></el-table-column>
                <el-table-column fixed="right" label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="mini"
                      round
                      @click.native.prevent="$refs.dialogTeacherDetail.dialogVisible=true;$refs.dialogTeacherDetail.teacherTid=scope.row.tid"
                    >查看详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <dialog-teacher-detail ref="dialogTeacherDetail"></dialog-teacher-detail>
          </el-tab-pane>
          <el-tab-pane label="学员管理" name="studentManage" v-loading="loading">
            <div class="table-wrapper">
              <img v-if="len_two===0" src="@/assets/img/no.png" class="Img" />
              <el-table v-else :data="studentData" height="600" stripe style="width: 100%">
                <el-table-column prop="name" label="学员姓名" width="100" align="center"></el-table-column>
                <el-table-column prop="sex" label="性别" width="50" align="center"></el-table-column>
                <el-table-column prop="education" label="文化程度" width="100" align="center"></el-table-column>
                <el-table-column prop="phone" label="联系电话" width="120" align="center"></el-table-column>
                <el-table-column prop="personnelType" label="人员类别" width="120" align="center"></el-table-column>
                <el-table-column prop="className" label="所在班级" width="160"></el-table-column>
                <el-table-column prop="workType" label="培训工种" width="100" align="center"></el-table-column>
                <el-table-column prop="trainDateStart" label="开课日期" width="100" align="center"></el-table-column>
                <el-table-column prop="trainDateEnd" label="结业日期" width="100" align="center"></el-table-column>
                <el-table-column prop="trainStatus" label="培训状态" align="center">
                  <template slot-scope="scope">
                    <span
                      :style="{color: trainStatusEnumList[scope.row.trainStatus].color}"
                    >{{trainStatus[scope.row.trainStatus]}}</span>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="mini"
                      round
                      @click.native.prevent="$router.push({ name: 'studentDetail', query: { tid: scope.row.studentId } })"
                    >查看详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
        <!---分页导航--->
        <el-pagination
          background
          v-if="show"
          layout="prev, pager, next"
          @current-change="pageChange"
          :total="paginationInfo.pageTotle"
          :current-page="paginationInfo.pageIndex"
          :page-size="paginationInfo.pageSize"
          style="text-align: center;margin-top: 10px"
        ></el-pagination>
      </el-col>
      <el-col :span="6" style="height: 100%;background-color: #fff;">
        <div class="top">
          <p @click="$router.push({ path: '/school' })">
            <img src="../../assets/img/icon/icon-history.png" width="14" height="14" alt />返回
          </p>
          <p>
            <span class="iconfont icon-brand" style="color: #728BD8; margin-right: 5px;"></span>
            {{schoolInfo.schoolName}}
          </p>
          <p style="padding: 0;">{{schoolInfo.schoolAddress}}</p>
          <p>学校负责人：{{schoolInfo.schoolMaster}}</p>
          <p>联系电话：{{schoolInfo.schoolPhone}}</p>
          <p>学校类型：{{schoolInfo.schoolType}}</p>
          <p>学校性质：{{schoolInfo.schoolKind}}</p>
          <p>主管部门：{{schoolInfo.agenceName}}</p>
        </div>
        <div class="bottom">
          <div>
            <div>累计开班数</div>
            <div>
              {{schoolTrainInfo.classCount||0}}
              <span>个</span>
            </div>
          </div>
          <div>
            <div>正在开班数</div>
            <div>
              {{schoolTrainInfo.onClassCount}}
              <span>个</span>
            </div>
          </div>
          <div>
            <div>累计培训人次</div>
            <div>
              {{schoolTrainInfo.trainStudent}}
              <span>人次</span>
            </div>
          </div>
          <div>
            <div>正在培训人数</div>
            <div>
              {{schoolTrainInfo.onTrainStudent}}
              <span>人</span>
            </div>
          </div>
          <div>
            <div>培训合格率</div>
            <div>{{schoolTrainInfo.passPercent}}</div>
          </div>
          <div>
            <div>培训就业率</div>
            <div v-if="message===null">{{ parseFloat(0).toFixed(2)}}%</div>
            <div else>{{message}}</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DialogTeacherDetail from '@/view/teacher/dialog/DialogTeacherDetail'
export default {
  components: {
    DialogTeacherDetail
  },
  data() {
    return {
      message: 0, // 就业率
      loading: false,
      len: 0,
      show: false,
      len_one: 0,
      len_two: 0,
      schoolInfo: {
        schoolName: '',
        schoolAddress: '',
        schoolMaster: '',
        schoolPhone: '',
        schoolType: '',
        schoolKind: '', // 性质
        agenceName: '' // 主管部门
      },
      schoolTrainInfo: {
        classCount: null,
        onTrainStudent: null,
        onClassCount: null,
        trainStudent: null,
        passPercent: null
      },
      paginationInfo: {
        pageTotle: 0,
        pageIndex: 1,
        pageSize: 8
      },
      active: 'classManage',
      classData: [],
      teacherData: [],
      studentData: [], // 学生列表
      classTeacherInfo: [],
      classStatusType: ['待开班', '开班中', '已结束'],
      trainStatusEnumList: [
        {
          tid: 0,
          color: '#7ED321'
        },
        {
          tid: 1,
          color: 'red'
        },
        {
          tid: 2,
          color: 'pink'
        }
      ],
      trainStatus: ['待培训', '培训中', '培训结束'],
      teacherStatusEnumList: [
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
  filters: {
    getTeacherString(val) {
      return val !== null ? val.split('/')[0] : ''
    }
  },
  mounted() {
    // 获取学校信息
    this.getSchoolInfo()
    // 获取学员信息
    this.getClassList()
    // 获取培训信息
    this.getSchoolTrainPersonData()
    this.employmentRate()
  },
  methods: {
    // 就业率
    employmentRate() {
      this.axios.get(this.$api.getEmploymentRateBySchoolSmall + `${this.$route.query.tid}`).then(res => {
        this.message = res.data.message
        console.log(res)
      })
    },
    // 获取指定schoolId的学生列表
    getStdList() {
      this.loading = true
      // 查询条件
      let params = {
        pageIndex: this.paginationInfo.pageIndex,
        pageSize: this.paginationInfo.pageSize,
        paramObj: {
          schoolId: this.$route.query.tid
        }
      }

      return this.axios
        .post(this.$api.getClassStdList, params)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }

          this.studentData = res.data.data.records
          this.len_two = res.data.data.records.length
          if (this.len_two === 0) {
            this.show = false
          } else {
            this.show = true
          }
          this.paginationInfo.pageTotle = res.data.data.total
          return res.data.data
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 获取指定schoolId的教师列表
    getTeacherList() {
      let params = {
        pageIndex: this.paginationInfo.pageIndex,
        pageSize: this.paginationInfo.pageSize,
        paramObj: {
          schoolId: this.$route.query.tid // this.$route.query.tid // this.searchForm.schoolId
        }
      }

      this.loading = true
      return this.axios
        .post(this.$api.getTeacherSelectPage, params)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }

          this.teacherData = res.data.data.records
          this.len_one = res.data.data.records.length
          if (this.len_one === 0) {
            this.show = false
          } else {
            this.show = true
          }
          this.paginationInfo.pageTotle = res.data.data.total
          return res.data.data
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 获取指定schoolId的班级列表
    getClassList() {
      this.loading = true
      let params = {
        pageIndex: this.paginationInfo.pageIndex,
        pageSize: this.paginationInfo.pageSize,
        paramObj: {
          schoolId: this.$route.query.tid
        }
      }

      return this.axios
        .post(this.$api.classSelectPage, params)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }
          this.classData = res.data.data.records
          console.log(this.classData)
          this.len = res.data.data.records.length
          this.paginationInfo.pageTotle = res.data.data.total
          if (this.paginationInfo.pageTotle === 0) {
            this.show = false
          } else {
            this.show = true
          }
          return res.data.data.records
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 获取指定schoolId的学校细信息
    getSchoolInfo() {
      this.$http
        .get(this.$api.findById + '?tid=' + this.$route.query.tid)
        .then(res => {
          this.schoolInfo = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 请求 - 通过学校id查询学校的培训开班数 培训人数 合格率
    getSchoolTrainPersonData() {
      return this.axios
        .post(this.$api.getClassCountDataBySchoolId + this.$route.query.tid)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }

          this.schoolTrainInfo.classCount = res.data.data.total_class_count
          this.schoolTrainInfo.trainStudent = res.data.data.total_student_count
          this.schoolTrainInfo.onClassCount = res.data.data.on_class_count
          this.schoolTrainInfo.onTrainStudent = res.data.data.on_student_count
          this.schoolTrainInfo.passPercent = res.data.data.pass_percent
          return res.data.data
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // tab按钮切换
    handleClick(tab) {
      // 切换页面时重置页面Index
      this.paginationInfo.pageIndex = 1
      switch (tab.name) {
        case 'classManage':
          this.getClassList()
          break
        case 'teacherManage':
          this.getTeacherList()
          break
        case 'studentManage':
          this.getStdList()
          break
        default:
          console.log('超出选中范围，请检查!')
      }
    },
    // 导航分页切换
    pageChange(val) {
      this.paginationInfo.pageIndex = val
      switch (this.active) {
        case 'classManage':
          this.getClassList()
          break
        case 'teacherManage':
          this.getTeacherList()
          break
        case 'studentManage':
          this.getStdList()
          break
        default:
          console.log('超出选中范围，请检查!')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.warp {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.Img {
  margin-top: 100px;
  color: #909399;
  width: 200px;
  height: 200px;
  transform: translateX(-100px);
  margin-left: 50%;
  margin-bottom: 100px;
}
.title {
  margin-top: 40px;
  margin-bottom: 40px;
}
.top {
  height: 30%;
  padding-top: 60px;
  padding-left: 24px;
  padding-right: 24px;
  position: relative;
  p {
    font-size: 12px;
    color: #494a4b;
    line-height: 22px;
    &:nth-of-type(1) {
      font-size: 14px;
      color: #3458c7;
      position: absolute;
      right: 22px;
      top: 31px;
      img {
        vertical-align: middle;
      }
      cursor: pointer;
    }
    &:nth-of-type(2) {
      font-size: 16px;
      img {
        margin-right: 12px;
      }
    }
    &:nth-of-type(3) {
      padding-left: 25px;
    }
    &:nth-of-type(4) {
      margin-top: 20px;
    }
    &:nth-of-type(6) {
      margin-top: 10px;
    }
    &:nth-of-type(8) {
      margin-top: 10px;
    }
  }
}
.bottom {
  height: 70%;
  padding: 24px;
  overflow: hidden;
  > div {
    height: 65px;
    line-height: 65px;
    border: 1px solid #3458c7;
    margin-top: 15px;
    display: flex;
    > div {
      &:first-of-type {
        flex: 6;
        font-size: 12px;
        color: #7a7b7e;
        padding-left: 24px;
      }
      &:last-of-type {
        flex: 4;
        font-size: 18px;
        font-weight: bold;
        span {
          font-size: 12px;
          color: #7a7b7e;
        }
        a {
          color: #3559c7;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
  }
}

.el-table {
  &::before {
    height: 0;
  }
}
</style>
<style>
.table-wrapper {
  margin-top: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #fff;
}
.el-tabs--card > .el-tabs__header {
  border-bottom: none;
}
.el-tabs--card > .el-tabs__header .el-tabs__nav {
  border: none;
}
.el-tabs--card > .el-tabs__header .el-tabs__item {
  border-left: none;
}
.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom: none;
}
.el-tabs__item {
  height: 30px;
  line-height: 30px;
  font-size: 12px;
}
.el-tabs__item.is-active {
  background-color: #409eff;
  color: #fff;
  border-radius: 20px;
  font-size: 12px;
}
.el-table__fixed-right::before,
.el-table__fixed::before {
  background-color: #fff;
}
</style>
