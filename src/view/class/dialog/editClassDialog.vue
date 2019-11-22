<template>
  <el-dialog
    :custom-class="customClass"
    :visible.sync="dialogVisible"
    :width="width"
    @open="open"
    :title="title"
    v-loading="loading"
    @close="close"
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
                v-for="item in enumList.work_type"
                :key="item.tid"
                :label="item.enumerValue"
                :value="item.tid"
              ></el-option>
            </el-select>-->
            <el-cascader
              style="width:100%"
              v-model="searchForm.workTypeTid"
              :options="options"
              :props="props"
              @change="change"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="培训层次" prop="trainLevel">
            <el-select v-model="searchForm.trainLevelTid" placeholder="请选择培训层次">
              <el-option
                v-for="item in enumList.train_level"
                :key="item.tid"
                :label="item.enumerValue"
                :value="item.tid"
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
                v-for="item in enumType.train_type"
                :key="item.tid"
                :label="item.train_type"
                :value="item.enumerValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="办学地点" prop="areaAddress.fullName">
            <el-input
              placeholder="请选择地址"
              v-model="searchForm.areaAddress.fullName"
              @focus="$refs.areaAddress.visible=true"
            ></el-input>
            <tab-area-select ref="areaAddress" :areaData="searchForm.areaAddress"></tab-area-select>
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
          <el-form-item label="理论老师" prop="theoryTeacher">
            <el-select
              value-key="teacherId"
              v-model="searchForm.theoryTeacher"
              placeholder="请选择理论老师"
            >
              <el-option
                v-for="item in teacherList"
                :key="item.teacherId"
                :label="item.teacherName"
                :value="item"
              ></el-option>
            </el-select>
            <!--<el-select
              :multiple-limit="1"
              autofocus="false"
              v-model="searchForm.theoryTeacher.teacherId"
              value-key="searchForm.theoryTeacher.teacherName"
              placeholder="请选择理论老师"
              @change="changeone"
            >
              <el-option
                v-for="item in teacherList"
                :key="item.teacherId"
                :label="item.teacherName"
                :value="item.teacherId"
              ></el-option>
            </el-select>-->
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="实操老师" prop="practiceTeacher">
            <el-select
              value-key="teacherId"
              v-model="searchForm.practiceTeacher"
              placeholder="请选择实操老师"
            >
              <el-option
                v-for="item in teacherList"
                :key="item.teacherId"
                :label="item.teacherName"
                :value="item"
              ></el-option>
            </el-select>
            <!--<el-select
              :multiple-limit="1"
              v-model="searchForm.practiceTeacher.teacherId"
              placeholder="请选择实操老师"
              @change="changetwo"
            >
              <el-option
                v-for="item1 in teacherList"
                :key="item1.teacherId"
                :label="item1.teacherName"
                :value="item1.teacherId"
              ></el-option>
            </el-select>-->
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
      <el-button type="primary" @click="save">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import ClassModel from '@/model/class'
import SchoolModel from '@/model/school'
import ClassEntity from '@/model/entity/classEntity'
import TabAreaSelect from '@/components/select/TabAreaSelect'
import enumUtil from '@/utils/enumUtil.js'
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
      title: '编辑班级信息',
      width: '40%',
      size: 'mini',
      enumList: {}, // 枚举列表
      originData: {}, // 外部传入的数据
      searchForm: new ClassEntity(), // 班级信息
      teacherList: [], // 学校空闲教师列表
      teacherListA: [], // 学校空闲教师列表
      enum: {},
      enumType: {},
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
        trainAddress: [{ required: true, message: '请输入培训地点', trigger: 'change' }],
        studentCount: [{ required: true, message: '请输入培训人数', trigger: 'blur' }],
        theoryCount: [{ required: true, message: '请输入理论课时', trigger: 'blur' }],
        practiceCount: [{ required: true, message: '请输入实操课时', trigger: 'blur' }],
        theoryTeacher: [{ required: true, message: '请选择理论教师', trigger: 'blur' }],
        practiceTeacher: [{ required: true, message: '请选择实操教师', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.enumList = enumUtil.getEnumList(['train_level', 'work_type'])
  },
  methods: {
    change(value) {
      this.searchForm.workTypeTid = value[1]
    },
    // 请求 - 修改班级信息
    save() {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          // 处理参数
          let params = this.searchForm
          params.trainAddress = this.searchForm.trainAddress
          params.areacode = this.searchForm.areaAddress.lastLevel.areaCode
          params.trainDateStart = this.searchForm.trainDate[0]
          params.trainDateEnd = this.searchForm.trainDate[1]
          params.classBeginTime = this.searchForm.classTime[0]
          params.classOverTime = this.searchForm.classTime[1]
          params.teacherList = []
          console.log(params)
          ClassModel.editClassInfo(params).then(data => {
            this.$message({
              message: '修改班级信息成功',
              type: 'success'
            })
            this.$emit('submitOk')
            this.dialogVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 钩子 - dialog被打开时
    close() {
      // window.location.reload()
    },
    open() {
      this.loading = true
      this.searchForm = Object.assign({}, this.originData)
      // 获取老师下拉列表
      this.getTeacherList(this.searchForm.tid).then(data => {
        this.teacherList = data
      })
      this.enum = enumUtil.getEnumList(['work_type'])
      this.enumType = enumUtil.getEnumList(['train_type'])
      this.options = enumUtil.getEnumList(['work_type']).work_type
      ;(this.searchForm.areaAddress = {
        // 地址回显单独处理，现在地址组件回显还有问题
        province: '',
        city: '',
        county: '',
        district: '',
        village: '',
        fullName: this.searchForm.classAddress,
        lastLevel: {
          areaCode: this.searchForm.classAreacode
        }
      }),
        (this.loading = false)
    },
    //  获取教师下拉列表
    getTeacherList(tid) {
      return this.axios
        .post(this.$api.getTeacherListBySchoolId + '?classId=' + tid)
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
