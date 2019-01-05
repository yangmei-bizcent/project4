<template>
  <div class="page-container edit-config">
    <div class="detail-title">
      <span>短信网关配置</span>
      <el-button size="small" @click="$router.go(-1)"><img src="../../assets/img/back.png" />返回</el-button>
    </div>

    <el-form label-width="120px" :model="configBody" :rules="rules" ref="ruleForm">
      <el-form-item label="网关地址" prop="url">
        <el-input v-model="configBody.url"></el-input>
      </el-form-item>
      <el-form-item label="协议类型" prop="protocolType">
        <el-select v-model="configBody.protocolType" clearable>
          <el-option value="platsms" label="platsms"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="短信平台token">
        <el-input v-model="configBody.platsmsToken"></el-input>
      </el-form-item>
      <el-form-item label="厂商名称">
        <el-input v-model="configBody.smsName"></el-input>
      </el-form-item>
      <el-form-item label="拥有单位">
        <el-input v-model="configBody.owner"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="submitForm('ruleForm')">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { aixosput } from "../../service/config.js"
import { axiospost } from "../../service/config.js"
const messageput = (_url, data) => aixosput(`message${_url}`, data)
const messagepost = (_url, data) => axiospost(`message${_url}`, data)
export default {
  data() {
    return {
      configBody: {},
      rules: {
        url: [{ required: true, message: "请输入网关地址", trigger: "blur" }],
        protocolType: [
          { required: true, message: "请输入协议类型", trigger: "change" }
        ]
      }
    };
  },

  created() {
    if (this.$route.params.body) {
      this.configBody = this.$route.params.body;
    }
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if(this.$route.query.type === 'add') {
            this.configBody.seq = '0'
            messagepost('/auth/smsPlatGateway/add', this.configBody)
            this.$message.success('新增成功')
            this.$router.go(-1)
          } else {
            messageput('/auth/smsPlatGateway/edit', this.configBody)
            this.$message.success('修改成功')
            this.$router.go(-1)
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    
  },
  components: {}
};
</script>

<style lang='scss' scoped>
.edit-config {
  padding: 15px 24px;
  min-height: 452px;
  .detail-title {
    display: flex;
    justify-content: space-between;
    height: 44px;
    line-height: 44px;
    margin-bottom: 20px;
    // padding-left: 13px;
    border-bottom: 1px solid #e6e6e6;
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #425b77;
    letter-spacing: 0.2px;
    .el-button {
      width: 69px;
      height: 34px;
      padding: 9px 10px;
      img {
        padding-right: 8px;
      }
    }
  }
}
</style>

<style lang="scss">
.edit-config {
  .el-form {
    width: 500px;
    .el-form-item__label {
      font-size: 14px;
      color: #425b77;
    }
    .el-input {
      width: 300px;
      height: 34px;
      .el-input__inner {
        width: 300px;
        height: 34px;
      }
    }

    .el-button {
      width: 78px;
      height: 34px;
      background-color: #00ad91;
      color: #ffffff;
      border: 1px solid #00ad91;
    }
  }
}
</style>


