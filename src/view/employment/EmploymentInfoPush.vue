<template>
  <div class="warp" id="warp">
    <el-row>
      <el-col>
        <el-form :inline="true" class="demo-form-inline searchFrom">
          <el-row>
            <el-col :lg="7" :md="12" :sm="24">
              <el-form-item label="岗位名称：">
                <el-input placeholder="请输入岗位名称" v-model="searchForm.jobName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12" :sm="24">
              <el-form-item label="学历选择：">
                <el-select v-model="searchForm.educationTid" placeholder="请选择">
                  <el-option
                    v-for="item in educationArr"
                    :key="item.tid"
                    :label="item.enumerValue"
                    :value="item.tid"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12" :sm="24">
              <el-form-item label="岗位收入：">
                <el-select v-model="searchForm.jobIncome" placeholder="请选择">
                  <el-option
                    v-for="item in incomeArr"
                    :key="item.label"
                    :label="item.label"
                    :value="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <!-- <el-col :lg="8" :md="12" :sm="24">
              <el-form-item label="地区选择：">
                <el-input
                  class="w108"
                  placeholder="请选择地址"
                  v-model="areaObj.fullName"
                  @focus="$refs.areaAddress.visible=true"
                ></el-input>
                <tab-area-select ref="areaAddress" :areaData="areaObj"></tab-area-select>
              </el-form-item>
            </el-col>-->
            <el-col :lg="1" :md="12" :sm="24">
              <el-form-item>
                <el-button type="primary" @click="getListData">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row style="margin-top: -20px;margin-left:25px">
      <el-button type="primary" @click="NewPostDialog = true">新建岗位</el-button>
      <!-- <el-button type="primary" @click="importDialog = true">批量导入</el-button>-->
      <!--<el-button type="primary" @click="postPushDialog = true">岗位推送记录</el-button>-->
    </el-row>

    <el-row :gutter="10" class="m-10" v-loading="loading">
      <img v-if="len===0" src="../../assets/img/no.png" class="Img" alt />
      <el-col v-else v-for="(item, index) in listData" :key="index" :sm="6" :md="8" :lg="6">
        <div class="classItem" @click="goDetail(item.tid)">
          <div class="left">
            <p class="title">{{item.jobName}}</p>
            <span class="address">{{item.jobAddress}}</span>
            <p class="companyName">
              <img src="../../assets/img/icon/icon-qi.png" alt style="width:12px;height:12px" />
              {{item.companyName}}
            </p>
            <p class="jobHiring">招聘人数 | {{item.jobHiring}}</p>
          </div>
          <div class="right">
            <p class="price">{{item.jobIncome}}</p>
            <p class="eaction">{{item.education}}</p>
            <p class="createTime">{{item.createTime}}</p>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-pagination
      v-if="active"
      background
      layout="prev, pager, next"
      :total="total"
      style="position: absolute;left: 50%;bottom: 15px;margin-left:-100px"
      @current-change="changePage"
    ></el-pagination>

    <!--新建岗位弹窗-->
    <el-dialog title="新建岗位" :visible.sync="NewPostDialog">
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
        <el-form-item label="薪资选择：" class="w45" prop="jobIncome">
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
        <el-form-item label="就业地区：" class="w45" prop="addAreaObj.fullName">
          <el-input
            placeholder="请选择地址"
            class="w108"
            v-model="addAreaObj.fullName"
            @focus="$refs.areaAddress.visible=true"
          ></el-input>
          <tab-area-select ref="areaAddress" :areaData="addAreaObj"></tab-area-select>
        </el-form-item>
        <el-form-item label="详细地址：" prop="jobAddress">
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

    <!--岗位推送记录弹窗-->
    <el-dialog title="岗位推送记录" :visible.sync="postPushDialog">
      <el-table :data="pushLogArr" style="height: 400px">
        <el-table-column property="jobName" label="推荐岗位名称" width="200"></el-table-column>
        <el-table-column property="clazzName" label="推荐班级" width="200"></el-table-column>
        <el-table-column property="createTime" label="推荐时间"></el-table-column>
        <el-table-column property="userName" label="推荐人"></el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="log_total"
        :page-size="pageSize"
        style="margin-top: 30px;margin-left: 50%;transform: translateX(-25%);"
        @current-change="logChangePage"
      ></el-pagination>
    </el-dialog>

    <!--批量导入弹窗-->
    <el-dialog title="岗位批量导入" :visible.sync="importDialog" width="30%">
      <el-upload
        style="margin-top: -20px"
        size="mini"
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :file-list="fileList"
      >
        <el-button size="small" type="primary">点击导入岗位</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xls、xlsx文件</div>
      </el-upload>
      <p style="margin-top: 30px">注:若您需要一次导入多个岗位,请下载模版后再进行岗位导入</p>
      <el-button type="primary">下载模板</el-button>
    </el-dialog>
  </div>
</template>

<script>
import TabAreaSelect from '@/components/select/TabAreaSelect'
export default {
  components: {
    TabAreaSelect
  },
  data() {
    return {
      len: 0,
      active: false,
      loading: false,
      pageIndex: 1,
      pageSize: 12,
      total: 0, // 总条数
      log_pageIndex: 1,
      log_pageSize: 12,
      log_total: 0, // 总条数
      addressFullName: '', // 搜索地址名称
      searchForm: {
        educationTid: 0,
        jobAreaCode: '',
        jobIncome: '',
        jobName: ''
      },
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
          label: '3001~4000'
        },
        {
          label: '4001~5000'
        },
        {
          label: '5001~6000'
        },
        {
          label: '6001~7000'
        },
        {
          label: '7001~8000'
        },
        {
          label: '8001~9000'
        },
        {
          label: '1001~10000'
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
      areaObj: {
        province: '',
        city: '',
        county: '',
        district: '',
        village: '',
        fullName: ''
      },
      addAreaObj: {
        province: '520000000000',
        city: '520100000000',
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
        sexRequire: ''
      },
      listData: [], // list数组
      pushLogArr: [],
      NewPostDialog: false,
      postPushDialog: false,
      importDialog: false,
      fileList: [
        {
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        },
        {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }
      ],
      s: 6, // 设置item栅格份数
      // 表单验证规则
      rules: {
        jobName: [{ required: true, message: '必填', trigger: 'blur' }, { min: 1, max: 20, message: '最多输入20个字', trigger: 'blur' }],
        educationTid: [{ required: true, message: '必填', trigger: 'blur' }],
        companyName: [{ required: true, message: '必填', trigger: 'blur' }, { min: 1, max: 20, message: '最多输入20个字', trigger: 'blur' }],
        sexRequire: [{ required: true, message: '必填', trigger: 'blur' }],
        jobHiring: [{ required: true, message: '必填', trigger: 'blur' }],
        jobIncome: [{ required: true, message: '必填', trigger: 'blur' }],
        fullName: [{ required: true, message: '必填', trigger: 'blur' }],
        jobAddress: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getSelectEducation()
    this.getListData()
    this.getPushLogs()
  },
  methods: {
    // 获取推送记录
    getPushLogs() {
      let params = {
        log_pageIndex: this.log_pageIndex,
        log_pageSize: this.log_pageSize,
        paramObj: {
          jobTid: 0 // 根据账号获取的
        }
      }

      // 发送请求
      this.$http
        .post(this.$api.queryJobPushListByJobTid, params)
        .then(res => {
          this.pushLogArr = res.data.data
          this.log_total = res.data.paging.total
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 记录分页事件
    logChangePage(page) {
      this.log_pageIndex = page
      this.getPushLogs()
    },

    // 获取分页列表
    getListData() {
      this.loading = true
      // 参数准备
      if (this.areaObj.village) {
        this.searchForm.jobAreaCode = this.areaObj.village.areaCode
      } else if (this.areaObj.district) {
        this.searchForm.jobAreaCode = this.areaObj.district.areaCode
      } else if (this.areaObj.county) {
        this.searchForm.jobAreaCode = this.areaObj.county.areaCode
      } else if (this.areaObj.city) {
        this.searchForm.jobAreaCode = this.areaObj.city.areaCode
      } else if (this.areaObj.province) {
        this.searchForm.jobAreaCode = this.areaObj.province.areaCode
      } else {
        this.searchForm.jobAreaCode = ''
      }

      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        paramObj: this.searchForm
      }

      // 发送请求
      this.$http
        .post(this.$api.pageJob, params)
        .then(res => {
          this.listData = res.data.data

          this.total = res.data.paging.total
          this.len = res.data.data.length
          if (this.len === 0) {
            this.active = false
          } else {
            this.active = true
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 分页事件
    changePage(page) {
      this.pageIndex = page
      this.getListData()
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
    // 导入事件
    handleClose() {},
    handlePreview() {},
    handleRemove() {},
    beforeRemove() {},
    handleExceed() {},
    goDetail(tid) {
      this.$router.push({ path: '/employment/detail', query: { tid } })
    },

    // 新增岗位信息
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
      } else {
        this.addJob.jobAreaCode = ''
      }

      // 发送请求
      this.$http
        .post(this.$api.saveJob, this.addJob)
        .then(res => {
          if (res.data.result !== 'ok') {
            this.$message.error('保存失败')
            return
          }

          this.$message.success('保存成功')

          // 刷新列表
          this.getListData()
          // 关闭弹窗
          this.NewPostDialog = false
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
  // computed: {
  //   contentWidth() {
  //     return this.$store.state.contentWidth
  //   },
  //   contentHeight() {
  //     return this.$store.state.contentHeight
  //   }
  // },
  // watch: {
  //   contentWidth: {
  //     deep: true,
  //     handler(val, oldVal) {
  //       if (val > 1800) {
  //         this.s = 6
  //       } else {
  //         this.s = 6
  //       }
  //     }
  //   }
  // }
}
</script>

<style scoped lang="scss">
.pl-10 {
  padding-left: 10px;
}
.m-10 {
  margin: 10px;
  padding: 10px;
}
.mt-10 {
  margin-top: 10px;
}
.p-10 {
  padding: 10px;
}
.w45 {
  width: 45%;
}
.w108 {
  width: 108%;
}
.warp {
  width: 100%;
  height: 100%;
}
.searchFrom {
  height: 65px;
  /*background-color: #fff;*/
  border-radius: 5px;
  margin: 10px;
  padding: 15px;
}
.Img {
  margin-top: 150px;
  color: #909399;
  width: 200px;
  height: 200px;
  transform: translateX(-100px);
  margin-left: 50%;
  margin-bottom: 100px;
}
.price {
  padding-top: 10px;
}
.createTime {
  padding-top: 20px;
}
@media screen and(min-width: 1200px) and(max-width: 1399px) {
  .m-10 {
    height: 300px !important;
    overflow: auto;
    .classItem {
      width: 220px !important;
      margin-top: 15px !important;
      .title {
        font-size: 16px !important;
      }
      .price {
        font-size: 16px !important;
      }
    }
  }
}
@media screen and(min-width: 1400px) and(max-width: 1439px) {
  .m-10 {
    height: 570px !important;
    overflow: auto;
    .classItem {
      width: 220px !important;
      margin-top: 15px !important;
      .title {
        font-size: 16px !important;
      }
      .price {
        font-size: 16px !important;
      }
    }
  }
}
@media screen and(min-width: 1440px) and(max-width: 1600px) {
  .m-10 {
    height: 450px !important;
    overflow: auto;
    .classItem {
      width: 220px !important;
      margin-top: 15px !important;
      .title {
        font-size: 16px !important;
      }
      .price {
        font-size: 16px !important;
      }
    }
  }
}
.classItem:hover {
  box-shadow: 0px 0px 10px #dcdcdc;
}
.classItem {
  width: 346px;
  height: 133px;
  padding: 15px;
  background-color: #fff;
  border-radius: 5px;
  /*box-shadow: 2px 2px 10px #ccc;*/
  color: #989898;
  cursor: pointer;
  display: flex;
  margin-top: 30px;
  margin-left: 15px;
  .title {
    font-size: 16px;
    color: #3458c7;
    padding-top: 10px;
  }
  .address {
    display: inline-block;
    height: 30px !important;
    margin-top: 8px;
    font-size: 12px;
  }
  .companyName {
    font-size: 14px !important;
  }
  .jobHiring {
    margin-top: 10px !important;
  }
  .eaction {
    margin-top: 10px;
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
.el-tag {
  color: #fff;
}
.el-table--border::after,
.el-table--group::after,
.el-table::before {
  content: '';
  position: absolute;
  background-color: #fff;
  z-index: 1;
}
el-pagination {
  padding-bottom: 30px !important;
}
</style>
