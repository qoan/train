<template>
  <!--- 表格列表 --->
  <div class="form">
    <!--- 顶部搜索栏 --->
    <el-row class="top">
      <el-col :span="24" style="text-align: right">
        <el-button type="primary" size="mini" @click="$refs.personAddDialog.dialogVisible=true">新增人员</el-button>
      </el-col>
    </el-row>

    <div class="form-wapper" v-loading="loading">
      <!-- 表格 -->
      <img v-if="len===0" src="@/assets/img/no.png" class="Img" />
      <el-table v-else height="500" :data="formData">
        <el-table-column align="center" prop="manageName" label="用户名称" width="120"></el-table-column>
        <el-table-column align="center" prop="managePhone" label="手机号" min-width="200"></el-table-column>
        <!---<el-table-column
          align="center"
          prop="area"
          label="所在区域"
          min-width="220">
        </el-table-column>--->
        <el-table-column align="center" prop="createTime" label="创建时间" min-width="200"></el-table-column>
        <el-table-column align="center" min-width="200" prop="manageState" label="使用状态">
          <template slot-scope="scope">
            <p
              :style="{color: manangeStatuEnum[scope.row.manageState].color}"
            >{{manangeStatuEnum[scope.row.manageState].type}}</p>
          </template>
        </el-table-column>

        <!---
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="$refs.editorDialog.dialogVisible = true;$refs.editorDialog.originData = scope.row">
              编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              >
              删除
            </el-button>
          </template>
        </el-table-column>
        --->
      </el-table>

      <!-- 分页导航 -->
      <el-pagination
        v-if="active"
        :background="true"
        @current-change="pageChange"
        :total="paginationInfo.pageTotle"
        :current-page.sync="paginationInfo.pageIndex"
        :page-size="paginationInfo.pageSize"
        layout="prev, pager, next"
      ></el-pagination>
    </div>
    <editor-dialog ref="editorDialog"></editor-dialog>
    <person-add-dialog ref="personAddDialog" @submitOk="getGovManagerList()"></person-add-dialog>
  </div>
</template>

<script>
import PersonAddDialog from './dialog/personAddDialog'
import EditorDialog from './dialog/editorDialog'
export default {
  components: {
    PersonAddDialog,
    EditorDialog
  },
  data() {
    return {
      loading: false,
      len: 0,
      active: false,
      paginationInfo: {
        pageTotle: 0,
        pageIndex: 1,
        pageSize: 10
      },
      searchForm: {
        name: null,
        phone: null,
        area: null,
        createTime: null,
        status: null
      },
      formData: [],
      manangeStatuEnum: [{ color: '#FF0000', type: '删除' }, { color: '#7ED321', type: '激活' }, { color: '#EDEDED', type: '未激活' }]
    }
  },
  mounted() {
    this.getGovManagerList()
  },
  methods: {
    pageChange(val) {
      this.paginationInfo.pageIndex = val
      this.getGovManagerList()
      console.log(val)
    },
    // 请求 - 获取政府管理员账号
    getGovManagerList() {
      this.loading = true
      return this.axios
        .get(this.$api.getGovManagerList)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }
          console.log(res)
          this.formData = res.data.data
          this.len = this.formData.length
          if (this.len === 0) {
            this.active = false
          } else {
            this.active = true
          }
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
.Img {
  margin-top: 100px;
  color: #909399;
  width: 200px;
  height: 200px;
  transform: translateX(-100px);
  margin-left: 50%;
  margin-bottom: 100px;
}
.form {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 30px 30px 60px 30px;
  box-sizing: border-box;
  display: flex;
  flex-flow: column nowrap;
  .top {
    margin-bottom: 30px;
  }
  .form-wapper {
    padding: 40px;
    box-sizing: border-box;
    background-color: #fff;
    display: flex;
    flex: 1;
    flex-flow: column nowrap;
    .el-pagination {
      width: 100%;
      text-align: center;
      padding-top: 40px;
    }
    .el-table {
      width: 100%;
      flex: 1;
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
</style>
