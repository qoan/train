<template>
  <div class>
    <div class="crumbs">
      <el-row style="border-bottom: 1px solid whitesmoke;padding:8px 20px">
        <el-col :span="18">
          <el-button :type="btnType1" round size="mini" @click="switchType(1)">系统消息</el-button>
          <el-button :type="btnType2" round size="mini" @click="switchType(2)">班级消息</el-button>
          <el-button :type="btnType3" round size="mini" @click="switchType(3)">预警消息</el-button>
        </el-col>
        <el-col :span="6">
          <el-button style="float:right" type="primary" size="mini">返回</el-button>
        </el-col>
      </el-row>
      <el-row style="padding:8px 20px">
        <el-col :span="24">
          <el-radio-group v-model="isCollapse">
            <el-radio-button :label="1">已读(1)</el-radio-button>
            <el-radio-button :label="2">未读(2)</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
    </div>
    <!-- <div class="container">
      <el-tabs v-model="message">
        <el-tab-pane :label="`未读消息(${unread.length})`" name="first">
          <el-table :data="unread" :show-header="false" style="width: 100%">
            <el-table-column>
              <template slot-scope="scope">
                <span class="message-title">{{scope.row.title}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="date" width="180"></el-table-column>
            <el-table-column width="120">
              <template slot-scope="scope">
                <el-button size="small" @click="handleRead(scope.$index)">标为已读</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="handle-row">
            <el-button type="primary">全部标为已读</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`已读消息(${read.length})`" name="second">
          <template v-if="message === 'second'">
            <el-table :data="read" :show-header="false" style="width: 100%">
              <el-table-column>
                <template slot-scope="scope">
                  <span class="message-title">{{scope.row.title}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="date" width="150"></el-table-column>
              <el-table-column width="120">
                <template slot-scope="scope">
                  <el-button type="danger" @click="handleDel(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="handle-row">
              <el-button type="danger">删除全部</el-button>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane :label="`回收站(${recycle.length})`" name="third">
          <template v-if="message === 'third'">
            <el-table :data="recycle" :show-header="false" style="width: 100%">
              <el-table-column>
                <template slot-scope="scope">
                  <span class="message-title">{{scope.row.title}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="date" width="150"></el-table-column>
              <el-table-column width="120">
                <template slot-scope="scope">
                  <el-button @click="handleRestore(scope.$index)">还原</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="handle-row">
              <el-button type="danger">清空回收站</el-button>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>-->
    <div class="container_Table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="主题与概要"></el-table-column>
        <el-table-column prop="date" label="发送时间"></el-table-column>
        <el-table-column prop="address" label="操作" align="center">
          <template>
            <el-button type="primary" size="mini">查看详情</el-button>
            <el-button type size="mini">忽略</el-button>
            <el-button type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        current-page="1"
        page-size="2"
        layout="prev, pager, next"
        :total="2"
        @current-change="changePagination"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tabs',
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      isCollapse: 1,
      btnType1: 'primary',
      btnType2: 'text',
      btnType3: 'text',
      message: 'first',
      showHeader: false,
      unread: [
        {
          date: '2018-04-19 20:00:00',
          title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
        },
        {
          date: '2018-04-19 21:00:00',
          title: '今晚12点整发大红包，先到先得'
        }
      ],
      read: [
        {
          date: '2018-04-19 20:00:00',
          title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
        }
      ],
      recycle: [
        {
          date: '2018-04-19 20:00:00',
          title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
        }
      ]
    }
  },
  methods: {
    handleRead(index) {
      const item = this.unread.splice(index, 1)
      console.log(item)
      this.read = item.concat(this.read)
    },
    handleDel(index) {
      const item = this.read.splice(index, 1)
      this.recycle = item.concat(this.recycle)
    },
    handleRestore(index) {
      const item = this.recycle.splice(index, 1)
      this.read = item.concat(this.read)
    },
    // 按钮切换
    switchType(n) {
      if (n === 1) {
        this.btnType1 = 'primary'
        this.btnType2 = 'text'
        this.btnType3 = 'text'
        this.earlyWarning = n
      } else if (n === 2) {
        this.btnType1 = 'text'
        this.btnType2 = 'primary'
        this.btnType3 = 'text'
        this.earlyWarning = n
      } else {
        this.btnType1 = 'text'
        this.btnType2 = 'text'
        this.btnType3 = 'primary'
        this.earlyWarning = n
      }
    },
    changePagination() {}
  },
  computed: {
    unreadNum() {
      return this.unread.length
    }
  }
}
</script>

<style lang="scss">
.crumbs {
  background: #fff;
  border-radius: 8px;
}
.container_Table {
  height: 700px;
  background: #fff;
  .el-pagination {
    position: absolute;
    bottom: 60px;
    left: 50%;
    margin-left: -150px;
  }
  .el-table {
    height: 580px;
  }
}
.message-title {
  cursor: pointer;
}
.handle-row {
  margin-top: 30px;
}
</style>
