<template>
  <div class="page-container add-application">
    <page-title :hasBtn="true" :options="pageTitleOptions" @click="backAppConf">新建应用</page-title>

    <!-- 步骤条 -->
    <el-steps align-center :active="step" :space="483" class="steps">
      <el-step title="基础信息配置"></el-step>
      <el-step title="配置开发信息"></el-step>
		</el-steps>

    <!-- 表单 -->
    <el-form :model="configForm" ref="configForm" :rules="rules" class="config-form" label-width="85px">
      <!-- 基础信息配置 -->
      <section v-show="step === 1 ? true : false">
        <el-form-item label="应用Logo" prop="headerImg">
          <el-upload
            action=""
            :show-file-list="false"
            :before-upload="beforeUpload"
            :http-request="imgUrlRequest">
            <el-button size="small" type="default" class="upload-btn">上传图片</el-button>
            <span class="upload-tip" slot="tip">建议使用750*750，1M以内的jpg,png图片</span>
          </el-upload>
          <img
            class="application-icon"
            v-show="configForm.headerImg ? true : false"
            :src="configForm.headerImg"/>
        </el-form-item>

        <el-form-item label="应用名称" prop="applicationName">
          <el-input v-model="configForm.applicationName" placeholder="请输入2-8个字，建议包含品牌名"></el-input>
        </el-form-item>

        <el-form-item label="应用简介" prop="applicationDesc">
          <el-input type="textarea"
            v-model="configForm.applicationDesc"
            placeholder="填写应用功能和使用场景介绍，要求4-120个字"
            resize="none"
            :rows="3"></el-input>
        </el-form-item>

        <hr>

        <el-form-item label="应用类型" prop="applicationType">
          <el-select v-model="configForm.applicationType" placeholder="请选择">
            <el-option label="基础服务" value="1"></el-option>
            <el-option label="专业服务" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分类" prop="applicationBusinessType">
          <el-select v-model="configForm.applicationBusinessType"
            multiple
            placeholder="请选择"
            class="multiple-select">
            <el-option
              v-for="(item, index) of typeItems"
              :key="index"
              :label="item.businessTypeName"
              :value="item.businessTypeId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="服务期限" v-if="false">
          <el-select v-model="configForm.applicationYearLimit" placeholder="请选择">
            <el-option label="12" value="12"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="is-pay-item">
          <el-radio-group v-model="configForm.isPay">
            <el-radio label="有支付"></el-radio>
            <el-radio label="无支付"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="成员敏感信息" class="sense-infos label-rows">
          <el-checkbox-group v-model="configForm.senseInfos">
            <el-checkbox label="就诊人信息"></el-checkbox>
            <el-checkbox label="用户信息"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="nextStep" class="btn-3-letters">下一步</el-button>
        </el-form-item>
      </section>

      <!-- 配置开发信息 -->
      <section v-show="step === 2 ? true : false">
        <el-form-item label="应用主页" prop="applicationBaseUrl">
          <el-input v-model="configForm.applicationBaseUrl" placeholder="请填写带协议头的合法URL"></el-input>
        </el-form-item>

        <el-form-item label="安装完成回调域名" class="label-rows" prop="callbackDomain">
          <el-input v-model="configForm.callbackDomain" placeholder="不包含协议头，不支持IP地址及短链域名"></el-input>
        </el-form-item>

        <el-form-item label="业务设置URL" class="label-rows" prop="applicationManageBaseUrl">
          <el-input v-model="configForm.applicationManageBaseUrl" placeholder="请填写带协议头的合法URL"></el-input>
        </el-form-item>

        <hr>

        <el-form-item label="数据回调URL" class="label-rows" prop="callbackDataUrl">
          <el-input v-model="configForm.callbackDataUrl" placeholder="请填写带协议头的合法URL"></el-input>
        </el-form-item>

        <el-form-item label="指令回调URL" class="label-rows" prop="callbackDictateUrl">
          <el-input v-model="configForm.callbackDictateUrl" placeholder="请填写带协议头的合法URL"></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button type="info" @click="preStep" class="btn-3-letters">上一步</el-button>
          <el-button type="primary" @click="saveApplication" class="btn-4-letters">保存应用</el-button>
        </el-form-item>
      </section>
    </el-form>
  </div>
</template>

<script>
import { axiosget, axiospost } from '@/service/config';
import pageTitle from '@/components/pageTitle';
const applicationpost = (url, data) => axiospost(`application/${url}`, data);
const applicationget = url => axiosget(`application/manage/${url}`);
export default {
  data () {
    let urlParser = function (rule, value, callback) {
      let urlReg = new RegExp('(https?)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]');
      if (!urlReg.test(value) && value.length > 0) {
        callback(new Error('请填写合法的URL'));
      } else {
        callback();
      }
    };
    let domainParser = function (rule, value, callback) {
      callback();
    };
    return {
      pageTitleOptions: {
        btnType: 'default',
        btnText: '返回',
        hasIcon: true
      },
      configForm: {//配置表单
        headerImg: '',
        applicationName: '',
        applicationDesc: '',
        applicationType: [],
        applicationBusinessType: '',
        isPay: '无支付',
        senseInfos: [],
        applicationBaseUrl: '',
        callbackDomain: '',
        applicationManageBaseUrl: '',
        callbackDataUrl: '',
        callbackDictateUrl: '',
        applicationYearLimit: ''
      },
      typeItems: [],
      step: 1,
      rules: {
        headerImg: [
          { required: true, message: '请上传应用Logo' }
        ],
        applicationName: [
          { required: true, message: '请填写应用名称', trigger: 'blur' },
          { min: 2, max: 8, message: '请输入2-8个字', trigger: 'blur' }
        ],
        applicationDesc: [
          { required: true, message: '请填写应用简介', trigger: 'blur' },
          { min: 4, max: 120, message: '请输入4-120个字', trigger: 'blur' }
        ],
        applicationType: [
          { required: true, message: '请选择应用类型' }
        ],
        applicationBusinessType: [
          { required: true, message: '请选择分类' }
        ],
        applicationBaseUrl: [
          { required: true, message: '请填写应用主页', trigger: 'blur' },
          { validator: urlParser, trigger: 'blur' }
        ],
        callbackDomain: [
          // { required: true, message: '请填写安装完成回调域名', trigger: 'blur' },
          { validator: domainParser, trigger: 'blur' }
        ],
        applicationManageBaseUrl: [
          // { required: false, message: '请填写业务设置URL', trigger: 'blur' },
          { validator: urlParser, trigger: 'blur' }
        ],
        callbackDataUrl: [
          // { required: true, message: '请填写数据回调URL', trigger: 'blur' },
          { validator: urlParser, trigger: 'blur' }
        ],
        callbackDictateUrl: [
          // { required: true, message: '请填写指令回调URL', trigger: 'blur' },
          { validator: urlParser, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    //获取应用分类选项列表
    applicationget(`businessTypeList`).then(res => {
      this.typeItems = res.data;
    }).catch(err => {
      console.log(err);
    });
  },
  methods: {
    backAppConf () {
      this.$router.push({ name: 'applicationConfig' });
    },
    nextStep () {
      let flag = true,
          params = ['headerImg', 'applicationName', 'applicationDesc', 'applicationType', 'applicationBusinessType'];
      for (let param of params) {
        this.$refs['configForm'].validateField(param, error => {
          if (error) {
            flag = false;
          }
        });
      }
      if (flag) {
        this.step = 2;
      }
    },
    preStep () {
      this.step = 1;
    },
    saveApplication () {
      this.$refs['configForm'].validate(valid => {
        if (valid) {
          let postObj = Object.assign({}, this.configForm);
          postObj.isPay = this.configForm.isPay === '无支付' ? '0' : '1';
          postObj.senseInfos = this.configForm.senseInfos.join(',');
          postObj.platformHospitalId = 'b41121dd-8c78-4877-891d-f8112085adb1';
          postObj.busTypeFlag = true;
          applicationpost('manage/addAppBaseInfo', postObj).then(res => {
            if (typeof res.data === 'string') {
              this.$message.success('新建成功');
              this.$router.push({ name: 'applicationConfig' });
            } else {
              this.$message.error(res.data.msg);
            }
          }).catch(err => {
            console.log(err);
            this.$message.error('新建失败');
          });
        } else {
          return false;
        }
      });
    },
    //图片上传
    imgUrlRequest (e) {
      const file = new FormData();
      file.append('file', e.file);
      applicationpost('plat/auth/images/upload', file).then(res => {
        this.configForm.headerImg = res.data.url;
        this.$refs['configForm'].clearValidate();
        this.$message.success('图片上传成功');
      }).catch(err => {
        console.log(err);
        this.$message.error('图片上传失败');
      });
    },
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg';
      const isPng = file.type === 'image/png';
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        this.$message.error('上传的图片大小不能超过1M');
      }
      if (!isJPG && !isPng) {
        this.$message.error('上传的图片格式只能为jpg或png');
      }
      return (isJPG || isPng) && isLt1M;
    }
  },
  components: { pageTitle }
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px 24px;
}
.steps {
  justify-content: center;
}
.config-form {
  width: 405px;
  margin: 30px auto 50px;
  hr {
    margin: -2px 0 20px;
  }
}
.upload-btn {
  padding: 7px;
}
.upload-tip {
  font-size: 12px;
  color: #999;
  letter-spacing: 0.2px;
  margin-left: 18px;
}
.application-icon {
  width: 70px;
  height: 70px;
  display: block;
  margin-top: 5px;
}
.is-pay-item {
  margin-top: -12px;
}
</style>

<style lang="scss">
@import './applicationManage';
.add-application {
  .config-form {
    .el-input__inner {
      width: 300px;
    }
    .el-tag--info {
      color: #000;
    }
    .sense-infos {
      margin-top: -12px;
    }
    .el-form-item__label:before {
      content: '';
      margin: 0;
    }
  }
  .el-steps {
    .el-step__line-inner {
      border-width: 1px !important;
    }
    .el-step__icon.is-text {
      height: 20px;
      width: 20px;
      font-size: 11px;
    }
    .el-step.is-horizontal .el-step__line {
      top: 11px;
      height: 2px;
    }
    .el-step__title {
      color: #666;
      font-weight: normal;
      letter-spacing: 0;
    }
  }
}
</style>
