<template>
  <div class="commonForm">
    <!--- 顶部搜索栏 --->
    <div class="top">
      <el-form class="serachForm" size="mini" :model="searchForm" ref="searchForm">
        <!-- row: 1 --->
        <el-row :gutter="20">
          <!-- col: 1 --->
          <el-col :lg="19" :md="24">
            <!-- row: 1 --->
            <el-row :gutter="40">
              <!-- col: 1 --->
              <el-col :lg="8" :md="12" :sm="24">
                <el-form-item label="班级名称：" prop="className">
                  <el-input
                    v-model="searchForm.className"
                    @keyup.enter.native="getClassStdList()"
                    placeholder="请输入班级名称"
                  ></el-input>
                </el-form-item>
              </el-col>
              <!-- col: 2 --->
              <el-col :lg="8" :md="12" :sm="24">
                <el-form-item label="学校名称：" prop="schoolName">
                  <!--<el-input
                    v-model="searchForm.schoolName"
                    @keyup.enter.native="getClassStdList()"
                    placeholder="请输入学校名称"
                  ></el-input>-->
                  <school-name @setSchoolName="setSchoolName"></school-name>
                </el-form-item>
              </el-col>
              <!-- col: 3 --->
              <el-col :lg="8" :md="12" :sm="24">
                <el-form-item label="身份证号：" prop="idCard">
                  <el-input
                    v-model="searchForm.idCard"
                    @keyup.enter.native="getClassStdList()"
                    placeholder="请输入身份证号"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :lg="8" :md="12" :sm="24">
                <el-form-item label="学员姓名：" prop="name">
                  <el-input
                    v-model="searchForm.name"
                    @keyup.enter.native="getClassStdList()"
                    placeholder="请输入姓名"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :lg="8" :md="12" :sm="24">
                <el-form-item label="文化程度：" prop="education">
                  <el-select v-model="searchForm.education" placeholder="请选择文化程度">
                    <el-option
                      v-for="item in educationEnumList"
                      :key="item.tid"
                      :label="item.enumerValue"
                      :value="item.tid"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- col: 3 --->
              <el-col :lg="8" :md="12" :sm="24">
                <el-form-item label="人员类型：" prop="personnelType">
                  <el-select v-model="searchForm.personnelType" placeholder="请选择人员类型">
                    <el-option
                      v-for="item in personTypeEnumList"
                      :key="item.tid"
                      :label="item.enumerValue"
                      :value="item.tid"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <!-- col: 2 --->
          <el-col :lg="5" :md="24" style="text-align: right">
            <el-button
              type="primary"
              size="mini"
              style="margin-right: 20px;"
              @click="paginationInfo.pageIndex=1;getClassStdList()"
            >查 询</el-button>
            <el-button
              size="mini"
              @click="$refs['searchForm'].resetFields();$refs['table'].clearFilter();"
            >重 置</el-button>
          </el-col>
        </el-row>
        <!-- row: 2 --->
        <el-row>
          <el-col :span="12" style="text-align: left">
            <el-button
              type="primary"
              size="mini"
              style="margin-right: 20px;"
              @click="$refs.dialogAddStdInfo.dialogVisible=true"
              v-if="userType === 5"
            >新增学员</el-button>
            <el-button
              v-if="userType === 5"
              type="primary"
              size="mini"
              @click="$refs.importStd.dialogVisible=true"
            >导入学员表</el-button>
          </el-col>
          <el-col :span="userType !== 5 ? 24 : 12" style="text-align: right">
            <el-radio-group
              v-model="trainStatus"
              size="mini"
              @change="paginationInfo.pageIndex=1;getClassStdList(trainStatus)"
            >
              <!-- 修改 -->
              <el-radio-button label>全部</el-radio-button>
              <el-radio-button label="0">待培训</el-radio-button>
              <el-radio-button label="1">培训中</el-radio-button>
              <el-radio-button label="2">培训结束</el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!--- 表格列表 --->
    <div class="form" v-loading="loading">
      <div class="form-wapper">
        <!-- 表格 -->
        <img v-if="len===0" src="../../assets/img/no.png" class="Img" alt />
        <el-table v-else ref="table" :data="getFilteFormData">
          <el-table-column align="center" prop="name" label="学员姓名"></el-table-column>
          <el-table-column align="center" prop="sex" label="性别">
            <template slot-scope="scope">
              <p>{{scope.row.sex | getSexType}}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="idCard" label="身份证号"></el-table-column>
          <el-table-column align="center" prop="education" label="文化程度"></el-table-column>
          <el-table-column align="center" prop="personnelType" label="人员类型"></el-table-column>
          <el-table-column align="center" prop="className" label="所在班级"></el-table-column>
          <el-table-column align="center" prop="schoolName" label="所在学校"></el-table-column>
          <el-table-column align="center" prop="phone" label="联系电话"></el-table-column>
          <el-table-column align="center" label="培训状态" prop="trainStatus">
            <template slot-scope="scope">
              <p
                :style="{color: trainStatusEnumList[scope.row.trainStatus].color}"
              >{{scope.row.trainStatus | getTrainStatusType(trainStatusEnumList)}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="$router.push({ name: 'studentDetail', query: { tid: scope.row.studentId, idCard: scope.row.idCard, classId: scope.row.classId } })"
              >查看</el-button>
              <el-button
                type="text"
                size="small"
                v-if="userType === 5"
                @click="deleteTeacher(scope.row.studentId)"
              >删除</el-button>
              <!-- 删除 -->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页导航 -->
    <el-pagination
      v-if="active"
      :background="true"
      @current-change="pageChange"
      :total="paginationInfo.pageTotle"
      :current-page="paginationInfo.pageIndex"
      :page-size="paginationInfo.pageSize"
      layout="prev, pager, next"
    ></el-pagination>
    <!--新增学员弹窗-->
    <dialog-add-std-info
      ref="dialogAddStdInfo"
      @submitOk="paginationInfo.pageIndex=1;getClassStdList()"
    ></dialog-add-std-info>
    <!--导入学员表弹窗-->
    <import-student ref="importStd" @getTableData="getClassStdList"></import-student>
  </div>
</template>

<script>
import DialogAddStdInfo from './dialog/DialogAddStdInfo'
import ImportStudent from '@/view/student/dialog/ImportStudent'
import schoolName from '../../components/select/SchoolName'
export default {
  name: 'commonForm',
  components: {
    DialogAddStdInfo,
    ImportStudent,
    schoolName
  },
  data() {
    return {
      active: false,
      len: 0,
      loading: false,
      userType: null,
      paginationInfo: {
        pageTotle: 0,
        pageIndex: 1,
        pageSize: 10
      },
      searchForm: {
        className: null,
        educationTid: null,
        idCard: null,
        personnelTypeTid: null,
        schoolName: null,
        name: null
      },
      trainStatus: '', // 当前页的培训状态
      trainStatus1: null,
      formData: [],
      educationEnumList: [],
      personTypeEnumList: [],
      trainStatusEnumList: [
        {
          tid: 0,
          color: '#7ED321',
          enumerValue: '待培训'
        },
        {
          tid: 1,
          color: 'red',
          enumerValue: '培训中'
        },
        {
          tid: 2,
          color: 'pink',
          enumerValue: '培训结束'
        }
      ]
    }
  },
  filters: {
    getTrainStatusType(val, typeList) {
      if (val === null) return ''
      return typeList[val].enumerValue
    },
    getSexType(val) {
      return parseInt(val) === 1 ? '男' : '女'
    }
  },
  mounted() {
    // 初始化表格数据
    this.getClassStdList()
    // 获取枚举列表
    this.educationEnumList = JSON.parse(sessionStorage.getItem('student_education') || '[]')
    this.personTypeEnumList = JSON.parse(sessionStorage.getItem('personnel_type') || '[]')
    this.userType = parseInt(JSON.parse(sessionStorage.getItem('userInfo')).roleTid)
  },
  computed: {
    getFilteFormData() {
      let enumValue
      switch (this.trainStatus) {
        case '全部':
          enumValue = -1
          break
        case '待培训':
          enumValue = 0
          break
        case '培训中':
          enumValue = 1
          break
        case '已完成培训':
          enumValue = 2
          break
        default:
          enumValue = -1
      }

      return this.formData.filter(item => {
        if (enumValue === -1) {
          return true
        } else {
          return item.trainStatus === enumValue
        }
      })
    }
  },
  methods: {
    // 获取学校ID
    setSchoolName(schoolName) {
      this.searchForm.schoolName = schoolName
    },
    // 获取表格数据
    getClassStdList(trainStatus) {
      this.loading = true
      // 查询条件
      let params = {
        pageIndex: this.paginationInfo.pageIndex,
        pageSize: this.paginationInfo.pageSize,
        paramObj: {
          className: this.searchForm.className,
          educationTid: this.searchForm.education,
          idCard: this.searchForm.idCard,
          personnelTypeTid: this.searchForm.personnelType,
          schoolName: this.searchForm.schoolName,
          name: this.searchForm.name
        }
      }
      params.paramObj.trainStatus = trainStatus
      console.log(params)
      return this.axios
        .post(this.$api.getClassStdList, params)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }
          console.log(res.data.data)
          this.formData = res.data.data.records
          this.len = res.data.data.records.length
          if (this.len === 0) {
            this.active = false
          } else {
            this.active = true
          }
          this.paginationInfo.pageTotle = res.data.data.total
          console.log(this.paginationInfo.pageTotle)
          return res.data.data
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
      // this.paginationInfo.pageIndex = 1
    },
    // 请求 --- 删除学员操作
    deleteTeacher(tid) {
      console.log(tid)
      this.$confirm('删除后不能恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .post(this.$api.deleteStudentById + tid)
            .then(res => {
              if (res.data.result !== 'ok') {
                this.$message.error(res.data.error.message)

                return Promise.reject(new Error(res.data.error.message))
              }
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              console.log(res.data)
              this.paginationInfo.pageIndex = 1
              this.getClassStdList()
              return res.data.data
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    },
    pageChange(val) {
      this.paginationInfo.pageIndex = val
      this.getClassStdList(this.trainStatus)
    }
  }
}
</script>

<style lang="scss" scoped>
.commonForm {
  height: 100%;
  width: 100%;
  padding: 20px 0px 0px 30px;
  box-sizing: border-box;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  // display: flex;
  flex-flow: column nowrap;
  .top {
    margin-bottom: 20px;
  }
  .form {
    flex: 1;
  }
}

.serachForm {
  /deep/ .el-form-item {
    display: flex;
    /* 使输入框自适应 */
    .el-form-item__content {
      flex: 1;
      /* 使下拉框自适应 */
      .el-select {
        width: 100%;
      }
      /* 使时间选择器自适应 */
      .el-date-editor {
        width: 100%;
      }
    }
  }
}
.Img {
  margin-top: 100px;
  color: #909399;
  width: 200px;
  height: 200px;
  transform: translateX(-100px);
  margin-left: 50%;
  margin-bottom: 30px;
}
.el-pagination {
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 30px;
}
@media screen and(min-width:1200px) and(max-width:1399px) {
  .form-wapper {
    height: 300px !important;

    .el-table {
      overflow: auto !important;
    }
  }
}
@media screen and(min-width:1440px) and(max-width:1600px) {
  .form-wapper {
    height: 420px !important;
    .el-table {
      overflow: auto !important;
    }
  }
}
@media screen and(min-width:1400px) and(max-width:1439px) {
  .form-wapper {
    height: 560px !important;

    .el-table {
      overflow: auto !important;
    }
  }
}
.form-wapper {
  height: 598px;
  width: 100%;
  padding: 10px 0px;
  box-sizing: border-box;
  background-color: #fff;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;

  .el-table {
    width: 100%;

    &::before {
      height: 0;
    }
    /deep/ .el-table__fixed-right {
      &::before {
        height: 0;
      }
    }
  }
}
</style>
