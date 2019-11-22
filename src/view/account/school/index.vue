<template>
  <el-container>
    <!-- 搜索栏 -->
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchForm"
      label-width="100px"
      style="width: 100%;"
    >
      <el-row>
        <el-form-item label="学校名称：" prop="accountNickname">
          <el-input
            placeholder="请输入学校名称"
            @keyup.enter.native="pageIndex=1;getTableData()"
            :size="size"
            v-model="searchForm.accountNickname"
            style="width: 280px"
          ></el-input>
        </el-form-item>

        <el-form-item label="学校负责人：" style="margin-left: 40px" prop="accountMaster">
          <el-input
            placeholder="请输入学校负责人姓名"
            @keyup.enter.native="pageIndex=1;getTableData()"
            :size="size"
            v-model="searchForm.accountMaster"
            style="width: 280px"
          ></el-input>
        </el-form-item>

        <el-form-item style="float:right">
          <el-button type="primary" :size="size" @click="getTableData">查 询</el-button>
          <el-button :size="size" @click="$refs.searchForm.resetFields();pageIndex=1;">重 置</el-button>
        </el-form-item>
      </el-row>
      <el-row style="margin-top: 0px;">
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-plus"
            :size="size"
            @click="$refs.dialogAddAccount.dialogVisible=true"
          >新增学校账号</el-button>
        </el-form-item>
      </el-row>
    </el-form>

    <!-- 数据表格 -->
    <section class="table-wrapper">
      <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="schoolName" label="学校名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="schoolAddress" label="学校地址" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="schoolMaster" label="学校负责人" align="center"></el-table-column>
        <el-table-column prop="schoolPhone" label="手机号" align="center"></el-table-column>
        <el-table-column prop="createTime" label="注册时间" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.schoolStatus"
              @change="setSchoolStatus($event,scope.row,scope.$index)"
            ></el-switch>
          </template>
        </el-table-column>
        <!-- <el-table-column fixed="right" label="操作" align="center">
          <template>
            <el-button
              type="text"
              size="small">
              重置密码
            </el-button>
          </template>
        </el-table-column>-->
      </el-table>
    </section>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange"
      style="text-align: center;margin-top: 10px"
      :page-size="pageSize"
    ></el-pagination>
    <!--添加账号Dialog-->
    <dialog-add-account ref="dialogAddAccount" @submitOk="getTableData()"></dialog-add-account>
  </el-container>
</template>

<script>
import DialogAddAccount from './dialogAddAccount'
export default {
  data() {
    return {
      size: 'mini',
      loading: false,
      pageIndex: 1,
      pageSize: 14,
      total: 0, // 总页数
      schoolName: '', // 学校名称
      tableData: [],
      searchForm: {
        accountNickname: null,
        accountAreacode: null,
        accountMaster: null
      }
    }
  },
  components: {
    DialogAddAccount
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getTableData()
    },
    // 获取表格数据
    getTableData() {
      // 参数准备
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        paramObj: {
          areaCode: this.searchForm.accountAreacode,
          schoolName: this.searchForm.accountNickname,
          schoolMaster: this.searchForm.accountMaster
        }
      }

      this.loading = true

      // 发送请求
      this.$http
        .post(this.$api.getMasrerSchoolList, params)
        .then(res => {
          const _that = this
          _that.tableData = []
          const result = res.data.data
          _that.tableData = result
          this.total = res.data.paging.total
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
    goDetail(tid) {
      this.$router.push({ path: '/school/detail', query: { tid } })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  width: 100%;
  height: 100%;
  padding: 30px;
  display: flex;
  flex-flow: column nowrap;
  font-size: 20px;
  .table-wrapper {
    padding: 20px 35px;
    box-sizing: border-box;
    background-color: #fff;
    flex: 1;
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
}
@media screen and(min-width:1200px) and(max-width:1600px) {
  .el-table {
    height: 300px;
    overflow: auto;
  }
}
</style>
