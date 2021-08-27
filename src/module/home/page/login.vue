<template>
  <div class="login-container">
    <el-form :model="userLoginRuleForm" :rules="userLoginRules" status-icon ref="userLoginRuleForm"
             class="demo-ruleForm login-page">
      <h3 class="title">用户登录</h3>
      <el-form-item prop="userName">
        <el-input type="text" v-model="userLoginRuleForm.userName" auto-complete="off" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="userLoginRuleForm.password" auto-complete="off" placeholder="请输入密码" @keyup.enter.native="submitLoginRuleForm"></el-input>
      </el-form-item>
      <el-form-item style="width:100%;margin-top: 20px;">
        <el-button type="primary" style="width:100%;" @click="submitLoginRuleForm" :loading="logining">登录</el-button>
        <br>
        <el-button style="width:100%;" @click="register">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

    import * as homeApi from '../api/home';
    export default {
        data() {
            return {
                logining: false,
                userLoginRuleForm: {
                    userName: '',
                    password: '',
                },
                userLoginRules: {
                    userName: [{
                        required: true,
                        message: '手机号不能为空',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: '密码不能为空',
                        trigger: 'blur'
                    }]
                }
                /* ,checked: false */
            }
        },
        methods: {
            submitLoginRuleForm(phone,password) {
                phone = this.userLoginRuleForm.userName;
                password = this.userLoginRuleForm.password;
                this.$refs.userLoginRuleForm.validate((valid) => {

                    homeApi.user_login(phone,password).then(res=>{
                            if(res.success){
                                this.$message({
                                    message: '登录成功',
                                    type: 'success'
                                });
                                console.log(res)
                                let user= JSON.stringify(res.data);
                                let userStr = encodeURIComponent(user);
                                sessionStorage.setItem("activeUser",userStr);
                                this.$router.push({
                                    path: '/home'
                                })
                            }else {
                                this.$message({
                                    message: res.data,
                                    type: 'error'
                                });
                            }
                        }).catch(error=>{
                            console.log("系统异常请联系管理员")
                        })
                })
            },
            register(){
                this.$router.push({
                    path:'/register'
                })
            }
        }
    };
</script>

<style scoped>
  .login-container {
    width: 100%;
    height: 100%;
  }

  .login-page {
    -webkit-border-radius: 5px;
    border-radius: 10px;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  /*  label.el-checkbox.rememberme {
      margin: 0px 0px 15px;
      text-align: left;
    } */
  #wjPwd{
    text-decoration: none;
    color: #409EFF;
  }
  #wjPwd:hover{
    color: orange;
  }
</style>
