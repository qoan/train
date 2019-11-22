<template>
  <el-dialog
    @open="open"
    @close="close"
    :custom-class="customClass"
    :visible.sync="dialogVisible"
    :width="width"
    :title="title"
  >
    <div>
      <el-row class="content-wapper">
        <el-col :span="12" class="left">
          <!--标题-->
          <p style="width: 100%; text-align: left; font-size: 14px; font-weight: 600;">学员列表</p>
          <!--搜索栏-->
          <el-form>
            <el-row type="flex" justify="space-between">
              <el-col :span="14">
                <el-form-item>
                  <el-input
                    :size="size"
                    v-model="leftSearchForm.nameOrIdCard"
                    placeholder="请输入学生姓名或身份证号"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item style="text-align: right;">
                  <el-button type="primary" :size="size" @click="getStdListSchoolId">查 询</el-button>
                  <el-button :size="size" type="primary" @click="addStdToClass">添 加</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="end">
              <el-col :span="14">
                <el-form-item style="text-align: right;">
                  <el-radio-group
                    v-model="leftSearchForm.type"
                    :size="size"
                    @change="getStdListSchoolId()"
                  >
                    <el-radio-button label="1">当前空闲学员</el-radio-button>
                    <el-radio-button label="0">历史培训学员</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!-- 表格 -->
          <el-table v-loading="leftLoading" ref="leftTable" height="500" :data="leftData">
            <el-table-column prop="name" label="学员姓名" width="130px"></el-table-column>
            <el-table-column prop="idCard" label="身份证号" min-width="160px"></el-table-column>
            <el-table-column fixed="right" label="操作" type="selection" width="40"></el-table-column>
            <p>操作</p>
          </el-table>

          <!-- 导航栏 -->
          <el-pagination
            style="width: 100%; text-align: center;"
            @current-change="leftPageChange"
            :total="paginationInfo.leftPageTotle"
            :current-page="paginationInfo.leftPageIndex"
            :page-size="paginationInfo.leftPageSize"
            layout="prev, pager, next"
          ></el-pagination>
        </el-col>
        <el-col :span="12" class="right">
          <!-- 标题 -->
          <p
            style="width: 100%; text-align: left; font-size: 14px; font-weight: 600; margin-bottom: 10px;"
          >学员列表</p>
          <!-- 表格 -->
          <el-table height="500" :data="rightData" v-loading="rightLoading">
            <el-table-column prop="name" label="学员姓名" width="130px"></el-table-column>
            <el-table-column prop="idCard" label="身份证号" min-width="160px"></el-table-column>
            <!---fixed="right" element fixed实际时重新复制了一份DOM，
            这样会导致模板被渲染两次，如果此时有条目的特殊处理可能会出现问题--->
            <el-table-column fixed="right" label="操作" width="60">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  :size="size"
                  :disabled="!deleteable(scope)"
                  @click="rightDelete(scope)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 导航栏
          <el-pagination
            style="width: 100%; text-align: center;"
            @current-change="rightPageChange"
            :total="paginationInfo.rightPageTotle"
            :current-page="paginationInfo.rightPageIndex"
            :page-size="paginationInfo.rightPageSize"
            layout="prev, pager, next"
            >
          </el-pagination>-->
        </el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveInfo()">保 存</el-button>
      <el-button type="primary" @click="dialogVisible=false">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      customClass: 'dialog-ediotr-std',
      title: '学生信息列表',
      width: '50%',
      size: 'mini',
      leftLoading: false,
      rightLoading: false,
      submitLoading: false,
      classId: null, // 当前班级的Id
      paginationInfo: {
        leftPageIndex: 1,
        leftPageSize: 11,
        leftPageTotle: 50,
        rightPageIndex: 1,
        rightPageSize: 11,
        rightPageTotle: 50
      },
      leftSearchForm: {
        type: 1, // 学生状态（空闲/历史培训）
        nameOrIdCard: null // 学生姓名或者身份证号
      },
      leftData: [], // 当前左边框数据
      rightData: [], // 当前有边框数据
      selectedItem: []
    }
  },
  methods: {
    open() {
      this.getStdListSchoolId() // 获取左边数据
      this.getStudentInfo() // 获取右边数据
    },
    close() {
      this.selectedItem = [] // 置空，保证每次开始选择时都是空的
      this.leftSearchForm = {
        // 置空查询条件
        type: 1,
        nameOrIdCard: null
      }
      console.log('关闭')
      this.$emit('closeOk')
    },
    leftPageChange(val) {
      this.paginationInfo.leftPageIndex = val
      this.getStdListSchoolId()
    },
    rightPageChange(val) {
      this.paginationInfo.rightPageIndex = val
      this.getStdListSchoolId()
    },
    // 添加左侧选中项到右边列表
    addStdToClass() {
      // 添加到右边
      this.rightData = this.$refs.leftTable.selection.concat(this.rightData)
      // 从左边删除
      this.leftData = this.leftData.filter(item => !this.$refs.leftTable.selection.includes(item))
      // 将选中项保存，涉及到分页，每次分页都会刷新数据，需要保存状态
      this.selectedItem = this.$refs.leftTable.selection.concat(this.selectedItem)
    },
    // 右边列表项删除返回左边列表
    rightDelete(scope) {
      // 从右边删除
      this.rightData.splice(this.rightData.indexOf(scope.row), 1)
      // 回滚回左边 - 并进行重新排序
      this.leftData.push(scope.row)
      this.leftData.sort((x, y) => {
        return x.studentId <= y.studentId ? -1 : 1
      })

      // 从选中项中删除
      this.selectedItem.splice(this.selectedItem.indexOf(scope.row), 1)
    },
    // 判断右侧选项是否可选，业务逻辑时原班级学生都不能被选中删除
    deleteable(scope) {
      return this.selectedItem.some(function(item) {
        return scope.row.studentId === item.studentId
      })
    },
    // 获取学校学生列表
    getStdListSchoolId() {
      this.leftLoading = true

      // 基础参数
      let params = {
        pageIndex: this.paginationInfo.leftPageIndex,
        pageSize: this.paginationInfo.leftPageSize,
        paramObj: {
          classId: parseInt(this.classId),
          type: parseInt(this.leftSearchForm.type)
        }
      }

      // 可选参数 - 身份证或姓名
      let nameOrIdCard = this.leftSearchForm.nameOrIdCard
      if (nameOrIdCard !== null && nameOrIdCard.trim() !== '') {
        if (this.isName(nameOrIdCard)) {
          params.paramObj['name'] = nameOrIdCard
        } else {
          params.paramObj['idCard'] = nameOrIdCard
        }
      }

      return this.axios
        .post(this.$api.getStdListBySchoolId, params)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }
          this.leftData = res.data.data.records
          return res.data.data
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.leftLoading = false
        })
    },
    // 获取班级学生列表
    getStudentInfo() {
      this.rightLoading = true
      return this.axios
        .post(this.$api.getClassStdent + `?classId=${this.classId}&pageIndex=${this.paginationInfo.rightPageIndex}&pageSize=${this.paginationInfo.rightPageSize}`)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }
          this.rightData = res.data.data.records
          return res.data.data
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.rightLoading = false
        })
    },
    // 请求 - 保存信息
    saveInfo() {
      this.submitLoading = false
      return this.axios
        .post(this.$api.addStdToClass, {
          classId: parseInt(this.classId),
          schoolId: 2,
          studentIdList: this.selectedItem.map(item => item.studentId)
        })
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }
          // 提示
          this.$message({
            message: '添加学生成功!',
            type: 'success'
          })
          // 清空选中项
          this.selectedItem = [] // 置空，保证每次开始选择时都是空的

          return res.data.data
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.submitLoading = true
          // 重新拉取数据, 重新拉取数据， 不管成功还是失败
          this.getStdListSchoolId()
          this.getStudentInfo()
        })
    },
    // 判断是否是姓名
    isName(str) {
      // 匹配中文，其中有一个中文就算是姓名，暂时不对名字长度进行限制
      return /[\u4e00-\u9fa5]+/.test(str)
    }
  }
}
</script>

<style lang="scss">
/* dialog位于顶层，scoped局域是无法选中的， 所以最好定义dialog的类名 */
.dialog-ediotr-std {
  .el-dialog__header {
    border-bottom: 1px solid #f7f7f7;
  }
  .el-dialog__body {
    padding-left: 40px;
    padding-right: 40px;
    padding-bottom: 0px;
    padding-bottom: 0px;
  }
}

/* 中间布局位置 */
.content-wapper {
  height: 600px;
  width: 100%;
  padding-bottom: 20px;
  border-bottom: 1px solid #f7f7f7;
  .left {
    height: 100%;
    padding: 20px 30px;
    box-sizing: border-box;
    display: flex;
    flex-flow: column nowrap;
    .el-form {
      margin-top: 15px;
    }
  }
  .right {
    height: 100%;
    padding: 20px 30px;
    box-sizing: border-box;
    border-left: 1px solid #f7f7f7;
    display: flex;
    flex-flow: column nowrap;
  }
}

/* 表格样式 */
.dialog-ediotr-std .el-table {
  margin-left: -12px; // 不要问我为什么
  width: 100%;
  &::before {
    height: 0;
  }
  /deep/ .el-table__fixed-right {
    &::before {
      height: 0;
    }
  }
  .el-table__header /deep/ th {
    border: none;
  }
  .el-table__body-wrapper {
    &::-webkit-scrollbar {
      width: 4px; // 横向滚动条
      height: 8px; // 纵向滚动条 必写
    }
    &::-webkit-scrollbar-thumb {
      background-color: grey;
      border-radius: 5px;
    }
  }
  .el-table__body /deep/ td {
    border: none;
  }
}
</style>
