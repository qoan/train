<template>
  <el-dialog
    :custom-class="customClass"
    :visible.sync="dialogVisible"
    :width="width"
    @open="open"
    :title="title"
  >
    <el-form
      class="serachForm"
      ref="searchForm"
      :model="searchForm"
      :rules="rules"
      status-icon
      :size="size"
    >
      <h3 style="margin-bottom: 20px;">基础信息</h3>
      <!--- 第一栏 -->
      <el-row :gutter="40">
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="班级名称" prop="className">
            <el-input placeholder="请输入班级名称" v-model="searchForm.className"></el-input>
          </el-form-item>
        </el-col>

        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="培训工种" prop="workType">
            <!-- <el-select v-model="searchForm.workType" placeholder="请选择培训工种">
              <el-option
                v-for="item in workTypeList"
                :key="item.tid"
                :label="item.enumerValue"
                :value="item.tid"
              ></el-option>
            </el-select>-->
            <el-cascader
              style="width:100%"
              v-model="searchForm.workType"
              :options="options"
              :props="props"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="培训层次" prop="trainLevel">
            <el-select v-model="searchForm.trainLevel" placeholder="请选择培训层次">
              <el-option
                v-for="item in trainLevelList"
                :key="item.tid"
                :label="item.enumerValue"
                :value="item.tid"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="办学地点" prop="areaAddress.fullName">
            <el-input
              placeholder="请选择地址"
              v-model="searchForm.areaAddress.fullName"
              @focus="$refs.TabAreaSelect.visible=true"
            ></el-input>
            <tab-area-select ref="TabAreaSelect" :areaData="searchForm.areaAddress"></tab-area-select>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="培训时间" prop="trainDate">
            <el-date-picker
              v-model="searchForm.trainDate"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <!--两个时间栏放在相邻出现居右现象，可能与el-row浮动有关 -->
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="上课时间" prop="classTime">
            <el-time-picker
              v-model="searchForm.classTime"
              is-range
              format="HH:mm"
              value-format="HH:mm:00"
              range-separator="至"
              start-placeholder="上课时间"
              end-placeholder="下课时间"
              placeholder="选择时间范围"
            ></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="培训地点" prop="trainAddress">
            <el-input placeholder="请输入培训地址" v-model="searchForm.trainAddress"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="培训类别" prop="trainType">
            <el-select v-model="searchForm.trainType" placeholder="请选择培训类别">
              <el-option
                v-for="item in trainTypeList"
                :key="item.tid"
                :label="item.enumerValue"
                :value="item.enumerValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="培训人数" prop="studentCount">
            <el-input-number v-model="searchForm.studentCount" :min="1" :max="200" label="请输入培训人数"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="理论课时" prop="theoryCount">
            <el-input-number v-model="searchForm.theoryCount" :min="1" :max="100" label="请输入理论课时"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="实操课时" prop="practiceCount">
            <el-input-number v-model="searchForm.practiceCount" :min="1" :max="100" label="请输入实操课时"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <!--- 第二栏 -->
      <h3 style="margin-bottom: 20px;">人员信息</h3>
      <el-row :gutter="40">
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="理论老师" prop="theoryTeacher.teacherName">
            <el-select
              value-key="teacherId"
              v-model="searchForm.theoryTeacher"
              placeholder="请选择理论老师"
            >
              <el-option
                v-for="item in teacherListType"
                :key="item.teacherId"
                :label="item.teacherName"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="实操老师" prop="practiceTeacher.teacherName">
            <el-select
              value-key="teacherId"
              v-model="searchForm.practiceTeacher"
              placeholder="请选择实操老师"
            >
              <el-option
                v-for="item in teacherListType"
                :key="item.teacherId"
                :label="item.teacherName"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!---
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="课程表">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              multiple
              :limit="3"
            >
              <el-button size="small" type="text">选择文件</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
        --->
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$refs.searchForm.resetFields()">重 置</el-button>
      <el-button type="primary" :loading="loading" @click="save">{{loading ? '执行中...' : '提 交'}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import TabAreaSelect from '@/components/select/TabAreaSelect'
export default {
  components: {
    TabAreaSelect
  },
  data() {
    /* 检查是否有特殊字符：除汉字 数字 字母以外的  */
    const hasSpeChar = (rule, value, callback) => {
      if (/^[\w\u4e00-\u9fa5]+$/.test(value)) {
        callback()
      } else {
        callback(new Error('只能由汉字、数字、字母组成，不允许包含特殊字符'))
      }
    }

    return {
      props: { expandTrigger: 'hover', value: 'tid', label: 'enumerValue', children: 'childrenList' },
      options: [],
      dialogVisible: false,
      loading: false,
      customClass: 'dialog-two',
      title: '新增班级',
      width: '40%',
      size: 'mini',
      searchForm: {
        className: null, // 班级名
        workType: null, // 培训工种
        trainDate: null, // 培训开始和结束时间
        classTime: null, // 上课开始-结束时间
        trainLevel: null, // 培训层次
        studentCount: null, // 培训人数
        theoryCount: null, // 理论课时间
        practiceCount: null, // 实操课时间
        classType: null,
        theoryTeacher: {
          teacherId: 0,
          teacherName: '',
          classType: 0
        }, // 理论老师
        practiceTeacher: {
          teacherId: 0,
          teacherName: '',
          classType: 0
        }, // 理论老师
        trainType: null, //培训类别
        areaAddress: {
          // 办学地址
          province: '520000000000',
          city: '',
          county: '',
          district: '',
          village: '',
          fullName: ''
          // lastLevel: ""
        },
        trainAddress: null
      },
      workTypeList: [], // 工作类型
      trainLevelList: [], // 培训等级
      trainTypeList: [],
      teacherListType: [], // 教师列表
      rules: {
        // 表单验证规则
        className: [
          { required: true, message: '请输入班级名称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '班级名称长度在 2 到 20 个字符',
            trigger: 'blur'
          },
          { validator: hasSpeChar, trigger: 'blur' }
        ],
        workType: [{ required: true, message: '请选择培训工种', trigger: 'change' }],
        trainType: [{ required: true, message: '请选择培训类别', trigger: 'change' }],
        trainLevel: [{ required: true, message: '请选择培训层次', trigger: 'blur' }],
        'areaAddress.fullName': [{ required: true, message: '请输入办学地点', trigger: 'change' }],
        trainDate: [{ required: true, message: '请选择培训时间', trigger: 'blur' }],
        classTime: [{ required: true, message: '请选择上课时间', trigger: 'blur' }],
        trainAddress: [{ required: true, message: '请输入培训地点', trigger: 'blur' }],
        studentCount: [{ required: true, message: '请输入培训人数', trigger: 'blur' }],
        theoryCount: [{ required: true, message: '请输入理论课时', trigger: 'blur' }],
        practiceCount: [{ required: true, message: '请输入实操课时', trigger: 'blur' }],
        'theoryTeacher.teacherName': [{ required: true, message: '请选择理论教师', trigger: 'change' }],
        'practiceTeacher.teacherName': [{ required: true, message: '请选择实操教师', trigger: 'change' }]
      }
    }
  },
  methods: {
    // 重新获取地址，防止自己拼接的地址和后台存储的不一致
    getAddrssByCode(code) {
      return this.axios
        .get(this.$api.area + code)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }
          return res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    save() {
      let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          let params = {
            // schoolId: userInfo.schoolId,
            // schoolName: userInfo.schoolName,
            className: this.searchForm.className,
            classBeginTime: this.searchForm.classTime[0],
            classOverTime: this.searchForm.classTime[1],
            studentCount: this.searchForm.studentCount,
            theoryCount: this.searchForm.theoryCount,
            practiceCount: this.searchForm.practiceCount,
            trainLevelTid: this.searchForm.trainLevel,
            trainDateStart: this.searchForm.trainDate[0],
            trainDateEnd: this.searchForm.trainDate[1],
            trainAddress: this.searchForm.trainAddress, // 培训地址码
            areacode: this.searchForm.areaAddress.lastLevel.areaCode, // 办学地址码
            theoryTeacher: this.searchForm.theoryTeacher,
            practiceTeacher: this.searchForm.practiceTeacher,
            timetableUrl: null,
            trainType: this.searchForm.trainType
          }

          if (this.searchForm.workType) {
            params.workTypeTid = this.searchForm.workType[1]
          }

          this.loading = true
          this.axios
            .post(this.$api.addNewClass, params)
            .then(res => {
              if (res.data.result !== 'ok') {
                this.$message.error(res.data.error.message)
                return Promise.reject(new Error(res.data.error.message))
              }
              this.$message({
                message: '添加班级成功',
                type: 'success'
              })
              this.$refs.searchForm.resetFields()
              this.$emit('submitOk')
              this.dialogVisible = false
              return res.data.data
            })
            .catch(err => {
              console.log(err)
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    open() {
      // 获取老师下拉列表
      this.getTeacherList(1).then(data => {
        console.log(data)
        this.teacherListType = data
      })

      // 获取枚举列表
      this.workTypeList = JSON.parse(sessionStorage.getItem('work_type') || '[]')
      this.trainLevelList = JSON.parse(sessionStorage.getItem('train_level') || '[]')
      this.trainTypeList = JSON.parse(sessionStorage.getItem('train_type') || '[]')
      this.options = this.workTypeList
    },
    // 获取教师下拉列表
    getTeacherList(tid) {
      return this.axios
        .post(this.$api.getTeacherListBySchoolId)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }

          return res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss">
/* dialog位于顶层，scoped局域是无法选中的， 所以最好定义dialog的类名 */
.dialog-two {
  .el-dialog__header {
    border-bottom: 1px solid #f7f7f7;
  }
  .el-dialog__body {
    padding-left: 40px;
    padding-right: 40px;
  }
  /deep/ .el-form-item {
    margin-bottom: 30px;
    display: flex;
    /* 使输入框自适应 */
    .el-form-item__content {
      flex: 1;
      /* 使下拉框自适应 */
      .el-select {
        width: 100%;
      }
      .el-input-number {
        width: 100%;
      }
      /* 使时间选择器自适应 */
      .el-date-editor {
        width: 100%;
      }
    }
  }
}

.el-row {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
