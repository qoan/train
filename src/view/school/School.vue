<template>
  <div class="warp" id="warp">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" ref="searchFrom" :model="searchForm" class="searchFrom" size="mini">
          <el-row>
            <el-col :lg="7" :md="8" :sm="24">
              <el-form-item label="学校名称：" prop="schoolName">
                <el-select v-model="searchForm.schoolName" placeholder="请选择" @change="change">
                  <el-option
                    v-for="item in schoolNameArr"
                    :key="item.tid"
                    :label="item.schoolName"
                    :value="item.schoolName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="7" :md="8" :sm="24">
              <el-form-item label="学校类型：" prop="schoolTypeTid">
                <el-select v-model="searchForm.schoolTypeTid" placeholder="请选择">
                  <el-option
                    v-for="item in schoolTypeArr"
                    :key="item.tid"
                    :label="item.enumerValue"
                    :value="item.tid"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :lg="7" :md="8" :sm="24">
              <el-form-item label="主管部门：" prop="agenceTid">
                <el-select v-model="searchForm.agenceTid" placeholder="请选择">
                  <el-option
                    v-for="item in departmentArr"
                    :key="item.tid"
                    :label="item.agenceName"
                    :value="item.tid"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>-->
            <el-col :lg="4">
              <el-form-item style="float: right">
                <el-button type="primary" @click="getList">查 询</el-button>
                <el-button @click="$refs.searchFrom.resetFields();pageIndex=1;getList()">重 置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="m-10" style="padding: 0 40px;" v-loading="loading">
      <img v-if="len===0" src="@/assets/img/no.png" class="Img" />
      <el-col v-else :span="s" v-for="(item, index) in listData" :key="index">
        <div class="classItem" @click="goDetail(item.tid)">
          <div class="left">
            <p class="title">{{item.schoolName}}</p>
            <span class="address">
              <img
                src="../../assets/img/icon/icon-map.png"
                style="margin-right: 6px"
                width="10"
                height="12"
                alt
              />
              {{item.schoolAddress}}
            </span>
            <br />
            <span style="font-size: 10px">
              <img
                src="../../assets/img/icon/icon-link.png"
                style="margin-right: 6px"
                width="10"
                height="12"
                alt
              />
              {{item.agenceName}}
            </span>
            <p>
              正在开班:
              <b>{{item.countOnClass}}</b> 个
            </p>
          </div>
          <div class="right">
            <el-tag size="small" class="tag" :color="item.color">{{item.schoolType}}</el-tag>
            <p style="margin-top:53px;margin-left:-10px">
              培训学员:
              <b>{{item.countClassStudent||0}}</b> 人次
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-pagination
      v-if="active"
      background
      layout="prev, pager, next"
      :total="total"
      style="position: absolute;bottom: 80px;left: 50%;transform: translateX(-50%);"
      @current-change="changePage"
      :page-size="pageSize"
    ></el-pagination>
  </div>
</template>

<script>
// import schoolName from '../../components/select/SchoolName'
export default {
  name: 'school',
  // components: {
  //   schoolName
  // },
  data() {
    return {
      schoolNameArr: [],
      loading: false,
      len: 0,
      active: false,
      searchForm: {
        schoolName: '', // 学校名称
        schoolTypeTid: '', // 学校类型ID
        agenceTid: '' // 主管部门ID
      },
      pageIndex: 1,
      pageSize: 16,
      total: 1, // 总页数
      listData: [], // list数组
      dialogFormVisible: false,
      schoolTypeArr: [], // 下拉选项-学校类型
      departmentArr: [], // 下拉选项-主管部门
      school: [
        {
          value: '选项1',
          label: '学校1'
        },
        {
          value: '选项2',
          label: '学校2'
        }
      ],
      s: 6 // 设置item栅格份数
    }
  },
  mounted() {
    this.getList()
    this.getSchoolType()
    this.getDepartment()
    this.getSchoolNameArr()
  },
  methods: {
    goDetail(tid) {
      this.$router.push({ path: '/school/detail', query: { tid } })
    },
    // 获取分页列表
    getList() {
      this.loading = true
      // 参数准备
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        paramObj: {
          schoolName: this.searchForm.schoolName,
          schoolTypeTid: this.searchForm.schoolTypeTid,
          agenceTid: this.searchForm.agenceTid,
          schoolStatus: 0
        }
      }
      // 发送请求
      this.$http
        .post(this.$api.selectPage, params)
        .then(res => {
          const _that = this
          _that.listData = []
          const result = res.data.data
          this.len = result.length
          if (this.len === 0) {
            this.active = false
          } else {
            this.active = true
          }
          result.forEach(function(item, index) {
            switch (item.schoolType) {
              case '民办职业培训机构':
                item.color = '#CDA164'
                _that.listData.push(item)
                break
              case '高技能人才基地':
                item.color = '#EF843C'
                _that.listData.push(item)
                break
              case '职业院校':
                item.color = '#69B5FF'
                _that.listData.push(item)
                break
              case '技工院校':
                item.color = '#62CB86'
                _that.listData.push(item)
                break
              case '企业培训机构':
                item.color = '#9362CD'
                _that.listData.push(item)
                break
              case '其他':
                item.color = '#62CB86'
                _that.listData.push(item)
                break
              default:
                // this.listData.push(item)
                break
            }
          })
          _that.total = res.data.paging.total
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
      this.getList()
    },
    // 获取学校
    getSchoolNameArr() {
      this.$http
        .get(this.$api.selectSchoolEnum)
        .then(res => {
          this.schoolNameArr = res.data.data
          this.schoolNameArr.unshift({
            schoolName: '请选择',
            tid: 0
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 将选择的值传出去
    change(name) {
      let str = name === '请选择' ? '' : name
      this.$emit('setSchoolName', str)
    },
    // 获取学校类型
    getSchoolType() {
      // 发送请求
      this.$http
        .get(this.$api.selectOption + 'school_type')
        .then(res => {
          this.schoolTypeArr = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取学校主管部门
    getDepartment() {
      // 发送请求
      this.$http
        .get(this.$api.getAgenceList)
        .then(res => {
          this.departmentArr = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  computed: {
    contentWidth() {
      return this.$store.state.contentWidth
    },
    contentHeight() {
      return this.$store.state.contentHeight
    }
  },
  watch: {
    contentWidth: {
      deep: true,
      handler(val, oldVal) {
        if (val > 1800) {
          this.s = 6
        } else {
          this.s = 6
        }
      }
    }
  }
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
.warp {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.Img {
  margin-top: 100px;
  color: #909399;
  width: 200px;
  height: 200px;
  transform: translateX(-100px);
  margin-left: 50%;
  margin-bottom: 100px;
}
.searchFrom {
  height: 25px;
  /*background-color: #fff;*/
  border-radius: 5px;
  margin: 10px;
  padding: 20px 20px 40px 30px;
}
.address {
  height: 30px;
  display: inline-block;
}
.el-col-lg-7 {
  width: 27.17% !important;
}

@media screen and(min-width:1200px) and(max-width:1399px) {
  .classItem {
    width: 215px !important;
  }
  .el-col-lg-4 {
    float: right;
    margin-top: -47px;
  }
  .el-col-lg-7 {
    width: 29% !important;
  }
}
@media screen and(min-width:1400px) and(max-width:1600px) {
  .classItem {
    width: 220px !important;
  }
  .el-col-lg-7 {
    width: 29% !important;
  }
  .el-col-lg-4 {
    float: right;
    margin-top: -47px;
  }
}
.classItem:hover {
  box-shadow: 0px 0px 10px #dcdcdc;
}
.classItem {
  width: 260px;
  height: 110px;
  padding: 15px;
  background-color: #fff;
  border-radius: 5px;
  /*box-shadow: 2px 2px 10px #ccc;*/
  color: #989898;
  cursor: pointer;
  display: flex;
  margin: 10px;
  .title {
    font-size: 14px;
    color: #3458c7;
    margin-bottom: 7px;
  }
  > div:first-of-type {
    flex: 6;
    > span {
      font-size: 12px;
    }
    > p:last-of-type {
      font-size: 10px;
      margin-top: 14px;
      > b {
        color: #666;
        font-size: 20px;
      }
    }
  }
  > div:last-of-type {
    flex: 4;
    text-align: center;
    > p:first-of-type {
      font-size: 10px;
    }
    > p:last-of-type {
      font-size: 10px;
      margin-top: 50px;
      > b {
        color: #666;
        font-size: 20px;
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
</style>
