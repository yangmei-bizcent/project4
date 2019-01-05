<template>
    <div class="page-container page-sendmsg">
        <el-row class="paddingX15">
            <page-title :options="pageTitleOptions" :hasBtn="true" @click="backTo">短信模板</page-title>
            <el-row :gutter="22" class="template-group">
                <el-col
                    :span="8"
                    v-for="(item, index) in msgTemplateData"
                    :key="index">
                    <div class="template-wrap">
                        <div>
                            <span class="template-title">{{ item.platTitleDesc }}</span>
                            <el-button-group class="template-btn-group">
                                <el-button type="text" @click="copyMsg(item.platMessageSmsId, item.platContentDesc)"><i class="copy-btn"></i> 选择</el-button>
                                <el-button type="text" @click="deleteMsg(item.platMessageSmsId,index)"><i class="delete-btn"></i> 删除</el-button>
                            </el-button-group>
                        </div>
                        <div class="template-content">
                            <img class="start-quotation" src="@/assets/img/startQuotation.png" />
                            <img class="end-quotation" src="@/assets/img/endQuotation.png" />
                            <p>{{ item.platContentDesc }}</p>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="create-template" @click="addMsgTemplt">
                        <div>
                            <img src="@/assets/img/add.png" />
                            <p>新建模板</p>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-row>
        <el-row class="paddingX15">
            <page-title :hasBtn="false">短信编辑框</page-title>
            <el-form :model="sendMsgForm" :rules="rules" ref="sendMsgForm" label-width="100px">
                <el-form-item label="收信人">
                    <el-tag v-for="(item, index) in orgInfo" :key="index" type="info" class="marginright15">{{ item.name }}</el-tag>
                </el-form-item>
                <el-form-item prop="newMsg">
                    <el-input
                        type="textarea"
                        resize="none"
                        :rows="5"
                        v-model="sendMsgForm.newMsg">
                    </el-input>
                </el-form-item>
                <!-- <el-form-item label="请输入您的验证码" prop="imgCode" class="img-code-item">
                    <el-input ref="imgCode" placeholder="请输入验证码" v-model="sendMsgForm.imgCode">
                        <template @click="refreshImgCode" slot="append">验证码图片</template>
                    </el-input>
                    <img src="@/assets/img/orgzCode.png" @click="refreshImgCode" />
                </el-form-item> -->
                <el-form-item>
                    <el-button type="primary" @click="submitForm('sendMsgForm')" class="confirm-btn">确认发送</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-dialog
            title="新增短信模板"
            :visible.sync="addMsgDlgVisible"
            width="40%"
            :before-close="handleClose">
            <div>
                <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入内容"
                    v-model="inputMsg">
                </el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addMsgDlgVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmAddMsg">确 定</el-button>
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
                hasIcon: true
            },
            addMsgDlgVisible: false,
            inputMsg: '',   // 弹出框编辑短信内容
            activeMsgId: '',    // 当前编辑的短信ID
            msgTemplateData: [],
            sendMsgForm: {
                addressee: [],  // 收信人
                newMsg: '',
                imgCode: '',
            },
            orgInfo:"",
            phoneNum:"",
            rules: {
                newMsg: [
                    {required: true, message: '请输入短信内容', trigger: 'blur'},
                ],
                imgCode: [
                    {required: true, message: '请输入图片验证码', trigger: 'blur'},
                ],
            },
        }
    },
    mounted() {
        var self = this;
        this.getMsgList();
        self.sendMsgForm.addressee = JSON.parse(localStorage.getItem('addresseeArr'));
        this.orgInfo=JSON.parse(sessionStorage.getItem("Allinfo"));
        this.phoneNum=this.orgInfo.map(item=>{
            return item.linkmanPhone;
        })

        // console.log(self.sendMsgForm.addressee);
    },
    methods: {
        getMsgList(){
            this.$store.dispatch({
                type:"GetMsgListF"
            }).then((res)=>{
                // console.log(res)
                if(res.data!=null){
                    this.msgTemplateData=JSON.parse(JSON.stringify(res.data));
                }
                
                
            })
        },
        backTo () {
            this.$router.push('/userManage/hosUserManage');
        },
        refreshImgCode() {
            
        },
        submitForm(formName) {

            let json={
                phoneNumberList:this.phoneNum,
                contentSms:this.sendMsgForm.newMsg
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$store.dispatch({
                        type:"sendMsgF",
                        data:json
                    }).then((res)=>{
                        if (res.data.code == 'success') {
                            this.sendMsgForm.newMsg="";
                            this.$alert('发送成功', '提示');
                        } else if (res.data.code == 'warn') {
                            this.$message.warning(res.data.msgs);
                        }
                    })

                    
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        handleClose() {
            this.addMsgDlgVisible = false;
        },
        addMsgTemplt() {
            var self = this;
            self.addMsgDlgVisible = true;
            self.inputMsg = '';
           
        },
        copyMsg(id, content) {
            var self = this;
            this.sendMsgForm.newMsg=content;
            this.$message({
                type: 'success',
                message: '选择成功!'
            });
            // self.$copyText(content).then(function (e) {
            //     self.$message({
            //         type: 'success',
            //         message: '复制成功!'
            //     });
            //     console.log(e)
            // }, function (e) {
            //     self.$message.error('复制失败!');
            //     console.log(e)
            // })
        },
        deleteMsg(id,index) {
            var self = this;
            this.$confirm('确定删除此短信模板?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store.dispatch({
                    type:"DeleteMsgF",
                    platMessageSmsId:id
                }).then((res)=>{
                    // console.log(res);
                    if(res.data.code=="success"){
                        this.msgTemplateData.splice(index,1);
                        this.getMsgList();
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }
                     
                })
               
            }).catch(() => {
                          
            });
        },
        confirmAddMsg() {
            //  确定修改短信模板内容
            var self = this;
            // 调接口提交修改
            // 成功的话
            if(this.inputMsg=="" || this.inputMsg==null){
                self.$message({
                    message: '请输入短信内容！',
                    type: 'warning'
                });
                return
            }
            self.addMsgDlgVisible = false;
            this.$store.dispatch({
                type:"AddMsgF",
                tpmsPlatMessageSms:{'platContentDesc':this.inputMsg,'platMessageType':"user_sys"}
            }).then((res)=>{
                if (res.data.code == 'success') {
                    this.getMsgList();
                    self.$message({
                        message: '新增成功！',
                        type: 'success'
                    });
                } else if (res.data.code == 'warn') {
                    this.$message({
                        message: res.data.msgs,
                        type: 'warning'
                    });
                }
            })
           
        },
    },
    components: {
        pageTitle
    }
}
</script>

<style lang="scss" scoped>
.template-group {
    .el-col {
        padding-bottom: 20px;
    }
}
.template-wrap {
    height: 185px;
    background: #F7F7F7;
    padding: 14px 20px;
}
.template-title {
    font-family: MicrosoftYaHei-Bold;
    font-size: 12px;
    color: #425B77;
    font-weight: bold;
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
.copy-btn {
    background: url('~@/assets/img/copy.png') center no-repeat;
}
.delete-btn {
    background: url('~@/assets/img/delete.png') center no-repeat;
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
.create-template {
    background: #FFF;
    border: 1px dashed #CCC;
    border-radius: 4px;
    height: 185px;
    cursor: pointer;
    div {
        display: flex;
        align-items: center;
        flex-flow: column;
    }
    p {
        font-size: 14px;
        color: #333;
        letter-spacing: 0.2px;
    }
    img {
        margin: 72px 0 1px;
    }
}
.confirm-btn {
    padding: 9px 11px;
}
</style>

<style lang="scss">
    .page-sendmsg {
        .padding0 {
            padding: 0;
        }
        .el-tag--info {
            background: #F2F2F2;
            border-color: #F2F2F2;
            color: #333;
            letter-spacing: 0.2px;
            font-size: 14px;
        }
        .el-form-item__label {
            color: #425B77;
            letter-spacing: 0.2px;
        }
        .img-code-item {
            width: 465px;
            .el-form-item__label {
                line-height: 18px;
                text-align: left;
                &:before {
                    content: '';
                    margin: 0;
                }
            }
            .el-input {
                width: 260px;
            }
            img {
                height: 40px;
                width: 97px;
                float: right;
                cursor: pointer;
            }
        }
    }
</style>
