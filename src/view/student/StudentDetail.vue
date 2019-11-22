<template>
  <div class="warp">
    <!-- 学员基本信息 -->
    <el-row class="box1">
      <el-col :span="3" class="h left">
        <photo class="photo" v-bind="{imgUrl: studentInfo.photoUrl, width: 130, height: 164}"></photo>
      </el-col>
      <el-col :span="14" class="h center">
        <p style="font-weight: 600;color:#000000">
          {{studentInfo.name}}
          <img
            style="margin-left: 5px;"
            :src="studentInfo.sex === '1' ? require('@/assets/img/icon/icon-boy.png') : require('@/assets/img/icon/icon-girl.png')"
            alt
          />
        </p>
        <hr style="width: 90%;opacity: .1;margin-top: 6px;" />
        <p style="margin-top: 5px;line-height:30px;">录入时间：{{studentInfo.createTime}}</p>
        <p style="line-height:30px;">家庭住址：{{studentInfo.address}}</p>
        <hr style="width: 90%;opacity: .1;margin-top: 5px;" />
        <ul>
          <li>
            <span>民族：{{studentInfo.nation}}</span>
            <span>出生年月：{{studentInfo.birthday}}</span>
            <span>身份证号码：{{studentInfo.idCard}}</span>
          </li>
          <li>
            <span>籍贯：{{studentInfo.nativePlace}}</span>
            <span>文化程度：{{studentInfo.education}}</span>
            <span>人员类型：{{studentInfo.personnelType}}</span>
          </li>
          <li>
            <span>年龄：{{studentInfo.age}}岁</span>
            <span>联系电话：{{studentInfo.phone}}</span>
            <span>人员类别：{{studentInfo.personnelCategory}}</span>
          </li>
        </ul>
      </el-col>
      <el-col :span="6" class="h right">
        <div class="preview_demo">
          <!-- <photo
            style="margin-right: 20px; margin-bottom: 10px;"
            v-bind="{imgUrl: url, width: 150, height: 100}"
            v-for="url in getPicUrlType(studentInfo.idCardUrl)"
            :key="url"
            lazy
          ></photo>-->
          <el-carousel height="250px">
            <el-carousel-item v-for="(item, index) in personImgList" :key="index">
              <photo v-bind="{imgUrl: item, width: 400, height: 250}" lazy></photo>
            </el-carousel-item>
          </el-carousel>
        </div>
        <!---<el-button type="primary" round size="mini" style="margin-top: 20px">
           <i class="el-icon-download"></i>下载
        </el-button>--->
        <el-button
          type="text"
          round
          size="mini"
          class="editBtn"
          v-if="userType === 5"
          @click="$refs.dialogEditStdInfo.dialogVisible=true;$refs.dialogEditStdInfo.tid=studentInfo.tid;"
        >
          <i class="el-icon-edit-outline"></i>编辑
        </el-button>
      </el-col>
    </el-row>
    <!-- 学员培训信息 -->
    <el-row class="box2 mt-30">
      <p class="box2_title" style="font-size:16px">学员培训经历</p>
      <p class="box2_content" v-for="(item, index) in trainLogs" :key="index">
        <span>{{item.className}}</span>
        <span>{{item.workType}}</span>
        <span>{{item.trainLevel}}</span>
        <span>{{item.trainDateStart}} - {{item.trainDateEnd}}</span>
        <span>{{item.schoolName}}</span>
        <span class="pxz">
          {{item.trainStatus | trainStatusFun}}
          <b
            v-if="item.trainStatus === 2 && item.studentScore > 0"
          >({{item.studentScore}}分)</b>
        </span>
        <span>
          <el-button type="text" round @click.native.prevent="goClassDetail(item.classId)">查看详情</el-button>
        </span>
      </p>
    </el-row>
    <!-- 学员考勤统计 -->
    <el-row class="box3 mt-30">
      <p style="font-size:16px">学员考勤统计</p>
      <el-col :span="6">
        <div class="item">
          <p>
            <span>{{checkCount.trainDays}}</span> 天
          </p>
          <p>本次培训天数</p>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="item">
          <p>
            <span>{{checkCount.AttendanceDays}}</span> 天
          </p>
          <p>正常考勤天数</p>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="item">
          <p>
            <span style="color: #D0021B;">{{checkCount.abnormalCount}}</span> 天
          </p>
          <p>异常考勤天数</p>
        </div>
      </el-col>
    </el-row>
    <!--学员岗位推荐-->

    <div class="box4 mt-30">
      <p style="font-size:16px">学员岗位推荐</p>
      <div class="Algin">
        <div v-for="(item1, index1) in listData" :key="'nice'+index1">
          <div class="classItem" @click="goDetail(item1.jobTid)">
            <div class="left">
              <p class="title">{{item1.jobName}}</p>
              <span class="jobAddress-span">{{item1.jobAddress}}</span>
              <p class="companyName-span">
                <img src="../../assets/img/icon/icon-qi.png" alt />
                {{item1.companyName}}
              </p>
              <p>招聘人数 | {{item1.jobHiring}}</p>
            </div>
            <div class="right">
              <p>{{item1.jobIncome}}</p>
              <p class="education">{{item1.education}}</p>
              <p>{{item1.createTime}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--学员就业情况-->
    <el-row class="box5 mt-30">
      <p class="box2_title" style="font-size:16px">学员就业情况</p>
      <el-button type="text" round size="mini" class="addBtn" @click="showDialogAdd" v-if="active">
        <i class="el-icon-plus"></i>新增
      </el-button>
      <el-button
        type="text"
        round
        size="mini"
        class="editBtn"
        @click="showEditDialog = true"
        v-if="active"
      >
        <i class="el-icon-edit-outline"></i>编辑
      </el-button>
      <div class="content">
        <p>
          <span>就业岗位：{{jobInfo.jobName}}</span>
          <span>就业时间：{{jobInfo.getJobTime}}</span>
          <span>就业单位名称：{{jobInfo.companyName}}</span>
        </p>
        <p>
          <span>就业渠道：{{jobInfo.getJobType}}</span>
          <span>月收入：{{jobInfo.income}}元/月</span>
          <span>具体就业地点：{{jobInfo.companyAddress}}</span>
        </p>
        <div class="preview">
          <p style="line-height:60px">就业证明:</p>
          <div class="item" v-for="(item, index) in showImgArr" :key="index">
            <!-- <photo :src="item.url" alt width="100%" height="100%" /> -->
            <photo v-bind="{imgUrl: item.url, width: 155, height: 120}" lazy></photo>
          </div>
          <!--<div class="item">
            <el-button type="primary" round size="mini" style="margin-top: 50px">
              <i class="el-icon-download"></i>下载
            </el-button>
          </div>-->
        </div>
      </div>
    </el-row>

    <!-- 新增就业信息弹窗 -->
    <el-dialog
      title="新增就业信息"
      :visible.sync="showJobInfoDialog"
      width="50%"
      style="border-radius: 10px;"
      @open="initDataFun"
    >
      <hr style="margin-top: -30px; margin-bottom: 20px; opacity: .5;" />
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="jobInfo" :rules="rules" ref="jobInfo">
            <h3 style="margin-bottom: 20px;">就业信息</h3>
            <el-col :span="12">
              <el-form-item label="就业岗位：" prop="jobName">
                <el-input placeholder="请输入就业岗位" v-model="jobInfo.jobName" style="width: 108%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="就业时间：" prop="getJobTime" label-width="90px">
                <el-date-picker
                  v-model="jobInfo.getJobTime"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位名称：" prop="companyName">
                <el-input v-model="jobInfo.companyName" placeholder="请输入单位名称" style="width: 108%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="就业渠道：" prop="getJobType">
                <el-select v-model="jobInfo.getJobType" placeholder="请选择">
                  <el-option
                    v-for="item in channelArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="就业地址：" prop="companyAddress">
                <el-input
                  v-model="jobInfo.companyAddress"
                  placeholder="请输入就业地址"
                  style="width: 108%;"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="月收入：" label-width="90px" prop="income">
                <el-input
                  v-model="jobInfo.income"
                  placeholder="请输入月收入"
                  type="number"
                  style="width: 108%;"
                ></el-input>
              </el-form-item>
            </el-col>
            <h3 style="margin-bottom: 20px;">就业证明</h3>
            <el-row>
              <el-col :span="24">
                <div class="uplodeBox">
                  <div>
                    <el-upload
                      ref="addStudentJob"
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
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" style="text-align: left;margin-top: 45px">
                <el-button type="primary" @click="submitForm('jobInfo')">确认提交</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 编辑就业信息弹窗 -->
    <el-dialog
      title="编辑就业信息"
      :visible.sync="showEditDialog"
      width="50%"
      style="border-radius: 10px;"
    >
      <hr style="margin-top: -30px; margin-bottom: 20px; opacity: .5;" />
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="editJobInfo" :rules="rules" ref="editJobInfo">
            <h3 style="margin-bottom: 20px;">就业信息</h3>
            <el-col :span="12">
              <el-form-item label="就业岗位：" prop="jobName">
                <el-input placeholder="请输入就业岗位" v-model="editJobInfo.jobName" style="width: 108%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="就业时间：" prop="getJobTime" label-width="90px">
                <el-date-picker
                  v-model="editJobInfo.getJobTime"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位名称：" prop="companyName">
                <el-input
                  v-model="editJobInfo.companyName"
                  placeholder="请输入单位名称"
                  style="width: 108%;"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="就业渠道：" prop="getJobType">
                <el-select v-model="editJobInfo.getJobType" placeholder="请选择">
                  <el-option
                    v-for="item in channelArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="就业地址：" prop="companyAddress">
                <el-input
                  v-model="editJobInfo.companyAddress"
                  placeholder="请输入就业地址"
                  style="width: 108%;"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="月收入：" label-width="90px" prop="income">
                <el-input
                  v-model="editJobInfo.income"
                  placeholder="请输入月收入"
                  type="number"
                  style="width: 108%;"
                ></el-input>
              </el-form-item>
            </el-col>
            <h3 style="margin-bottom: 20px;">就业证明</h3>
            <el-row>
              <el-col :span="24">
                <UploadMultiFileListBak v-bind="upLoadConfig" v-model="stdEmpUploadFileList"></UploadMultiFileListBak>
                <!---
                <div class="uplodeBox">
                  <div>
                    <el-upload
                      ref="editStudentJob"
                      :file-list="editimgPathArr"
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
                </div> --->
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" style="text-align: left;margin-top: 45px">
                <el-button type="primary" @click="submitForm2('editJobInfo')">确认提交</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 编辑学员弹窗 -->
    <dialog-edit-std-info ref="dialogEditStdInfo" @submitOk="getStudentInfo()"></dialog-edit-std-info>
  </div>
</template>

<script>
import Photo from '@/components/select/Photo'
import DialogEditStdInfo from '@/view/student/dialog/DialogEditStdInfo'
import UploadMultiFileListBak from '../../components/select/UploadMultiFileListBak'
export default {
  name: 'studentDetail',
  components: {
    DialogEditStdInfo,
    UploadMultiFileListBak,
    Photo
  },
  data() {
    return {
      active: false,
      tid: 0, // 学员ID
      idCard: '', // 学员身份证
      classId: 0, // 班级ID
      jobid: 0,
      checkCount: {
        // 考勤统计
        trainDays: 0, // 培训天数
        AttendanceDays: 0, // 出勤天数
        abnormalCount: 0 // 异常考勤次数
      },
      dialogVisible: false,
      dialogImageUrl: false,
      personImgList: [],
      listData: [], // 学员就业推送信息
      // 就业详情
      jobInfo: {
        companyAddress: '',
        companyName: '',
        fileUrls: '',
        getJobTime: '',
        getJobType: '',
        income: '',
        jobName: '',
        studentId: 0,
        studentIdcard: ''
      },
      editJobInfo: {
        companyAddress: '',
        companyName: '',
        fileUrls: '',
        getJobTime: '',
        getJobType: '',
        income: '',
        jobName: '',
        studentId: 0,
        studentIdcard: '',
        tid: 0
      },
      upLoadConfig: {
        action: this.$api.uploadImage + '?folder=patrolImg',
        limit: 9,
        sizeLimit: 1024 * 1024 * 1
      },
      stdEmpUploadFileList: [],

      // 回显图片数组
      showImgArr: [],
      channelArr: [],
      imgPathArr: [], // 图片地址数组，用于记录上传图片的地址
      editimgPathArr: [], // 图片地址数组，用于记录上传图片的地址
      uploadImage: this.$api.uploadImage + '?folder=patrolImg', // 图片上传地址
      userType: null,
      studentInfo: {
        name: '',
        createTime: '',
        address: '',
        idCardUrl: [],
        registerUrl: [],
        otherFileUrl: [],
        nation: '',
        birthday: '',
        idCard: '',
        nativePlace: '',
        education: '',
        personnelType: '',
        age: '',
        phone: '',
        personnelCategory: ''
      },
      showJobInfoDialog: false,
      showEditDialog: false,
      // 验证规则
      rules: {
        companyAddress: [{ required: true, message: '必填', trigger: 'blur' }],
        companyName: [{ required: true, message: '必填', trigger: 'blur' }],
        getJobType: [{ required: true, message: '必填', trigger: 'blur' }],
        income: [{ required: true, message: '必填', trigger: 'blur' }],
        jobName: [{ required: true, message: '必填', trigger: 'blur' }],
        studentIdcard: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      // 培训记录
      trainLogs: []
    }
  },
  mounted() {
    // 获取学员ID
    this.tid = this.$route.query.tid || 0
    this.idCard = this.$route.query.idCard || ''
    this.classId = this.$route.query.classId || 0

    // 获取学员信息
    this.getStudentInfo()
    this.userType = parseInt(JSON.parse(sessionStorage.getItem('userInfo')).roleTid)
    if (this.userType === 5) {
      this.active = true
    } else {
      this.active = false
    }
    // 查询考勤统计
    this.getStudentCheckCountFun()

    // 查询学员就业岗位推送
    if (this.classId) {
      this.getListData()
    }

    // 查询培训总天数
    this.getTrainTotalDaysFun()

    // 获取就业渠道
    this.getChannelFun()

    // 获取学员就业情况信息
    this.getStudentJobFun()

    // 获取培训记录
    this.getTrainLogsFun()
  },
  filters: {
    trainStatusFun(n) {
      let str = ''
      switch (n) {
        case 0:
          str = '待培训'
          break
        case 1:
          str = '培训中'
          break
        case 2:
          str = '已完成'
          break
        default:
          str = ''
      }
      return str
    }
  },
  methods: {
    // 学员岗位推荐详情
    goDetail(tid) {
      console.log(this.listData)
      console.log(tid)
      this.$router.push({ path: '/employment/detail/', query: { tid } })
    },
    // 获取培训记录
    getTrainLogsFun() {
      // 发送请求
      this.$http
        .post(this.$api.findStudentTrainDataList + this.tid)
        .then(res => {
          let result = res.data.data
          if (result) {
            this.trainLogs = result
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 获取图片连接
    getPersonFile() {
      this.personImgList = []
      JSON.parse(this.studentInfo.idCardUrl || '[]').forEach((item, index) => {
        if (typeof item === 'string') {
          this.personImgList.push(item)
        } else {
          this.personImgList.push(item.url)
        }
      })

      JSON.parse(this.studentInfo.registerUrl || '[]').forEach((item, index) => {
        if (typeof item === 'string') {
          this.personImgList.push(item)
        } else {
          this.personImgList.push(item.url)
        }
      })

      JSON.parse(this.studentInfo.otherFileUrl || '[]').forEach((item, index) => {
        if (typeof item === 'string') {
          this.personImgList.push(item)
        } else {
          this.personImgList.push(item.url)
        }
      })

      this.personImgList = this.personImgList.filter(item => item)
    },
    // 获取学员就业情况信息
    getStudentJobFun() {
      // 发送请求
      this.$http
        .post(this.$api.getJobListByStudentId + this.tid)
        .then(res => {
          let result = res.data.data
          if (result) {
            this.jobInfo = result
            this.editJobInfo = result
            console.log(JSON.parse(result.fileUrls))
            this.stdEmpUploadFileList = JSON.parse(result.fileUrls)
            this.showImgArr = JSON.parse(result.fileUrls)
            this.editimgPathArr = JSON.parse(result.fileUrls)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 新增学员就业情况
    addStudentJobFun() {
      // 参数准备
      this.jobInfo.fileUrls = JSON.stringify(this.imgPathArr)
      this.jobInfo.studentId = this.tid
      this.jobInfo.studentIdcard = this.idCard
      this.jobInfo.classId = this.classId
      this.jobInfo.studentName = this.studentInfo.name

      // 发送请求
      this.$http
        .post(this.$api.saveGetJob, this.jobInfo)
        .then(res => {
          let result = res.data
          if (result.message) {
            this.$message.success(result.message)
            this.showJobInfoDialog = false
            // 清空图片数组
            this.imgPathArr = []
            this.$refs.addStudentJob.clearFiles()
            // 获取学员就业情况信息
            this.getStudentJobFun()
          } else {
            this.$message.error(result.error.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 表单验证
    submitForm: function(formName) {
      var Self = this
      this.$refs[formName].validate(function(valid) {
        if (valid) {
          Self.addStudentJobFun()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 编辑学员就业情况
    editStudentJobFun() {
      // 参数准备
      this.editJobInfo.fileUrls = JSON.stringify(
        this.stdEmpUploadFileList.map(item => {
          let data = {}
          if (item.url && item.url.startsWith('blob:')) {
            item.url = item.response && item.response.message // 替换默认的url，否则回显很麻烦
          }
          return {
            url: item.url,
            name: item.name
          }
        })
      )

      this.editJobInfo.studentId = this.tid
      this.editJobInfo.studentIdcard = this.idCard
      this.jobInfo.classId = this.classId
      this.jobInfo.studentName = this.studentInfo.name

      // 发送请求
      this.$http
        .post(this.$api.updateGetJob, this.editJobInfo)
        .then(res => {
          let result = res.data
          if (result.message) {
            this.$message.success(result.message)
            this.showEditDialog = false
            this.showImgArr = JSON.parse(this.editJobInfo.fileUrls)
            this.$refs.editStudentJob.clearFiles()
            // 获取学员就业情况信息
            this.getStudentJobFun()
          } else {
            this.$message.error(result.error.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 表单验证
    submitForm2: function(formName) {
      var Self = this
      this.$refs[formName].validate(function(valid) {
        if (valid) {
          Self.editStudentJobFun()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 弹窗add
    showDialogAdd() {
      this.showJobInfoDialog = true
    },

    // 上传图片成功
    uploadSuccess(response, file, fileList) {
      this.$message({
        message: '图片上传成功',
        type: 'success'
      })
      // 保存地址数组
      this.imgPathArr = []
      this.editimgPathArr = []
      fileList.forEach((item, index) => {
        console.log(item)
        if (item.response) {
          let url = item.response.message
          let obj = { url }
          this.imgPathArr.push(obj)
          this.editimgPathArr.push(obj)
        } else {
          let url = item.url
          let obj = { url }
          this.imgPathArr.push(obj)
          this.editimgPathArr.push(obj)
        }
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

    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    // 移除图片
    handleRemove(file, fileList) {
      console.log(file)
      this.imgPathArr = []
      this.editimgPathArr = []
      fileList.forEach((item, index) => {
        if (item.response) {
          let url = item.response.message
          let obj = { url }
          this.imgPathArr.push(obj)
          this.editimgPathArr.push(obj)
        } else {
          let url = item.url
          let obj = { url }
          this.editimgPathArr.push(obj)
        }
      })
    },

    // 获取就业渠道
    getChannelFun() {
      this.$http
        .get(this.$api.selectOption + 'getjob_type')
        .then(res => {
          let result = res.data.data
          result.forEach((item, index) => {
            let obj = {
              label: item.enumerValue,
              value: item.tid
            }
            this.channelArr.push(obj)
          })
        })
        .catch(err => {
          console.log(err)
        })
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

    // 获取学员培训天数
    getTrainTotalDaysFun() {
      this.$http
        .post(this.$api.getTrainTotalDaysByClassId + this.classId)
        .then(res => {
          let result = res.data.data
          this.checkCount.trainDays = result || 0
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 获取学员考勤统计
    getStudentCheckCountFun() {
      this.$http
        .get(this.$api.checksCountNow + this.tid + '/' + this.classId)
        .then(res => {
          let result = res.data.data
          if (result.length > 1) {
            this.checkCount.AttendanceDays = parseInt(result[0].checkCount + result[1].checkState) || 0
            this.checkCount.abnormalCount = result[1].checkCount || 0
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 班级详情
    goClassDetail(tid) {
      this.$router.push({ path: '/class/detail', query: { tid } })
    },
    // 获取学员详细信息
    getStudentInfo() {
      return this.axios
        .post(this.$api.getStudentInfo + this.$route.query.tid)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error(res.data.error.message)
            return Promise.reject(new Error(res.data.error.message))
          }
          this.studentInfo = res.data.data
          this.getPersonFile()

          return res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 获取学员就业推送信息
    getListData() {
      // 发送请求
      this.$http
        .post(this.$api.jobPushTop + this.classId)
        .then(res => {
          if (res.data.data) {
            this.listData = res.data.data
            console.log(this.listData)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 打开新增窗口清空数据
    initDataFun() {
      this.jobInfo = {
        companyAddress: '',
        companyName: '',
        fileUrls: '',
        getJobTime: '',
        getJobType: '',
        income: '',
        jobName: '',
        studentId: 0,
        studentIdcard: ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
.warp {
  width: 100%;
  min-height: 100%;
  background-color: #fff;
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
.mt-30 {
  // margin-top: 30px;
}
@mixin box {
  border-top: 1px solid #ccc;
  & > p:first-of-type {
    color: #000;
    font-weight: bold;
    letter-spacing: 5px;
  }
}
.photo {
  text-align: center;
}
@media screen and(min-width:1920px) {
}
@media screen and(min-width:1200px) and(max-width:1399px) {
}
.box1 {
  height: 300px;
  padding: 50px 0;
  > h {
    height: 100%;
  }
  > .left {
    margin-top: 15px;
    .img {
      width: 118px;
      height: 164px;
      background-color: #3399ff;
      margin: 0 auto;
    }
  }
  > .center {
    color: #868686;
    font-size: 13px;
    p {
      &:first-of-type {
        font-size: 18px;
      }
      line-height: 35px;
    }
    ul {
      margin-top: 5px;
      list-style: none;
      li {
        height: 30px;
        line-height: 45px;
        display: flex;
        span {
          flex: 1;
        }
      }
    }
  }
  > .right {
    text-align: center;
    position: relative;
    .preview {
      height: 140px;
      display: flex;
      div {
        width: 160px;
        height: 120px;
        background: url('../../assets/img/photo.png') no-repeat center center;
        flex: 1;
        border: 1px dashed #ccc;
        margin-right: 30px;
      }
    }
    .editBtn {
      position: absolute;
      right: -30px;
      top: -40px;
      font-size: 14px;
    }
  }
}
.box2 {
  overflow: auto;
  margin-top: 30px;
  padding: 18px 0 0px 24px !important;
  .box2_content {
    font-size: 13px;
    line-height: 65px;
  }
  p:last-child {
    padding-bottom: 35px;
  }
  p {
    height: 30px;
    display: flex;
    color: #868686;

    span {
      flex: 1;
    }
    .pxz {
      font-weight: bold;
      color: #00cc33;
    }
    .hg {
      font-weight: bold;
      color: #3d89fe;
    }
  }

  @include box;
}
.box3 {
  padding: 18px 0 0 24px !important;
  @include box;
  .item {
    width: 100%;
    height: 100%;
    padding: 30px;
    p {
      text-align: center;
      font-size: 13px;
      &:first-of-type {
        span {
          font-size: 30px;
          color: #3458c7;
        }
      }
    }
  }
}
.Algin {
  display: flex;
  flex-wrap: wrap;
}
.jobAddress-span {
  height: 30px;
  display: inline-block;
  margin-top: 10px;
}
.companyName-span {
  height: 30px;
}
.education {
  margin-top: 10px;
}
.box4 {
  @include box;
  height: 220px;
  padding: 18px 0 0 24px;
  overflow: auto;
  .classItem {
    margin-right: 50px;
    min-width: 260px;

    height: 133px;
    padding: 15px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 2px 2px 10px #ccc;
    color: #989898;
    cursor: pointer;
    display: flex;
    margin-top: 15px;
    .title {
      font-size: 18px;
      color: #3458c7;
    }
    > div:first-of-type {
      flex: 6;
      > span {
        font-size: 12px;
      }
      p {
        &:nth-of-type(2) {
          margin-top: 8px;
          font-size: 10px;
          color: #000;
          img {
            margin-right: 5px;
            vertical-align: middle;
            transform: translateY(-2px);
          }
        }
        &:nth-of-type(3) {
          font-size: 8px;
        }
        &:last-of-type {
          margin-top: 5px;
        }
      }
    }
    > div:last-of-type {
      flex: 4;
      text-align: center;
      p {
        text-align: right;
        &:first-of-type {
          font-size: 18px;
          color: #f5a623;
        }
        &:nth-of-type(2) {
          font-size: 14px;
        }
        /* &:nth-of-type(3){
           margin-top: 11px;
           font-size: 10px;
         }*/
        &:last-of-type {
          font-size: 10px;
          margin-top: 30px;
        }
      }
    }
  }
}
.box5 {
  @include box;
  height: 280px;
  font-size: 12px;
  position: relative;
  .box2_title {
    padding: 18px 0 0 24px;
  }
  .addBtn {
    position: absolute;
    right: 10px;
    top: 10px;
  }
  .editBtn {
    position: absolute;
    right: 60px;
    top: 10px;
  }
  .content {
    overflow: hidden;
    padding: 24px;
    color: #868686;
    p {
      display: flex;
      height: 20px;

      font-size: 13px;
      span {
        flex: 1;
        display: inline-block;
      }
    }
    p:nth-child(2) {
      line-height: 38px;
    }
    .preview {
      .item {
        float: left;
        margin-left: 60px;
        margin-top: 25px;
        background: url('../../assets/img/photo.png') no-repeat center center;
        width: 155px;
        height: 120px;
        border: 1px dashed #ccc;
        &:last-of-type {
          // overflow: hidden;
          background-color: #fff;
          background: none;
          border: none;
        }
      }
    }
  }
}
</style>
<style>
.el-upload--picture-card {
  width: 84px;
  height: 84px;
  line-height: 84px;
}
.el-upload-list--picture-card .el-upload-list__item {
  width: 84px;
  height: 84px;
}
</style>
