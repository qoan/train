<template>
  <div class="warp">
    <el-row style="height: 100%;">
      <!-- 班级学生表格 -->
      <el-col :span="18" style="height: 100%;padding: 0 20px">
        <p class="title">学员信息</p>
        <div class="btnBox">
          <el-button
            type="primary"
            v-if="userType === 5"
            @click="$refs.computerDialog.dialogVisible=true;$refs.computerDialog.classId=$route.query.tid"
          >培训经费</el-button>
          <el-button
            type="primary"
            v-if="userType === 5"
            @click="$refs.editStdDialog.dialogVisible=true;$refs.editStdDialog.classId=$route.query.tid"
          >编辑学员</el-button>
          <el-button
            v-if="userType === 5"
            type="primary"
            @click="$refs.importClassStd.dialogVisible=true;$refs.importClassStd.classId=$route.query.tid"
          >导入学员</el-button>
          <el-button
            v-if="userType === 5"
            type="primary"
            @click="$refs.importStdScore.dialogVisible=true"
          >导入学员成绩</el-button>
        </div>
        <el-table
          :data="studentInfo"
          v-loading="loading"
          height="540"
          stripe
          :header-cell-style="{'background': '#F9F9FB', 'border': 'none'}"
          :cell-style="{'background': '#F9F9FB'}"
        >
          <el-table-column prop="name" label="学员姓名" width="80"></el-table-column>
          <el-table-column prop="sex" label="性别" align="center" width="70">
            <template slot-scope="scope">
              <p>{{scope.row.sex | getSexType}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="nation" label="民族" align="center" width="80"></el-table-column>
          <el-table-column prop="idCard" label="身份证号" align="center" width="150"></el-table-column>
          <el-table-column prop="education" label="文化程度" align="center" width="100"></el-table-column>
          <el-table-column prop="personnelType" label="人员类别" align="center" width="140">
            <template slot-scope="scope">
              <p>{{scope.row.personnelType}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="家庭住址" align="center" width="180"></el-table-column>
          <el-table-column prop="phone" label="联系电话" align="center" width="130"></el-table-column>
          <el-table-column prop="passStatus" label="培训成绩" align="center" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.passStatus === 0" style="color: #FFBC4C">待录入</span>
              <span v-if="scope.row.passStatus === 1" style="color: #7ED321">合格</span>
              <span v-if="scope.row.passStatus === 2" style="color: red">不合格</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="160">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                round
                @click.native.prevent="goStudentDetail(scope.row)"
              >查看详情</el-button>
              <el-button
                type="text"
                size="small"
                v-if="userType === 5"
                @click="deleteStudent(scope.row.studentId)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          background
          @current-change="pageChange"
          :total="pagination.pageTotal"
          :current-page="pagination.pageIndex"
          :page-size="pagination.pageSize"
          layout="prev, pager, next"
          style="text-align: center;margin-top: 40px"
        ></el-pagination>
      </el-col>
      <!-- 班级详情 -->
      <el-col :span="6" style="height: 100%;background-color: #fff;" class="classDetail">
        <div class="top">
          <div class="item">
            <div class="class-name">
              <p>
                <span class="iconfont icon-brand" style="color: #728BD8; margin-right: 5px;"></span>
                {{classDetail.className}}
              </p>
              <el-button
                v-if="userType === 5"
                round
                type="text"
                size="mini"
                @click="showEditClass()"
              >
                <i class="el-icon-edit-outline"></i>编辑
              </el-button>
            </div>
            <p>{{classDetail.trainAddress}}</p>
          </div>

          <div class="item">
            <p>学校名称：{{classDetail.schoolName}}</p>
            <p>培训类别：{{classDetail.trainType}}</p>
            <p>培训工种：{{classDetail.workType}}</p>
          </div>

          <div class="item">
            <p>培训课时：{{classDetail | getTrainTime}}</p>
            <p>培训层次：{{getTrainType(classDetail.trainLevelTid)}}</p>
          </div>
          <div class="item">
            <p>培训上课时间：{{classDetail.classBeginTime}}</p>
            <p>培训下课时间：{{classDetail.classOverTime}}</p>
          </div>
          <div class="item">
            <p>培训开始时间：{{classDetail.trainDateStart}}</p>
            <p>培训结束时间：{{classDetail.trainDateEnd}}</p>
          </div>
        </div>
        <div class="bottom">
          <div>
            <div>班级人数</div>
            <div>
              {{classStudent.studentCount}}
              <span>人</span>
            </div>
          </div>
          <div>
            <div>授课老师</div>
            <div style="flex: 25;font-size:14px">
              <!-- 默认最多显示两个 -->
              理论:{{classDetail.theoryTeacher.teacherName}} 实操:{{classDetail.practiceTeacher.teacherName}}
              <!---<a>详情</a> 暂时注释 --->
            </div>
          </div>
          <div>
            <div>今日应到人数</div>
            <div>
              {{totalStudent}}
              <span>人</span>
            </div>
          </div>
          <div>
            <div>今日实到人数</div>
            <div>
              {{classDetail.actualGoStdCount}}
              <span>人</span>
            </div>
          </div>
          <div>
            <div>培训合格率</div>
            <div
              v-if="classStudent.studentCount!==0"
            >{{ parseFloat(classPage/classStudent.studentCount*100||0).toFixed(2)}}%</div>
            <div v-else>{{ parseFloat(0).toFixed(2)}}%</div>
          </div>
          <div>
            <div>培训就业率</div>
            <!-- 保留小数 -->
            <div>{{message}}</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!--导入学员成绩弹窗-->
    <import-std-score ref="importStdScore" @getTableData="getStudentInfo"></import-std-score>
    <!--编辑学员弹窗-->
    <edit-std-dialog ref="editStdDialog" @closeOk="getStudentInfo"></edit-std-dialog>
    <!---编辑班级弹窗---->
    <edit-class-dialog ref="editClassDialog" @submitOk="getClassDetail"></edit-class-dialog>
    <!-- 培训经费弹窗 -->
    <ComputerDialog ref="computerDialog"></ComputerDialog>
    <import-class-std ref="importClassStd" @getTableData="getStudentInfo"></import-class-std>
  </div>
</template>

<script>
import ClassModel from '@/model/class'
import enumUtil from '@/utils/enumUtil.js'
import ClassEntity from '@/model/entity/classEntity'
import ImportStdScore from '@/view/class/dialog/ImportStdScore'
import EditStdDialog from '@/view/class/dialog/EditStdDialog'
import EditClassDialog from '@/view/class/dialog/editClassDialog'
import ComputerDialog from '@/view/class/dialog/ComputerDialog'
import ImportClassStd from '@/view/class/dialog/ImportClassStd'

export default {
  components: {
    ImportStdScore,
    EditStdDialog,
    EditClassDialog,
    ComputerDialog,
    ImportClassStd
  },
  data() {
    return {
      totalStudent: 0,
      classPage: 0,
      trainPasaRate: 0,
      loading: false,
      userType: null, // 用户类型
      enumList: {}, // 枚举列表
      classDetail: new ClassEntity(), // 班级详细信息
      classStudent: [],
      pagination: {
        pageTotal: 0, // 数据总条数
        pageIndex: 1, // 当前页数索引
        pageSize: 10 // 一页展示的页数
      },

      classInfo: null, // 班级信息
      teacherInfo: null, // 教师信息
      studentInfo: [], // 学生信息
      studentDialog: false,
      editStudentDialog: false,
      message: null
    }
  },
  mounted() {
    // 获取班级详细信息
    this.getClassDetail()
    this.passPage()
    this.employmentRate()
    // 获取班级列表
    this.getStudentInfo()
    this.getStudentCount()
    // 获取枚举
    this.enumList = enumUtil.getEnumList(['work_type', 'train_level', 'education', 'personnel_type'])
    console.log(this.enumList)
    this.enumList.trainStatu = [{ value: '待录入', color: '#7ED321' }, { value: '合格', color: '#FFBC4C' }, { value: '不合格', color: '#000' }]
    this.userType = parseInt(JSON.parse(sessionStorage.getItem('userInfo')).roleTid)
  },
  computed: {
    getWorkType() {
      return function(tid) {
        if (tid < 0) return '无'
        return enumUtil.getEnumValue(this.enumList.work_type, tid)
      }
    },
    getTrainType() {
      return function(tid) {
        if (tid < 0) return '无'
        return enumUtil.getEnumValue(this.enumList.train_level, tid)
      }
    },
    getTrainStatu() {
      return function(tid) {
        if (tid < 0) return { value: '无', color: 'red' }
        return this.enumList.trainStatu[tid]
      }
    }
  },
  filters: {
    getTrainTime(classDetail) {
      if (!classDetail) return '无'
      return `理论${classDetail.theoryCount}节，实操${classDetail.practiceCount}节`
    },
    getSexType(val) {
      if (val === null) return '无'
      return parseInt(val) === 1 ? '男' : '女'
    }
  },
  methods: {
    // 获取班级就业率
    employmentRate() {
      this.axios.get(this.$api.getEmploymentRateByClass + `${this.$route.query.tid}`).then(res => {
        this.message = res.data.message
        console.log(res)
      })
    },
    passPage() {
      this.axios.get(this.$api.getPassCount + `${this.$route.query.tid}`).then(res => {
        this.classPage = res.data.data
        console.log(this.classPage)
      })
      this.axios.post(this.$api.getClassTeacher + `${this.$route.query.tid}`).then(res => {
        this.totalStudent = res.data.data.totalStudent
        console.log(res)
      })
    },
    // 跳转道班级编辑
    showEditClass() {
      this.$refs.editClassDialog.dialogVisible = true
      this.$refs.editClassDialog.originData = this.classDetail
      this.$refs.editClassDialog.enumList = this.enumList
    },
    // 获取班级详细信息
    getClassDetail() {
      ClassModel.getClassInfo({
        classId: this.$route.query.tid
      }).then(data => {
        this.classDetail = data
        console.log(this.classDetail)
      })
    },
    getStudentCount() {
      this.axios.post(this.$api.getClassDetail + this.$route.query.tid).then(res => {
        if (res.data.result !== 'ok') {
          this._errorNotify('获取班级信息失败!')
          throw new Error(res.data.error.message)
        }
        this.classStudent = res.data.data
        console.log(this.classStudent)
      })
    },
    // 获取班级信息（班名、班级总人数）
    getStudentInfo() {
      this.loading = true
      return this.axios
        .post(this.$api.getClassStdent + `?classId=${this.$route.query.tid}&pageIndex=${this.pagination.pageIndex}&pageSize=${this.pagination.pageSize}`)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }
          this.studentInfo = res.data.data.records
          console.log(this.studentInfo)
          this.pagination.pageTotal = res.data.data.total
          return res.data.data
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    pageChange(val) {
      this.pagination.pageIndex = val
      this.getStudentInfo()
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    goStudentDetail(studentInfo) {
      this.$router.push({
        name: 'studentDetail',
        query: {
          tid: studentInfo.studentId,
          classId: this.classDetail.tid,
          idCard: studentInfo.idCard
        }
      })
    },
    // 删除学生
    deleteStudent(studentId) {
      this.$confirm('此操作将从班级删除学生, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .post(this.$api.deleteStdFromClass + `?classId=${this.$route.query.tid}&studentId=${studentId}`) // `?classId=${this.$route.query.tid}&studentId=${studentId}`
            .then(res => {
              if (res.data.result !== 'ok') {
                this.$message.error(res.data.error.message)
                return Promise.reject(new Error(res.data.error.message))
              }

              this.$message({
                type: 'success',
                message: '删除成功!'
              })

              this.pagination.pageIndex = 1
              this.getStudentInfo()
              return res.data.data
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
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
.title {
  margin-top: 40px;
  margin-bottom: 40px;
}
.btnBox {
  text-align: right;
  padding-bottom: 20px;
}

/* 表格样式 */
.el-table {
  width: 100%;
  background-color: transparent;
  &::before {
    height: 0;
  }
}
@media screen and(min-width:1440px) and(max-width:1600px) {
  .top {
    height: 28% !important;
    padding-top: 20px !important;
  }
  .title {
    margin-top: 20px !important;
    margin-bottom: 0px !important;
  }
  .el-table {
    height: 480px !important;
  }
}
@media screen and(min-width:1200px) and(max-width:1339px) {
  .top {
    height: 28% !important;
    padding-top: 10px !important;
    p {
      font-size: 12px !important;
    }
  }
  .title {
    margin-top: 15px !important;
    margin-bottom: 0px !important;
  }
  .el-table {
    height: 380px !important;
  }
  .item {
    line-height: 17px !important;
    margin-bottom: 5px !important;
  }
  .bottom {
    > div {
      height: 60px !important;
      margin-top: 5px !important;
    }
  }
}
/* 班级详情 */
.classDetail {
  .top {
    height: 26%;
    padding-top: 20px;
    padding-left: 24px;
    padding-right: 24px;
    .class-name {
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        margin: 0;
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.7);
        line-height: 22px;
      }
    }
    .item {
      font-size: 12px;
      color: #494a4b;
      line-height: 22px;
      // margin-bottom: 10px;
    }
  }
  .bottom {
    height: 70%;
    padding: 20px;
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
          padding-left: 15px;
        }
        &:last-of-type {
          flex: 4;
          font-size: 16px;
          font-weight: bold;
          text-align: right;
          padding-right: 40px;
          span {
            font-size: 12px;
            color: #7a7b7e;
          }
          a {
            color: #3559c7;
            font-size: 12px;
            cursor: pointer;
            margin-left: 5px;
          }
        }
      }
    }
  }
}
</style>
