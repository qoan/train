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
              <el-col :lg="8" :md="12" :sm="24">
                <el-form-item label="教师名称：" prop="name">
                  <el-input
                    v-model="searchForm.name"
                    @keyup.enter.native="getSchoolTeacherList()"
                    placeholder="请输入教师名称"
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

              <el-col :lg="8" :md="12" :sm="24">
                <el-form-item label="工作状态：" prop="workStatus">
                  <el-select v-model="searchForm.workStatus" placeholder="请选择工作状态">
                    <el-option
                      v-for="item in workStatusEnumList"
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
              @click="paginationInfo.pageIndex=1;getSchoolTeacherList()"
            >查 询</el-button>
            <el-button
              size="mini"
              @click="$refs['searchForm'].resetFields();$refs['table'].clearFilter();getSchoolTeacherList()"
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
              v-if="userType === 5"
              @click="$refs.dialogAddTeacher.dialogVisible=true"
            >新增教师</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!--- 表格列表 --->
    <div class="form" v-loading="loading">
      <div class="form-wapper">
        <!-- 表格 -->
        <img v-if="len===0" src="../../assets/img/no.png" class="Img" alt />
        <el-table v-else ref="table" :data="formData">
          <el-table-column align="center" prop="name" label="教师姓名"></el-table-column>
          <el-table-column align="center" prop="sex" label="性别">
            <template slot-scope="scope">
              <p>{{scope.row.sex | getSexType}}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="education" label="文化程度"></el-table-column>
          <el-table-column align="center" prop="phone" label="联系电话"></el-table-column>
          <el-table-column
            align="center"
            prop="schoolName"
            :show-overflow-tooltip="true"
            label="所在学校"
          ></el-table-column>
          <el-table-column
            prop="className"
            :show-overflow-tooltip="true"
            align="center"
            label="所在班级"
          >
            <template slot-scope="scope">
              <p>{{scope.row.className === null ? '未分配' : scope.row.className}}</p>
            </template>
          </el-table-column>
          <el-table-column label="工作状态" align="center" prop="workStatus">
            <template slot-scope="scope">
              <p
                :style="{color: workStatusEnumList[scope.row.workStatus].color}"
              >{{workStatusEnumList[scope.row.workStatus].enumerValue}}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="$refs.dialogTeacherDetail.dialogVisible=true;$refs.dialogTeacherDetail.teacherTid=scope.row.tid"
              >查看</el-button>
              <el-button
                type="text"
                size="small"
                v-if="userType === 5"
                @click="$refs.dialogEditTeacher.dialogVisible=true;$refs.dialogEditTeacher.teacherTid=scope.row.tid"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                v-if="userType === 5"
                @click="deleteTeacher(scope.row.tid)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页导航 -->

        <dialog-teacher-detail ref="dialogTeacherDetail"></dialog-teacher-detail>
        <dialog-add-teacher ref="dialogAddTeacher" @addOk="getSchoolTeacherList()"></dialog-add-teacher>
        <!--编辑弹窗-->
        <dialog-edit-teacher ref="dialogEditTeacher" @addOk="getSchoolTeacherList()"></dialog-edit-teacher>
      </div>
    </div>
    <el-pagination
      v-if="active"
      :background="true"
      @current-change="pageChange"
      :total="paginationInfo.pageTotle"
      :current-page="paginationInfo.pageIndex"
      :page-size="paginationInfo.pageSize"
      layout="prev, pager, next"
    ></el-pagination>
  </div>
</template>

<script>
import DialogAddTeacher from './dialog/DialogAddTeacher'
import DialogEditTeacher from './dialog/DialogEditTeacher'
import DialogTeacherDetail from '@/view/teacher/dialog/DialogTeacherDetail'
export default {
  components: {
    DialogTeacherDetail,
    DialogAddTeacher,
    DialogEditTeacher
  },
  data() {
    return {
      editObj: {
        sex: null,
        age: null,
        name: null,
        phone: null,
        idCard: null,
        educationTid: null,
        teacherQuelify: [], // 教师资质
        headImage: [
          // 个人证件照
          {
            id: 'headImage'
          }
        ]
      },
      active: false,
      len: 0,
      loading: false,
      userType: null,
      paginationInfo: {
        pageTotle: 0,
        pageIndex: 1,
        pageSize: 11
      },
      searchForm: {
        name: null,
        education: null,
        workStatus: null
      },
      trainStatus: '全部', // 当前页的培训状态
      formData: [],
      educationEnumList: [],
      personCategoryEnumList: [],
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
  mounted() {
    // 初始化表格数据
    this.getSchoolTeacherList()

    // 获取枚举列表
    this.educationEnumList = JSON.parse(sessionStorage.getItem('teacher_education') || '[]')
    this.personCategoryEnumList = JSON.parse(sessionStorage.getItem('personnel_type') || '[]')
    this.userType = parseInt(JSON.parse(sessionStorage.getItem('userInfo')).roleTid)
  },
  filters: {
    getSexType(val) {
      return parseInt(val) === 1 ? '男' : '女'
    }
  },
  methods: {
    // 编辑教师信息
    editTeacher(obj) {
      this.$refs.dialogEditTeacher.oraginData = obj
      this.$refs.dialogEditTeacher.dialogVisible = true
    },
    // 事件 - 导航分页改变
    pageChange(val) {
      this.paginationInfo.pageIndex = val
      this.getSchoolTeacherList()
    },
    // 请求 - 获取学校教师列表
    getSchoolTeacherList() {
      this.loading = true
      // 查询条件
      let params = {
        pageIndex: this.paginationInfo.pageIndex,
        pageSize: this.paginationInfo.pageSize,
        paramObj: {
          educationTid: this.searchForm.education,
          name: this.searchForm.name,
          workStatus: this.searchForm.workStatus
        }
      }

      return this.axios
        .post(this.$api.getTeacherSelectPage, params)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }

          this.formData = res.data.data.records
          this.len = res.data.data.records.length
          if (this.len === 0) {
            this.active = false
          } else {
            this.active = true
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
    // 请求 --- 删除教师操作
    deleteTeacher(tid) {
      this.$confirm('删除后不能恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .post(this.$api.deleteTeacher + tid)
            .then(res => {
              if (res.data.result !== 'ok') {
                this.$message.error(res.data.error.message)
                return Promise.reject(new Error(res.data.error.message))
              }
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.paginationInfo.pageIndex = 1
              this.getSchoolTeacherList()
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

<style lang="scss" scoped>
.commonForm {
  height: 100%;
  width: 100%;
  padding: 30px 0px 0px 30px;
  box-sizing: border-box;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  // display: flex;
  flex-flow: column nowrap;
  .top {
    margin-bottom: 40px;
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
  position: absolute;
  left: 50%;
  margin-left: -150px;
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
    height: 450px !important;

    .el-table {
      overflow: auto !important;
    }
  }
}
.form-wapper {
  height: 585px;
  width: 100%;
  padding: 5px 20px;
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
