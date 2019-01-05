<template>
    <div class="page-container page-msgmanage">
        <el-row class="paddingX15">
            <page-title :options="pageTitleOptions" @click="backTo">系统发送短信模板</page-title>
            <el-row :gutter="22">
                <el-col :span="8"
                    v-for="(item, index) in msgData" 
                    :key="index" >
                    <div class="template-sort">
                        <i :class="item.titleIcon"></i><span>{{ item.platTitleDesc }}</span>
                    </div>
                    <div class="template-wrap">
                        <div>
                            <el-button-group class="template-btn-group">
                                <el-button type="text" @click="editMsg(item,index)"><i class="edit-btn"></i> 编辑</el-button>
                            </el-button-group>
                        </div>
                        <div class="template-content">
                            <img class="start-quotation" src="@/assets/img/startQuotation.png" />
                            <img class="end-quotation" src="@/assets/img/endQuotation.png" />
                            <p>{{ item.platContentDesc }}</p>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-row>
        <el-dialog
            title="编辑模板"
            :visible.sync="editMsgDlgVisible"
            width="480px"
            :before-close="handleClose">
            <div>
                <el-input
                    type="textarea"
                    :rows="5"
                    placeholder="请输入内容"
                    resize="none"
                    v-model="inputMsg">
                </el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editMsgDlgVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmEditMsg">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import pageTitle from '@/components/pageTitle';
export default {
    data() {
        return {
            pageTitleOptions: {
                btnType: 'default',
                btnText: '返回',
                hasIcon: false
            },
            editMsgDlgVisible: false,
            inputMsg: '',   // 弹出框编辑短信内容
            activeMsgId: '',    // 当前编辑的短信ID
            msgData: [],
            index:""
        }
    },
    created(){
        this.freshMsgData();
    },
    methods: {
      freshMsgData () {
        this.$store.dispatch('MsgtemplateF').then((res)=>{
          if(res.data!=null){
            this.msgData=JSON.parse(JSON.stringify(res.data));
          }
          console.log(res);
        })
      },
      backTo () {
          this.$router.go(-1)
        //   this.$router.push('/userManage/hosUserManage');
      },
      handleClose() {
         this.editMsgDlgVisible = false;
      },
      editMsg(data,index) {
          var self = this;
          this.index=index;
          self.editMsgDlgVisible = true;
          self.inputMsg = data.platContentDesc;
          self.activeMsgId = data.platMessageTemplateId;
      },
      confirmEditMsg() {
        //   确定修改短信模板内容
        var self = this;
        let data = Object.assign({}, self.msgData[self.index]);
        data.platContentDesc=self.inputMsg;
        this.$store.dispatch({
            type:"EditMsgF",
            data:data
        }).then((res)=>{
            this.freshMsgData();
            self.$message({
                type: 'success',
                message: '编辑成功!'
            });
            self.editMsgDlgVisible = false;
            console.log(res);
        }).catch(e => {
            self.$message({
                type: 'warning',
                message: '你描述的文字太长了'
            });
        })
        
        // 调接口提交修改
        // 成功的话
        
      },
    },
    components: {
        pageTitle
    }
}
</script>

<style lang="scss" scoped>
.template-sort {
    margin-bottom: 20px;
    span {
        font-size: 16px;
        color: #425B77;
        letter-spacing: 0.23px;
        vertical-align: middle;
    }
    i {
        width: 20px;
        height: 20px;
        margin-right: 10px;
        vertical-align: middle;
    }
}
.success-icon {
    background: url('~@/assets/img/success.png') center no-repeat;
}
.fail-icon {
    background: url('~@/assets/img/fail.png') center no-repeat;
}
.warn-icon {
    background: url('~@/assets/img/warn.png') center no-repeat;
}
.template-wrap {
    height: 185px;
    background: #F7F7F7;
    padding: 14px 20px;
    div {
        overflow: hidden;
    }
}
.template-btn-group {
    font-size: 14px;
    color: #539CDB;
    float: right;
    .el-button {
        padding: 0;
        margin-left: 10px;
    }
    i {
        height: 14px;
        width: 14px;
        position: relative;
        top: 2px;
    }
}
.edit-btn {
    background: url('~@/assets/img/edit.png') center no-repeat;
}
.template-content {
    padding: 14px;
    position: relative;
    margin-top: 14px;
    height: 128px;
    p {
        margin: 0;
        font-size: 14px;
        color: #333;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
        overflow: hidden;
    }
    img {
        position: absolute;
    }
}
.start-quotation {
    top: 0;
    left: 0;
}
.end-quotation{
    bottom: 0;
    right: 0;
}
</style>

<style lang="scss">
    .page-msgmanage {
        .padding3X {
            padding-top: 3px;
            padding-bottom: 3px;
        }
        .el-dialog__header {
            padding: 16px 20px;
        }
        .el-dialog__title {
            color: #425B77;
        }
        .el-dialog__body {
            border-top: 1px #CCC solid;
            border-bottom: 1px #CCC solid;
        }
        .el-dialog__footer {
            padding: 12px 20px;
            button {
                padding: 9px 15px;
            }
        }
    }
</style>
