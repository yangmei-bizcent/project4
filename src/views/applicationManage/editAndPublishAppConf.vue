<template>
  <div class="edit-and-publish-app-conf">
    <div class="page-container">
      <page-title :hasBtn="true" :options="pageTitleOptions" @click="backAppConf">编辑与发布应用配置</page-title>

      <!-- 标签页 -->
      <el-tabs v-model="tabsActive" type="card" @tab-click="tabChangeHandle">
        <!-- 基础信息 -->
        <el-tab-pane label="基础信息" name="first">
          <el-form
            :model="configForm"
            :rules="rules"
            ref="baseForm"
            class="config-form"
            label-width="85px">
            <div class="form-items">
              <el-form-item label="应用Logo">
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

              <el-form-item label="应用类型">
                <el-select v-model="configForm.applicationType" placeholder="请选择">
                  <el-option label="基础服务" value="1"></el-option>
                  <el-option label="专业服务" value="2"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="分类" prop="applicationBusTypes">
                <el-select v-model="configForm.applicationBusTypes"
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
                  <el-option label="一年期以上" value="一年期以上"></el-option>
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
            </div>

            <div class="submit-item">
              <el-form-item>
                <el-button
                  type="info"
                  class="btn-4-letters"
                  @click="baseInfoSubmit">确认提交</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>

        <!-- 开发信息 -->
        <el-tab-pane label="开发信息" name="second">
          <el-form
            :model="configForm"
            ref="configForm"
            :rules="rules"
            class="config-form"
            label-width="85px">
            <div class="form-items">
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
            </div>

            <div class="submit-item">
              <el-form-item>
                <el-button
                  type="info"
                  class="btn-4-letters"
                  @click="configInfoSubmit">确认提交</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>

        <!-- 应用详情配置 -->
        <el-tab-pane label="应用详情配置" name="third">
          <el-radio-group v-model="configModel" class="config-model">
            <el-radio label="图片模式" value="图片模式"></el-radio>
            <el-radio label="字段模式" value="字段模式"></el-radio>
          </el-radio-group>

          <!-- 图片模式 -->
          <section v-show="appDetailModel && modelFlag">
            <div class="app-detail-config">
              <el-upload
                action=""
                :limit="1"
                :before-upload="beforeUpload"
                :http-request="imgUrlRequestHandle"
                :file-list="fileList"
                :on-exceed="limitFile"
                :on-remove="removeFile"
                list-type="picture">
                <el-button size="small" type="default" class="upload-btn">上传图片</el-button>
                <span class="upload-tip" slot="tip">图片上传规则：上传图片宽度限定为1500px，大小5M以内。</span>
              </el-upload>
            </div>
            <el-button
              type="info"
              class="btn-4-letters submit-btn"
              @click="submitPictureModel">保存提交</el-button>
          </section>

          <!-- 字段模式 -->
          <section v-show="!appDetailModel && modelFlag" class="field-model">
            <div class="app-detail-config">
              <page-title :hasBtn="false">应用功能点介绍<span class="page-title-vice">填写2 - 6 个介绍</span></page-title>
              <el-row :gutter="20">
                <el-col :span="12"
                  v-for="(item, index) of functions"
                  :key="index">
                  <div class="point-items">
                    <el-form
                      :model="item"
                      ref="functionForm"
                      :rules="index <= 1 ? rules : {}"
                      label-width="20px">
                      <el-form-item label=" " prop="functionName">
                        <el-input v-model="item.functionName" placeholder="功能点" :maxlength="15"></el-input>
                        <span class="count-statistics">{{ `${item.functionName.length}/15` }}</span>
                      </el-form-item>

                      <el-form-item label=" " class="desc-wrap" prop="functionDesc">
                        <el-input
                          v-model="item.functionDesc"
                          type="textarea"
                          placeholder="该功能点介绍"
                          resize="none"
                          :rows="3"
                          :maxlength="100"></el-input>
                        <span class="count-statistics static-width">{{ `${item.functionDesc.length}/100` }}</span>
                      </el-form-item>
                    </el-form>

                    <div class="flex-align-end">
                      <el-button
                        type="default"
                        class="btn-2-letters delete-btn"
                        v-if="index <= 1 ? false : true"
                        @click="deleteItem(index, 'functions')">删除</el-button>
                    </div>
                  </div>
                </el-col>      
              </el-row>
              <el-button
                type="info"
                class="btn-4-letters add-btn"
                @click="addItem('functions')">新增介绍</el-button>
              <el-button type="text" class="add-tip">填写范例：应用功能点.jpg</el-button>

              <page-title :hasBtn="false">应用详情截图</page-title>
              <el-form class="screenshot-form">
                <el-upload
                  action=""
                  :limit="3"
                  :before-upload="beforeUpload"
                  :http-request="imgUrlRequestHandleScreenshot"
                  :file-list="screenshot"
                  :on-exceed="limitFile3"
                  :on-remove="removeFileScreenshot"
                  list-type="picture">
                  <el-button size="small" type="default" class="upload-btn">上传图片</el-button>
                  <span class="upload-tip" slot="tip">像素1242*2208,1M以内无水印jpg、png，最多上传3张</span>
                </el-upload>
                <el-button type="text" class="add-tip">填写范例：应用功能点.jpg</el-button>
              </el-form>

              <page-title :hasBtn="false">应用亮点介绍<span class="page-title-vice">最多新增四个特色</span></page-title>
              <el-row :gutter="20">
                <el-col :span="12"
                  v-for="(item, index) of advantages"
                  :key="index">
                  <div class="point-items">
                    <el-form
                      :model="item"
                      ref="advantageForm"
                      :rules="index <= 1 ? rules : {}"
                      label-width="20px">
                      <el-form-item label=" " prop="advantageName">
                        <el-input v-model="item.advantageName" placeholder="亮点" :maxlength="10"></el-input>
                        <span class="count-statistics">{{ `${item.advantageName.length}/10` }}</span>
                      </el-form-item>

                      <el-form-item label=" " class="desc-wrap" prop="advantageDesc">
                        <el-input
                          v-model="item.advantageDesc"
                          type="textarea"
                          placeholder="该亮点介绍"
                          resize="none"
                          :rows="3"
                          :maxlength="20"></el-input>
                        <span class="count-statistics static-width">{{ `${item.advantageDesc.length}/20` }}</span>
                      </el-form-item>
                    </el-form>

                    <div class="flex-align-end">
                      <el-button
                        type="default"
                        class="btn-2-letters delete-btn"
                        v-if="index <= 1 ? false : true"
                        @click="deleteItem(index, 'advantages')">删除</el-button>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-button
                type="info"
                class="btn-4-letters add-btn"
                @click="addItem('advantages')">新增亮点</el-button>
              <el-button type="text" class="add-tip">填写范例：应用亮点介绍.jpg</el-button>

              <page-title :hasBtn="false">应用场景</page-title>
              <el-row :gutter="20">
                <el-col :span="12"
                  v-for="(item, index) of scenes"
                  :key="index">
                  <div class="point-items">
                    <el-form
                      :model="item"
                      label-width="20px">
                      <el-form-item label=" ">
                        <el-input v-model="item.applicationSceneTitle" placeholder="应用场景" :maxlength="10"></el-input>
                        <span class="count-statistics">{{ `${item.applicationSceneTitle.length}/10` }}</span>
                      </el-form-item>

                      <el-form-item label=" " class="desc-wrap">
                        <el-input
                          v-model="item.applicationSceneDesc"
                          type="textarea"
                          placeholder="该应用场景介绍"
                          resize="none"
                          :rows="3"
                          :maxlength="200"></el-input>
                        <span class="count-statistics static-width">{{ `${item.applicationSceneDesc.length}/200` }}</span>
                      </el-form-item>
                    </el-form>

                    <div class="flex-align-end">
                      <el-button
                        type="default"
                        class="btn-2-letters delete-btn"
                        @click="deleteItem(index, 'scenes')">删除</el-button>
                    </div>
                  </div>
                </el-col>
              </el-row>

              <el-form class="screenshot-form">
                <el-upload
                  action=""
                  :limit="3"
                  :before-upload="beforeUploadLimithalf"
                  :http-request="imgUrlRequestHandleScenes"
                  :file-list="scenesList"
                  :on-exceed="limitFile3"
                  :on-remove="removeFileScenes"
                  list-type="picture">
                  <el-button size="small" type="default" class="upload-btn">上传图片</el-button>
                  <span class="upload-tip" slot="tip">可不填，最多3个应用场景，上传图片大小为500KB以内</span>
                </el-upload>
              </el-form>

              <el-button
                type="info"
                class="btn-4-letters"
                @click="addItem('scenes')">新增应用场景</el-button>
              <el-button type="text" class="add-tip">填写范例：应用场景.jpg</el-button>
            </div>
            <el-button
              type="info"
              class="btn-4-letters submit-btn"
              @click="submitFieldModelInfo">保存提交</el-button>
          </section>
        </el-tab-pane>

        <!-- 操作指引配置 -->
        <el-tab-pane label="操作指引配置" name="fourth">
          <p class="operation-tip">可通过图文编辑的形式对该应用的操作使用流程进行详细的介绍，保存提交后显示在应用详情的操作指引中。</p>
          <div id="operating-instructions"></div>
          <el-button
            type="info"
            class="btn-4-letters submit-btn"
            @click="saveEditor">保存提交</el-button>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 发布与下架栏 -->
    <div class="publish-info">
      <el-button
        type="primary"
        class="btn-4-letters first-btn"
        :disabled="configForm.isGrounding === '1' ? true : false"
        @click="upOrDownApp">发布应用</el-button>
      <el-button
        type="default"
        class="btn-4-letters"
        :disabled="configForm.isGrounding === '1' ? false : true"
        @click="upOrDownApp">下架应用</el-button>
      <span class="app-state">{{ configForm.isGrounding === '1' ? '应用已发布' : '应用未发布' }}<span :class="configForm.isGrounding === '0' ? 'unpublished' : 'published'"></span></span>
    </div>

    <!-- 查看大图 -->
    <el-dialog title="查看大图" :visible.sync="dialogVisible">
      <img class="big-img" :src="imgUrl"/>
    </el-dialog>
  </div>
</template>

<script>
import { axiosget, axiospost } from '@/service/config';
import { exportRootUrl, exportLocalUrl } from "@/service/baseuri";
import Editor from 'wangeditor';
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
      applicationId: '',
      pageTitleOptions: {
        btnType: 'default',
        btnText: '返回',
        hasIcon: true
      },
      configForm: {//配置表单
        headerImg: '',//应用logo
        applicationName: '',//应用名称
        applicationDesc: '',//应用简介
        applicationBusTypes: [],//应用类型
        applicationType: '',//分类
        isPay: '',//有无支付
        senseInfos: [],//成员敏感信息
        applicationBaseUrl: '',//应用主页
        callbackDomain: '',//安装完成回调域名
        applicationManageBaseUrl: '',//业务设置URL
        callbackDataUrl: '',//数据回调URL
        callbackDictateUrl: '',//指令回调URL
        applicationYearLimit: ''//服务期限
      },
      ischanged: true,//过滤基础信息&开发信息数据初始化的变更
      ischangedDetail: true,//过滤应用详情配置数据初始化的变更
      changeFlag: false,//基础信息&开发信息是否变更的标记
      typeItems: [],
      modelFlag: false,
      tabsActive: '',
      configModel: '',//应用详情配置模式
      fileList: [],//图片模式图片上传列表
      screenshot: [],//字段模式应用截图上传列表
      scenesList: [],//字段模式应用场景图片上传列表
      functions: [],//应用功能点
      advantages: [],//应用亮点
      scenes: [],//应用场景
      functionFlag: false,
      advantageFlag: false,
      introImgFlag: false,
      sceneFlag: false,
      editor: null,//富文本编辑器实例
      imgUrl: '',
      dialogVisible: false,//查看大图弹窗
      rules: {
        applicationName: [
          { required: true, message: '请填写应用名称', trigger: 'blur' },
          { min: 2, max: 8, message: '请输入2-8个字', trigger: 'blur' }
        ],
        applicationDesc: [
          { required: true, message: '请填写应用简介', trigger: 'blur' },
          { min: 4, max: 120, message: '请输入4-120个字', trigger: 'blur' }
        ],
        applicationBusTypes: [
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
          // { required: true, message: '请填写业务设置URL', trigger: 'blur' },
          { validator: urlParser, trigger: 'blur' }
        ],
        callbackDataUrl: [
          // { required: true, message: '请填写数据回调URL', trigger: 'blur' },
          { validator: urlParser, trigger: 'blur' }
        ],
        callbackDictateUrl: [
          // { required: true, message: '请填写指令回调URL', trigger: 'blur' },
          { validator: urlParser, trigger: 'blur' }
        ],
        functionName: [
          { required: true, message: '请填写功能点', trigger: 'blur' }
        ],
        functionDesc: [
          { required: true, message: '请填写该功能点介绍', trigger: 'blur' }
        ],
        advantageName: [
          { required: true, message: '请填写亮点', trigger: 'blur' }
        ],
        advantageDesc: [
          { required: true, message: '请填写该亮点介绍', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    backAppConf () {
      this.$router.push({ name: 'applicationConfig' });
    },
    //切换tab页
    tabChangeHandle (e) {
      sessionStorage.setItem('active', e.name);
      // switch (e.name) {
      //   case 'third': 
      //     this.getAppDetailInfo(this.applicationId);
        //   break;
        // default: 
      this.getAppInfo(this.applicationId);
      // }
    },
    //图片上传
    imgUrlRequest (e, fileList) {
      const file = new FormData();
      file.append('file', e.file);
      applicationpost('plat/auth/images/upload', file).then(res => {
        if (!fileList) {
          this.configForm.headerImg = res.data.url;
        } else {
          fileList.push({
            url: res.data.url
          });
        }
        this.$message.success('图片上传成功');
      }).catch(err => {
        console.log(err);
        this.$message.error('图片上传失败');
      });
    },
    imgUrlRequestHandle (e) {
      this.imgUrlRequest(e, this.fileList);
    },
    imgUrlRequestHandleScreenshot (e) {
      this.imgUrlRequest(e, this.screenshot);
    },
    imgUrlRequestHandleScenes (e) {
      this.imgUrlRequest(e, this.scenesList);
    },
    beforeUploadLimithalf (file) {
      return this.beforeUpload(file, 0.5);
    },
    beforeUpload (file, size = 1) {
      const isJPG = file.type === 'image/jpeg';
      const isPng = file.type === 'image/png';
      const isLimit = file.size / 1024 / 1024 < size;
      if (!isLimit) {
        if (size < 1) {
          this.$message.error(`上传的图片大小不能超过${size * 1000}K`);
        } else {
          this.$message.error(`上传的图片大小不能超过${size}M`);
        }
      }
      if (!isJPG && !isPng) {
        this.$message.error('上传的图片格式只能为jpg或png');
      }
      return (isJPG || isPng) && isLimit;
    },
    limitFile (file, fileList) {
      this.$message.error('最多上传一张图片，请删除之后再重新上传');
    },
    limitFile3 (file, fileList) {
      this.$message.error('最多上传三张图片，请删除之后再重新上传');
    },
    removeFile (file, fileList) {
      this.fileList = [];
    },
    removeFileHandle (file, fileList) {
      let tempList = [];
      for (let fileItem of fileList) {
        if (fileItem !== file) {
          tempList.push(fileItem);
        }
      }
      return tempList;
    },
    removeFileScreenshot (file, fileList) {
      this.screenshot = this.removeFileHandle(file, fileList);
    },
    removeFileScenes (file, fileList) {
      this.scenesList = this.removeFileHandle(file, fileList);
    },
    //获取应用配置&操作指引信息
    getAppInfo (applicationId) {
      applicationget(`getAppInfo?applicationId=${applicationId}`).then(res => {
        //清除表单校验状态
        this.$refs['baseForm'].clearValidate();
        this.$refs['configForm'].clearValidate();
        let tempArray = [];
        for (let item of res.data.busTypes) {
          tempArray.push(item.businessTypeId);
        }
        res.data.applicationBusTypes = tempArray;
        res.data.isPay = res.data.isPay === '0' ? '无支付' : '有支付';
        res.data.senseInfos = res.data.senseInfos ? res.data.senseInfos.split(',') : [];
        this.configModel = res.data.introType === '1' ? '图片模式' : '字段模式';
        this.ischanged = false;
        this.changeFlag = false;
        this.configForm = res.data;
        this.editor.txt.html(res.data.operationalGuidelines);
      }).catch(err => {
        console.log(err);
      });
    },
    //获取应用详情配置信息
    getAppDetailInfo (applicationId) {
      //清除表单校验状态
      if (this.$refs['functionForm'] && this.$refs['advantageForm']) {
        for (let i = 0; i < 2; i++) {
          this.$refs['functionForm'][i].clearValidate();
          this.$refs['advantageForm'][i].clearValidate();
        }
      }
      applicationget(`getAppFuncInfo?applicationId=${applicationId}&introType=${this.configModel === '图片模式' ? 1 : 2}`).then(res => {
        if (this.configModel === '字段模式') {
          this.ischangedDetail = false;
          this.functionFlag = false;
          this.advantageFlag = false;
          this.introImgFlag = false;
          this.sceneFlag = false;
          this.functions = res.data.functions.length !== 0 ? res.data.functions : [{
              functionName: '',
              functionDesc: ''
            }, {
              functionName: '',
              functionDesc: ''
            }];
          this.advantages = res.data.advantages.length !== 0 ? res.data.advantages : [{
              advantageName: '',
              advantageDesc: ''
            }, {
              advantageName: '',
              advantageDesc: ''
            }];
          let tempArray = [];
          for (let img of res.data.introImgs) {
            tempArray.push({
              name: '',
              url: img.introImg
            });
          }
          this.screenshot = tempArray;
          this.scenes = res.data.scenes;
          let tempArray2 = [];
          for (let item of res.data.scenes) {
            if (item.applicationSceneImg) {
              tempArray2.push({
                url: item.applicationSceneImg
              });
            }
          }
          this.scenesList = tempArray2;
        } else if (res.data.introImgs.length > 0) {
          this.fileList = [{
            url: res.data.introImgs[0].introImg
          }];
        }
        this.modelFlag = true;
      }).catch(err => {
        console.log(err);
      });
    },
    //基础信息提交
    baseInfoSubmit () {
      this.$refs['baseForm'].validate(valid => {
        if (valid) {
          let params = ['headerImg', 'applicationName', 'applicationDesc', 'applicationType', 'applicationYearLimit', 'platformHospitalId'],
              postObj = {};
          for (let param of params) {
            postObj[param] = this.configForm[param];
          }
          postObj.applicationBusinessType = this.configForm.applicationBusTypes;
          postObj.isPay = this.configForm.isPay === '无支付' ? '0' : '1';
          postObj.senseInfos = this.configForm.senseInfos.join(',');
          postObj.applicationId = this.applicationId;
          postObj.busTypeFlag = this.changeFlag;
          applicationpost('manage/editAppBaseInfo', postObj).then(res => {
            this.$message.success('提交成功');
            this.getAppInfo(this.applicationId);
          }).catch(err => {
            console.log(err);
            this.$message.error('提交失败');
          });
        } else {
          return false;
        }
      });
    },
    //开发信息提交
    configInfoSubmit () {
      this.$refs['configForm'].validate(valid => {
        if (valid) {
          applicationpost('manage/editAppConfigInfo?applicationBaseUrl=' +
            this.configForm.applicationBaseUrl + '&callbackDomain=' +
            this.configForm.callbackDomain + '&applicationManageBaseUrl=' +
            this.configForm.applicationManageBaseUrl + '&callbackDataUrl=' +
            this.configForm.callbackDataUrl + '&callbackDictateUrl=' +
            this.configForm.callbackDictateUrl + '&applicationId=' +
            this.applicationId + '&platformHospitalId=b41121dd-8c78-4877-891d-f8112085adb1').then(res => {
            if (typeof res.data === 'string') {
              this.$message.success('提交成功');
            } else {
              this.$message.error(res.data.msg);
            }
          }).catch(err => {
            console.log(err);
            this.$message.error('提交失败');
          });
        } else {
          return false;
        }
      });
    },
    //删除应用详情配置项目
    deleteItem (index, type) {
      this[type].splice(index, 1);
    },
    //新增应用详情配置项目
    addItem (type) {
      switch (type) {
        case 'functions':
          if (this[type].length >= 6) {
            this.$message.error('您已经添加6个应用功能点了，如有需要请您对之前的功能点进行概括');
            break;
          }
          this[type].push({
            functionName: '',
            functionDesc: '',
            applicationId: this.applicationId
          });
          break;
        case 'advantages':
          if (this[type].length >= 4) {
            this.$message.error('您已经添加4个应用亮点了，如有需要请您对之前的亮点进行概括');
            break;
          }
          this[type].push({
            advantageName: '',
            advantageDesc: '',
          });
          break;
        case 'scenes':
          if (this[type].length >= 3) {
            this.$message.error('您已经添加3个应用场景了，如有需要请您对之前的应用场景进行概括');
            break;
          }
          this[type].push({
            applicationSceneTitle: '',
            applicationSceneDesc: ''
          });
      }
    },
    //图片模式保存提交
    submitPictureModel () {
      if (this.fileList.length > 0) {
        let postObj = [{
          url: this.fileList[0].url
        }];
        applicationpost(`manage/pictureList?applicationId=${this.applicationId}`, JSON.stringify(postObj)).then(res => {
          this.$message.success('提交成功');
        }).catch(err => {
          console.log(err);
          this.$message.error('提交失败');
        });
      } else {
        this.$message.error('请至少上传一张图片再进行提交');
      }
    },
    //字段模式保存提交
    submitFieldModelInfo () {
      let functionFlags = [],
          advantageFlags = [];
      //必填表单校验
      for (let i = 0; i < 2; i++) {
        functionFlags[i] = false;
        advantageFlags[i] = false;
        this.$refs['functionForm'][i].validate(valid => {
          if (valid) {
            functionFlags[i] = true;
          } else {
            return false;
          }
        });
        this.$refs['advantageForm'][i].validate(valid => {
          if (valid) {
            advantageFlags[i] = true;
          } else {
            return false;
          }
        });
      }
      if (functionFlags.every(value => {
        return value
      }) && advantageFlags.every(value => {
        return value
      })) {
        //去除有空输入框的项
        for (let i = Math.max(this.functions.length, this.advantages.length, this.scenes.length) - 1; i >= 0; i--) {
          if (this.functions[i] && (this.functions[i].functionName.length === 0 || this.functions[i].functionDesc.length === 0)) {
            this.functions.splice(i, 1);
          }
          if (this.advantages[i] && (this.advantages[i].advantageName.length === 0 || this.advantages[i].advantageDesc.length === 0)) {
            this.advantages.splice(i, 1);
          }
          if (this.scenes[i] && (this.scenes[i].applicationSceneTitle.length === 0 || this.scenes[i].applicationSceneDesc.length === 0)) {
            this.scenes.splice(i, 1);
          }
        }
        //应用详情截图
        let introImgs = [];
        for (let item of this.screenshot) {
          introImgs.push({
            name: '',
            url: item.url
          });
        }
        //应用场景图片
        let scenes = [];
        for (let i = this.scenes.length - 1; i >= 0; i--) {
          scenes[i] = Object.assign({}, this.scenes[i]);
          scenes[i].applicationSceneImg = this.scenesList[i] ? this.scenesList[i].url : '';
        }
        //应用亮点关键字
        let keyRegExp = /(?<=(\(|\（))(.+?)(?=(\)|\）))/g,
            nameRegExp = /(\(|\（)(.+?)(\)|\）)/;
        for (let i = 0; i < this.advantages.length; i++) {
          let key = this.advantages[i].advantageName.match(keyRegExp);
          if (key) {
            this.advantages[i].advantageKeyWord = key[0];
            this.advantages[i].advantageName = this.advantages[i].advantageName.replace(nameRegExp, key[0]);
          } else {
            this.advantages[i].advantageKeyWord = key;
          }
        }
        let postObj = {
          advantageFlag: this.advantageFlag,
          advantages: Object.assign([], this.advantages),
          functionFlag: this.functionFlag,
          functions: Object.assign([], this.functions),
          sceneFlag: this.sceneFlag,
          scenes: scenes,
          introImgFlag: this.introImgFlag,
          introImgs: introImgs
        };
        console.log(postObj);
        applicationpost(`manage/field?applicationId=${this.applicationId}`, postObj).then(res => {
          if (typeof res.data === 'string') {
            this.$message.success('提交成功');
            this.getAppDetailInfo(this.applicationId);
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(err => {
          console.log(err);
          this.$message.error('提交失败');
        });
      }
    },
    //操作指引提交
    saveEditor () {
      applicationpost(`manage/operaGuidelines?applicationId=${this.applicationId}`, this.editor.txt.html()).then(res => {
        if (typeof res.data === 'string') {
          this.$message.success('提交成功');
        }
      }).catch(err => {
        console.log(err);
        this.$message.error('提交失败');
      });
    },
    //应用上下架
    upOrDownApp () {
      let tip = this.configForm.isGrounding === '1' ? '下架' : '发布';
      this.$confirm(`是否确定${tip}此应用`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        applicationget(`upApp?applicationId=${this.applicationId}&groundingType=${this.configForm.isGrounding === '1' ? '0' : '1'}`).then(res => {
          this.$message.success(`${tip}成功`);
          this.getAppInfo(this.applicationId);
          this.getAppDetailInfo(this.applicationId);
        }).catch(err => {
          console.log(err);
          this.$message.error(`${tip}失败`);
        });
      }).catch(() => {});
    },
    //图片遮罩层
    imgModal () {
      document.addEventListener('mouseover', event => {
        let target = event.target;
        if (target.className === 'el-upload-list__item-thumbnail') {
          this.imgUrl = target.src;
          let modal = target.parentNode.querySelector('.view-big-img');
          if (!modal) {
            let icon = document.createElement('i');
            icon.className = 'el-icon-zoom-in view-big-img';
            target.parentNode.appendChild(icon);
          } else {
            modal.style.display = 'inline-flex';
          }
        }
      });
      document.addEventListener('mouseout', event => {
        let target = event.target;
        if (target.className === 'el-icon-zoom-in view-big-img') {
          target.style.display = 'none';
        }
      });
      document.addEventListener('click', event => {
        let target = event.target;
        if (target.className === 'el-icon-zoom-in view-big-img') {
          this.dialogVisible = true;
        }
      });
    }
  },
  computed: {
    appDetailModel () {
      return this.configModel === '图片模式' ? true : false;
    }
  },
  watch: {
    configForm: {
      handler () {
        if (this.ischanged) {
          this.changeFlag = true;
        }
      },
      deep: true
    },
    functions: {
      handler () {
        if (this.ischangedDetail) {
          this.functionFlag = true;
        }
      },
      deep: true
    },
    advantages: {
      handler () {
        if (this.ischangedDetail) {
          this.advantageFlag = true;
        }
      },
      deep: true
    },
    screenshot: {
      handler () {
        if (this.ischangedDetail) {
          this.introImgFlag = true;
        }
      },
      deep: true
    },
    scenes: {
      handler () {
        if (this.ischangedDetail) {
          this.sceneFlag = true;
        }
      },
      deep: true
    },
    scenesList: {
      handler () {
        if (this.ischangedDetail) {
          this.sceneFlag = true;
        }
      },
      deep: true
    },
    ischanged () {
      if (this.ischanged === false) {
        setTimeout(() => {
          this.ischanged = true;
        }, 0);
      }
    },
    ischangedDetail () {
      if (this.ischangedDetail === false) {
        setTimeout(() => {
          this.ischangedDetail = true;
        }, 0);
      }
    },
    configModel () {
      this.getAppDetailInfo(this.applicationId);
    }
  },
  created () {
    this.applicationId = sessionStorage.getItem('applicationId');
    if (!this.applicationId) {
      this.$router.push({ name: 'applicationConfig' });
    } else {
      //获取应用分类选项列表
      applicationget(`businessTypeList`).then(res => {
        this.typeItems = res.data;
      }).catch(err => {
        console.log(err);
      });
      this.getAppInfo(this.applicationId);
      // this.getAppDetailInfo(this.applicationId);
    }
    if (!sessionStorage.getItem('active')) {
      sessionStorage.setItem('active', 'first');
    }
    this.tabsActive = sessionStorage.getItem('active');
  },
  mounted () {
    //初始化富文本编辑器配置
    let context = this;
    this.editor = new Editor('#operating-instructions');
    this.editor.customConfig.uploadImgServer = `${exportRootUrl}/application/plat/auth/images/upload`;
    this.editor.customConfig.showLinkImg = false;
    this.editor.customConfig.customAlert = function (info) {
      context.$message.error(info);
    };
    this.editor.customConfig.uploadImgHeaders = {
      'Authorization': localStorage.getItem('token'),
      'Accept': 'application/json'
    };
    this.editor.customConfig.uploadImgHooks = {
      before: function (xhr, editor, files) {
        const isJPG = files[0].type === 'image/jpeg';
        const isPng = files[0].type === 'image/png';
        const isLimit = files[0].size / 1024 / 1024 < 1;
        if (!isLimit) {
          return {
            prevent: true,
            msg: '上传的图片大小不能超过1M'
          };
        }
        if (!isJPG && !isPng) {
          return {
            prevent: true,
            msg: '上传的图片格式只能为jpg或png'
          };
        }
      },
      customInsert (insertImg, result, editor) {
        insertImg(result.url);
      }
    };
    this.editor.customConfig.uploadFileName = 'file';
    this.editor.customConfig.menus = [
      'head',  // 标题
      'bold',  // 粗体
      'fontSize',  // 字号
      'fontName',  // 字体
      'italic',  // 斜体
      'underline',  // 下划线
      'strikeThrough',  // 删除线
      'foreColor',  // 文字颜色
      'backColor',  // 背景颜色
      'link',  // 插入链接
      'list',  // 列表
      'justify',  // 对齐方式
      'quote',  // 引用
      'image',  // 插入图片
      'table',  // 表格
      'code',  // 插入代码
      'undo',  // 撤销
      'redo'  // 重复
    ];
    this.editor.create();
    this.imgModal();
  },
  destroyed () {
    sessionStorage.removeItem('active');
    // sessionStorage.removeItem('applicationId');
  },
  components: { pageTitle }
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px 24px 0;
  margin-bottom: 66px;
}
.form-items {
  border-left: 1px solid #E6E6E6;
  border-bottom: 1px solid #E6E6E6;
  border-right: 1px solid #E6E6E6;
  background: #FBFDFF;
  padding: 40px 54px 0;
  hr {
    margin: -2px 0 20px;
  }
}
.submit-item {
  padding-left: 54px;
  margin: 20px 0 0;
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

.config-model {
  margin: 28px 0 16px;
}
.app-detail-config {
  border: 1px solid #E6E6E6;
  background: #FBFDFF;
  padding: 30px 24px;
}
.submit-btn {
  margin: 20px 24px 50px;
}
.point-items {
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
  .el-input {
    max-width: 300px;
  }
}
.count-statistics {
  font-size: 14px;
  color: #425B77;
  letter-spacing: 0.2px;
  margin-left: 10px;
}
.static-width {
  width: 40px;
}
.delete-btn {
  margin-right: 50px;
}
.add-btn {
  margin-bottom: 25px;
}
.screenshot-form {
  margin: 7px 0 25px;
}
.add-tip {
  font-size: 12px;
  color: #3C9EF8;
  letter-spacing: 0.2px;
  text-decoration: underline;
}

.operation-tip {
  margin: 20px 0 15px;
  font-size: 14px;
  color: #333;
  letter-spacing: 0;
}

.publish-info {
  border-top: 1px solid #E6E6E6;
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #FFF;
  margin-left: -20px;
  height: 66px;
  display: flex;
  align-items: center;
  z-index: 1000;
}
.first-btn {
  margin-left: 44px;
}
.app-state {
  font-size: 14px;
  color: #425B77;
  letter-spacing: 0;
  margin-left: 20px;
  span {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    vertical-align: middle;
    margin-left: 10px;
  }
}
.unpublished {
  background: #DB524B;
}
.published {
  background: #58B957;
}

.big-img {
  width: 100%;
}
</style>

<style lang="scss">
@import './applicationManage';
.edit-and-publish-app-conf {
  .view-big-img {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(0, 0, 0 , 0.3);
    color: #FFF;
    font-size: 20px;
    width: 130px;
    height: 130px;
    z-index: 2;
    cursor: pointer;
  }
  .w-e-text-container {
    z-index: 100 !important;
  }
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
  .el-upload-list__item {
    margin-top: 20px;
    width: 170px;
    height: 150px;
    img {
      width: 130px;
      height: 130px;
    }
    .el-icon-close-tip {
      color: #FFF;
    }
  }
  .el-tabs__header {
    margin: 0;
  }
  .desc-wrap {
    .el-form-item__content {
      display: flex;
      align-items: flex-end;
      line-height: 18px;
    }
  }
  .field-model {
    .el-upload-list__item {
      display: inline-block;
      margin-right: 20px;
      margin-top: 23px;
    }
  }
}
</style>
