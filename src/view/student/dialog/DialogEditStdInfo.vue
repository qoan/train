<template>
  <el-dialog
    @open="open"
    @close="close"
    :custom-class="customClass"
    :visible.sync="dialogVisible"
    :width="width"
    :title="title">

    <el-form class="serachForm" ref="serachForm" v-loading="loading" :model="formData" :rules="rules" :size="size" status-icon label-width="100px">
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
            <el-input placeholder="请输入学员身份证号" maxlength="18"  v-model="formData.idCard"></el-input>
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
                :value="value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="学员年龄："  prop="age">
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
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="出生年月：" prop="birthday">
            <el-date-picker
              v-model="formData.birthday"
              type="date"
              disabled
              placeholder="请选择出生年月">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="文化程度：" prop="education">
            <el-select  v-model="formData.education"  placeholder="请选择学员文化程度">
              <el-option
                v-for="item in educationEnumList"
                :key="item.tid"
                :label="item.enumerValue"
                :value="item.tid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24" >
          <el-form-item label="联系电话：" prop="phone">
            <el-input placeholder="请输入学员联系电话" maxlength="11" v-model="formData.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="家庭住址：" prop="areaAddress.fullName">
            <el-input placeholder="请选择家庭住址"  v-model="formData.areaAddress.fullName" @focus="$refs.formData.visible=true"></el-input>
            <tab-area-select ref="formData" :areaData="formData.areaAddress"></tab-area-select>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24" >
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
            <el-select v-model="formData.personnelType"  placeholder="请选择人员类型">
              <el-option
                v-for="item in personTypeEnumList"
                :key="item.tid"
                :label="item.enumerValue"
                :value="item.tid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="人员类别：" prop="personnelCategory">
            <el-select v-model="formData.personnelCategory"  placeholder="请选择人员类别">
              <el-option
                v-for="item in personCateGoryEnumList"
                :key="item.tid"
                :label="item.enumerValue"
                :value="item.tid">
              </el-option>
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
      <p style="font-weight: 600; padding: 10px 0">学员资料 <span style="color: red;font-size: 10px;opacity: .5">(注：图片大小不能大于1M)</span></p>
      <el-row>
        <el-col :san="24">
          <div style="display: flex; flex-flow: row wrap;">
            <upload-single-file
              style="margin-right: 20px; margin-bottom: 20px;"
              v-model="formData.personFileList.headPhoto"
              v-bind="{ action: action, width: 110, height: 110, formData: formData.personFileList.headPhoto}"
              @changePicture="changePicture"
            >
            </upload-single-file>
            <upload-single-file
              style="margin-right: 20px; margin-bottom: 20px;"
              v-for="(item, index) in formData.personFileList.idCard"
              :key="item.id"
              v-model="formData.personFileList.idCard[index]"
              v-bind="{ action: action, width: 110, height: 110, formData: formData.personFileList.idCard[index]}"
              @changePicture="changePicture"
            >
            </upload-single-file>
            <upload-single-file
              style="margin-right: 20px; margin-bottom: 20px;"
              v-for="(item, index) in formData.personFileList.accountBook"
              :key="item.id"
              v-model="formData.personFileList.accountBook[index]"
              v-bind="{ action: action, width: 110, height: 110, formData: formData.personFileList.accountBook[index]}"
              @changePicture="changePicture"
            >
            </upload-single-file>
          </div>
          <p style="font-weight: 600; padding: 10px 0" >其他资料 <span style="color: red;font-size: 10px;opacity: .5">(注：图片大小不能大于1M)</span></p>
          <upload-multi-file-list-bak
            v-model="formData.personFileList.otherFile"
            v-bind="{ action: `${this.$api.uploadImage}?folder=student`, width: 110, height: 110, fileList: formData.personFileList.otherFile}"
            @changePicture="changePicture"
            >
          </upload-multi-file-list-bak>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="$refs.serachForm.resetFields();">重 置</el-button> --->
      <el-button type="primary" :loading="submitLoading" @click="editClassStudent();$emit('submitOk')">{{submitLoading ? '执行中...' : '修 改'}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { PROVICE, NATION } from '@/data/nationEnum'
import RegexUtil from '@/utils/regexUtils'
import AutoCptUtil from '@/utils/autoCptUtil'
import UploadSingleFile from '@/components/select/UploadSingleFile'
import UploadMultiFileListBak from '@/components/select/UploadMultiFileListBak'
import TabAreaSelect from '@/components/select/TabAreaSelect'
import instance from '../../../config/axios.config'
export default {
  components: {
    UploadSingleFile,
    UploadMultiFileListBak,
    TabAreaSelect
  },
  data () {
    return {
      loading: false,
      submitLoading: false,
      dialogVisible: false,
      customClass: 'dialog-stu-info',
      title: '编辑学员',
      width: '45%',
      size: 'mini',
      action: null,
      tid: null,
      formData: { // 表单数据
        birthday: null,
        classId: null,
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
        area: null, // 暂时添加
        areaAddress: { // 家庭地址
          province: '',
          city: '',
          county: '',
          fullName: ''
        },
        detailAddress: '', // 详细地址,
        personFileList: {
          headPhoto: {
            id: 'headPhoto',
            title: '个人证件照',
            url: ''
          },
          idCard: [
            {
              id: 'frontIdCard',
              title: '身份证正面',
              url: ''
            },
            {
              id: 'backIdCard',
              title: '身份证反面',
              url: ''
            }
          ],
          accountBook: [
            {
              id: 'frontAccountBook',
              title: '户口簿正面',
              url: ''
            },
            {
              id: 'backAccountBook',
              title: '户口簿反面',
              url: ''
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
          { min: 2, max: 10, message: '姓名长度在 2 到 10 个字符', trigger: 'blur' },
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
        nation: [
          { required: true, message: '请选择学员民族', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入学员联系电话', trigger: 'blur' },
          { min: 11, max: 11, message: '电话号码长度为11个字符', trigger: 'blur' },
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
        education: [
          { required: true, message: '请选择学员文化程度', trigger: 'blur' }
        ],
        personnelType: [
          { required: true, message: '请选择人员类型', trigger: 'change' }
        ],
        personnelCategory: [
          { required: true, message: '请选择人员类别', trigger: 'change' }
        ],
        classId: [
          { required: true, message: '请选择所在班级', trigger: 'change' }
        ]
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
  mounted () {
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
      handler (val, oldval) {
        this.formData.detailAddress = val.replace(/\//g, '')
      }
    },
    'formData.areaAddress.county': {
      handler (val, oldval) {
        this.formData.area = val.areaCode
      }
    }
  },
  methods: {
    // 回调事件
    changePicture(url) {
      console.log(url)
      for (let item in this.formData.personFileList) {
        let arr = this.formData.personFileList[item]
        if (arr instanceof Array) {
          arr.forEach(obj => {
            if (obj.url === url) {
              obj.url = ''
              return false
            }
          })
        } else {
          if (arr.url === url) {
            arr.url = ''
            return
          }
        }
      }
    },
    // 事件 - dialog打开，初始换参数
    open () {
      this.getStudentInfo().then(data => {
        console.log(data)
        this.formData.birthday = data.birthday
        this.formData.education = data.educationTid
        this.formData.idCard = data.idCard
        this.formData.name = data.name
        this.formData.nation = data.nation
        this.formData.nativePlace = data.nativePlace
        this.formData.personnelCategory = data.personnelCategoryTid
        this.formData.personnelType = data.personnelTypeTid
        this.formData.phone = data.phone
        this.formData.sex = data.sex
        this.formData.age = data.age
        this.formData.detailAddress = data.address
        this.formData.area = data.areacode
        this.formData.areaAddress.fullName = data.areacodeValue
        this.formData.tid = data.tid
        this.formData.personFileList.headPhoto.url = data.photoUrl
        JSON.parse(data.idCardUrl).forEach((item, index) => {
          if (typeof item === 'string') {
            this.formData.personFileList.idCard[index].url = item
          } else if (item.url) {
            this.formData.personFileList.idCard[index].url = item.url
          } else {
            this.formData.personFileList.idCard[index].url = ''
          }
        })
        JSON.parse(data.registerUrl).forEach((item, index) => {
          if (typeof item === 'string') {
            this.formData.personFileList.accountBook[index].url = item
          } else if (item.url) {
            this.formData.personFileList.accountBook[index].url = item.url
          } else {
            this.formData.personFileList.accountBook[index].url = ''
          }
        })
        this.formData.personFileList.otherFile = []
        JSON.parse(data.otherFileUrl).forEach((item, index) => {
          if (item.url) {
            this.formData.personFileList.otherFile.push(item)
          }
        })
      })
    },
    close () {
      this.$refs.serachForm.resetFields()
    },
    // 组装 - 组装上传的图像信息，便于后期取出
    buildUploadImg (arr) {
      return arr.filter(item => {
        return item.response
      }).map(item => {
        return item.response.message
      })
    },
    // 网络 - 获取当前学员信息
    getStudentInfo () {
      this.loading = true
      return this
        .axios
        .post(this.$api.getStudentInfo + this.tid)
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
        .finally(() => {
          this.loading = false
        })
    },
    // 网络 - 编辑学员
    editClassStudent () {
      this.$refs['serachForm'].validate((valid) => {
        if (!valid) return

        this.submitLoading = true
        let arr = []
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
          sex: parseInt(this.formData.sex),
          age: this.formData.age,
          birthday: this.formData.birthday,
          address: this.formData.detailAddress,
          areacode: this.formData.area,
          tid: this.formData.tid,
          photoUrl: this.formData.personFileList.headPhoto.url, // 头像
          idCardUrl: JSON.stringify(this.formData.personFileList.idCard), // 身份证
          registerUrl: JSON.stringify(this.formData.personFileList.accountBook)  // 户口簿
        }

        // 其它凭证
        this.formData.personFileList.otherFile.forEach(item => {
          console.log(item)
          console.log(item.url)
          let obj = {}
          obj.url = item.url
          arr.push(obj)
        })

        params.otherFileUrl = JSON.stringify(arr)

        this
          .axios
          .post(this.$api.editClassStudent, params)
          .then(res => {
            if (res.data.result !== 'ok') {
              this.$message.error(res.data.error.message)
              return Promise.reject(new Error(res.data.error.message))
            }

            this.$message({
              message: '修改学员信息成功!',
              type: 'success'
            })

            this.dialogVisible = false
            this.$emit('submitOk')

            return res.data.data
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            this.submitLoading = false
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
      border-bottom: 1px solid #F7F7F7;
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
  input[type="number"]{
    -moz-appearance: textfield;
  }

  /* 处理表单校验成功后缀图标颜色 */
  .el-input__suffix .el-icon-circle-check{
    color: #67C23A;
  }

  .el-row {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
</style>
