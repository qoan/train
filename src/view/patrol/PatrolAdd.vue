<template>
  <div class="warp">
    <h2>新增巡检记录</h2>
    <hr>
    <el-form :inline="true" :model="baseInfo">
      <h3 style="margin-bottom: 20px;">基础信息</h3>
      <el-form-item label="检查班级：" class="w30">
        <el-select v-model="baseInfo.clazzName" placeholder="请选择" @change="setBaseInfo">
          <el-option
            v-for="item in classListArr"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在学校：" class="w30">
        <el-input readonly v-model="baseInfo.schoolName" style="width: 108%;"></el-input>
      </el-form-item>
      <el-form-item label="培训工种：" class="w30">
        <el-input readonly v-model="baseInfo.professional" style="width: 108%;"></el-input>
      </el-form-item>
      <el-form-item label="培训层次：" class="w30">
        <el-input readonly v-model="baseInfo.trainingLevel" style="width: 108%;"></el-input>
      </el-form-item>
      <el-form-item label="培训时间： " style="width: 30%;overflow: hidden;">
        <el-date-picker
          readonly
          v-model="trainDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 220px"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="培训人数：" class="w30">
        <el-input readonly v-model="baseInfo.trainingNumber" type="number" placeholder="请输入培训人数"  style="width: 108%;"></el-input>
      </el-form-item>
      <el-form-item label="培训地点：" class="w30">
        <el-input readonly v-model="baseInfo.trainingAddress" placeholder="请输入培训地点"  style="width: 108%;"></el-input>
      </el-form-item>
      <!--<el-button type="primary" @click="saveBaseInfo">保 存</el-button>-->
      <el-button type="primary" @click="addSave">新增记录</el-button>
    </el-form>
   <!-- <el-row>
      <el-col :span="24" style="text-align: left;margin-top: 45px">
        <el-button type="primary" @click="showDialog = true">新增记录</el-button>
      </el-col>
    </el-row>-->
    <!--回显列表-->
    <el-row v-if="logsShow">
      <div class="itemBox" v-for="(item, index) in lgosListArr" :key="index" >
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
          <div class="pic" v-for="(i, index) in JSON.parse(item.imagesPath)" :key="index">
            <Photo :imgUrl="i.url" width="100%" height="100%"></Photo>
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
    <el-dialog title="新增记录"  :visible.sync="showDialog" width="50%" @close="initDialogData" style="border-radius: 10px;">
      <hr style="margin-top: -30px; margin-bottom: 20px; opacity: .5;">
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="logItem" :rules="rules" ref="logItem">
            <el-form-item label="授课教师认证：" class="w45" prop="teacherCertification">
              <el-select v-model="logItem.teacherCertification" placeholder="请选择" >
                <el-option
                  v-for="item in isTrueArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="教学设备匹配：" class="w45" prop="equipmentMatching">
              <el-select v-model="logItem.equipmentMatching" placeholder="请选择">
                <el-option
                  v-for="item in isTrueArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="培训人数：" class="w45" label-width="120px" prop="trainingNumber">
              <el-input v-model="logItem.trainingNumber"
                        placeholder="请输入培训人数"
                        style="width: 108%;"
                        type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="陪同人员：" class="w45" label-width="120px" prop="inspectionPerson">
              <el-input v-model="logItem.inspectionPerson" maxlength="10" placeholder="请输入陪同人员姓名" style="width: 108%;"></el-input>
            </el-form-item>
            <el-form-item label="教学执行情况：" class="w45" prop="executionPlan">
              <el-select v-model="logItem.executionPlan" placeholder="教学计划执行情况">
                <el-option
                  v-for="item in teachingSituation"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="听课情况：" class="w45" label-width="120px" prop="classSituation">
              <el-select v-model="logItem.classSituation" placeholder="请选择">
                <el-option
                  v-for="item in teachingSituation"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label">
                </el-option>
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
                    accept="image/jpeg,image/png,application/pdf"
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
                    <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog>
                </div>
              </div>
            </el-row>
            <el-row>
              <el-col :span="24" style="text-align: left;margin-top: 45px">
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
    <el-dialog title="编辑记录"  :visible.sync="editLgosDialog" width="50%" @close="initDialogData" style="border-radius: 10px;">
      <hr style="margin-top: -30px; margin-bottom: 20px; opacity: .5;">
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="logItem" :rules="rules" ref="logItem">
            <el-form-item label="授课教师认证：" class="w45" prop="teacherCertification">
              <el-select v-model="logItem.teacherCertification" placeholder="请选择" >
                <el-option
                  v-for="item in isTrueArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="教学设备匹配：" class="w45" prop="equipmentMatching">
              <el-select v-model="logItem.equipmentMatching" placeholder="请选择">
                <el-option
                  v-for="item in isTrueArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="培训人数：" class="w45" label-width="120px" prop="trainingNumber">
              <el-input v-model="logItem.trainingNumber"
                        placeholder="请输入培训人数"
                        style="width: 108%;"
                        type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="陪同人员：" class="w45" label-width="120px" prop="inspectionPerson">
              <el-input v-model="logItem.inspectionPerson" maxlength="10" placeholder="请输入陪同人员姓名" style="width: 108%;"></el-input>
            </el-form-item>
            <el-form-item label="教学执行情况：" class="w45" prop="executionPlan">
              <el-select v-model="logItem.executionPlan" placeholder="教学计划执行情况">
                <el-option
                  v-for="item in teachingSituation"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="听课情况：" class="w45" label-width="120px" prop="classSituation">
              <el-select v-model="logItem.classSituation" placeholder="请选择">
                <el-option
                  v-for="item in teachingSituation"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label">
                </el-option>
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
                    accept="image/jpeg,image/png,application/pdf"
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
                    <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog>
                </div>
              </div>
            </el-row>
            <el-row>
              <el-col :span="24" style="text-align: left;margin-top: 45px">
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
      editLgosDialog: false, // 编辑记录弹窗
      imgPathArr: [], // 图片地址数组，用于记录上传图片的地址
      dialogImageUrl: '',
      dialogVisible: false,
      uploadImage: this.$api.uploadImage + '?folder=patrolImg', // 图片上传地址
      isImg: false,
      tid: 0, // 记录本条Tid，用于记录保存
      logsShow: false, // 判断是否显示记录列表
      baseInfoArr: [], // 所有基础信息
      trainDate: '', // 培训时间
      baseInfo: { // 用于保存的单条基础信息
        'clazzName': '',
        'professional': '',
        'schoolName': '',
        'trainingAddress': '',
        'trainingBeginTime': '',
        'trainingEndTime': '',
        'trainingLevel': '',
        'trainingNumber': 0
      },
      classListArr: [], // 班级列表
      showDialog: false,
      logItem: { // 用于保存的单条记录
        'classSituation': '', // 听课情况
        'equipmentMatching': false, // 设备匹配
        'executionPlan': '', // 教学计划执行情况
        'imagesPath': '',  // 上传图片路径数组JSON字符串
        'inspectionPerson': '', // 巡检人
        'inspectionTid': 0, // 巡检信息Tid
        'teacherCertification': false, // 教师认证
        'trainingNumber': 0 // 培训人数
      },
      rules: {
        teacherCertification: [{ required: true, message: '必填', trigger: 'blur' }],
        equipmentMatching: [{ required: true, message: '必填', trigger: 'blur' }],
        trainingNumber: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            validator: function (rule, value, callback) {
              let t = /^\d+\.\d+$/    // 小数验证
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
      },
      lgosListArr: [
        /* {
          'classSituation': '', // 听课情况
          'equipmentMatching': false, // 设备匹配
          'executionPlan': '', // 教学计划执行情况
          'imagesPath': '',  // 上传图片路径数组JSON字符串
          'inspectionPerson': '', // 巡检人
          'inspectionTid': 0, // 巡检信息Tid
          'teacherCertification': false, // 教师认证
          'trainingNumber': 0 // 培训人数
        } */
      ], // 回显记录
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
      ]
    }
  },
  mounted() {
    this.getBaseInfoList()
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
  },
  methods: {
    // 保存记录
    addSave () {
      if (!this.baseInfo.clazzName) {
        this.$message.warning('请先选择班级才能新增！')
        return
      }

      this.showDialog = true
    },
    // 关闭弹窗重新初始化数据
    initDialogData () {
      this.logItem = {
        'classSituation': '', // 听课情况
        'equipmentMatching': false, // 设备匹配
        'executionPlan': '', // 教学计划执行情况
        'imagesPath': '',  // 上传图片路径数组JSON
        'inspectionPerson': '', // 巡检人
        'inspectionTid': 0, // 巡检信息Tid
        'teacherCertification': false, // 教师认证
        'trainingNumber': 0 // 培训人数
      }
    },
    // 编辑单条记录弹窗
    editLogsDialog (index) {
      this.editLgosDialog = true
      this.logItem = this.lgosListArr[index]
      console.log(this.logItem.imagesPath)
      // 给图片数组赋值
      this.imgPathArr = JSON.parse(this.logItem.imagesPath)
    },
    // 保存编辑的记录信息
    saveEditLogInfo(logId) {
      this.logItem.tid = logId
      this.logItem.inspectionTid = this.tid
      this.logItem.trainingNumber = parseInt(this.logItem.trainingNumber)
      this.logItem.imagesPath = JSON.stringify(this.imgPathArr)
      this.$http.post(this.$api.updateInspectionRecordByTid, this.logItem)
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
    // 上传图片成功
    uploadSuccess (response, file, fileList) {
      this.$message({
        message: '图片上传成功',
        type: 'success'
      })
      // 保存地址数组
      this.imgPathArr = []
      fileList.forEach((item, index) => {
        let url = item.response.message
        let obj = { url }
        this.imgPathArr.push(obj)
      })
    },
    // 上传图片失败
    uploadError (err, file, fileList) {
      console.log(err)
      this.$message.error('图片上传失败')
    },
    // 上传图片超过数量限制
    uploadMax (files, fileList) {
      this.$message({
        message: '最多只能上传9张照片',
        type: 'warning'
      })
    },
    // 移除图片
    handleRemove(file, fileList) {
      this.imgPathArr = []
      fileList.forEach((item, index) => {
        let url = item.response.message
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
    },
    // 获取班级列表
    getBaseInfoList() {
      const params = [1]
      this.$http.post(this.$api.getSchoolsAllClass, params)
        .then(res => {
          let result = res.data.data
          this.baseInfoArr = result // 存入所有的基础信息
          // 遍历所有班级名称
          result.forEach((item, index) => {
            let obj = {
              label: item.className,
              value: index
            }
            this.classListArr.push(obj)
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取记录列表
    getLogsList () {
      this.$http.get(this.$api.selectInspectionRecordByInspectionTid + this.tid)
        .then(res => {
          let result = res.data.data
          this.lgosListArr = result
          this.logLength = result.length
          if (this.logLength === 0) {
            // 没有记录，删除父级条目
            this.deleteParent()
            // 删除基础信息
            this.baseInfo = {
              'clazzName': '',
              'professional': '',
              'schoolName': '',
              'trainingAddress': '',
              'trainingBeginTime': '',
              'trainingEndTime': '',
              'trainingLevel': '',
              'trainingNumber': 0
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 根据选择的班级index设置基础信息
    setBaseInfo(val) {
      let item = this.baseInfoArr[val]
      this.baseInfo.clazzName = item.className
      this.baseInfo.schoolName = item.schoolName
      this.baseInfo.professional = item.workType
      this.baseInfo.trainingLevel = item.trainLevel
      this.baseInfo.trainingNumber = item.studentCount
      this.baseInfo.trainingAddress = item.areacodeAddress
      this.trainDate = [item.trainDateStart, item.trainDateEnd]
    },
    // 保存基础信息
    saveBaseInfo() {
      this.baseInfo.trainingBeginTime = this.trainDate[0]
      this.baseInfo.trainingEndTime = this.trainDate[1]
      this.$http.post(this.$api.saveInspection, this.baseInfo)
        .then(res => {
          let tid = res.data.data
          this.tid = tid
          this.logsShow = true // 保存成功展示记录列表

          // 保存记录信息
          this.logItem.inspectionTid = this.tid // 父ID
          this.logItem.trainingNumber = parseInt(this.logItem.trainingNumber)
          this.logItem.imagesPath = JSON.stringify(this.imgPathArr)
          this.$http.post(this.$api.saveInspectionRecord, this.logItem)
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
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 保存记录
    saveLogInfo() {
      // 先保存基础信息
      if (this.logLength === 0) {
        // 没有记录才保存基础信息，有记录是追加不新建基础信息
        this.saveBaseInfo()
      } else {
        // 保存记录信息
        this.logItem.inspectionTid = this.tid // 父ID
        this.logItem.trainingNumber = parseInt(this.logItem.trainingNumber)
        this.logItem.imagesPath = JSON.stringify(this.imgPathArr)
        this.$http.post(this.$api.saveInspectionRecord, this.logItem)
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
      }
    },
    // 删除记录
    deleteLogs (tid) {
      this.$confirm('删除后无法恢复，确认删除吗？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除请求
        this.$http.get(this.$api.deleteInspectionRecordByTid + tid)
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
      }).catch(() => {

      })
    },

    // 删除父条目
    deleteParent () {
      this.$http.get(this.$api.deleteInspectionByTid + this.tid)
        .then(res => {
          console.log('父条目删除成功')
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 表单验证
    submitForm: function (formName, logId) {
      var Self = this
      this.$refs[formName].validate(function (valid) {
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
    resetForm: function (formName) {
      this.$refs[formName].resetFields()
    },
    // 格式化表格中的数据
    trueOrFalse (row, column, cellValue) {
      if (cellValue) {
        return '是'
      } else {
        return '否'
      }
    },
    // 返回
    goBack () {
      this.$router.push({ path: '/patrol' })
    }
  }
}
</script>

<style scoped lang="scss">
  .warp{
    width: calc(100% - 100px);
    height: calc(100% - 100px);
    padding: 50px;
    hr{
      width: 90%;
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .w30{
      width: 30%;
    }
    .w45{
      width: 45%;
    }
    .uplodeBox{
      >div{
        display: inline-block;
        height: 84px;
        margin-right: 12px;
        position: relative;
        >p{
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
    .itemBox{
      width: 100%;
      height: 180px;
      background-color: #F5F7FD;
      margin-top: 20px;
      padding: 20px;
      p{
        display: flex;
        margin-top: 15px;
        font-size: 14px;
        &:first-of-type{
          font-size: 16px;
          font-weight: bold;
        }
        span{
          flex: 1;
        }
      }
      .imgBox{
        font-size: 12px;
        margin-top: 20px;
        height: 60px;
        overflow: hidden;
        div{
          float: left;
          width: 45px;
          height: 45px;
          line-height: 45px;
          margin-right: 10px;
          &:first-of-type{
            width: 80px;
            margin-right: 0px;
          }
        }
        .pic{
          background-color: blue;
        }
      }
    }
  }
</style>
<style>
  .el-upload--text{
    width: 84px;
    height: 84px;
  }
  .el-upload--picture-card{
    width: 84px;
    height: 84px;
    line-height: 85px;
  }
  .el-upload-list--picture-card .el-upload-list__item{
    width: 84px;
    height: 84px;
  }
</style>
