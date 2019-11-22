<template>
  <el-container>
    <el-main>
      <el-row class="title">
        <span style="font-size: 26px; color: rgba(52,88,199,1);" class="iconfont icon-brand"></span>
        <p style="font-size: 24px; color: #000; font-weight: 600; margin-left: 20px">{{userInfo.accountNickname}}</p>
        <el-button
          icon="el-icon-plus"
          type="primary"
          size="mini"
          style="margin-left: 65px"
          @click="$refs.addBranchSchool.dialogVisible=true"
        >新增分校</el-button>
      </el-row>
      <el-tabs
        tab-position="left"
        ref="elTable"
        @tab-click="tabClick"
        v-model="activePanel"
        v-loading="branchSchoolLoading"
      >
        <el-tab-pane v-for="(item, index) in branchSchoolList" :key="index" :name="'pane-' + index" style="position: relative">
          <template slot="label">
            <p>{{item.schoolName}}</p>
            <div class="right">
              <el-button type="text" @click.stop="$refs.editorDialog.dialogVisible=true;$refs.editorDialog.tid=item.tid">编辑</el-button>
              <el-button type="text">删除</el-button>
            </div>
          </template>

          <section>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px;">
              <p style="font-size: 24px;">{{schoolInfo.schoolName}}</p>
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-plus"
                @click="$refs.personAddDialog.dialogVisible=true;$refs.personAddDialog.schoolTid=schoolInfo.tid"
              >新增人员</el-button>
            </div>
            <el-table size="medium" :data="tableData" :height="tableHeight" style="width: 100%">
              <el-table-column prop="manageName" label="用户名" width="180"></el-table-column>
              <el-table-column prop="managePhone" label="手机号" width="200" align="center"></el-table-column>
              <el-table-column width="340" prop="createTime" label="创建时间" align="center"></el-table-column>
              <el-table-column label="使用状态" align="center">
                <template slot-scope="scope">
                  <p :style="{color: manangeStatuEnum[scope.row.manageState].color}">{{manangeStatuEnum[scope.row.manageState].type}}</p>
                </template>
              </el-table-column>

              <!--
              <el-table-column fixed="right" label="操作" width="120">
                <template>
                  <el-button type="text" size="small">岗位调动</el-button>
                  <el-button type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
              --->
            </el-table>
          </section>
          <!---
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-size="10"
            :total="40"
            style="text-align: center; padding-top: 30px;"
            layout="prev, pager, next"
          ></el-pagination> --->
        </el-tab-pane>
      </el-tabs>
      <add-branch-school ref="addBranchSchool" @submitOk="getBranchSchoolList()"></add-branch-school>
      <person-add-dialog ref="personAddDialog" @submitOk="getSlaveSchoolManager(schoolInfo.tid)"></person-add-dialog>
      <editor-dialog ref="editorDialog" @submitOk="getBranchSchoolList()"></editor-dialog>
    </el-main>
  </el-container>
</template>

<script>
import AddBranchSchool from '@/view/organization/school/dialog/addBranchSchool'
import PersonAddDialog from '@/view/organization/school/dialog/personAddDialog'
import EditorDialog from '@/view/organization/school/dialog/editorDialog'
export default {
  components: {
    AddBranchSchool,
    PersonAddDialog,
    EditorDialog
  },
  data() {
    return {
      roler: '',
      tableHeight: 540,
      activePanel: 'pane-0',
      branchSchoolLoading: false,
      userInfo: {},
      tableData: [],
      branchSchoolList: [],
      schoolInfo: {
        schoolName: null,
        tid: null
      },
      manangeStatuEnum: [
        { color: '#FF0000', type: '删除' },
        { color: '#7ED321', type: '激活' },
        { color: '#EDEDED', type: '未激活' }
      ]
    }
  },
  filters: {
  },
  mounted() {
    // 初始化分校列表
    this.getBranchSchoolList().then(data => {
      this.getSlaveSchoolManager(data[0].tid)
      this.schoolInfo = data[0]
    })

    // 获取账号信息
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  },
  methods: {
    // 事件 - 标签页点击
    tabClick (tabItem) {
      this.schoolInfo = this.branchSchoolList[tabItem.index]
      this.getSlaveSchoolManager(this.schoolInfo.tid)
    },
    // 请求 - 获取分校列表
    getBranchSchoolList () {
      this.branchSchoolLoading = true
      return this.axios
        .get(this.$api.getSlaveSchoolList)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }
          this.branchSchoolList = res.data.data
          return res.data.data
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.branchSchoolLoading = false
        })
    },
    // 请求 - 获取分校管理员列表
    getSlaveSchoolManager (tid) {
      return this.axios
        .get(this.$api.getSlaveSchoolManager + tid)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }
          this.tableData = res.data.data
          return res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  // 事件 - 分页页面改变
  handleCurrentChange() {}
}
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 32px;
  .el-main {
    background-color: #fff;
    flex: 1;
    flex-flow: column;
    display: flex;
    padding: 30px;
    box-sizing: border-box;
    .title {
      display: flex;
      align-items: center;
    }
    .el-tabs {
      width: 100%;
      flex: 1;
      /* tab表头样式 */
      /deep/ .el-tabs__header {
        width: 400px;
        padding-top: 10px;
        .el-tabs__item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 30px 50px !important;
          p {
            font-size: 16px;
            font-family: PingFangSC-Medium;
            font-weight: 550;
            line-height: 28px;
          }
          .right .el-button {
            font-size: 14px;
            font-family: PingFangSC-Medium;
            font-weight: 400;
            color: rgba(52, 88, 199, 1);
            line-height: 28px;
          }
        }
      }
      /* tab内容样式 */
      /deep/ .el-tabs__content {
        padding: 20px 30px;
      }
    }
  }
}
</style>
