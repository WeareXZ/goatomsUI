<template>
  <div>
    <!--编写页面静态部分，即view部分-->
    <el-form :model="pageForm" label-width="80px" :rules="pageFormRules" ref="pageForm">
      <el-form-item prop="shoeCode" label="型号">
        <el-input v-model="pageForm.shoeCode" auto-complete="false"></el-input>
      </el-form-item>
      <el-form-item prop="shoeSize" label="尺码">
        <el-input v-model="pageForm.shoeSize" auto-complete="false"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="pageForm.price" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="pageForm.remark" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="创建人" prop="createdBy">
        <el-input v-model="pageForm.createdBy" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker type="datetime" placeholder="创建时间" v-model="pageForm.createdTime"></el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog‐footer">
      <el-button type="plain" @click="go_back" class="">返回</el-button>
      <el-button type="primary" @click="addSubmit">提交</el-button>
    </div>
  </div>
</template>
<script>
    /*编写页面静态部分，即model及vm部分。*/
    import * as cmsApi from '../api/cms'

    export default {
        data() {
            return {
                pageForm: {
                    shoeCode: '',
                    shoeSize: '',
                    price: '',
                    pageName: '',
                    pageType: '',
                    remark: '',
                    createdBy: '',
                    createdTime: new Date()
                },
                pageFormRules: {
                    shoeCode: [
                        {
                            required: true,
                            message: '请输入型号',
                            trigger: 'blur'
                        }
                    ],
                    shoeSize: [
                        {
                            required: true,
                            message: '请输入尺码',
                            trigger: 'blur'
                        }
                    ],
                    createdBy: [
                        {
                            required: true,
                            message: '请输入创建人',
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
                            var moment = require("moment");
                            this.pageForm.createdTime = moment(this.pageForm.createdTime).format("YYYY-MM-DD HH:mm:ss");
                            cmsApi.page_add(this.pageForm).then((res) => {
                                if (res.success) {
                                    this.$message({
                                            message: '提交成功',
                                            type: 'success'
                                        }
                                    )
                                    //清空表单
                                    this.$refs['pageForm'].resetFields();
                                } else if (res.message) {
                                    this.$message.error(res.message);
                                } else {
                                    this.$message({
                                        message: '提交失败',
                                        type: 'false'
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
                    path: '/cms/page/list',
                    query: {
                        page: this.$route.query.page,
                        shoeCode: this.$route.query.shoeCode,
                        shoeSize: this.$route.query.shoeSize
                    }
                })
            }
        },
        //mounted()方法是DOM元素渲染生成完成后调用
        //created()方法是vue实例已创建但是DOM元素还没有渲染生成
        mounted() {

        }
    }
</script>
<style>
  /*编写页面样式，不是必须*/
</style>
