/* tab页地址选择器
 * 1. 实现多级地址选择(最多5级)
 * 2. 支持回显和到选
 * 3. 支持多级默认地址
 */

/* fix bug记录
 * 1. 解决不支持传入默认地址 - 给地址标签绑定对应的code, 筛选和默认传入地址相同的标签，并手动触发click事件
 * 2. 修复最后一级地址无限拼接的问题
 * 3. 修复地址提示过长挤压确认按钮问题
 * 4. 修复选到最后一级自动关闭
 * 5. 添加加载动画
 * 6. 支持多级设置默认选中值 - 回显功能
 * 7. 添加lastLevel来表示最后一级显示的地址
 * 8. 修复选择完成后重新进入页面总是在下一级页面tab - 切换tab动作应放在有下一级页面逻辑下，不能提早切换
 */

<template>
  <el-popover @show="show" placement="bottom" trigger="manual" v-model="visible">
    <i class="el-icon-close close-icon" @click="visible=false;"></i>
    <el-tabs v-model="activeName" @tab-click="handleClick" ref="$tabs" v-loading="loading">
      <!-- 不复用，因为不好控制样式，条目宽度不一致 --->
      <el-tab-pane label="省" v-if="'province' in areaData" name="province">
        <el-row :gutter="20">
          <el-col :span="6" v-for="(item, index) in areaList.provinceList" :key="index">
            <p
              @click="areaData.province=item"
              :data-code="item.areaCode"
              ref="$provinceItems"
            >{{item | getAreaDataType}}</p>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="市" v-if="'city' in areaData" name="city">
        <el-row :gutter="20">
          <el-col :span="6" v-for="(item, index) in areaList.cityList" :key="index">
            <p
              @click="areaData.city=item"
              :data-code="item.areaCode"
              ref="$cityItems"
            >{{item | getAreaDataType}}</p>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="区/县" v-if="'county' in areaData" name="county">
        <el-row :gutter="20">
          <el-col :span="8" v-for="(item, index) in areaList.countyList" :key="index">
            <p
              @click="areaData.county=item"
              :data-code="item.areaCode"
              ref="$countyItems"
            >{{item | getAreaDataType}}</p>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="乡" v-if="'district' in areaData" name="district">
        <el-row :gutter="20">
          <el-col :span="12" v-for="(item, index) in areaList.districtList" :key="index">
            <p
              @click="areaData.district=item"
              :data-code="item.areaCode"
              ref="$districtItems"
            >{{item | getAreaDataType}}</p>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="村" v-if="'village' in areaData" name="village">
        <el-row :gutter="20">
          <el-col :span="12" v-for="(item, index) in areaList.villageList" :key="index">
            <p
              @click="areaData.village=item"
              :data-code="item.areaCode"
              ref="$villageItems"
            >{{item | getAreaDataType}}</p>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <div class="footer">
      <p class="prompt">当前选择：{{areaData.fullName}}</p>
      <el-button type="text" @click="visible=false;">确 认</el-button>
    </div>
  </el-popover>
</template>
<script>
const ALL_PROVICE_CODE = "000000000000";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      activeName: "province",
      bakData: {}, // 备份数据，用于重置
      areaList: {
        provinceList: [],
        cityList: [],
        countyList: [],
        districtList: [],
        villageList: []
      }
    };
  },
  props: {
    areaData: {
      type: Object,
      default: () => {
        return {
          province: "",
          city: "",
          county: "",
          district: "",
          village: "",
          fullName: "",
          lastLevel: "" // 最后一级
        };
      }
    }
  },
  mounted() {
    this.bakData = Object.assign({}, this.areaData); // 不能直接赋值
  },
  filters: {
    /* 过滤一些不规则数据，可能影响UI展示 */
    getAreaDataType(val) {
      if (val.areaCode === "150000000000") {
        return "内蒙省";
      }
      if (val.areaCode === "450000000000") {
        return "广西省";
      }
      if (val.areaCode === "540000000000") {
        return "西藏省";
      }
      if (val.areaCode === "640000000000") {
        return "宁夏省";
      }
      if (val.areaCode === "650000000000") {
        return "新疆省";
      }
      if (val.areaCode === "522300000000") {
        return "黔西南";
      }
      if (val.areaCode === "522600000000") {
        return "黔东南";
      }
      if (val.areaCode === "522700000000") {
        return "黔南";
      }
      return val.areaName;
    },
    /* 每级对应显示的标题 */
    getLableType(val) {
      if (val === "province") {
        return "省";
      }
      if (val === "city") {
        return "市";
      }
      if (val === "county") {
        return "区/县";
      }
      if (val === "district") {
        return "乡";
      }
      if (val === "village") {
        return "村";
      }
      return "";
    }
  },
  watch: {
    "areaData.province": {
      // 监听省级变化，拉去市级数据
      handler(val, oldval) {
        if (val === "") return; // 在空值时不触发，解决重置问题
        this.areaList.cityList = []; // 先清空，防止数据错乱，避免跳转瞬间的数据切换动画
        this.areaData.fullName = val.areaName; // 赋值当前选择
        this.areaData.lastLevel = this.areaData.province;
        this.getAreaByCode(this.areaData.province.areaCode).then(data => {
          this.areaList.cityList = data;
          // 如果市级有默认地址，则选中
          if (
            this.areaData.city !== "" &&
            this.areaData.city !== null &&
            this.areaData.city !== undefined
          ) {
            this.$nextTick(() => {
              let childrenList = this.$refs.$cityItems;
              let $p = childrenList.filter(
                item => item.dataset.code === this.areaData.city
              );
              // 因为组件外areaCode中元素赋值和后台返回对象不一致，导致给areaCode.province赋值后
              // 第二次市找不到对应节点的会出现报错
              if ($p.length > 0) {
                $p[0].click();
                $p[0].style.color = "#409EFF"; // 改变颜色进行标注
              }
            });
          }

          // 判断下一级是否有值，没有直接关闭
          if (!("city" in this.areaData)) {
            this.visible = false;
          } else {
            this.activeName = "city"; // 切换到市级Tab
          }
        });
      }
    },
    "areaData.city": {
      handler(val, oldval) {
        if (val === "") return;
        this.areaList.countyList = [];
        this.areaData.lastLevel = this.areaData.city;
        this.areaData.fullName = `${this.areaData.province.areaName}/${val.areaName}`;
        this.getAreaByCode(this.areaData.city.areaCode).then(data => {
          this.areaList.countyList = data;
          // 如果县级有默认地址，则选中
          if (
            this.areaData.county !== "" &&
            this.areaData.county !== null &&
            this.areaData.county !== undefined
          ) {
            this.$nextTick(() => {
              let childrenList = this.$refs.$countyItems;
              let $p = childrenList.filter(
                item => item.dataset.code === this.areaData.county
              );
              // 因为组件外areaCode中元素赋值和后台返回对象不一致，导致给areaCode.province赋值后
              // 第二次市找不到对应节点的会出现报错
              if ($p.length > 0) {
                $p[0].click();
                $p[0].style.color = "#409EFF"; // 改变颜色进行标注
              }
            });
          }

          // 判断下一级是否有值，没有直接关闭
          if (!("county" in this.areaData)) {
            this.visible = false;
          } else {
            // 有则切换到下一级
            this.activeName = "county";
          }
        });
      }
    },
    "areaData.county": {
      handler(val, oldval) {
        if (val === "") return;
        this.areaList.districtList = [];
        this.areaData.lastLevel = this.areaData.county;
        this.areaData.fullName = `${this.areaData.province.areaName}/${this.areaData.city.areaName}/${val.areaName}`;
        this.getAreaByCode(this.areaData.county.areaCode).then(data => {
          this.areaList.districtList = data;
          // 如果县级有默认地址，则选中
          if (
            this.areaData.district !== "" &&
            this.areaData.district !== null &&
            this.areaData.district !== undefined
          ) {
            this.$nextTick(() => {
              let childrenList = this.$refs.$districtItems;
              let $p = childrenList.filter(
                item => item.dataset.code === this.areaData.district
              );
              // 因为组件外areaCode中元素赋值和后台返回对象不一致，导致给areaCode.province赋值后
              // 第二次市找不到对应节点的会出现报错
              if ($p.length > 0) {
                $p[0].click();
                $p[0].style.color = "#409EFF"; // 改变颜色进行标注
              }
            });
          }

          // 判断下一级是否有值，没有直接关闭
          if (!("district" in this.areaData)) {
            this.visible = false;
          } else {
            this.activeName = "district";
          }
        });
      }
    },
    "areaData.district": {
      handler(val, oldval) {
        if (val === "") return;
        this.areaList.villageList = [];
        this.areaData.lastLevel = this.areaData.district;
        this.areaData.fullName = `${this.areaData.province.areaName}/${this.areaData.city.areaName}/${this.areaData.county.areaName}/${val.areaName}`;
        this.getAreaByCode(this.areaData.district.areaCode).then(data => {
          this.areaList.villageList = data;
          // 如果县级有默认地址，则选中
          if (
            this.areaData.village !== "" &&
            this.areaData.village !== null &&
            this.areaData.village !== undefined
          ) {
            this.$nextTick(() => {
              let childrenList = this.$refs.$villageItems;
              let $p = childrenList.filter(
                item => item.dataset.code === this.areaData.village
              );
              // 因为组件外areaCode中元素赋值和后台返回对象不一致，导致给areaCode.province赋值后
              // 第二次市找不到对应节点的会出现报错
              if ($p.length > 0) {
                $p[0].click();
                $p[0].style.color = "#409EFF"; // 改变颜色进行标注
              }
            });
          }

          // 判断下一级是否有值，没有直接关闭
          if (!("village" in this.areaData)) {
            this.visible = false;
          } else {
            this.activeName = "village";
          }
        });
      }
    },
    "areaData.village": {
      handler(val, oldval) {
        if (val === "") return;
        this.areaData.fullName = `${this.areaData.province.areaName}/${this.areaData.city.areaName}/${this.areaData.county.areaName}/${this.areaData.district.areaName}/${val.areaName}`;
        // 最后一级选中后进行关闭
        this.areaData.lastLevel = this.areaData.village;
        this.visible = false;
      }
    }
    // "areaData.fullName": {
    //   handler(val, oldval) {
    //     // 支持重置
    //     if (val === "") {
    //       // fullName会被置为undefined，原因未找到
    //       Object.assign(this.areaData, this.bakData); // 重新赋值会导致areaData数据监听的触发
    //     }
    //   }
    // }
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    // 根据地址码获取子地区
    getAreaByCode(code) {
      this.loading = true;
      return this.$http
        .get(this.$api.subArea + code)
        .then(res => {
          if (res.data.result !== "ok") {
            this.$message.error(res.data.error.message);
            return Promise.reject(new Error(res.data.error.message));
          }
          return res.data.data;
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 显示触发钩子
    show() {
      // 拉取省级数据
      this.getAreaByCode(ALL_PROVICE_CODE).then(data => {
        this.areaList.provinceList = data;
        // 如果省级传入了默认值，则选中
        if (
          this.areaData.province !== "" &&
          this.areaData.province !== null &&
          this.areaData.province !== undefined
        ) {
          this.$nextTick(() => {
            // 如果外部传递了默认地址则拉取数据并选中
            let childrenList = this.$refs.$provinceItems;
            let $p = childrenList.filter(
              item => item.dataset.code === this.areaData.province
            );
            // 因为组件外areaCode中元素赋值和后台返回对象不一致，导致给areaCode.province赋值后
            // 第二次市找不到对应节点的会出现报错
            if ($p.length > 0) {
              $p[0].click();
              $p[0].style.color = "#409EFF"; // 改变颜色进行标注
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-popover {
  margin-top: 10px;
  padding: 30px 30px 10px;
  .close-icon {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}

.el-tabs {
  width: 500px;
  /deep/ .el-tabs__header {
    .el-tabs__item {
      width: 80px;
      text-align: center;
    }
  }
  /deep/ .el-tab-pane::-webkit-scrollbar {
    width: 4px; // 横向滚动条
    height: 8px; // 纵向滚动条 必写
  }
  /deep/ .el-tab-pane::-webkit-scrollbar-thumb {
    background-color: grey;
    border-radius: 5px;
  }
}

.el-tab-pane {
  height: 200px;
  overflow-y: scroll;
  overflow-x: hidden;
  p {
    margin: 0;
    padding: 10px;
    font-size: 14px;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:hover {
      color: #409eff;
    }
  }
}

.footer {
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .prompt {
    font-size: 12px;
    color: #898989;
    margin: 0;
    margin-left: 10px;
    margin-right: 10px;
  }
  .el-button {
    margin-right: -10px;
  }
}
</style>
