<template>
  <div class="warp">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" class="demo-form-inline searchFrom">
          <el-row :gutter="10">
            <el-col :lg="8">
              <el-form-item label="学校名称：">
                <el-input placeholder="请输入学校名称" v-model="searchForm.schoolName" style="width: 108%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="8">
              <el-form-item label="班级名称：">
                <el-input placeholder="请输入班级名称" v-model="searchForm.clazzName" style="width: 108%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="8">
              <el-form-item label="巡检人员：">
                <el-input
                  placeholder="请输入巡检人员姓名"
                  v-model="searchForm.inspectionPerson"
                  style="width: 108%"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :lg="8">
              <el-form-item label="检查次数：">
                <el-select v-model="searchForm.inspectionCount" placeholder="请选择">
                  <el-option
                    v-for="item in checks"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="8">
              <el-form-item label="检查时间：">
                <el-date-picker
                  value-format="yyyy-MM-dd"
                  v-model="searchForm.inspectionDate"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="disabledOptions"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :lg="8">
              <el-form-item>
                <el-button type="primary" @click="getTableData">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-button style="margin-left:30px" type="primary" @click="goAddPage">新增巡检</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px" v-loading="loading">
      <img v-if="len===0" src="../../assets/img/no.png" class="Img" />
      <el-table v-else :data="dataTable" height="500" stripe style="width: 100%">
        <el-table-column label="内容">
          <template slot-scope="scope">
            <div>
              <span>{{scope.row.clazzName}}</span>
              <span style="margin-right: 10px">的检查</span>
              <el-tag
                v-if="(scope.row.inspectionCount%2)==0"
                color="#747AFF"
                style="color: #fff;"
              >第{{scope.row.inspectionCount}}次</el-tag>
              <el-tag v-else color="#EF843C" style="color: #fff">第{{scope.row.inspectionCount}}次</el-tag>
            </div>
            <!-- <div v-if="scope.row.inspectionCount === 2">
              <span>{{scope.row.clazzName}}</span>
              <span style="margin-right: 10px">的检查</span>
              <el-tag color="#EF843C" style="color: #fff">第{{scope.row.inspectionCount}}次</el-tag>
            </div>
            <div v-if="scope.row.inspectionCount === 3">
              <span>{{scope.row.clazzName}}</span>
              <span style="margin-right: 10px">的检查</span>
              <el-tag color="#7ED321" style="color: #fff">第{{scope.row.inspectionCount}}次</el-tag>
            </div>-->
          </template>
        </el-table-column>
        <el-table-column prop="inspectionDate" label="检查时间"></el-table-column>
        <el-table-column prop="inspectionPerson" label="检查人"></el-table-column>
        <el-table-column prop="clazzName" label="检查班级"></el-table-column>
        <el-table-column prop="schoolName" label="所在学校"></el-table-column>
        <el-table-column align="center" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              round
              @click.native.prevent="goDetail(scope.row.tid)"
            >查看详情</el-button>
            <el-button
              type="text"
              size="mini"
              round
              @click.native.prevent="deleteLogs(scope.$index, scope.row.tid)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="active"
        background
        layout="prev, pager, next"
        :total="total"
        style="text-align: center;margin-top: 10px"
        @current-change="changePage"
      ></el-pagination>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      len: 0,
      active: false,
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0, // 总条数
      // 查询字段
      searchForm: {
        schoolName: '',
        clazzName: '',
        inspectionPerson: '', // 巡检人员
        inspectionCount: 0, // 检查次数
        inspectionDate: '' // 检查时间
      },
      // 禁用今天以后的日期
      disabledOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      // 检查次数
      checks: [
        {
          label: '请选择',
          value: 0
        },
        {
          label: '一次',
          value: 1
        },
        {
          label: '二次',
          value: 2
        },
        {
          label: '三次',
          value: 3
        }
      ],
      // 表格数据
      dataTable: [],
      Count: [],
      Count1: [],
      inspectionCount: 0 // 次数
    }
  },

  mounted() {
    this.getTableData()
  },
  methods: {
    goDetail(tid) {
      this.$router.push({ path: '/patrol/details', query: { tid } })
    },
    goAddPage() {
      this.$router.push({ path: '/patrol/add' })
    },
    getTableData() {
      this.loading = true
      // 参数准备
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        paramObj: this.searchForm
      }

      // 发请求
      this.$http
        .post(this.$api.pageInspectionList, params)
        .then(res => {
          console.log(res)
          this.dataTable = res.data.data
          this.len = this.dataTable.length
          if (this.len === 0) {
            this.active = false
          } else {
            this.active = true
          }
          this.total = res.data.paging.total
          let than = this
          var list = []
          // for (let i = 0; i < this.total; i++) {
          //   list = than.Count.push(res.data.data[i].inspectionCount)
          // }
          // this.Count1 = list
          // console.log(this.total)
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
      this.getTableData()
    },
    // 删除记录
    deleteLogs(index, tid) {
      this.$confirm('删除后无法恢复，确认删除吗？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .get(this.$api.deleteInspectionByTid + tid)
            .then(res => {
              this.dataTable.splice(index, 1)
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getTableData()
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
  height: 100px;
  border-radius: 5px;
  margin: 10px;
  padding: 20px;
}
.el-tag {
  position: absolute;
  right: 70px;
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
