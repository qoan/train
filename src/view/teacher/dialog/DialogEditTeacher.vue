<template>
  <el-dialog
    @open="open"
    @close="reset()"
    :custom-class="customClass"
    :visible.sync="dialogVisible"
    :width="width"
    :title="title"
  >
    <el-form
      class="form"
      :rules="rules"
      :model="teacherInfo"
      ref="form"
      v-loading="openLoading"
      status-icon
      :size="size"
    >
      <!--- 基础信息 --->
      <p style="font-weight: 600; padding-bottom: 20px;">基础信息</p>
      <el-row :gutter="40">
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="教师姓名：" prop="name">
            <el-input v-model="teacherInfo.name" placeholder="请输入教师姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="身份证号：" prop="idCard">
            <el-input v-model="teacherInfo.idCard" maxlength="18" placeholder="请输入身份证号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="教师性别：" prop="sex">
            <el-select v-model="teacherInfo.sex" disabled placeholder="请选择教师性别">
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="教师年龄：" prop="age">
            <el-input v-model="teacherInfo.age" type="number" disabled placeholder="请输入教师年龄"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="联系电话：" prop="phone">
            <el-input
              v-model="teacherInfo.phone"
              maxlength="11"
              type="number"
              placeholder="请输入联系电话"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="文化程度：" prop="educationTid">
            <el-select v-model="teacherInfo.educationTid" placeholder="请选择文化程度">
              <el-option
                v-for="item in teacherEducateEnumList"
                :key="item.tid"
                :label="item.enumerValue"
                :value="item.tid"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!--- 个人照片 --->
      <p style="font-weight: 600; padding-bottom: 20px;">个人头像</p>
      <el-row>
        <el-col :span="24">
          <upload-single-file
            ref="uploadSingleFile"
            v-model="teacherInfo.headImage"
            v-bind="upLoadConfig"
          ></upload-single-file>
        </el-col>
      </el-row>

      <!--- 教师资质 --->
      <p style="font-weight: 600; padding-bottom: 20px;">教师资质</p>
      <el-row>
        <el-col :span="24">
          <UploadMultiFileListBak
            ref="uploadMultiFileList"
            v-bind="upLoadConfig"
            v-model="teacherInfo.teacherQuelify"
          ></UploadMultiFileListBak>
        </el-col>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="reset()">重 置</el-button>
      <el-button type="primary" :loading="loading" @click="submit">{{loading ? '执行中...' : '提 交'}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import RegexUtils from '@/utils/regexUtils'
import AutoCptUtil from '@/utils/autoCptUtil'
import UploadSingleFile from '@/components/select/UploadSingleFileBak'
import UploadMultiFileListBak from '@/components/select/UploadMultiFileListBak'
export default {
  components: {
    UploadSingleFile,
    UploadMultiFileListBak
  },
  props: {},
  data() {
    return {
      tid: 0,
      openLoading: false,
      loading: false,
      dialogVisible: false,
      customClass: 'dialog-add-teacher',
      title: '编辑教师',
      width: '44%',
      size: 'mini',
      teacherTid: null,
      teacherInfo: {
        sex: null,
        age: null,
        name: null,
        phone: null,
        idCard: null,
        educationTid: null,
        teacherQuelify: [], // 教师资质
        headImage: []
      },
      teacherEducateEnumList: [],
      // 图片上传配置
      upLoadConfig: {
        action: this.$api.uploadImage + '?folder=teacher',
        limit: 9,
        sizeLimit: 1024 * 1024 * 1,
        width: 110,
        height: 110
      },
      // 头像上传相关回调
      headUpload: {
        bigPicVisible: false,
        isShowScanIcon: false,
        uploadUrl: this.$api.uploadImage + '?folder=teacherHead'
      },
      rules: {
        name: [
          { required: true, message: '请输入教师姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '姓名长度在 2 到 10 个字符', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (RegexUtils.isCZName(value)) {
                callback()
              } else {
                callback(new Error('姓名必须为2 到 10 个中文字符'))
              }
            },
            trigger: 'blur'
          }
        ],
        sex: [{ required: true, message: '请选择教师性别', trigger: 'change' }],
        idCard: [
          { required: true, message: '请输入教师身份证号', trigger: 'blur' },
          { min: 18, max: 18, message: '身份证号为18位字符', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (RegexUtils.isIdCard(value)) {
                this.teacherInfo.sex = AutoCptUtil.getSexByIdCard(value)
                this.teacherInfo.age = AutoCptUtil.getAgeByIdCard(value)
                callback()
              } else {
                callback(new Error('请输入正确身份证号码'))
              }
            },
            trigger: 'blur'
          }
        ],
        age: [
          { required: true, message: '请输入教师年龄', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (RegexUtils.isAgeRange(value)) {
                callback()
              } else {
                callback(new Error('年龄取值范围在0 ~ 120 岁'))
              }
            },
            trigger: 'blur'
          }
        ],
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { min: 11, max: 11, message: '电话号码长度为11个字符', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (RegexUtils.isPhone(value)) {
                callback()
              } else {
                callback(new Error('请输入正确的电话号码'))
              }
            },
            trigger: 'blur'
          }
        ],
        educationTid: [{ required: true, message: '请选择教师文化程度', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.teacherEducateEnumList = JSON.parse(sessionStorage.getItem('teacher_education') || '[]')
  },
  methods: {
    // 钩子 - dialog打开时
    open() {
      this.openLoading = true
      return this.axios
        .post(this.$api.getTeacherInfoById + this.teacherTid)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }

          this.teacherInfo = res.data.data
          this.teacherInfo.teacherQuelify = JSON.parse(this.teacherInfo.otherFileUrl)
          this.teacherInfo.headImage = this.teacherInfo.photoUrl.length > 0 ? [{ url: this.teacherInfo.photoUrl }] : []
          return res.data.data
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.openLoading = false
        })
    },

    // 事件 - 重置
    reset() {
      this.$refs.form.resetFields()
      this.$refs.uploadMultiFileList.clearFiles()
      this.$refs.uploadSingleFile.clearFiles()
    },

    // 请求 - 提交教师添加信息
    submit() {
      this.$refs['form'].validate(valid => {
        if (!valid) return

        this.loading = true
        let params = {
          name: this.teacherInfo.name,
          sex: parseInt(this.teacherInfo.sex),
          idCard: this.teacherInfo.idCard,
          age: parseInt(this.teacherInfo.age),
          phone: this.teacherInfo.phone,
          educationTid: this.teacherInfo.educationTid,
          tid: this.teacherInfo.tid,
          otherFileUrl: JSON.stringify(
            this.teacherInfo.teacherQuelify.map(item => {
              return {
                name: item.name,
                url: item.url
              }
            })
          ), // 其它证明
          photoUrl: this.teacherInfo.headImage.length > 0 ? this.teacherInfo.headImage[0].url : '' // 头像
        }

        return this.axios
          .post(this.$api.editTeacher, params)
          .then(res => {
            if (res.data.result !== 'ok') {
              this.$message.error(res.data.error.message)
              return Promise.reject(new Error(res.data.error.message))
            }
            this.$message({
              message: '添加成功!',
              type: 'success'
            })
            this.$emit('addOk')
            this.dialogVisible = false
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
.dialog-add-teacher {
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
      flex: 1;
      /* 使下拉框自适应 */
      .el-select {
        width: 100%;
      }
      /* 使时间选择器自适应 */
      .el-date-editor {
        width: 100%;
      }
    }
  }

  .el-upload {
    width: 110px;
    height: 110px;
  }
  /* 教师资质 */
  .el-upload-list {
    .el-upload-list__item {
      width: 110px;
      height: 110px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  /* 个人照片 */
  .avatar-uploader {
    .el-upload {
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 100%;
        height: 100%;
      }
      &:hover {
        .scan-big-pic {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #000;
          opacity: 0.6;
          z-index: 999;
        }
      }
      .scan-big-pic {
        display: none;
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
}

.el-row {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
