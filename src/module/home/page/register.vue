<template>
  <div class="login-container">
    <!--编写页面静态部分，即view部分-->
    <el-form :model="pageForm" :rules="pageFormRules" status-icon  ref="pageForm" label-position="left" label-width="0px"
             class="demo-ruleForm login-page">
      <el-form-item prop="userName">
        <el-input v-model="pageForm.userName" auto-complete="false" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="pageForm.password" type="password" auto-complete="false" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <el-input v-model="pageForm.phone" auto-complete="off" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item style="width:100%;margin-top: 20px;">
        <el-button type="primary" style="width:100%;" @click="addSubmit">提交</el-button>
        <br>
        <el-button type="plain" style="width:100%;" @click="go_back" class="">返回</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
    /*编写页面静态部分，即model及vm部分。*/
    import * as homeApi from '../api/home'

    export default {
        data() {
            return {
                pageForm: {
                    userName: '',
                    password: '',
                    phone: ''
                },
                pageFormRules: {
                    userName: [
                        {
                            required: true,
                            message: '请输入用户名',
                            trigger: 'blur'
                        }
                    ],
                    password: [
                        {
                            required: true,
                            message: '请输入密码',
                            trigger: 'blur'
                        }
                    ],
                    phone: [
                        {
                            required: true,
                            message: '请输入手机号',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        methods: {
            addSubmit: function () {
                this.$refs['pageForm'].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            homeApi.register(this.pageForm).then((res) => {
                                if (res.success) {
                                    this.$message({
                                            message: '注册成功',
                                            type: 'success'
                                        }
                                    )
                                    this.go_back()
                                } else if (res.message) {
                                    this.$message.error(res.message);
                                } else {
                                    this.$message({
                                        message: res.data,
                                        type: 'error'
                                    })
                                }
                            })
                        })
                    } else {
                        this.$message({
                                message: '校验失败',
                                type: 'false'
                            }
                        )
                        return false;
                    }
                })
            },
            go_back: function () {
                this.$router.push({
                    path: '/'
                })
            }
        },
        //mounted()方法是DOM元素渲染生成完成后调用
        //created()方法是vue实例已创建但是DOM元素还没有渲染生成
        mounted() {

        }
    }
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
