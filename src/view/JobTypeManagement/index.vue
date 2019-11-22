<template>
  <el-container>
    <el-main style="display: flex; flex-direction: row; width: 100%;height: 100%">
      <div style="flex: 3;height: 100%;">
        <el-row class="title">
          <span style="font-size: 26px; color: rgba(52,88,199,1);" class="iconfont icon-brand"></span>
          <p style="font-size: 24px; color: #000; font-weight: 600; margin-left: 20px">一级工种</p>
          <el-button
            type="primary"
            size="mini"
            style="margin-left: 65px"
            @click="$refs.addBranchSchool.dialogVisible=true"
          >新增一级工种</el-button>
        </el-row>
        <el-tabs
          tab-position="left"
          ref="elTable"
          @tab-click="tabClick"
          v-model="activePanel"
          v-loading="branchSchoolLoading"
        >
          <el-tab-pane v-for="(item, index) in branchSchoolList" :key="index" :name="'pane-' + index" style="position: relative;">
            <template slot="label">
              <p>{{item.enumerValue}}</p>
              <div class="right">
                <el-button type="text"
                           @click.stop="$refs.editorDialog.dialogVisible=true;
                         $refs.editorDialog.tid=item.tid;
                         $refs.editorDialog.personInfo.name=item.enumerValue;">
                  编辑</el-button>
                <el-button type="text" @click="deleteParentLevel(item.tid)">删除</el-button>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div style="flex: 7;height: 100%;">
        <section>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px;">
            <p style="font-size: 24px;">{{schoolInfo.enumerValue}}</p>
            <el-button
              type="primary"
              size="mini"
              @click="$refs.personAddDialog.dialogVisible=true;$refs.personAddDialog.schoolTid=schoolInfo.tid"
            >新建二级工种</el-button>
          </div>
          <el-table size="medium" :data="tableData" :height="tableHeight" style="width: 100%">
            <el-table-column prop="enumerValue" label="工种名称" width="180"></el-table-column>
            <el-table-column width="340" prop="createTime" label="创建时间" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="$refs.editorsubDialog.dialogVisible=true;
                         $refs.editorsubDialog.tid=scope.row.tid;
                         $refs.editorsubDialog.personInfo.name=scope.row.enumerValue;
                  ">编辑</el-button>
                <el-button type="text" @click="deleteSubLevel(scope.row.tid, scope.row.parentId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </section>
      </div>
      <add-branch-school ref="addBranchSchool" @submitOk="getBranchSchoolList()"></add-branch-school>
      <person-add-dialog ref="personAddDialog" @submitOk="getSlaveSchoolManager(schoolInfo.tid)" :parentId="schoolInfo.tid"></person-add-dialog>
      <editor-dialog ref="editorDialog" @submitOk="getBranchSchoolList()"></editor-dialog>
      <editor-sub-dialog ref="editorsubDialog" @submitOk="getSlaveSchoolManager(schoolInfo.tid)"></editor-sub-dialog>
    </el-main>
  </el-container>
</template>

<script>
import AddBranchSchool from '@/view/JobTypeManagement/dialog/addBranchSchool'
import PersonAddDialog from '@/view/JobTypeManagement/dialog/personAddDialog'
import EditorDialog from '@/view/JobTypeManagement/dialog/editorDialog'
import EditorSubDialog from '@/view/JobTypeManagement/dialog/editorSubDialog'
export default {
  components: {
    AddBranchSchool,
    PersonAddDialog,
    EditorDialog,
    EditorSubDialog
  },
  data() {
    return {
      searchWord: '',
      roler: '',
      tableHeight: 540,
      activePanel: '',
      branchSchoolLoading: false,
      userInfo: {},
      tableData: [],
      branchSchoolList: [],
      schoolInfo: {
        enumerValue: null,
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
    // 初始化工种列表
    this.getBranchSchoolList().then(data => {
      this.getSlaveSchoolManager(data[0].tid)
      this.schoolInfo = data
    })

    // 获取账号信息
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  },
  methods: {
    // 删除二级工种
    deleteSubLevel (tid, parentId) {
      this.$confirm('删除后无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return this.axios
          .get(this.$api.deleteWorkType + tid)
          .then(res => {
            if (res.data.result !== 'ok') {
              this.$message.error(res.data.error.message)
              return Promise.reject(new Error(res.data.error.message))
            }
            // 删除成功，刷新列表
            this.getSlaveSchoolManager(parentId)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            return res.data.data
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {

          })
      }).catch(() => {

      })
    },
    // 删除一级工种
    deleteParentLevel (tid) {
      this.$confirm('删除后无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return this.axios
          .get(this.$api.deleteWorkType + tid)
          .then(res => {
            if (res.data.result !== 'ok') {
              this.$message.error(res.data.error.message)
              return Promise.reject(new Error(res.data.error.message))
            }
            // 删除成功，刷新列表
            this.getBranchSchoolList()
            this.tableData = []
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            return res.data.data
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {

          })
      }).catch(() => {

      })
    },
    // 事件 - 标签页点击
    tabClick (tabItem) {
      this.schoolInfo = this.branchSchoolList[tabItem.index]
      this.getSlaveSchoolManager(this.schoolInfo.tid)
    },
    // 请求 - 获取工种列表
    getBranchSchoolList () {
      this.branchSchoolLoading = true
      return this.axios
        .get(this.$api.workTypeList)
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
    // 请求 - 获取二级工种列表
    getSlaveSchoolManager (tid) {
      return this.axios
        .get(this.$api.workTypeChildList + tid)
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
