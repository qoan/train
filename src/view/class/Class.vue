<template>
  <div class="warp">
    <!-- 搜索栏 -->
    <el-form class="serachForm" ref="searchForm" :model="searchForm" :rules="rules" size="mini">
      <el-row :gutter="20">
        <!-- col: 1 --->
        <el-col :lg="19" :md="24">
          <!-- row: 1 --->
          <el-row :gutter="60">
            <!-- col: 1 --->
            <el-col :lg="8" :md="12" :sm="24">
              <el-form-item label="班级名称：" prop="className">
                <el-input
                  v-model="searchForm.className"
                  @keyup.enter.native="getClassFormData()"
                  placeholder="请输入班级名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- col: 2 --->
            <el-col :lg="8" :md="12" :sm="24">
              <el-form-item label="学校名称：" prop="schoolName">
                <el-input
                  v-model="searchForm.schoolName"
                  @keyup.enter.native="getClassFormData()"
                  placeholder="请输入学校名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- col: 3 --->
            <!-- <el-col :lg="8" :md="12" :sm="24">
              <el-form-item label="班级地址：" prop="areacodeAddress">
                <el-input
                  v-model="searchForm.areacodeAddress"
                  @keyup.enter.native="getClassFormData()"
                  placeholder="请输入班级地址"
                ></el-input>
              </el-form-item>
            </el-col>-->

            <el-col :lg="8" :md="12" :sm="24">
              <el-form-item label="开班状态：" prop="isStart">
                <el-select v-model="searchForm.isStart" value-key="key" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in enumList.classStatuData"
                    :key="index"
                    :label="item.value"
                    :value="item.key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- row: 2 --->
          <el-row :gutter="60">
            <!-- col: 1 --->
            <el-col :lg="8" :md="12" :sm="24">
              <el-form-item label="培训工种：" prop="workTypeTid">
                <!-- <el-select v-model="searchForm.workTypeTid" value-key="tid" placeholder="请选择">
                  <el-option
                    v-for="item in enumList['work_type']"
                    :key="item.tid"
                    :label="item.enumerValue"
                    :value="item.tid"
                  ></el-option>
                </el-select>-->
                <el-cascader
                  style="width:100%"
                  v-model="searchForm.workTypeTid"
                  :options="options"
                  @change="handleChange"
                  :props="props"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <!-- col: 2 --->

            <!-- col: 3 --->
            <el-col :lg="8" :md="12" :sm="24">
              <el-form-item label="培训时间：" prop="trainDate">
                <el-date-picker
                  v-model="searchForm.trainDate"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="24">
              <el-button
                type="primary"
                size="mini"
                style="margin-right: 20px"
                @click="queryClass()"
              >查 询</el-button>
              <el-button
                size="mini"
                @click="$refs['searchForm'].resetFields();pageIndex=1;getClassFormData()"
              >重 置</el-button>
            </el-col>
          </el-row>
        </el-col>
        <!-- col: 2 --->
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-button
            type="primary"
            v-if="userType === 5"
            @click="$refs.addClassDialog.dialogVisible=true"
          >新建班级</el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- 班级列表 -->
    <section class="classList" v-loading="loading" style="margin-top: 20px;">
      <!-- 表格 --->
      <img v-if="len===0" src="../../assets/img/no.png" class="Img" />
      <div v-else class="card-list">
        <el-card
          class="card"
          v-for="(record, index) in classListData"
          :key="index"
          shadow="hover"
          @mouseenter.native="mouseOver(index)"
          @mouseleave.native="mouseLeave()"
          @click.native="$router.push({ name: 'classDetail', query: { tid: record.tid} });"
        >
          <p>
            <span class="hid">{{record.className}}</span>

            <el-tag
              size="mini"
              class="tag"
              style="float:right"
              :style="{background:back[index%5]}"
            >{{record.workType}}</el-tag>
          </p>
          <p>
            <i class="iconfont icon-address1"></i>
            {{record.trainAddress}}
          </p>
          <p>
            <i class="iconfont icon-person"></i>
            {{record.studentCount}}人
          </p>
          <p>
            <i class="iconfont icon-education"></i>
            {{record.schoolName}}
          </p>
          <p>
            <i class="iconfont icon-time"></i>
            {{`${record.trainDateStart.replace(/-/g, '/')} - ${record.trainDateEnd.replace(/-/g, '/')}`}}
          </p>
          <div v-if="role">
            <el-button
              type="text"
              size="small"
              class="btndelete"
              v-show="show&&index==current"
              @click.stop="deleteClass(record.tid)"
            >删除</el-button>
          </div>

          <!-- v-if="userType === 5" -->
        </el-card>
      </div>
    </section>

    <!-- 分页导航 -->
    <el-pagination
      v-if="active"
      :background="true"
      @current-change="pageChange"
      :total="pagination.pageTotal"
      :current-page="pagination.pageIndex"
      :page-size="pagination.pageSize"
      layout="prev, pager, next"
    ></el-pagination>

    <!-- 新增班级弹窗 -->
    <add-class-dialog ref="addClassDialog" @submitOk="getClassFormData()"></add-class-dialog>
  </div>
</template>

<script>
import ClassModel from '@/model/class.js'
import classEntity from '@/model/entity/classEntity'
import enumUtil from '@/utils/enumUtil.js'
import colorEnum from '@/data/colorEnum.js'
import AddClassDialog from '@/view/class/dialog/AddClassDialog'
// import { resolve } from 'dns'
// import Actoar from '../../assets/img/no.png'
export default {
  name: 'class',
  components: {
    AddClassDialog
  },
  data() {
    return {
      back: ['#fbd14b', '#ff585d', '#252a34', '#08d9d6', '#bebebe'],
      work: 0,
      props: { expandTrigger: 'hover', value: 'tid', label: 'enumerValue', children: 'childrenList' },
      options: [],
      role: 0,
      current: 0,
      active: false,
      show: false,
      loading: false, // 加载动画
      dialogFormVisible: false, // 新增班级弹窗
      userType: null, // 用户身份标识
      enumList: {}, // 枚举集合
      len: 0,
      pagination: {
        pageTotal: 0, // 数据总条数
        pageIndex: 1, // 当前页数索引
        pageSize: 15 // 一页展示的页数
      },
      searchForm: {
        className: null, // 班级名
        schoolName: null, // 学校名
        areacodeAddress: null, // 班级地址
        isStart: null, // 是否开班
        workTypeTid: null, // 培训工种
        trainDate: null // 培训开始和结束时间
        // trainType: null //培训类别
      },
      classListData: null, // 表格数据
      rules: {
        // 搜索表单校验规则
        className: [
          {
            min: 2,
            max: 20,
            message: '班级名称长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ],
        schoolName: [
          {
            min: 2,
            max: 20,
            message: '学校名称长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ],
        areacodeAddress: [
          {
            min: 2,
            max: 20,
            message: '请输入详细班级地址，长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    // 获取表格数据
    this.getClassFormData()

    // 获取枚举
    this.enumList = enumUtil.getEnumList(['work_type'])
    this.enumList.classStatuData = [{ key: 1, value: '已开班' }, { key: 2, value: '已结业' }]
    // console.log(this.enumList)
    this.options = enumUtil.getEnumList(['work_type']).work_type

    // 获取当前身份信息
    this.userType = parseInt(JSON.parse(sessionStorage.getItem('userInfo')).roleTid)
    if (this.userType === 5) {
      this.role = true
    } else {
      this.role = false
    }
  },
  methods: {
    handleChange(value) {},
    // 其它 - 根据枚举value找到枚举key
    convertEnumToValue(value, enumList) {
      if (enumList.length <= 0) return 0
      let item = enumList.find(item => item.enumerValue === value)
      if (item === undefined) return 0
      return item.tid
    },
    // 其它 - 班级工种颜色生成规则
    getWorkTypeColor(value) {
      return colorEnum.getColor(this.convertEnumToValue(value, this.enumList.work_type))
    },
    // 网络 - 请求班级分页数据
    getClassFormData() {
      this.loading = true

      // 参数处理

      if (this.searchForm.workTypeTid) {
        this.searchForm.workTypeTid = this.searchForm.workTypeTid[1]
      }
      let paramObj = this.searchForm
      paramObj.trainDateStart = this.searchForm.trainDate && this.searchForm.trainDate[0]
      paramObj.trainDateEnd = this.searchForm.trainDate && this.searchForm.trainDate[1]
      // console.log(this.searchForm.className)
      let params = {
        pageIndex: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize,
        paramObj: paramObj
      }
      // 请求数据
      ClassModel.getClassList(params)
        .then(data => {
          this.classListData = data.classListData
          this.len = data.classListData.length
          this.pagination.pageTotal = data.pageTotle
          console.log(data)
          // console.log(sessionStorage.getItem('roleTid'))
          if (this.len === 0) {
            this.active = false
          } else {
            this.active = true
          }
          console.log(data)
          return data
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 事件 - 分页导航页面改变
    pageChange(val) {
      this.pagination.pageIndex = val
      // console.log(val)
      this.getClassFormData()
    },
    // 事件 - 根据条件查询班级
    queryClass() {
      this.$refs['searchForm'].validate(valid => {
        if (!valid) return false
        this.pageIndex = 1
        this.getClassFormData()
      })
    },

    // 请求 --- 删除班级操作
    deleteClass(tid) {
      console.log(tid)
      this.$confirm('删除后不能恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .post(this.$api.delClassById + tid)

            .then(res => {
              console.log(res)
              if (res.data.result !== 'ok') {
                this.$message.error(res.data.error.message)
                return Promise.reject(new Error(res.data.error.message))
              }
              this.$message({
                type: 'success',
                message: '删除成功'
              })

              this.pagination.pageIndex = 1
              this.getClassFormData()
              return res.data.data
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    },
    mouseOver(index) {
      this.show = true
      this.current = index
    },
    // 移出
    mouseLeave() {
      this.show = false
      this.current = null
    }
  }
}
</script>

<style scoped lang="scss">
/* 包裹层 */
.warp {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
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
/* 搜索栏 */
.serachForm {
  /deep/ .el-form-item {
    width: 100%;
    display: flex;
    /* 使输入框自适应 */
    .el-form-item__content {
      flex: 1;
      .el-input {
        width: 100%;
      }
      /* 使下拉框自适应 */
      .el-select {
        width: 100% !important;
      }
      /* 使时间选择器自适应 */
      .el-date-editor {
        width: 100%;
      }
    }
  }
}

/* 分页导航 */
.el-pagination {
  left: 50%;
  margin-left: -150px;
  width: 100%;
  position: absolute;
  bottom: 30px;
}
@media screen and(min-width:1200px) and(max-width:1399px) {
  .card-list {
    height: 280px !important;
    overflow: auto;
  }
}
@media screen and(min-width:1400px) and(max-width:1439px) {
  .card-list {
    height: 520px !important;
    overflow: auto;
  }
}
@media screen and(min-width:1440px) and(max-width:1600px) {
  .card-list {
    height: 350px !important;
    overflow: auto;
  }
}
/* 班级列表 */
.classList {
  display: flex;
  flex-flow: column nowrap;
  .card-list {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    grid-template-columns: repeat(5, calc(100% / 5));
    grid-template-rows: repeat(3, 180px);
    position: relative;

    .card {
      width: 250px !important;
      height: 150px;
      border-radius: 5px;
      color: #7c7e81;
      cursor: pointer;
      margin-bottom: 30px;
      position: relative;
      margin-left: 40px;
      .hid {
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        /*禁止换行显示*/
        white-space: nowrap;
        display: inline-block;
      }
      p {
        width: 100%;
        margin-top: 5px;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 1px;
        i {
          margin-right: 5px;
          font-size: 12px;
        }
        &:first-of-type {
          font-size: 14px;
          color: #3458c7;
        }
      }
      .btndelete {
        position: absolute;
        bottom: 10px;
        right: 10px;
        z-index: 1000;
      }
    }
  }
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
  border-color: transparent;
}
</style>
