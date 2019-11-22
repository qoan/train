<template>
  <el-dialog
    @open="open()"
    :custom-class="customClass"
    :visible.sync="dialogVisible"
    :width="width"
    :title="title"
  >
    <el-form class="serachForm" ref="serachForm" :size="size" :rules="rules" :model="serachForm">
      <!--- 第一栏 -->
      <el-row :gutter="40">
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="分校名称：" prop="schoolName">
            <el-input v-model="serachForm.schoolName" placeholder="请输入学校名称"></el-input>
          </el-form-item>
        </el-col>

        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="机构地址：" prop="schoolAreacode.fullName">
            <el-input
              placeholder="请选择所在区域"
              v-model="serachForm.schoolAreacode.fullName"
              @focus="$refs.tabAreaSelect.visible=true"
            ></el-input>
            <tab-area-select ref="tabAreaSelect" :areaData="serachForm.schoolAreacode"></tab-area-select>
          </el-form-item>
        </el-col>

        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="详细地址：" prop="schoolAddress">
            <el-input v-model="serachForm.schoolAddress" placeholder="请输入详细地址"></el-input>
          </el-form-item>
        </el-col>

        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="负责人：" prop="schoolMaster">
            <el-input v-model="serachForm.schoolMaster" placeholder="请输入负责人"></el-input>
          </el-form-item>
        </el-col>

        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="联系电话：" prop="schoolPhone">
            <el-input v-model="serachForm.schoolPhone" placeholder="请输入联系电话"></el-input>
          </el-form-item>
        </el-col>

        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="学校性质：" prop="schoolKindTid">
            <el-select v-model="serachForm.schoolKindTid" placeholder="请选择学校性质">
              <el-option
                v-for="item in schoolKindEnumList"
                :key="item.tid"
                :label="item.enumerValue"
                :value="item.tid"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="学校类型：" prop="schoolTypeTid">
            <el-select v-model="serachForm.schoolTypeTid" placeholder="请选择学校类型">
              <el-option
                v-for="item in schoolTypeEnumList"
                :key="item.tid"
                :label="item.enumerValue"
                :value="item.tid"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="主管部门：" prop="agenceTid">
            <el-select v-model="serachForm.agenceTid" placeholder="请选择主管部门">
              <el-option
                v-for="item in agenceList"
                :key="item.tid"
                :label="item.agenceName"
                :value="item.tid"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$refs.serachForm.resetFields()">重 置</el-button>
      <el-button
        type="primary"
        @click="addNewSchool();"
        :loading="loading"
      >{{loading?'执行中...':'提 交'}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import RegexUtil from "@/utils/regexUtils";
import TabAreaSelect from "@/components/select/TabAreaSelect";
export default {
  components: {
    TabAreaSelect
  },
  data() {
    return {
      dialogVisible: false,
      customClass: "dialog-add-slave-school",
      title: "新增分校",
      width: "40%",
      size: "mini",
      serachForm: {
        schoolName: null,
        schoolMaster: null,
        schoolAddress: null,
        schoolPhone: null,
        schoolKindTid: null,
        schoolTypeTid: null,
        agenceTid: null,
        schoolAreacode: {
          // 区域地址码
          province: "",
          city: "",
          county: "",
          fullName: ""
        }
      },
      schoolKindEnumList: [],
      schoolTypeEnumList: [],
      agenceList: [],
      rules: {
        schoolName: [
          { required: true, message: "请输入学校名称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "学校名称长度在 2 到 20 个字符",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (RegexUtil.isCZName(value)) {
                callback();
              } else {
                callback(new Error("学校名称必须为2 到 20 个中文字符"));
              }
            },
            trigger: "blur"
          }
        ],
        schoolMaster: [
          { required: true, message: "请输入负责人名字", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "负责人名字长度在 2 到 10 个字符",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (RegexUtil.isCZName(value)) {
                callback();
              } else {
                callback(new Error("负责人名字必须为2 到 10 个中文字符"));
              }
            },
            trigger: "blur"
          }
        ],
        schoolAddress: [
          { required: true, message: "请输入详细地址", trigger: "change" }
        ],
        "schoolAreacode.fullName": [
          { required: true, message: "请选择机构地址", trigger: "change" }
        ],
        schoolPhone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "电话号码长度为11个字符",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (RegexUtil.isPhone(value)) {
                callback();
              } else {
                callback(new Error("请输入正确的电话号码"));
              }
            },
            trigger: "blur"
          }
        ],
        schoolKindTid: [
          { required: true, message: "请选择学校性质", trigger: "change" }
        ],
        schoolTypeTid: [
          { required: true, message: "请选择学校类型", trigger: "change" }
        ]
      }
    };
  },
  watch: {
    // 详细地址跟随区域地址变化
    "serachForm.schoolAreacode.fullName": {
      handler(val, oldval) {
        this.serachForm.schoolAddress = val.replace(/\//g, "");
      }
    }
  },
  methods: {
    // 回调 - dialog打开时
    open() {
      this.getAgenceList();
      this.schoolKindEnumList = JSON.parse(
        sessionStorage.getItem("school_kind") || "[]"
      );
      this.schoolTypeEnumList = JSON.parse(
        sessionStorage.getItem("school_type") || "[]"
      );
    },
    // 请求 - 新增分校
    addNewSchool() {
      this.$refs["serachForm"].validate(valid => {
        if (!valid) return;
        this.loading = true;
        let params = {
          agenceTid: this.serachForm.agenceTid,
          schoolAddress: this.serachForm.schoolAddress,
          schoolAreacode: this.serachForm.schoolAreacode.county.areaCode,
          schoolKindTid: this.serachForm.schoolKindTid,
          schoolMaster: this.serachForm.schoolMaster,
          schoolName: this.serachForm.schoolName,
          schoolPhone: this.serachForm.schoolPhone,
          schoolTypeTid: this.serachForm.schoolTypeTid
        };

        return this.axios
          .post(this.$api.addSlaveSchoolAccount, params)
          .then(res => {
            if (res.data.result !== "ok") {
              this.$message.error(res.data.error.message);
              return Promise.reject(new Error(res.data.error.message));
            }

            this.$message({
              message: "添加成功!",
              type: "success"
            });

            this.dialogVisible = false;
            this.$emit("submitOk");
            this.$refs.serachForm.resetFields();
            return res.data.data;
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    // 请求 - 获取政府机构
    getAgenceList() {
      return this.axios
        .get(this.$api.getAgenceList)
        .then(res => {
          if (res.data.result !== "ok") {
            this.$message.error(res.data.error.message);
            return Promise.reject(new Error(res.data.error.message));
          }
          this.agenceList = res.data.data;
          return res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss">
/* dialog位于顶层，scoped局域是无法选中的， 所以最好定义dialog的类名 */
.dialog-add-slave-school {
  .el-dialog__header {
    border-bottom: 1px solid #f7f7f7;
  }
  .el-dialog__body {
    padding-left: 40px;
    padding-right: 40px;
  }
}

.el-form {
  .el-form-item {
    display: flex;
    flex-flow: row nowrap;
    label {
      width: 100px !important;
    }
    .el-form-item__content {
      flex: 1;
      .el-input {
        width: 100%;
      }
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
}

.el-row {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
