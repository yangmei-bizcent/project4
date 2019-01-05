<template>
    <div class="page-container page-certifauditdetail">
        <div class="certif-title">
            <span>{{ applyState == 0?'待审核':'已审核' }}</span>
            <el-button size="small" @click="$router.push('/userManage/certifAudit')"><img src="../../assets/img/back.png" />返回</el-button>
        </div>
        <el-form label-position="right" label-width="110px" :model="certifAuditDetail">
            <el-form-item label="机构名称">
                <div>{{ certifAuditDetail.name }}</div>
            </el-form-item>
            <el-form-item label="机构类别">
                <div>{{ certifAuditDetail.projectCategory }}</div>
            </el-form-item>
            <el-form-item label="机构地址">
                <div>{{certifAuditDetail.province}} {{certifAuditDetail.city}} {{certifAuditDetail.area}} {{ certifAuditDetail.address }}</div>
            </el-form-item>
            <el-form-item label="组织机构代码">
                <div>{{ certifAuditDetail.authCode }}</div>
            </el-form-item>
            <el-form-item label="组织机构代码证明证件">
                <div class="flex-align-start flex-wrap">
                    <div
                      v-for="(item, index) of certifAuditDetail.codeUrl ? JSON.parse(certifAuditDetail.codeUrl) : []"
                      :key="index"
                      class="paddingX5 padding5X relative marginright15 height150"
                      @mouseover="showLargeImgTool('largeProveImgTool', index)"
                      @mouseleave="hideLargeImgTool('largeProveImgTool', index)">
                        <div
                          class="absolute textAlignCenter cursorPointer displayNone largeImgTool largeProveImgTool"
                          @click="showLargeImg(item.url)">
                            <i class="el-icon-zoom-in color-white"></i>
                        </div>
                        <img :src="item.url" alt="组织机构代码证明证件" class="height100">
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="医疗机构执业许可证登记号">
                <div>{{ certifAuditDetail.licenceNumber }}</div>
            </el-form-item>
            <el-form-item label="医疗机构执业许可证">
                <div class="flex-align-start flex-wrap">
                    <div
                      v-for="(item, index) of certifAuditDetail.licenceUrl ? JSON.parse(certifAuditDetail.licenceUrl) : []"
                      :key="index"
                      class="paddingX5 padding5X relative marginright15 height150"
                      @mouseover="showLargeImgTool('largeLicenseImgTool', index)"
                      @mouseleave="hideLargeImgTool('largeLicenseImgTool', index)">
                        <div
                          class="absolute textAlignCenter cursorPointer displayNone largeImgTool largeLicenseImgTool"
                          @click="showLargeImg(item.url)">
                            <i class="el-icon-zoom-in color-white"></i>
                        </div>
                        <img :src="item.url" alt="组织机构代码证" class="height100">
                    </div>
                </div>
            </el-form-item>

            <el-dialog title="查看大图" :visible.sync="imgDlgVisible" id="img-dialog" v-dialogDrag>
                <div class="textAlignCenter">
                    <img class="big-pic" :src="LargeImgSrc">
                </div>
            </el-dialog>
            <!-- <div v-for="(item, index) in historyAudits" :key="index">
                        <el-form-item label="审核时间">
                            <div>{{ item.time }}</div>
                        </el-form-item>
                        <el-form-item label="审核批注">
                            <div>{{ item.desc }}</div>
                        </el-form-item>
                    </div> -->
            <div v-if="applyState == 1" style="padding-bottom:36px;">
                <div class="certif-title">
                    <span>管理员审核</span>
                </div>
                <el-form-item label="审核时间">
                    <div>{{ auditResult.auditTime |formatDate}}</div>
                </el-form-item>
                <el-form-item label="审核结果">
                    <div class="auditResult" :class="{auditPass: auditResult.auditPostil ? false : true}">{{auditResult.auditPostil ? '审核不通过' : '审核通过'}}</div>
                </el-form-item>
                <el-form-item label="驳回理由" v-if="auditResult.auditPostil">
                    <div class="refuse-reason">{{ auditResult.auditPostil }}</div>
                </el-form-item>
                <el-form-item label="审核人">
                    <div>{{ auditResult.auditName }}</div>
                </el-form-item>
            </div>
        </el-form>
        <el-form label-position="right" label-width="110px" :model="formData" :rules="rules" ref="certifAuditDetail">
          <div v-if="applyState==0">
              <div class="certif-title">
                  <span>历史审核驳回记录</span>
              </div>
              <el-table class="reject-table"
                :data="certifAuditDetail.auditHospitalList ? certifAuditDetail.auditHospitalList.filter((item,index,array) => {return item.auditStatus == '30'}) : []"
                border stripe tooltip-effect="dark">
                  <el-table-column label="认证申请提交时间" prop="submitTime" width="180" align="center"></el-table-column>
                  <el-table-column label="驳回操作者" prop="auditName" width="100" align="center"></el-table-column>
                  <el-table-column label="驳回内容" prop="auditPostil" show-overflow-tooltip align="center"></el-table-column>
                  <el-table-column label="审核驳回时间" prop="auditTime" width="180" align="center" :formatter="dateFormater"></el-table-column>
              </el-table>
              <div class="certif-title">
                  <span>管理员批注</span>
              </div>
              <el-form-item label="驳回内容" prop="rejectContent">
                  <el-input type="textarea" :rows="3" placeholder="请输入驳回内容" v-model="formData.rejectContent">
                  </el-input>
              </el-form-item>
              <p class="hint">
                  <i class="el-icon-ts-mark2" style="color:#F6A810;"></i>驳回内容需要返回显示给用户查看，请谨慎详细填写。
              </p>
          </div>
          <el-form-item v-if="applyState==0" label="">
              <div class="flex-align-start flex-wrap margin30X">
                  <el-button type="primary" size="small" @click.native="pass">审核通过</el-button>
                  <el-button type="danger" size="small" @click="submitForm('certifAuditDetail')">审核不通过</el-button>
                  <!-- <el-button type="default" @click="donotAudit">暂不审核</el-button> -->
              </div>
          </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import fecha from 'fecha';
import { formatDate2 } from '../../util/date.js';
export default {
  data() {
    let rejectContentValidate = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入驳回内容"));
      } else if (value.length >= 500) {
        callback(new Error("输入内容过长"));
      } else {
        callback();
      }
    };
    return {
      applyState: "",
      auditPass: false,
      imgDlgVisible: false,
      checkPendingCode: "10",
      checkingCode: "20",
      checkedSuccessCode: "40",
      checkedFailCode: "30",
      orgzId: "",
      rejectContent: "",
      LargeImgSrc: "", // 大图src
      formData: {
        rejectContent: ""
      },
      rules: {
        rejectContent: [
          // {required: true, message: '请输入驳回内容', trigger: 'blur'},
          { validator: rejectContentValidate, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapGetters({
      token: "token",
      certifAuditDetail: "PlatformHospitalByPhId"
    }),
    auditResult() {
      if (this.certifAuditDetail.auditHospitalList instanceof Array) {
        return this.certifAuditDetail.auditHospitalList[
          this.certifAuditDetail.auditHospitalList.length - 1
        ];
      } else {
        return {};
      }
    }
  },
    filters:{
        formatDate:function (val) {
            return formatDate2(val);
        }
    },

  async created() {
    this.applyState = localStorage.getItem("applyState");
    this.orgzId = this.$route.query["orgzId"];
    await this.$store.dispatch({
      type: "getPlatformHospitalByPhId",
      phid: this.orgzId
    });
  },
  mounted() {},
  methods: {
     dateFormater: function(row, column, cellValue){
        return cellValue ? fecha.format(new Date(cellValue.replace(/-/g,"/")), 'YYYY-MM-DD HH:mm') : '';
      },
    // 鼠标放上去时 显示放大镜
    showLargeImgTool(overlayClassname, index) {
      document.getElementsByClassName(overlayClassname)[index].style.display =
        "block";
    },
    hideLargeImgTool(overlayClassname, index) {
      document.getElementsByClassName(overlayClassname)[index].style.display =
        "none";
    },
    showLargeImg(src) {
      // window.open(src);
      const dialog = document.querySelector('#img-dialog .el-dialog');
      dialog.style.top = 0;
      dialog.style.left = 0;
      this.imgDlgVisible = true;
      this.LargeImgSrc = src;
    },
    donotAudit() {
      console.log("暂不审核");
      this.$router.push({
        path: "/certifAudit"
      });
    },
    // 审核通过
    pass() {
      this.$confirm("确定审核通过?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let temp = Object.assign({}, this.certifAuditDetail);
          temp.auditStatus = this.checkedSuccessCode;
          temp.auditPostil = "";
          this.$store
            .dispatch({
              type: "adminPatchPlatformHospital",
              data: temp
            })
            .then(res => {
              if (res.status == 200) {
                this.$alert("审核完成", "提示", {
                  confirmButtonText: "确定",
                  callback: action => {
                    this.$router.push({
                      path: "/userManage/certifAudit",
                      query: {
                        // applyState: this.applyState
                      }
                    });
                  }
                });
              }
            })
            .then(() => {
                  this.$store.dispatch({
                    type: "sendMsgSuccInfo",
                    data: this.certifAuditDetail
                  });
                });
            
        })
        .catch(() => {});
    },
    submitForm(formName, ifAudit) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 审核不通过
          this.$confirm("确定审核不通过?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              let temp = Object.assign({}, this.certifAuditDetail);
              temp.auditStatus = this.checkedFailCode;
              temp.auditPostil = this.formData.rejectContent;
              this.$store
                .dispatch({
                  type: "adminPatchPlatformHospital",
                  data: temp
                }) 
             
                .then(res => {
                  if (res.status == 200) {
                    this.$alert("审核完成", "提示", {
                      confirmButtonText: "确定",
                      callback: action => {
                        this.$router.push({
                          path: "/userManage/certifAudit",
                          query: {
                            // applyState: this.applyState
                          }
                        });
                      }
                    });
                  }
                })
                  .then(() => {
                  this.$store.dispatch({
                    type: "sendMsgFailInfo",
                    data: temp
                  });
                });
            })
            .catch(() => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.big-pic {
  max-width: 100%;
}
.refuse-reason {
  word-wrap:break-word;
}
</style>

<style lang="scss">
.page-certifauditdetail {
  padding: 15px 28px;
  .el-dialog__wrapper {
    overflow: hidden;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  .idCardImg {
    width: 300px;
  }
  .height100 {
    height: 100%;
  }
  .height150 {
    height: 150px;
  }
  .largeImgTool {
    width: 100%;
    height: 150px;
    line-height: 150px;
    left: 0;
    top: 0px;
    background-color: rgba(0, 0, 0, 0.4);
    i {
      font-size: 28px;
    }
  }

  .certif-title {
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

  .el-form-item__label {
    color: #425b77;
    letter-spacing: 0.2px;
    padding-right: 20px;
    line-height: 20px;
  }

  .el-form-item__content {
    line-height: 20px;
  }

  .reject-table {
    margin-bottom: 30px;
  }

  .el-textarea__inner {
    width: 500px;
    height: 120px;
  }

  p.hint {
    margin-left: 104px;
    margin-top: 20px;
    font-size: 11.95px;
    color: #425b77;
    letter-spacing: -0.33px;
  }

  .el-table {
    thead.has-gutter {
      tr th {
        color: #425b77;
        letter-spacing: 0;
      }
    }
  }

  .el-button--small {
    font-size: 14px;
  }

  .auditResult {
    font-size: 14px;
    color: #db524b;
    letter-spacing: 0.2px;
    &.auditPass {
      color: #00bc9c;
    }
  }
}
</style>
