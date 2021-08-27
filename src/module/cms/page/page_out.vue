<template>
  <div>
    <!--编写页面静态部分，即view部分-->
    <el-form :model="pageForm" label-width="80px" :rules="pageFormRules" ref="pageForm">
      <el-form-item prop="pageName" label="型号">
        <el-input v-model="pageForm.shoeCode" auto-complete="false" disabled="true"></el-input>
      </el-form-item>
      <el-form-item prop="pageAliase" label="尺码">
        <el-input v-model="pageForm.shoeSize" auto-complete="false" disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="利润" prop="profit">
        <el-input v-model="pageForm.profit" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="出库时间">
        <el-date-picker type="datetime" placeholder="出库时间" v-model="pageForm.updatedTime"></el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog‐footer">
      <el-button type="plain" @click="go_back" class="">返回</el-button>
      <el-button type="primary" @click="editSubmit">提交</el-button>
    </div>
  </div>
</template>

<script>
    /*编写页面静态部分，即model及vm部分。*/
    import * as cmsApi from '../api/cms'

    export default {
        data() {
            return {
                orderId: '',
                pageForm: {
                    shoeCode: '',
                    shoeSize: '',
                    profit: '',
                    updatedTime: new Date()
                },
                pageFormRules: {
                    profit: [
                        {
                            required: true,
                            message: '请输入利润',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        methods: {
            editSubmit: function () {
                this.$refs['pageForm'].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            var moment = require("moment");
                            this.pageForm.updatedTime = moment(this.pageForm.updatedTime).format("YYYY-MM-DD HH:mm:ss");
                            cmsApi.page_out(this.pageForm, this.orderId).then((res) => {
                                if (res.success) {
                                    this.$message({
                                            message: '出库成功',
                                            type: 'success'
                                        }
                                    )
                                    this.go_back();
                                } else {
                                    this.$message({
                                        message: res.msg,
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
                        shoeSize: this.$route.query.shoeSize,
                        orderStatus: this.$route.query.orderStatus
                    }
                })
            },
            //点击修改时进入初始化数据
            query_edit: function () {
                cmsApi.page_findByOrderId(this.orderId).then(res => {
                    console.log(res)
                    if (res.success) {
                        this.pageForm = res.data
                    }
                })
            }
        },
        //mounted()方法是DOM元素渲染生成完成后调用
        //created()方法是vue实例已创建但是DOM元素还没有渲染生成
        mounted() {

        },
        created() {
            this.orderId = this.$route.query.orderId;
            this.query_edit();
        }
    }
</script>
<style>
  /*编写页面样式，不是必须*/
</style>
