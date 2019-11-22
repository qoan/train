<template>
  <div class="warp">
    <h2>巡检记录</h2>
    <!--<el-button type="primary" style="position: absolute;right: 300px;top: 80px;">导出本条记录</el-button>-->
    <hr />
    <h3 style="margin-bottom: 20px;">基础信息</h3>
    <p>
      <span>检查班级：{{baseInfoObj.clazzName}}</span>
      <span>所在学校：{{baseInfoObj.schoolName}}</span>
      <span>培训工种：{{baseInfoObj.professional}}</span>
    </p>
    <p>
      <span>培训层次：{{baseInfoObj.trainingLevel}}</span>
      <span>培训时间：{{baseInfoObj.trainingBeginTime}} - {{baseInfoObj.trainingEndTime}}</span>
      <span>培训人数：{{baseInfoObj.trainingNumber}}</span>
    </p>
    <p>
      <span>培训地点：</span>
    </p>
    <el-row>
      <el-col :span="24" style="text-align: left;margin-top: 45px">
        <el-button type="primary" @click="showDialog = true">新增记录</el-button>
      </el-col>
    </el-row>
    <el-row>
      <div class="itemBox" v-for="(item, index) in lgosListArr" :key="index">
        <p class="tit">
          <span v-if="index === 0">第一次记录</span>
          <span v-if="index === 1">第二次记录</span>
          <span v-if="index === 2">第三次记录</span>
          <el-button type="primary" style="margin-left: 20px" @click="editLogsDialog(index)">编 辑</el-button>
          <el-button type="primary" @click="deleteLogs(item.tid)">删 除</el-button>
        </p>
        <p>
          <span>授课教师认证：{{item.teacherCertification | formatBoolean}}</span>
          <span>教学设备匹配：{{item.equipmentMatching | formatBoolean}}</span>
          <span>培训人数：{{item.trainingNumber}}</span>
          <span>检查人员：{{item.inspectionPerson}}</span>
        </p>
        <p>
          <span>教学计划执行情况：{{item.executionPlan}}</span>
          <span>听课情况：{{item.classSituation}}</span>
          <span>检查时间：{{item.executionPlan}}</span>
          <span></span>
        </p>
        <div class="imgBox">
          <div>现场照片：</div>
          <div class="pic" v-for="(obj, i) in JSON.parse(item.imagesPath)" :key="i">
            <!--<img :src="obj.url" alt="" width="100%" height="100%">-->
            <Photo :imgUrl="obj.url" width="100%" height="100%"></Photo>
          </div>
        </div>
      </div>
    </el-row>

    <el-row>
      <el-col :span="24" style="text-align: center;margin-top: 45px">
        <el-button type="primary" @click="goBack">返 回</el-button>
      </el-col>
    </el-row>

    <!--新增记录弹窗-->
    <el-dialog
      title="新增记录"
      :visible.sync="showDialog"
      width="50%"
      @close="initDialogData"
      style="border-radius: 10px;"
    >
      <hr style="margin-top: -30px; margin-bottom: 20px; opacity: .5;" />
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="logItem" :rules="rules" ref="logItem">
            <el-form-item label="授课教师认证：" class="w45" prop="teacherCertification">
              <el-select v-model="logItem.teacherCertification" placeholder="请选择">
                <el-option
                  v-for="item in isTrueArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="教学设备匹配：" class="w45" prop="equipmentMatching">
              <el-select v-model="logItem.equipmentMatching" placeholder="请选择">
                <el-option
                  v-for="item in isTrueArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="培训人数：" class="w45" label-width="120px" prop="trainingNumber">
              <el-input
                v-model="logItem.trainingNumber"
                placeholder="请输入培训人数"
                style="width: 108%;"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="陪同人员：" class="w45" label-width="120px" prop="inspectionPerson">
              <el-input
                v-model="logItem.inspectionPerson"
                maxlength="10"
                placeholder="请输入陪同人员姓名"
                style="width: 108%;"
              ></el-input>
            </el-form-item>
            <el-form-item label="教学执行情况：" class="w45" prop="executionPlan">
              <el-select v-model="logItem.executionPlan" placeholder="教学计划执行情况">
                <el-option
                  v-for="item in teachingSituation"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="听课情况：" class="w45" label-width="120px" prop="classSituation">
              <el-select v-model="logItem.classSituation" placeholder="请选择">
                <el-option
                  v-for="item in teachingSituation"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item label="检查时间： " label-width="120px" prop="date">
                <el-date-picker
                  v-model="logItem.date"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
            </el-form-item>-->
            <el-row>
              <el-col :span="24">
                <h3 style="margin-bottom: 20px;">现场照片：</h3>
              </el-col>
              <div class="uplodeBox">
                <div>
                  <el-upload
                    ref="addUploadImg"
                    :action="uploadImage"
                    multiple
                    accept="image/jpeg, image/png, application/pdf"
                    :limit="9"
                    list-type="picture-card"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    :on-exceed="uploadMax"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :before-upload="beforeAvatarUpload"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible" size="tiny">
                    <img width="100%" :src="dialogImageUrl" alt />
                  </el-dialog>
                </div>
              </div>
            </el-row>
            <el-row>
              <el-col :span="24" style="text-align: left;margin-top: 10px">
                <el-button type="primary" @click="submitForm('logItem')">确认提交</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <!--<div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>-->
    </el-dialog>

    <!--编辑记录弹窗-->
    <el-dialog
      title="编辑记录"
      :visible.sync="editLgosDialog"
      width="50%"
      @close="initDialogData"
      style="border-radius: 10px;"
    >
      <hr style="margin-top: -30px; margin-bottom: 20px; opacity: .5;" />
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="logItem" :rules="rules" ref="logItem">
            <el-form-item label="授课教师认证：" class="w45" prop="teacherCertification">
              <el-select v-model="logItem.teacherCertification" placeholder="请选择">
                <el-option
                  v-for="item in isTrueArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="教学设备匹配：" class="w45" prop="equipmentMatching">
              <el-select v-model="logItem.equipmentMatching" placeholder="请选择">
                <el-option
                  v-for="item in isTrueArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="培训人数：" class="w45" label-width="120px" prop="trainingNumber">
              <el-input
                v-model="logItem.trainingNumber"
                placeholder="请输入培训人数"
                style="width: 108%;"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="陪同人员：" class="w45" label-width="120px" prop="inspectionPerson">
              <el-input
                v-model="logItem.inspectionPerson"
                maxlength="10"
                placeholder="请输入陪同人员姓名"
                style="width: 108%;"
              ></el-input>
            </el-form-item>
            <el-form-item label="教学执行情况：" class="w45" prop="executionPlan">
              <el-select v-model="logItem.executionPlan" placeholder="教学计划执行情况">
                <el-option
                  v-for="item in teachingSituation"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="听课情况：" class="w45" label-width="120px" prop="classSituation">
              <el-select v-model="logItem.classSituation" placeholder="请选择">
                <el-option
                  v-for="item in teachingSituation"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item label="检查时间： " label-width="120px" prop="date">
                <el-date-picker
                  v-model="logItem.date"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
            </el-form-item>-->
            <el-row>
              <el-col :span="24">
                <h3 style="margin-bottom: 20px;">现场照片：</h3>
              </el-col>
              <div class="uplodeBox">
                <div>
                  <el-upload
                    ref="editUploadImg"
                    :file-list="imgPathArr"
                    :action="uploadImage"
                    multiple
                    accept="image/jpeg, image/png, application/pdf"
                    :limit="9"
                    list-type="picture-card"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    :on-exceed="uploadMax"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :before-upload="beforeAvatarUpload"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible" size="tiny">
                    <img width="100%" :src="dialogImageUrl" alt />
                  </el-dialog>
                </div>
              </div>
            </el-row>
            <el-row>
              <el-col :span="24" style="text-align: left;margin-top:10px">
                <el-button type="primary" @click="submitForm('logItem', logItem.tid)">确认提交</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <!--<div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>-->
    </el-dialog>
  </div>
</template>

<script>
import Photo from '../../components/select/Photo'
export default {
  components: {
    Photo
  },
  data() {
    return {
      logLength: 0, // 记录上传条数，超过三条不能上传
      dialogVisible: false,
      showDialog: false,
      dialogImageUrl: '',
      tid: 0,
      imgPathArr: [], // 图片地址数组，用于记录上传图片的地址
      uploadImage: this.$api.uploadImage + '?folder=patrolImg', // 图片上传地址
      // 所有基础信息
      baseInfoObj: {
        clazzName: '',
        professional: '',
        schoolName: '',
        trainingAddress: '',
        trainingBeginTime: '',
        trainingEndTime: '',
        trainingLevel: '',
        trainingNumber: 0
      },
      lgosListArr: [], // 回显记录
      editLgosDialog: false,
      // 用于保存的单条记录
      logItem: {
        classSituation: '', // 听课情况
        equipmentMatching: false, // 设备匹配
        executionPlan: '', // 教学计划执行情况
        imagesPath: '', // 上传图片路径数组JSON字符串
        inspectionPerson: '', // 巡检人
        inspectionTid: 0, // 巡检信息Tid
        teacherCertification: false, // 教师认证
        trainingNumber: 0 // 培训人数
      },
      isTrueArr: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        }
      ],
      teachingSituation: [
        {
          label: '优秀'
        },
        {
          label: '良好'
        },
        {
          label: '一般'
        },
        {
          label: '较差'
        }
      ],
      // 验证规则
      rules: {
        teacherCertification: [{ required: true, message: '必填', trigger: 'blur' }],
        equipmentMatching: [{ required: true, message: '必填', trigger: 'blur' }],
        trainingNumber: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            validator: function(rule, value, callback) {
              let t = /^\d+\.\d+$/ // 小数验证
              if (value > 200 || value < 1 || t.test(value)) {
                callback(new Error('只能输入1-200的整数'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        executionPlan: [{ required: true, message: '必填', trigger: 'blur' }],
        classSituation: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.tid = this.$route.query.tid
    this.getBaseInfoList()
    this.getLogsList()
  },
  methods: {
    // 关闭弹窗重新初始化数据
    initDialogData() {
      this.logItem = {
        classSituation: '', // 听课情况
        equipmentMatching: false, // 设备匹配
        executionPlan: '', // 教学计划执行情况
        imagesPath: '', // 上传图片路径数组JSON
        inspectionPerson: '', // 巡检人
        inspectionTid: 0, // 巡检信息Tid
        teacherCertification: false, // 教师认证
        trainingNumber: 0 // 培训人数
      }
    },
    // 获取基础信息
    getBaseInfoList() {
      this.$http
        .get(this.$api.selectInspectionByInspectionTid + this.tid)
        .then(res => {
          let result = res.data.data
          this.baseInfoObj = result // 存入所有的基础信息
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 获取记录列表
    getLogsList() {
      this.$http
        .get(this.$api.selectInspectionRecordByInspectionTid + this.tid)
        .then(res => {
          let result = res.data.data
          this.lgosListArr = result // 存入所有的基础信息
          this.logLength = result.length
          if (this.logLength === 0) {
            // 没有记录，删除父级条目
            this.deleteParent()
            // 删除基础信息
            this.baseInfoObj = {
              clazzName: '',
              professional: '',
              schoolName: '',
              trainingAddress: '',
              trainingBeginTime: '',
              trainingEndTime: '',
              trainingLevel: '',
              trainingNumber: 0
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 编辑单条记录弹窗
    editLogsDialog(index) {
      this.editLgosDialog = true
      this.logItem = this.lgosListArr[index]
      // 给图片数组赋值
      this.imgPathArr = JSON.parse(this.logItem.imagesPath)
    },

    // 保存记录
    saveLogInfo() {
      this.logItem.inspectionTid = this.tid // 父ID
      this.logItem.trainingNumber = parseInt(this.logItem.trainingNumber)
      this.logItem.imagesPath = JSON.stringify(this.imgPathArr)
      this.$http
        .post(this.$api.saveInspectionRecord, this.logItem)
        .then(res => {
          this.$message({
            message: '记录保存成功',
            type: 'success'
          })
          // 清空图片数组
          this.imgPathArr = []
          this.$refs.addUploadImg.clearFiles()
          // 保存成功更新记录表
          if (this.tid) {
            this.getLogsList()
          }
          // 关闭弹窗
          this.showDialog = false
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 删除记录
    deleteLogs(tid) {
      this.$confirm('删除后无法恢复，确认删除吗？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .get(this.$api.deleteInspectionRecordByTid + tid)
            .then(res => {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getLogsList() // 删除成功更新列表
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    },

    // 保存编辑的记录信息
    saveEditLogInfo(logId) {
      this.logItem.tid = logId
      this.logItem.inspectionTid = this.tid
      this.logItem.trainingNumber = parseInt(this.logItem.trainingNumber)
      this.logItem.imagesPath = JSON.stringify(this.imgPathArr)
      this.$http
        .post(this.$api.updateInspectionRecordByTid, this.logItem)
        .then(res => {
          this.$message({
            message: '记录保存成功',
            type: 'success'
          })
          // 关闭弹窗
          this.editLgosDialog = false
          // 清空图片数组
          this.imgPathArr = []
          this.$refs.editUploadImg.clearFiles()
          // 保存成功更新记录表
          if (this.tid) {
            this.getLogsList()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 删除父条目
    deleteParent() {
      this.$http
        .get(this.$api.deleteInspectionByTid + this.tid)
        .then(res => {
          console.log('父条目删除成功')
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 表单验证
    submitForm: function(formName, logId) {
      var Self = this
      this.$refs[formName].validate(function(valid) {
        if (valid) {
          if (logId) {
            // 有ID调编辑
            Self.saveEditLogInfo(logId)
          } else {
            if (Self.logLength >= 3) {
              Self.$message.warning('最多只能上传三条记录！')
              return
            }
            // 无ID调新增
            Self.saveLogInfo() // 表单验证通过保存数据
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 返回
    goBack() {
      this.$router.push({ path: '/patrol' })
    },

    // 上传图片成功
    uploadSuccess(response, file, fileList) {
      this.$message({
        message: '图片上传成功',
        type: 'success'
      })
      // 保存地址数组
      this.imgPathArr = []
      fileList.forEach((item, index) => {
        let url = item.url
        let obj = { url }
        this.imgPathArr.push(obj)
      })
    },
    // 上传图片失败
    uploadError(err, file, fileList) {
      console.log(err)
      this.$message.error('图片上传失败')
    },
    // 上传图片超过数量限制
    uploadMax(files, fileList) {
      this.$message({
        message: '最多只能上传9张照片',
        type: 'warning'
      })
    },
    // 移除图片
    handleRemove(file, fileList) {
      this.imgPathArr = []
      fileList.forEach((item, index) => {
        let url = item.url
        let obj = { url }
        this.imgPathArr.push(obj)
      })
    },
    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 图片上传前验证
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      const isPdf = file.type === 'application/pdf'
      const isLt2M = file.size / 1024 / 1024 < 1
      let isTrue = true

      if (!isJPG && !isPng && !isPdf) {
        isTrue = false
        this.$message.error('只能上传jpg、png、pdf格式的文件！')
      }
      if (!isLt2M) {
        isTrue = false
        this.$message.error('上传图片大小不能超过 1MB！')
      }
      return isTrue
    }
  },
  filters: {
    // 格式化布尔值
    formatBoolean(value) {
      if (value === false) {
        return '否'
      } else {
        return '是'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.warp {
  width: calc(100% - 100px);
  height: calc(100% - 100px);
  padding: 50px;
  hr {
    width: 90%;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  > p {
    display: flex;
    line-height: 30px;
    span {
      flex: 1;
    }
  }
  .itemBox {
    width: 100%;
    height: 180px;
    background-color: #f5f7fd;
    margin-top: 20px;
    padding: 20px;
    p {
      display: flex;
      margin-top: 15px;
      font-size: 14px;
      &:first-of-type {
        font-size: 16px;
        font-weight: bold;
      }
      span {
        flex: 1;
      }
    }
    .imgBox {
      font-size: 12px;
      margin-top: 20px;
      height: 60px;
      overflow: hidden;
      div {
        float: left;
        width: 45px;
        height: 45px;
        line-height: 45px;
        margin-right: 10px;
        &:first-of-type {
          width: 80px;
          margin-right: 0px;
        }
      }
    }
  }
  .w30 {
    width: 30%;
  }
  .w45 {
    width: 45%;
  }
  .uplodeBox {
    > div {
      display: inline-block;

      margin-right: 12px;
      position: relative;
      > p {
        width: 100%;
        font-size: 10px;
        color: #929498;
        position: absolute;
        left: 0;
        bottom: -20px;
        text-align: center;
      }
    }
  }
}
</style>
<style>
.el-upload--text {
  width: 84px;
  height: 84px;
}
</style>
