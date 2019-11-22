<template>
  <el-dialog :visible.sync="dialogVisible" title="新建政府机构账号" width="800px">
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      :inline="true"
      label-width="100px"
      style="width: 100%;"
    >
      <el-form-item label="政府名称：" prop="accountNickname">
        <el-input maxlength="20" v-model="formData.accountNickname" placeholder="请输入政府名称"></el-input>
      </el-form-item>

      <el-form-item label="所在区域：" prop="accountAreacode.fullName">
        <el-input
          placeholder="请选择所在区域"
          v-model="formData.accountAreacode.fullName"
          @focus="$refs.tabAreaSelect.visible=true"
        ></el-input>
        <tab-area-select ref="tabAreaSelect" :areaData="formData.accountAreacode"></tab-area-select>
      </el-form-item>

      <el-form-item label="详细地址：" prop="accountAddress">
        <el-input v-model="formData.accountAddress" maxlength="20" placeholder="请输入详细地址"></el-input>
      </el-form-item>

      <el-form-item label="负责人：" prop="accountMaster">
        <el-input v-model="formData.accountMaster" placeholder="请输入负责人"></el-input>
      </el-form-item>

      <el-form-item label="联系电话：" prop="accountLikePhone">
        <el-input v-model="formData.accountLikePhone" placeholder="请输入联系电话"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer" class="dialog-footer">
      <el-button @click="$refs['form'].resetFields()">重 置</el-button>
      <el-button type="primary" @click="addNewGovAccount()">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import TabAreaSelect from "@/components/select/TabAreaSelect";
import RegexUtil from "../../../utils/regexUtils.js";
export default {
  components: {
    TabAreaSelect
  },
  data() {
    return {
      dialogVisible: false,
      formData: {
        accountNickname: null, // 机构名称
        accountAddress: null, // 详细地址
        accountAreacode: {
          // 区域地址码
          province: "",
          city: "",
          county: "",
          fullName: ""
        },
        accountMaster: null, // 机构负责人
        accountLikePhone: null // 联系号码
      },
      rules: {
        accountNickname: [
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
                callback(new Error("姓名必须为2 到 20 个中文字符"));
              }
            },
            trigger: "blur"
          }
        ],
        accountAddress: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
          {
            min: 2,
            max: 30,
            message: "详细地址长度在2~30个字符之间",
            trigger: "blur"
          }
        ],
        "accountAreacode.fullName": [
          { required: true, message: "请选择学校地址", trigger: "change" }
        ],
        accountMaster: [
          { required: true, message: "请输入负责人姓名", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "负责人姓名长度在 2 到 20 个字符",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (RegexUtil.isCZName(value)) {
                callback();
              } else {
                callback(new Error("姓名必须为2 到 20 个中文字符"));
              }
            },
            trigger: "blur"
          }
        ],
        accountLikePhone: [
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
        ]
      }
    };
  },
  watch: {
    // 详细地址跟随区域地址变化
    "formData.accountAreacode.fullName": {
      handler(val, oldval) {
        this.formData.accountAddress = val.replace(/\//g, "");
      }
    }
  },
  methods: {
    // 请求 - 添加一个新的政府账号
    addNewGovAccount() {
      let params = {
        agenceAddress: this.formData.accountAddress,
        agenceAreacode: this.formData.accountAreacode.county.areaCode,
        agencePhone: this.formData.accountLikePhone,
        agenceMaster: this.formData.accountMaster,
        agenceName: this.formData.accountNickname
      };

      this.axios
        .post(this.$api.addGovAccount, params)
        .then(res => {
          if (res.data.result !== "ok") {
            this.$message.error(res.data.error.message);
            return Promise.reject(new Error(res.data.error.message));
          }

          this.$message({
            message: "添加账号成功",
            type: "success"
          });
          this.$refs["form"].resetFields();
          this.$emit("submitOk");
          this.dialogVisible = false;
          return res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  .el-form-item {
    width: 360px;
    display: flex;
    /deep/ .el-form-item__content {
      flex: 1;
    }
  }
}
</style>
