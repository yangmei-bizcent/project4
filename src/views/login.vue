<template>
    <div class="page-login">
      <ts-login :top-tab="toptab" :tab-index="tabindex" :logo="loginLogo">
        <template v-if="tabindex.index==1">
          <el-form :model="loginForm" :rules="rules" ref="loginForm">
              <el-form-item prop="phone">
                  <el-input v-model="loginForm.phone" placeholder="输入用户名">
                    <img src="../assets/img/name.png" slot="prefix">
                  </el-input>
              </el-form-item>
              <el-form-item prop="password">
                  <el-input type="password" v-model="loginForm.password" placeholder="输入密码" auto-complete="off">
                    <img src="../assets/img/password.png" slot="prefix">
                  </el-input>
              </el-form-item>
              <el-form-item class="forget">
                  <el-checkbox v-model="loginForm.remember">10天内免登录</el-checkbox>
                  <a href="">忘记密码？</a>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
              </el-form-item>
              <el-form-item>
                  <p><a>申请使用</a></p>
              </el-form-item>
          </el-form>
        </template>
      </ts-login>
      <div class="foot">
        <p class="fontstyl">Copyright © 2000-2017 DXY All Rights Reserved.</p> 
        <p class="fontstyl2">浙B2-20070219(含BBS) （浙）-经营性-2017-0006 浙公网安备 33010802004314 号</p>
      </div>
    </div>
    
</template>

<script>
import loginLogo from "../assets/img/logo.png"
import loginBg from "../assets/img/500003099.png"

export default {
    data() {
      var validatePhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入手机号码'));
        }
        else if(!/^((1[3-9][0-9])+\d{8})$/.test(value))
        {
           return callback(new Error('请输入正确的手机号码'));
        }
        return callback();
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }
        else{
            var reg = /[\u4e00-\u9fa5]/;
            if(reg.test(value)) {
                callback(new Error('密码可输入字母/数字/大写字母/特殊符号'));
            }
        }
        return callback();
      };
      return {
        loginLogo,
        loginBg,
        // orgzOptions: [{
        //     value: '1',
        //     label: '卓健科技'
        //   }, {
        //     value: '2',
        //     label: '浙江省人民医院'
        //   }, {
        //     value: '3',
        //     label: '杭州市第一人民医院'
        //   }],
        toptab: [
          {
            text: "账号登录"
          }
        ],
        tabindex: {
          index: 1
        },
        loginForm: {
          phone: '',
          password: '',
          orgz: '',
          remember: false,
        },
        rules: {
          phone: [
            // {required: true, message: '请输入手机号码', trigger: 'blur'},
            {min: 11, max: 11, message: '请输入正确的手机号码', trigger: 'blur'},
            { validator: validatePhone, trigger: 'blur' }
          ],
          password: [
            {min: 6, max: 16, message: '密码长度为6-16位', trigger: 'blur'},
            { validator: validatePass, trigger: 'blur' }
          ]
        }
      };
    },
    mounted() {
      document.getElementsByClassName("ts-leftbg")[0].firstChild.src = this.loginBg;
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('submit!');
            this.$store.dispatch('login',{req:{password:this.loginForm.password, phone:this.loginForm.phone}}).then(()=>{
              this.$router.push('/userManage/hosUserManage')
            })
            // this.$router.push('/hosUserManage')
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    }
  }
</script>

<style lang="scss">
.page-login {
  .foot {
    position: fixed;
    bottom: 0px;
    left: 0;
    right: 0;
    opacity: 0.3;
    height: 77px;
    background: #2F3C4E;
    .fontstyl {
        margin-top: 20px;
        font-family: 微软雅黑;
        font-size: 12px;
        color: #FFFFFF;
        text-align: center;
    }
    .fontstyl2 {
        font-family: 微软雅黑;
        font-size: 12px;
        color: #FFFFFF;
        text-align: center;
    }
}
  .ts-logindiv .ts-formdiv .ts-leftbg {
    width: 411px;
    left: -10%;
  }
  .el-form {
    width: 100%;
    margin-top: 50px;
    
    .el-form-item__content {
      font-size: 12px;
      color: #425B77;
      letter-spacing: 0;
      p {
        text-align: center;
      }
    }
    .el-input__inner {
      border-top: none;
      border-left: none;
      border-right: none;
      border-radius: 0;
    }

    .el-form-item.forget {
      .el-form-item__content {
        position: relative;
        .el-checkbox {
          .el-checkbox__label {
            font-size: 12px;
            color: #425B77;
            letter-spacing: -0.29px;
          }
        }
        a {
          position: absolute;
          right: 0;
        }
        // display: flex;
        // justify-content: space-between;
      }
    }

    .el-button.el-button--primary {
      width: 100%;
    }
  }
}
</style>


