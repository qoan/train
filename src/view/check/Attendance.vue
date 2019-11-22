<template>
  <div class="warp">
    <el-row>
      <el-col>
        <el-form :inline="true" class="demo-form-inline searchFrom">
          <el-row :gutter="0">
            <el-col :lg="8" :md="12" :sm="24">
              <el-form-item label="班级名称：">
                <el-select v-model="searchForm.classId" placeholder="请选择">
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
              <el-form-item label="学校名称：">
                <el-select v-model="searchForm.schoolId" placeholder="请选择">
                  <el-option
                    v-for="item in schoolNameArr"
                    :key="item.tid"
                    :label="item.schoolName"
                    :value="item.tid"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12" :sm="24" v-if="queryItem">
              <el-form-item label="学员姓名：">
                <el-input
                  v-model="searchForm.studentName"
                  placeholder="请输入学员姓名"
                  style="width: 108%"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :lg="8" :md="12" :sm="24" v-if="queryItem">
              <el-form-item label="身份证号：">
                <el-input v-model="searchForm.idCard" placeholder="请输入学员身份证号" style="width: 108%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="4" :md="12" :sm="24">
              <el-form-item>
                <el-button type="primary" @click="searchFormFun">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col style="text-align: right" class="pl-10">
        <el-button :type="btnType1" round size="mini" @click="switchType(1)">按班级查询</el-button>
        <el-button :type="btnType2" round size="mini" @click="switchType(2)">按学员查询</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20" v-show="selectedShow" v-loading="loading1" class="card">
      <img v-if="len===0" src="../../assets/img/no.png" class="Img" alt />
      <el-col v-else :lg="5" class="infoItem" v-for="(item, index) in dataList" :key="index">
        <div class="classItem" @click="goDetail(item)">
          <p class="p1">
            {{item.className}}
            <el-tag
              size="small"
              class="tag"
              style="float:right;"
              :style="{background:back[index%5]}"
            >{{item.workType}}</el-tag>
          </p>
          <p>
            <img src="../../assets/img/icon/icon-education.png" width="14" height="14" alt />
            {{item.schoolName}}
          </p>
          <p>
            <i class="el-icon-user-solid"></i>
            {{item.studentCount}}人
          </p>
          <p
            v-if="item.finish === 0"
            style="text-align: center;vertical-align: center;font-size: 20px;"
          >已结束</p>
          <div v-else class="infoBox">
            <div>
              <p>{{item.ydCount}}</p>
              <p>今日应到人数</p>
            </div>
            <div>
              <p>{{item.checkCount}}</p>
              <p>今日实到人数</p>
            </div>
            <div>
              <p
                v-if="item.studentCount!==0"
              >{{ parseInt((item.checkCount / item.studentCount).toFixed(2) * 100) }}%</p>
              <p v-else>{{ parseInt(0) }}%</p>
              <p>考勤率</p>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-pagination
      v-show="selectedShow"
      v-if="active"
      background
      layout="prev, pager, next"
      :total="total"
      style="text-align: center;margin-top: 60px"
      @current-change="changePage"
      :page-size="pageSize"
    ></el-pagination>

    <el-row v-show="!selectedShow" v-loading="loading">
      <img v-if="len1===0" src="../../assets/img/no.png" class="Img" alt />
      <el-table v-else :data="dataTables" stripe style="width: 100%">
        <!-- <el-table-column
                        label="学员头像"
                        width="200">
                    <template>
                        <div class="headImg"></div>
                    </template>
        </el-table-column>-->
        <el-table-column align="center" prop="studentName" label="学员姓名"></el-table-column>
        <el-table-column align="center" prop="className" label="班级"></el-table-column>
        <el-table-column align="center" prop="studentIdcard" label="身份证号"></el-table-column>
        <el-table-column align="center" prop="schoolName" label="所在学校"></el-table-column>
        <el-table-column align="center" label="今日考勤状态">
          <template slot-scope="scope">
            <span v-if="scope.row.checkState === 1" style="color:#7ED321">正常</span>
            <span v-else-if="scope.row.checkState === 2" style="color: #FFBC4C">异常</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope2">
            <el-button
              type="text"
              size="mini"
              round
              @click.native.prevent="goStudentDetail(scope2.row.studentIdcard, scope2.row.studentId, scope2.row.classId)"
            >查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-pagination
      v-show="!selectedShow"
      v-if="active1"
      background
      layout="prev, pager, next"
      :total="total2"
      @current-change="changePage2"
      :page-size="pageSize2"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      back: ['#fbd14b', '#ff585d', '#252a34', '#08d9d6', '#bebebe'],
      active: false,
      active1: false,
      loading: false,
      loading1: false,
      len: 0,
      len1: 0,
      pageIndex: 1,
      pageSize: 16,
      total: 0, // 总条数
      pageIndex2: 1,
      pageSize2: 11,
      total2: 0, // 总页数
      selectedShow: true,
      status: false,
      btnType1: 'primary',
      btnType2: 'text',
      searchForm: {
        classId: 0,
        idCard: '',
        pageIndex: 0,
        pageSize: 0,
        schoolId: 0,
        studentName: ''
      },
      classNameArr: [],
      schoolNameArr: [],
      dataList: [],
      dataTables: [],
      queryItem: false,
      checkRate: 0 // 考勤率
    }
  },
  filters: {
    formatFloat(val) {
      return val.fixed(2)
    }
  },
  mounted() {
    this.getClassNameArr()
    this.getSchoolNameArr()
    this.getDataList()
    this.getDataTables()
  },
  methods: {
    // 搜索事件
    searchFormFun() {
      if (this.queryItem) {
        this.getDataTables()
      } else {
        this.getDataList()
      }
    },

    // 根据学员查询dataTables
    getDataTables() {
      this.loading = true
      let params = {
        pageIndex: this.pageIndex2,
        pageSize: this.pageSize2
      }

      if (this.searchForm.classId) {
        params.classId = this.searchForm.classId
      }

      if (this.searchForm.schoolId) {
        params.schoolId = this.searchForm.schoolId
      }

      if (this.searchForm.idCard) {
        params.idCard = this.searchForm.idCard
      }

      if (this.searchForm.studentName) {
        params.studentName = this.searchForm.studentName
      }

      this.$http
        .post(this.$api.pageCheckTodayStudent, params)
        .then(res => {
          this.dataTables = res.data.data.records
          this.len1 = res.data.data.records.length
          this.total2 = res.data.data.total
          console.log(res)
          if (this.len1 === 0) {
            this.active1 = false
          } else {
            this.active1 = true
          }
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 分页事件
    changePage(page) {
      this.pageIndex = page
      this.getDataList()
    },

    // 根据班级查询List
    getDataList() {
      this.loading1 = true
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }

      if (this.searchForm.classId) {
        params.classId = this.searchForm.classId
      }

      if (this.searchForm.schoolId) {
        params.schoolId = this.searchForm.schoolId
      }

      this.$http
        .post(this.$api.pageCheckTodayClass, params)
        .then(res => {
          this.dataList = res.data.data.records
          this.len = res.data.data.records.length
          this.total = res.data.data.total
          if (this.len === 0) {
            this.active = false
          } else {
            this.active = true
          }
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.loading1 = false
        })
    },

    // 分页事件2
    changePage2(page) {
      this.pageIndex2 = page
      this.getDataTables()
    },

    // 获取学校
    getSchoolNameArr() {
      this.$http
        .get(this.$api.selectSchoolEnum)
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
    goDetail(classObj) {
      this.$router.push({ path: '/check/class/detail', query: classObj })
    },
    switchType(n) {
      if (n === 2) {
        this.btnType1 = 'text'
        this.btnType2 = 'primary'
        this.selectedShow = false
        this.queryItem = true
      } else {
        this.btnType1 = 'primary'
        this.btnType2 = 'text'
        this.selectedShow = true
        this.queryItem = false
      }
    },
    goStudentDetail(studentIdcard, studentId, classId) {
      this.$router.push({
        path: '/check/student/detail',
        query: { studentIdcard, studentId, classId }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.warp {
  width: 100%;
  height: 100%;
}
.searchFrom {
  height: 50px;
  /* background-color: #fff;*/
  border-radius: 5px;
  margin: 10px;
  padding: 10px;
}
.Img {
  margin-top: 80px;
  color: #909399;
  width: 200px;
  height: 200px;
  transform: translateX(-100px);
  margin-left: 50%;
  // margin-bottom: 100px;
}
.pl-10 {
  padding-left: 10px;
}
.m-10 {
  margin: 10px;
}
.p-10 {
  padding: 10px;
}
.card {
  height: 600px !important;
}
.el-table {
  margin-top: 20px;
}
@media screen and(min-width:1200px) and(max-width:1600px) {
  .card {
    height: 300px !important;
    overflow: auto;
    margin-top: 20px;
  }
  .el-table {
    height: 300px !important;
    overflow: auto !important;
    margin-top: 20px;
  }
}
.infoItem {
  margin-right: 30px;
  margin-top: 15px;
}
.el-pagination {
  position: absolute;
  bottom: 30px;
  left: 50%;
  margin-left: -150px;
}
@media screen and(min-width: 1200px) and(max-width: 1600px) {
  .classItem {
    width: 240px !important;
  }
  .p1 {
    font-size: 12px !important;
  }
  .infoBox {
    div {
      font-size: 12px !important;
    }
  }
}
.classItem:hover {
  box-shadow: 0px 0px 10px #dcdcdc;
}
.classItem {
  width: 100%;
  height: 120px;
  padding: 5px;
  background-color: #fff;
  border-radius: 5px;
  color: #7c7e81;
  cursor: pointer;
  margin-left: 10%;
  > p {
    margin-top: 5px;
    font-size: 12px;
    img {
      vertical-align: middle;
    }
    &:first-of-type {
      font-size: 14px;
      color: #3458c7;
    }
  }
  > .infoBox {
    display: flex;
    margin-top: 15px;
    > div {
      flex: 1;
      p {
        text-align: center;
        &:first-of-type {
          font-size: 20px;
          color: rgba(0, 0, 0, 0.7);
        }
        &:last-of-type {
          font-size: 10px;
          color: rgba(0, 0, 0, 0.49);
        }
      }
    }
  }
}
.headImg {
  width: 32px;
  height: 32px;
  border-radius: 32px;
  background-color: red;
}
</style>
<style>
.el-upload--text {
  background-color: #fff;
  border: none;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: auto;
  height: auto;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.el-range-editor--small.el-input__inner {
  width: 50%;
}
.el-tag {
  color: #fff;
}
</style>
