<template>
  <el-container>
    <el-form class="serachForm" ref="searchForm" :model="searchForm" size="mini">
      <!-- row: 1 --->
      <el-row :gutter="20">
        <!-- col: 1 --->
        <el-col :lg="19" :md="24">
          <!-- row: 1 --->
          <el-row :gutter="40">
            <!-- col: 1 --->
            <el-col :lg="8" :md="12" :sm="24">
              <el-form-item label="政府名称：" prop="govName">
                <el-input v-model="searchForm.govName" placeholder="请输入政府名称"></el-input>
              </el-form-item>
            </el-col>
            <!-- col: 2 --->
            <el-col :lg="8" :md="12" :sm="24">
              <el-form-item label="所在区域：" prop="areaCode.fullName">
                <el-input
                  placeholder="请选择所在区域"
                  v-model="searchForm.areaCode.fullName"
                  @focus="$refs.tabAreaSelect.visible=true"
                ></el-input>
                <tab-area-select ref="tabAreaSelect" :areaData="searchForm.areaCode"></tab-area-select>
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
            @click="paginationInfo.pageIndex=1; getGovAccountData()"
          >查 询</el-button>
          <el-button size="mini" @click="reset()">重 置</el-button>
        </el-col>
      </el-row>
      <el-button
        style="margin-top: 0px; margin-bottom: 20px;"
        type="primary"
        icon="el-icon-plus"
        @click="$refs.dialogAddAccount.dialogVisible=true"
      >新增政府账号</el-button>
      <el-row>
        <el-col :span="12" style="text-align: left"></el-col>
      </el-row>
    </el-form>

    <!-- 数据表格 -->
    <section class="table-wrapper">
      <el-table
        v-loading="loading"
        size="medium"
        :data="tableData"
        style="width: 100%;height:560px"
      >
        <el-table-column align="center" prop="agenceName" label="监督机构名称"></el-table-column>
        <el-table-column
          align="center"
          prop="agenceAddress"
          label="所在区域"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column align="center" prop="agenceMaster" label="机构负责人"></el-table-column>
        <el-table-column prop="agencePhone" align="center" label="手机号"></el-table-column>
        <el-table-column prop="createTime" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.agenceState" :active-value="1" :inactive-value="0"></el-switch>
          </template>
        </el-table-column>
        <!-- <el-table-column
          fixed="right"
          label="操作"
          width="120">
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
      @current-change="handleCurrentChange"
      background
      :current-page="paginationInfo.pageIndex"
      :page-size="paginationInfo.pageSize"
      :total="paginationInfo.pageTotle"
      style="text-align: center; padding-top: 30px;"
      layout="prev, pager, next"
    ></el-pagination>
    <!--添加账号Dialog-->
    <dialog-add-account ref="dialogAddAccount" @submitOk="getGovAccountData()"></dialog-add-account>
  </el-container>
</template>

<script>
import TabAreaSelect from '@/components/select/TabAreaSelect'
import DialogAddAccount from '@/view/account/govenment/dialogAddAccount'
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      searchForm: {
        govName: null,
        areaCode: {
          province: '',
          city: '',
          county: '',
          fullName: '',
          lastLevel: ''
        }
      },
      paginationInfo: {
        pageIndex: 1,
        pageSize: 12,
        pageTotle: 0
      }
    }
  },
  components: {
    DialogAddAccount,
    TabAreaSelect
  },
  // 钩子 - 初始化
  mounted() {
    this.getGovAccountData()
  },
  methods: {
    // 事件 - 重置
    reset() {
      this.$refs.searchForm.resetFields()
      this.searchForm.areaCode = {
        province: '',
        city: '',
        county: '',
        fullName: '',
        lastLevel: ''
      }
      this.paginationInfo.pageIndex = 1
      // this.getGovAccountData();
    },
    // 事件 - 分页导航栏页面改变
    handleCurrentChange(val) {
      this.paginationInfo.pageIndex = val
      this.getGovAccountData()
    },

    // 请求 - 获取政府总帐号
    getGovAccountData() {
      this.loading = true
      console.log(this.searchForm.areaCode)
      let params = {
        pageIndex: this.paginationInfo.pageIndex,
        pageSize: this.paginationInfo.pageSize,
        paramObj: {
          areaCode: this.searchForm.areaCode.lastLevel.areaCode,
          agenceName: this.searchForm.govName
        }
      }

      return this.axios
        .post(this.$api.getGovAccountList, params)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }

          this.tableData = res.data.data
          this.paginationInfo.pageTotle = res.data.paging.total
          return res.data.data
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
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
  @media screen and(min-width:1200px) and(max-width:1600px) {
    .el-table {
      height: 300px !important;
      overflow: auto;
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
        .el-input {
          width: 100%;
        }
        /* 使时间选择器自适应 */
        .el-date-editor {
          width: 100%;
        }
      }
    }
  }
}
</style>
