<template>
  <div class="warp">
    <el-row>
      <el-col>
        <el-form :inline="true" class="demo-form-inline searchFrom">
          <el-row :gutter="20">
            <el-col :lg="8" :md="12" :sm="24">
              <el-form-item label="人员类型：">
                <el-select v-model="searchForm.enumberPersonnelTypeTid" placeholder="请选择">
                  <el-option
                    v-for="item in personTypeArr"
                    :key="item.tid"
                    :label="item.enumerValue"
                    :value="item.tid"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12" :sm="24">
              <el-form-item label="身份证号：">
                <el-input
                  placeholder="请输入身份证号"
                  v-model="searchForm.studentIdCard"
                  style="width:108%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12" :sm="24">
              <el-form-item label="学校名称：">
                <el-select v-model="searchForm.schoolTid" placeholder="请选择">
                  <el-option
                    v-for="item in schoolNameArr"
                    :key="item.tid"
                    :label="item.schoolName"
                    :value="item.tid"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :lg="8" :md="12" :sm="24">
              <el-form-item label="文化程度：">
                <el-select v-model="searchForm.enumberEducationTid" placeholder="请选择">
                  <el-option
                    v-for="item in educationArr"
                    :key="item.tid"
                    :label="item.enumerValue"
                    :value="item.tid"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12" :sm="24">
              <el-form-item label="班级名称：">
                <el-select v-model="searchForm.clazzTid" placeholder="请选择">
                  <el-option
                    v-for="item in classNameArr"
                    :key="item.tid"
                    :label="item.className"
                    :value="item.tid"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12" :sm="24">
              <el-form-item>
                <el-button type="primary" @click="getDataTables">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24" style="text-align: right;display: none">
        <el-button type="primary">一键提醒</el-button>
      </el-col>
    </el-row>
    <el-row v-loading="loading">
      <img v-if="len===0" src="../../assets/img/no.png" class="Img" alt />
      <el-table v-else :data="dataTable" stripe style="width: 100%">
        <el-table-column prop="studentName" label="学生姓名" width="100"></el-table-column>
        <el-table-column prop="studentIdCard" label="身份证号码" width="150"></el-table-column>
        <el-table-column prop="education" label="文化程度" width="100"></el-table-column>
        <el-table-column prop="personnelType" label="人员类别" min-width="150"></el-table-column>
        <el-table-column prop="clazzName" label="所在班级" min-width="150"></el-table-column>
        <el-table-column prop="schoolName" label="所在学校" min-width="150"></el-table-column>
        <el-table-column prop="studentPhone" label="联系电话" width="150"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              round
              @click.native.prevent="goDetail(scope.row.studentTid)"
            >查看详情</el-button>
            <!--<el-button type="text" size="mini" round >提醒学员</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="active"
        background
        layout="prev, pager, next"
        :total="total"
        style="text-align: center;margin-top: 20px"
        @current-change="changePage"
      ></el-pagination>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'school',
  data() {
    return {
      len: 0,
      active: false,
      loading: false,
      pageIndex: 1,
      pageSize: 7,
      total: 0, // 总条数
      searchForm: {
        clazzTid: 0,
        enumberEducationTid: 0,
        enumberPersonnelTypeTid: 0,
        schoolTid: 0,
        studentIdCard: ''
      },
      personTypeArr: [
        {
          enumerValue: '请选择',
          tid: 0
        }
      ],
      educationArr: [
        {
          enumerValue: '请选择',
          tid: 0
        }
      ],
      schoolNameArr: [
        {
          schoolName: '请选择',
          tid: 0
        }
      ],
      classNameArr: [
        {
          className: '请选择',
          tid: 0
        }
      ],
      dataTable: []
    }
  },
  mounted() {
    this.getDataTables()
    this.getPersonType()
    this.getEducation()
    this.getClassNameArr()
    this.getSchoolNameArr()
  },
  methods: {
    getDataTables() {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        paramObj: this.searchForm
      }
      this.$http
        .post(this.$api.queryUnemploymentList, params)
        .then(res => {
          this.dataTable = res.data.data
          this.len = res.data.data.length
          if (this.len === 0) {
            this.active = false
          } else {
            this.active = true
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 获取学校
    getSchoolNameArr() {
      this.loading = true
      this.$http
        .get(this.$api.querySchoolList)
        .then(res => {
          this.schoolNameArr = res.data.data
          this.schoolNameArr.unshift({
            schoolName: '请选择',
            tid: 0
          })
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 获取班级
    getClassNameArr() {
      this.$http
        .post(this.$api.getSchoolsAllClass)
        .then(res => {
          this.classNameArr = res.data.data
          this.classNameArr.unshift({
            className: '请选择',
            tid: 0
          })
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 获取人员类型
    getPersonType() {
      this.$http
        .get(this.$api.selectOption + 'personnel_type')
        .then(res => {
          this.personTypeArr = res.data.data
          this.personTypeArr.unshift({
            enumerValue: '请选择',
            tid: 0
          })
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 获取文化程度
    getEducation() {
      this.$http
        .get(this.$api.selectOption + 'student_education')
        .then(res => {
          this.educationArr = res.data.data
          this.educationArr.unshift({
            enumerValue: '请选择',
            tid: 0
          })
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 分页事件
    changePage(page) {
      this.pageIndex = page
      this.getDataTables()
    },

    // 转到学员详情
    goDetail(tid) {
      this.$router.push({ path: '/student/detail', query: { tid } })
    }
  }
}
</script>

<style scoped lang="scss">
.Img {
  margin-top: 100px;
  width: 200px;
  height: 200px;
  transform: translateX(-100px);
  margin-left: 50%;
  margin-bottom: 80px;
}
.pl-10 {
  padding-left: 10px;
}
.m-10 {
  margin: 10px;
  padding: 10px;
}
.p-10 {
  padding: 10px;
}
.warp {
  width: 100%;
  height: 100%;
}
.searchFrom {
  height: 80px;
  border-radius: 5px;
  margin: 10px;
  padding: 20px;
}
.nameColor {
  color: #3559c7;
}
.uplodeBox {
  > div {
    display: inline-block;
    width: 84px;
    height: 84px;
    margin-right: 12px;
    background-color: #8c939d;
    position: relative;
    > p {
      width: 100%;
      font-size: 10px;
      color: #929498;
      position: absolute;
      left: 0;
      bottom: -20px;
      text-align: center;
    }
  }
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #8c939d;
}
.avatar-uploader-icon {
  font-size: 14px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  line-height: 84px;
  text-align: center;
}
.avatar {
  width: 100%;
  height: 100%;
  display: inline-block;
}
.el-upload--text {
  width: 84px;
  height: 84px;
}
</style>
