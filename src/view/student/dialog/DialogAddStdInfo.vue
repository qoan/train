<template>
  <el-dialog
    @open="open"
    @close="close"
    :custom-class="customClass"
    :visible.sync="dialogVisible"
    :width="width"
    :title="title"
  >
    <el-form
      class="serachForm"
      ref="serachForm"
      :model="formData"
      :rules="rules"
      :size="size"
      status-icon
      label-width="100px"
    >
      <p style="font-weight: 600; padding: 10px 0">基础信息</p>
      <!--- 第一栏 -->
      <el-row :gutter="60">
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="学员名称：" prop="name">
            <el-input placeholder="请输入学员名称" maxlength="10" v-model="formData.name"></el-input>
          </el-form-item>
        </el-col>
        <!--两个时间栏放在相邻出现居右现象，可能与el-row浮动有关 -->
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="身份证号：" prop="idCard">
            <el-input placeholder="请输入学员身份证号" maxlength="18" v-model="formData.idCard"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="学员性别：" prop="sex">
            <el-select v-model="formData.sex" disabled placeholder="请选择学员性别">
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="学员籍贯：" prop="nativePlace">
            <el-select placeholder="请输入学员籍贯" disabled v-model="formData.nativePlace">
              <el-option
                v-for="(key, value, index) in nationProvinceEnumList"
                :key="index"
                :label="value"
                :value="value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="学员年龄：" prop="age">
            <el-input placeholder="请输入学员学员年龄" disabled v-model="formData.age"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="学员民族：" prop="nation">
            <el-select placeholder="请输入学员民族" v-model="formData.nation">
              <el-option
                v-for="(item, index) in nationEnumList"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="出生年月：" prop="birthday">
            <el-date-picker v-model="formData.birthday" type="date" disabled placeholder="请选择出生年月"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="文化程度：" prop="education">
            <el-select v-model="formData.education" placeholder="请选择学员文化程度">
              <el-option
                v-for="item in educationEnumList"
                :key="item.tid"
                :label="item.enumerValue"
                :value="item.tid"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="联系电话：" prop="phone">
            <el-input placeholder="请输入学员联系电话" maxlength="11" v-model="formData.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="家庭住址：" prop="areaAddress.fullName">
            <el-input
              placeholder="请选择家庭住址"
              v-model="formData.areaAddress.fullName"
              @focus="$refs.formData.visible=true"
            ></el-input>
            <tab-area-select ref="formData" :areaData="formData.areaAddress"></tab-area-select>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="详细地址：" prop="detailAddress">
            <el-input placeholder="请输入详细地址" v-model="formData.detailAddress"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!--- 第二栏 -->
      <p style="font-weight: 600; padding: 10px 0">培训信息</p>
      <el-row :gutter="40">
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="人员类型：" prop="personnelType">
            <el-select v-model="formData.personnelType" placeholder="请选择人员类型">
              <el-option
                v-for="item in personTypeEnumList"
                :key="item.tid"
                :label="item.enumerValue"
                :value="item.tid"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="人员类别：" prop="personnelCategory">
            <el-select v-model="formData.personnelCategory" placeholder="请选择人员类别">
              <el-option
                v-for="item in personCateGoryEnumList"
                :key="item.tid"
                :label="item.enumerValue"
                :value="item.tid"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!--- 这个功能暂时屏蔽
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="所在班级：" prop="classId">
            <el-select v-model="formData.classId"  placeholder="请选择所在班级">
              <el-option
                v-for="item in classList"
                :key="item.tid"
                :label="item.className"
                :value="item.tid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        --->
      </el-row>

      <!--- 第三栏 -->
      <p style="font-weight: 600; padding: 10px 0">学员资料</p>
      <el-row>
        <el-col :san="24">
          <!--个人信息相关文件上传-->
          <div style="display: flex; flex-flow: row wrap;">
            <!-- 头像 --->
            <upload-single-file
              style="margin-right: 20px; margin-bottom: 20px;"
              v-model="formData.personFileList.headPhoto"
              v-bind="{ action: action, width: 110, height: 110}"
            ></upload-single-file>
            <!-- 身份证 --->
            <upload-single-file
              style="margin-right: 20px; margin-bottom: 20px;"
              v-for="(item, index) in formData.personFileList.idCard"
              :key="item.id"
              v-model="formData.personFileList.idCard[index]"
              v-bind="{ action: action, width: 110, height: 110}"
            ></upload-single-file>
            <!-- 户口簿 --->
            <upload-single-file
              ref="multiUpload"
              style="margin-right: 20px; margin-bottom: 20px;"
              v-for="(item, index) in formData.personFileList.accountBook"
              :key="item.id"
              v-model="formData.personFileList.accountBook[index]"
              v-bind="{ action: action, width: 110, height: 110}"
            ></upload-single-file>
          </div>

          <!--可选择上传--->
          <p style="font-weight: 600;padding-bottom: 10px">其他资料</p>
          <upload-multi-fileList
            ref="upload"
            v-model="formData.personFileList.otherFile"
            v-bind="{ action: `${this.$api.uploadImage}?folder=student`, width: 110, height: 110}"
          ></upload-multi-fileList>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$refs.serachForm.resetFields();$refs.upload.clearFiles();">重 置</el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="addStdToClass();"
      >{{loading ? '执行中...' : '提 交'}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { PROVICE, NATION } from '@/data/nationEnum'
import RegexUtil from '@/utils/regexUtils'
import AutoCptUtil from '@/utils/autoCptUtil'
import UploadSingleFile from '@/components/select/UploadSingleFile'
import UploadMultiFileList from '@/components/select/UploadMultiFileList'
import TabAreaSelect from '@/components/select/TabAreaSelect'

import StudentEntity from '../../../model/entity/studentEntity'
export default {
  components: {
    UploadSingleFile,
    UploadMultiFileList,
    TabAreaSelect
  },
  inject: ['reload'],
  data() {
    return {
      loading: false,
      dialogVisible: false,
      customClass: 'dialog-stu-info',
      title: '新增学员',
      width: '45%',
      size: 'mini',
      studentInfo: {},
      action: null,
      originData: {}, // 源数据
      formData: {
        // 表单数据
        birthday: null,
        classId: null,
        schoolId: 1,
        education: null,
        idCard: null,
        name: null,
        nation: null,
        nativePlace: null,
        personnelCategory: null,
        personnelType: null,
        phone: null,
        sex: null,
        age: null,
        areaAddress: {
          // 家庭地址
          province: '',
          city: '',
          county: '',
          fullName: ''
        },
        detailAddress: '', // 详细地址,
        personFileList: {
          headPhoto: {
            id: 'headPhoto',
            title: '个人头像'
          },
          idCard: [
            {
              id: 'frontIdCard',
              title: '身份证正面'
            },
            {
              id: 'backIdCard',
              title: '身份证反面'
            }
          ],
          accountBook: [
            {
              id: 'frontAccountBook',
              title: '户口簿户主页'
            },
            {
              id: 'backAccountBook',
              title: '户口簿内面'
            }
          ],
          otherFile: []
        }
      },
      educationEnumList: [], // 教育程度枚举
      nationProvinceEnumList: [], // 籍贯枚举
      nationEnumList: [], // 民族枚举
      personTypeEnumList: [], // 人员类型
      personCateGoryEnumList: [], // 人员类别
      classList: [], // 当前学校的班级列表
      rules: {
        name: [
          { required: true, message: '请输入学员姓名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '姓名长度在 2 到 10 个字符',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (RegexUtil.isCZName(value)) {
                callback()
              } else {
                callback(new Error('姓名必须为2 到 10 个中文字符'))
              }
            },
            trigger: 'blur'
          }
        ],
        idCard: [
          { required: true, message: '请输入学员身份证号', trigger: 'blur' },
          { min: 18, max: 18, message: '身份证号为18位字符', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (RegexUtil.isIdCard(value)) {
                // 回显相关信息
                // 性别
                this.formData.sex = AutoCptUtil.getSexByIdCard(value)
                console.log(this.formData.sex)
                // 年龄
                this.formData.age = AutoCptUtil.getAgeByIdCard(value)
                // 出身年月
                this.formData.birthday = AutoCptUtil.getBirthByIdCard(value)
                // 籍贯
                this.formData.nativePlace = AutoCptUtil.getAareByIdCard(value)
                callback()
              } else {
                callback(new Error('请输入正确的身份证号!'))
              }
            },
            trigger: 'blur'
          }
        ],
        nation: [{ required: true, message: '请选择学员民族', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入学员联系电话', trigger: 'blur' },
          {
            min: 11,
            max: 11,
            message: '电话号码长度为11个字符',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (RegexUtil.isPhone(value)) {
                callback()
              } else {
                callback(new Error('请输入正确的电话号码'))
              }
            },
            trigger: 'blur'
          }
        ],
        education: [{ required: true, message: '请选择学员文化程度', trigger: 'blur' }],
        personnelType: [{ required: true, message: '请选择人员类型', trigger: 'change' }],
        personnelCategory: [{ required: true, message: '请选择人员类别', trigger: 'change' }],
        classId: [{ required: true, message: '请选择所在班级', trigger: 'change' }]
        /*
        'areaAddress.fullName': [
          { required: true, message: '请选择家庭地址', trigger: 'change' }
        ],
        detailAddress: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { min: 2, max: 20, message: '请输入详细地址', trigger: 'blur' }
        ]
        */
      }
    }
  },
  props: ['fileData', 'fileThumPreview'],
  mounted() {
    this.educationEnumList = JSON.parse(sessionStorage.getItem('student_education') || '[]')
    this.personTypeEnumList = JSON.parse(sessionStorage.getItem('personnel_type') || '[]')
    this.personCateGoryEnumList = JSON.parse(sessionStorage.getItem('personnel_category') || '[]')
    this.nationProvinceEnumList = PROVICE
    this.nationEnumList = NATION
    this.action = `${this.$api.uploadImage}?folder=student`
  },
  watch: {
    // 详细地址跟随区域地址变化
    'formData.areaAddress.fullName': {
      handler(val, oldval) {
        this.formData.detailAddress = val.replace(/\//g, '')
      }
    }
  },
  methods: {
    // 事件 - dialog打开，初始换参数
    open() {
      this.getSchoolsAllClass()
    },
    clearImg(obj, file) {
      this.fileThumPreview = obj
      this.fileData = file
    },
    close() {
      this.$refs.serachForm.resetFields()
    },
    // 组装 - 组装上传的图像信息，便于后期取出
    buildUploadImg(arr) {
      return arr
        .filter(item => {
          return item.response
        })
        .map(item => {
          return item.response.message
        })
    },
    // 网络 - 获取学校中所有班级
    getSchoolsAllClass() {
      this.axios
        .post(this.$api.getSchoolsAllClass)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }
          this.classList = res.data.data
          return res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 网络 - 新增学员
    addStdToClass() {
      this.$refs['serachForm'].validate(valid => {
        if (!valid) return

        this.loading = true
        let params = {
          // classId: this.formData.classId,
          educationTid: this.formData.education,
          idCard: this.formData.idCard,
          name: this.formData.name,
          nation: this.formData.nation,
          nativePlace: this.formData.nativePlace,
          personnelCategoryTid: this.formData.personnelCategory,
          personnelTypeTid: this.formData.personnelType,
          phone: this.formData.phone,
          sex: this.formData.sex,
          age: this.formData.age,
          birthday: this.formData.birthday,
          address: this.formData.detailAddress,
          areacode: this.formData.areaAddress.county.areaCode,
          photoUrl: this.formData.personFileList.headPhoto.response && this.formData.personFileList.headPhoto.response.message, // 头像
          idCardUrl: JSON.stringify(this.buildUploadImg(this.formData.personFileList.idCard)), // 身份证
          registerUrl: JSON.stringify(this.buildUploadImg(this.formData.personFileList.accountBook)), // 户口簿
          otherFileUrl: JSON.stringify(this.buildUploadImg(this.formData.personFileList.otherFile)) // 其它凭证
        }

        this.axios
          .post(this.$api.addNewStdtoClass, params)
          .then(res => {
            if (res.data.result !== 'ok') {
              this.$message.error(res.data.error.message)
              return Promise.reject(new Error(res.data.error.message))
            }

            this.$message({
              message: '添加学员成功!',
              type: 'success'
            })
            this.reload()
            this.dialogVisible = false
            this.$emit('submitOk')

            return res.data.data
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            this.loading = false
          })
      })
    }
  }
}
</script>

<style lang="scss">
/* dialog位于顶层，scoped局域是无法选中的， 所以最好定义dialog的类名 */
.dialog-stu-info {
  .el-dialog__header {
    border-bottom: 1px solid #f7f7f7;
  }
  .el-dialog__body {
    padding-left: 40px;
    padding-right: 40px;
  }
  .el-form-item {
    display: flex;
    /* 使输入框自适应 */
    .el-form-item__content {
      margin-left: 0 !important;
      flex: 1;
      /* 使下拉框自适应 */
      /deep/ .el-select {
        width: 100%;
      }
      /* 使时间选择器自适应 */
      .el-date-editor {
        width: 100%;
      }
    }
  }
}

/* 处理input type = number的上下箭头 */
input {
  appearance: none;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type='number'] {
  -moz-appearance: textfield;
}

/* 处理表单校验成功后缀图标颜色 */
.el-input__suffix .el-icon-circle-check {
  color: #67c23a;
}

.el-row {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
