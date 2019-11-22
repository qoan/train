<template>
  <div class="warp">
    <el-row style="height: 100%">
      <el-col :span="18" style="height: 100%">
        <div class="l-top">
          <p>
            <i class="iconfont icon-post"></i>
            {{addJob.jobName}}
          </p>
          <p>{{addJob.jobIncome}}</p>
          <p>学历：{{addJob.education}} | 性别：{{addJob.sexRequire}}</p>
          <p>{{addAreaObj.fullName + addJob.jobAddress}}</p>
          <el-button type="primary" class="editBtn" @click="editPostDialog = true">编 辑</el-button>
        </div>
        <div class="l-center">
          <p>岗位职责</p>
          <!--{{addJob.jobDescription}}-->
          <p v-for="(item, index) in dutyArr" :key="index">{{item}}</p>
        </div>
        <div class="l-bottom">
          <p>任职资格</p>
          <!--{{addJob.jobRequire}}-->
          <p v-for="(item, index) in qualifications" :key="index">{{item}}</p>
        </div>
      </el-col>
      <el-col :span="6" style="height: 100%;padding: 40px 24px">
        <div class="r-top">
          <p>推荐统计</p>
          <div>
            <p>已推荐班级</p>
            <p>
              <span>{{statisticsClazz}}</span> 个
            </p>
          </div>
          <div>
            <p>已推荐学员</p>
            <p>
              <span>{{statisticsPerson}}</span> 人
            </p>
          </div>
        </div>
        <div class="r-bottom" style="position: relative">
          <p>岗位推荐列表</p>
          <Scroll :tid="parseInt(tid)" :Refresh="Refresh"></Scroll>
          <el-button
            type="primary"
            @click="jobDialog = true"
            style="position: absolute; bottom: 30px;left: 50%;transform: translateX(-50%)"
          >立即推荐</el-button>
        </div>
      </el-col>
    </el-row>

    <!--编辑岗位弹窗-->
    <el-dialog title="编辑岗位" :visible.sync="editPostDialog">
      <hr style="margin-bottom: 20px; opacity: .2;" />
      <el-form :inline="true" :model="addJob" :rules="rules" ref="ruleForm">
        <h3 style="margin-bottom: 20px;">基础信息</h3>
        <el-form-item label="就业岗位：" class="w45" prop="jobName">
          <el-input type="text" v-model="addJob.jobName" class="w108"></el-input>
        </el-form-item>
        <el-form-item label="学历要求：" prop="educationTid">
          <el-select placeholder="请选择" v-model="addJob.educationTid">
            <el-option
              v-for="item in educationArr"
              :key="item.tid"
              :label="item.enumerValue"
              :value="item.tid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司名称：" class="w45" prop="companyName">
          <el-input type="text" v-model="addJob.companyName" class="w108"></el-input>
        </el-form-item>
        <el-form-item label="性别要求：" prop="sexRequire">
          <el-select placeholder="请选择" v-model="addJob.sexRequire">
            <el-option
              v-for="item in sexArr"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="薪资选择：" class="w45" prop="jobIncome" label-width="90px">
          <el-select placeholder="请选择" v-model="addJob.jobIncome">
            <el-option
              v-for="item in incomeArr"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="招聘人数：" prop="jobHiring">
          <el-select placeholder="请选择" v-model="addJob.jobHiring">
            <el-option
              v-for="item in personArr"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="就业地区：" class="w45" prop="fullName" label-width="90px">
          <el-input
            placeholder="请选择地址"
            class="w108"
            v-model="addAreaObj.fullName"
            @focus="$refs.areaAddress.visible=true"
          ></el-input>
          <tab-area-select ref="areaAddress" :areaData="addAreaObj"></tab-area-select>
        </el-form-item>
        <el-form-item label="详细地址：" prop="jobAddress" label-width="90px">
          <el-input type="text" v-model="addJob.jobAddress" class="w108"></el-input>
        </el-form-item>
        <h3 style="margin-bottom: 20px;">岗位职责</h3>
        <el-form-item prop="jobDescription">
          <el-input
            size="medium"
            v-model="addJob.jobDescription"
            style="width: 700px;"
            type="textarea"
            placeholder="请输入岗位职责"
          ></el-input>
        </el-form-item>
        <h3 style="margin-bottom: 20px;">任职资格</h3>
        <el-form-item prop="jobRequire">
          <el-input
            size="medium"
            v-model="addJob.jobRequire"
            style="width: 700px;"
            type="textarea"
            placeholder="请输入任职资格"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="NewPostDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
      </div>
    </el-dialog>

    <!--推送弹窗-->
    <el-dialog title="岗位推荐" :visible.sync="jobDialog" width="400px" height="600px">
      <hr style="margin-top: -30px; margin-bottom: 20px; opacity: .2;" />
      <el-form>
        <el-form-item label="请选择班级: ">
          <el-select v-model="classIdArr" multiple placeholder="请选择">
            <el-option
              v-for="item in classArr"
              :key="item.tid"
              :label="item.className"
              :value="item.tid"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <p>注：当您选择完班级后，该岗位信息将会推送给班级内的所有学员，若该学员已接受本条推送，本次推送将不会记录</p>
      <el-button
        type="primary"
        style="margin-left: 50%;transform: translateX(-50%);margin-top: 20px"
        @click="pushLogs"
      >提交</el-button>
    </el-dialog>
  </div>
</template>

<script>
import Scroll from './Scroll'
import TabAreaSelect from '@/components/select/TabAreaSelect'
export default {
  components: {
    Scroll,
    TabAreaSelect
  },
  data() {
    return {
      Refresh: false, // 是否刷新滚动列表
      statisticsPerson: 0, // 推荐人数
      statisticsClazz: 0, // 推荐班级数
      tid: 0,
      dutyArr: [], // 岗位职责
      qualifications: [], // 任职资格
      editPostDialog: false,
      jobDialog: false,
      status: false,
      btnType1: 'text',
      btnType2: 'primary',
      classIdArr: [], // 推荐的班级ID
      // 学历
      educationArr: [
        {
          tid: 0,
          enumerValue: '请选择'
        }
      ],
      // 岗位收入
      incomeArr: [
        {
          label: '2000~3000'
        },
        {
          label: '3000~4000'
        },
        {
          label: '4000~5000'
        },
        {
          label: '6000~7000'
        },
        {
          label: '8000~9000'
        },
        {
          label: '10000以上'
        }
      ],
      sexArr: [
        {
          label: '男'
        },
        {
          label: '女'
        },
        {
          label: '不限'
        }
      ],
      personArr: [
        {
          label: '1-10人'
        },
        {
          label: '11-20人'
        },
        {
          label: '21-30人'
        },
        {
          label: '31-40人'
        },
        {
          label: '41-50人'
        }
      ],
      // 地址选择
      addAreaObj: {
        province: '',
        city: '',
        county: '',
        district: '',
        village: '',
        fullName: ''
      },
      addJob: {
        companyName: '',
        educationTid: '',
        jobAddress: '',
        jobAreaCode: '',
        jobDescription: '',
        jobHiring: '',
        jobIncome: '',
        jobName: '',
        jobRequire: '',
        sexRequire: '',
        tid: 0
      },
      // 班级列表
      classArr: [],
      rules: {
        jobName: [{ required: true, message: '必填', trigger: 'blur' }, { min: 1, max: 20, message: '最多输入20个字', trigger: 'blur' }],
        educationTid: [{ required: true, message: '必填', trigger: 'blur' }],
        companyName: [{ required: true, message: '必填', trigger: 'blur' }, { min: 1, max: 20, message: '最多输入20个字', trigger: 'blur' }],
        sexRequire: [{ required: true, message: '必填', trigger: 'blur' }],
        jobHiring: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.tid = this.$route.query.tid
    this.getDetails()
    this.getSelectEducation()
    this.getClassList()
    // 统计人数和班级数
    this.getStatisticsPerson(this.tid)
    this.getStatisticsClaZZ(this.tid)
  },
  methods: {
    // 推送信息
    pushLogs() {
      if (this.classIdArr.length <= 0) {
        this.$message.warning('请先选择班级！')
        return
      }

      let params = {
        clazzTidList: this.classIdArr,
        jobTid: this.tid
      }

      this.$http
        .post(this.$api.queryJobPush, params)
        .then(res => {
          this.$message.success('推荐成功！')
          this.classIdArr = []
          this.jobDialog = false
          this.getClassList()
          // 推送成功刷新统计人数和班级数
          this.getStatisticsPerson(this.tid)
          this.getStatisticsClaZZ(this.tid)
          // 刷新滚动列表
          this.Refresh = true
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 获取推荐统计人数
    getStatisticsPerson(tid) {
      this.$http
        .post(this.$api.getStudent + tid)
        .then(res => {
          this.statisticsPerson = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 获取推荐统计班级数
    getStatisticsClaZZ(tid) {
      this.$http
        .post(this.$api.getClazz + tid)
        .then(res => {
          this.statisticsClazz = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 获取推荐的班级列表
    getClassList() {
      this.$http
        .post(this.$api.selectClazzThisJobNotPush + '?jobTid=' + this.tid)
        .then(res => {
          this.classArr = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 获取详情
    getDetails() {
      this.$http
        .get(this.$api.getByTid + this.tid)
        .then(res => {
          this.addJob = res.data.data
          this.dutyArr = this.addJob.jobDescription.split(/[\s\n]/)
          this.qualifications = this.addJob.jobRequire.split(/[\s\n]/)

          // 获取地区全称
          this.getAreaFullName(this.addJob.jobAreaCode)
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 根据code查询地区全称
    getAreaFullName(code) {
      this.$http
        .get(this.$api.area + code)
        .then(res => {
          this.addAreaObj.fullName = res.data.data.areaFullname
          // 处理详细地址避免冗余
          let len = this.addAreaObj.fullName.length
          this.addJob.jobAddress = this.addJob.jobAddress.substr(len)
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 获取学历选择
    getSelectEducation() {
      this.$http
        .get(this.$api.selectOption + 'student_education')
        .then(res => {
          this.educationArr = res.data.data
          this.educationArr.unshift({
            tid: 0,
            enumerValue: '请选择'
          })
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 保存岗位信息
    savaJobInfo() {
      // 参数处理
      if (this.addAreaObj.village) {
        this.addJob.jobAreaCode = this.addAreaObj.village.areaCode
      } else if (this.addAreaObj.district) {
        this.addJob.jobAreaCode = this.addAreaObj.district.areaCode
      } else if (this.addAreaObj.county) {
        this.addJob.jobAreaCode = this.addAreaObj.county.areaCode
      } else if (this.addAreaObj.city) {
        this.addJob.jobAreaCode = this.addAreaObj.city.areaCode
      } else if (this.addAreaObj.province) {
        this.addJob.jobAreaCode = this.addAreaObj.province.areaCode
      }

      this.addJob.tid = this.tid

      // 发送请求
      this.$http
        .post(this.$api.updateJob, this.addJob)
        .then(res => {
          this.$message.success('保存成功')
          // 关闭弹窗
          this.editPostDialog = false
          // 刷新详情
          this.getDetails()
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 表单验证通过在提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 调用保存接口
          this.savaJobInfo()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.warp {
  width: 100%;
  height: 100%;
}
.w45 {
  width: 45%;
}
.w108 {
  width: 108%;
}
.l-top,
.l-center,
.l-bottom {
  padding: 30px;
  p:first-of-type {
    font-weight: bold;
    margin-bottom: 10px;
  }
  p {
    line-height: 25px;
    font-size: 14px;
  }
}
.l-top {
  position: relative;
  p {
    margin-top: 10px;
    font-size: 12px;
    &:first-of-type {
      font-size: 20px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.7);
      i {
        color: #3458c7;
      }
    }
    &:nth-of-type(2) {
      color: #f5a623;
      font-size: 16px;
      font-weight: bold;
    }
  }
  .editBtn {
    position: absolute;
    right: 150px;
    top: 100px;
  }
}
.r-top {
  height: 40%;
  > p {
    font-size: 14px;
  }
  > div {
    height: 52px;
    margin-top: 20px;
    border: 1px solid rgba(52, 88, 199, 0.2);
    padding: 10px 20px;
    background: url('../../assets/img/tj.png') no-repeat 90% center;
    p {
      font-size: 10px;
      color: #7a7b7e;
      margin-top: 5px;
      span {
        font-size: 18px;
        color: #000;
      }
    }
  }
}
.r-bottom {
  height: 60%;
}
</style>
