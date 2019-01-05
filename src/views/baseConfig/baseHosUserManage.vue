<template>
    <div class="page-container page-hosusermanage">
        <el-form ref="msgForm" :rules="rules" :model="msgForm" label-width="60px">
            <header class="flex-align-justifystart border-bottom-e6e6e6 marginbottom20">
                <p class="width350 fontsize4 color-425b77">向管理员发送用户注册提醒短信</p>
                <el-switch
                    class="marginleft40"
                    v-model="msgForm.registerMsg"
                    active-color="#13ce66" >
                </el-switch>
            </header>
            <el-row>
                <el-col :span="12" v-for="(item,index) in msgForm.registerMsgPhones" :key="index" style="width: 100%;">
                    <el-form-item 
                        :label="'手机'+(index+1)" 
                        :prop="'registerMsgPhones.'+index" 
                        :rules="rules.phone">
                        <el-input 
                            v-model="msgForm.registerMsgPhones[index]" 
                            class="width300"
                            placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                    <!-- <div class="template-wrap width410">
                        <div>
                            <el-button-group class="template-btn-group">
                                <el-button type="text"><i class="el-icon-ts-pjgl"></i> 修改</el-button>
                            </el-button-group>
                        </div>
                        <div class="template-content">
                            <img class="start-quotation" src="@/assets/img/startQuotation.png" />
                            <img class="end-quotation" src="@/assets/img/endQuotation.png" />
                            <p>标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题</p>
                        </div>
                    </div> -->
                </el-col>
            </el-row>
            <header class="flex-align-justifystart border-bottom-e6e6e6 margintop10 marginbottom20">
                <p class="width350 fontsize4 color-425b77">向管理员发送审核机构认证提醒短信</p>
                <el-switch
                    class="marginleft40"
                    v-model="msgForm.authenMsg"
                    active-color="#13ce66">
                </el-switch>
            </header>
            <el-row>
                <el-col :span="12" v-for="(item,index) in msgForm.authenMsgPhones" :key="index" style="width: 100%;">
                    <el-form-item 
                        :label="'手机'+(index+1)" 
                        :prop="'authenMsgPhones.'+index" 
                        :rules="rules.phone">
                        <el-input 
                            v-model="msgForm.authenMsgPhones[index]" 
                            class="width300"
                            placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                    <!-- <div class="template-wrap width410">
                        <div>
                            <el-button-group class="template-btn-group">
                                <el-button type="text"><i class="el-icon-ts-pjgl"></i> 修改</el-button>
                            </el-button-group>
                        </div>
                        <div class="template-content">
                            <img class="start-quotation" src="@/assets/img/startQuotation.png" />
                            <img class="end-quotation" src="@/assets/img/endQuotation.png" />
                            <p>标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题</p>
                        </div>
                    </div> -->
                </el-col>
            </el-row>
            <el-form-item label-width="0" class="margintop40">
                <el-button type="info" @click="submit('msgForm')">保存提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script> 
import Vuex from 'vuex'
import { Toast } from 'mint-ui';
var validatePhone;
export default {
    data() {
        validatePhone = (rule, value, callback) => {
            console.log(2222)
            if (value && !/^((1[3-9][0-9])+\d{8})$/.test(value)) {
                return callback(new Error('请输入正确的手机号码'));
            }
            return callback();
        };
        return {
            msgForm: {
                registerMsg: false,
                registerMsgPhones:[],

                authenMsg: false,
                authenMsgPhones:[]
            },
            rules: {
                phone: [{ validator: validatePhone, trigger: 'blur' }],
            }
        }
    },
    created() {
        this.getSMS();
    },
    mounted() {
        
    },
    methods: {
        arrSet(arr,length){
            if(length < 3){
                arr.push("")
                return this.arrSet(arr,length+1);
            }
        },
        clear_arr_trim(array) {
            for(var i = 0 ;i<array.length;i++){
                if(array[i] == "" || typeof(array[i]) == "undefined"){
                    array.splice(i,1);
                    i= i-1;
                }
            }
            return array;
        },
        getSMS(){
            this.$store.dispatch({
                type:'smsConfigList'
            }).then((res)=>{
            console.log(res.data);
            var info = res.data;
            if(info!=null){
                info.forEach(item => {
                    if (item.smsId=="1") {
                        this.msgForm.registerMsg = item.enabled=="0" ? true : false;
                        this.msgForm.registerMsgPhones = item.smsPhones;
                        this.arrSet(this.msgForm.registerMsgPhones,this.msgForm.registerMsgPhones.length);
                    }
                    if (item.smsId=="2") {
                        this.msgForm.authenMsg = item.enabled=="0" ? true : false;
                        this.msgForm.authenMsgPhones = item.smsPhones;
                        this.arrSet(this.msgForm.authenMsgPhones,this.msgForm.authenMsgPhones.length);
                    }
                }) 
                console.log('注册数组：', this.msgForm.registerMsgPhones); 
                console.log('认证数组：', this.msgForm.authenMsgPhones); 
            }
            // console.log(res);
            })
        },
        submit(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let registerMsgInfo = {
                        enabled: this.msgForm.registerMsg ? 0 : 1,
                        smsId: '1',
                        smsPhones: this.clear_arr_trim(this.msgForm.registerMsgPhones)
                    };
                    let authenMsgInfo = {
                        enabled: this.msgForm.authenMsg ? 0 : 1,
                        smsId: '2',
                        smsPhones: this.clear_arr_trim(this.msgForm.authenMsgPhones)
                    };
                    let res = [
                        registerMsgInfo,
                        authenMsgInfo
                    ];
                    console.log(res)
                    this.$store.dispatch({
                    type: 'smsConfigUpdate', 
                    res: res
                    }).then(()=>{
                        this.$message({
                            type: 'success',
                            message: '短信配置修改成功'
                        });
                        // this.$router.push('/baseConfig/hosUserManage');
                        this.getSMS();
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}
</script>

<style lang="scss">
.page-hosusermanage {
    .width350 {
        width: 350px;
    }
    .width300 {
        width: 300px;
    }
    .width410 {
        width: 410px;
    }
    .border-bottom-e6e6e6 {
        border-bottom: 1px solid #e6e6e6;
    }
    .el-form-item__label {
        color: #425b77;
    }
    .el-switch__label {
        color: #333;
    }
    .template-wrap {
        height: 185px;
        background: #F7F7F7;
        padding: 14px 20px;
    }
    .template-btn-group {
        font-size: 14px;
        color: #539CDB;
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
    .start-quotation {
        top: 0;
        left: 0;
    }
    .end-quotation{
        bottom: 0;
        right: 0;
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
}
</style>


