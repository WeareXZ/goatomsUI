<template>
  <div>
    <!--编写页面静态部分，即view部分-->
    <el-form :model="params">
      <el-select v-model="params.orderStatus" placeholder="请选择状态">
        <el-option
          v-for="item in orderStatusList"
          :key="item.orderStatus"
          :label="item.orderStatusName"
          :value="item.orderStatus">
        </el-option>
      </el-select>
      鞋码型号:
      <el-input v-model="params.shoeCode" placeholder="请输入内容" clearable style="width: 200px"></el-input>
      鞋码尺寸:
      <el-input v-model="params.shoeSize" placeholder="请输入内容" clearable style="width: 200px"></el-input>
      入库时间:
      <el-date-picker
        v-model="params.startTime"
        type="date"
        placeholder="开始日期"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      ——
      <el-date-picker
        v-model="params.endTime"
        type="date"
        placeholder="结束日期"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button type="primary" size="small" v-on:click="query">查询</el-button>
      <router-link class="mui‐tab‐item" :to="{path:'/cms/page/add/',query:{
        page:this.params.page,
        orderStatus:this.params.orderStatus,
        shoeCode:this.params.shoeCode,
        shoeSize:this.params.shoeSize
      }}">
        <el-button type="primary" size="small">新增页面</el-button>
      </router-link>
      <el-button type="primary" size="small" v-on:click="orderExport">订单导出</el-button>
      <el-button type="primary" size="small" v-on:click="calculate">利润统计</el-button>
      <el-input type="info" v-model="totalProfit" style="width: 100px" size="small" disabled="true"></el-input>
      <el-upload style="margin-left: 8px;"
                 class="upload-demo inline-block margin-right-10"
                 action=""
                 :on-change="handleChange"
                 :show-file-list="false"
                 :on-remove="handleRemove"
                 :file-list="fileListUpload"
                 :limit="limitUpload"
                 accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                 :auto-upload="false">
        <el-button  type="primary" size="small">订单导入</el-button>
      </el-upload>
    </el-form>
    <el-table
      :data="list"
      stripe
      style="width: 100%">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column type="orderId" width="60" hidden>
      </el-table-column>
      <el-table-column prop="orderNumber" label="订单号" width="250">
      </el-table-column>
      <el-table-column prop="shoeCode" label="型号" width="120">
      </el-table-column>
      <el-table-column prop="shoeSize" label="尺码" width="120">
      </el-table-column>
      <el-table-column prop="orderStatus" label="状态" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.orderStatus==0">入库</span>
          <span v-if="scope.row.orderStatus==1">出库</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格" width="250">
      </el-table-column>
      <el-table-column prop="profit" label="利润" width="250">
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="250">
      </el-table-column>
      <el-table-column prop="createdTime" label="创建时间" width="180" :formatter="dateFormat">
      </el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button v-on:click="edit(scope.row.orderId)" type="text" size="small" align="left">修改</el-button>
          <el-button v-on:click="out(scope.row.orderId)" type="text" size="small" align="left">出库</el-button>
          <el-button v-on:click="cancel(scope.row.orderId)" type="text" size="small" align="left">取消</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      layout="prev, pager, next"
      :total="total"
      :page-size="params.size"
      :current-page="params.page"
      v-on:current-change="changePage"
      style="float:right">
    </el-pagination>
  </div>
</template>
<script>
    /*编写页面静态部分，即model及vm部分。*/
    import * as cmsApi from '../api/cms'

    export default {
        data() {
            return {
                fileListUpload:[],
                limitUpload:1,
                disabled:false,
                accountList:[],
                orderStatusList: [],//状态列表
                list: [],
                total: 0,
                totalProfit: 0,
                params: {
                    orderStatus: '',
                    shoeCode: '',
                    shoeSize: '',
                    startTime:'',
                    endTime:'',
                    page: 1,
                    size: 10
                }
            }
        },
        methods: {
            query: function () {
                // alert('查询')
                //调用服务端的接口
                console.log(this.params)
                cmsApi.page_list(this.params.page, this.params.size, this.params).then((res) => {
                    if (res.success) {
                        //将res结果数据赋值给数据模型对象
                        console.log(res)
                        this.list = res.data.records;
                        this.total = res.data.total;
                    } else {
                        this.$message({
                            message: res.data,
                            type: 'error'
                        });
                    }
                })

            },
            changePage: function (page) {//形参就是当前页码
                //调用query方法
                // alert(page)
                this.params.page = page;
                this.query()
                ////初始化站点列表
            },
            review: function (orderId) {
                window.open("http://www.xuechengzaixian.com/cms/preview/" + orderId)
            },
            edit: function (orderId) {
                this.$router.push({
                    path: '/cms/page/edit',
                    query: {
                        page: this.params.page,
                        orderId: orderId,
                        orderStatus: this.params.orderStatus,
                        shoeCode: this.params.shoeCode,
                        shoeSize: this.params.shoeSize,
                    }
                })
            },
            out: function (orderId) {
                cmsApi.page_findByOrderIdByStatus(orderId).then((res) => {
                    if (res.success) {
                        this.$router.push({
                            path: '/cms/page/out',
                            query: {
                                orderId: orderId,
                                page: this.params.page,
                                shoeCode: this.params.shoeCode,
                                shoeSize: this.params.shoeSize,
                            }
                        })
                    } else {
                        this.$message({
                            message: res.data,
                            type: 'error'
                        })
                    }
                })
            },
            cancel: function (orderId) {
                cmsApi.page_cancel(orderId).then((res) => {
                    if (res.success) {
                        this.$message({
                            message: "取消成功",
                            type: 'success'
                        })
                        this.query()
                    } else {
                        this.$message({
                            message: res.data,
                            type: 'error'
                        })
                    }
                })
            },
            calculate: function () {
                // alert('查询')
                //调用服务端的接口
                cmsApi.page_calculate(this.params.page, this.params.size, this.params).then((res) => {
                    if (res.success) {
                        //将res结果数据赋值给数据模型对象
                        console.log(res)
                        this.totalProfit = res.data;
                    } else {
                        this.$message({
                            message: res.data,
                            type: 'error'
                        });
                    }
                })

            },
            orderExport: function () {
                //调用服务端的接口
                cmsApi.exportexcle(this.params).then((res) => {
                    if (res) {
                        //将res结果数据赋值给数据模型对象
                        console.log(res.data)
                        const blob = new Blob([res.data], {type: 'application/ms-excel'}); // 解析后端返回的乱码
                        const elink = document.createElement('a');
                        elink.download = "order.xls"; //定义下载名字
                        elink.href = URL.createObjectURL(blob);
                        document.body.appendChild(elink);
                        elink.click();
                        URL.revokeObjectURL(elink.href); // 释放URL 对象
                        document.body.removeChild(elink);
                    } else {
                        this.$message({
                            message: "导出错误",
                            type: 'error'
                        });
                    }
                })

            },
            handleChange(file, fileList) {
                this.fileTemp = file.raw
                let fileName = file.raw.name
                let fileType = fileName.substring(fileName.lastIndexOf('.') + 1);
                // 判断上传文件格式
                if (this.fileTemp) {
                    if ((fileType == 'xlsx') || (fileType == 'xls')) {
                        this.importf(this.fileTemp)
                        console.log(this.accountList)
                    } else {
                        this.$message({
                            type: 'warning',
                            message: '附件格式错误，请删除后重新上传！'
                        })
                    }
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请上传附件！'
                    })
                }
            },
            //导入的方法
            importf(obj) {
                this.dialogVisible = true;
                let _this = this;
                let inputDOM = this.$refs.inputer;   // 通过DOM取文件数据
                this.file = event.currentTarget.files[0];
                var rABS = false; //是否将文件读取为二进制字符串
                var f = this.file;
                var reader = new FileReader();
                //if (!FileReader.prototype.readAsBinaryString) {
                FileReader.prototype.readAsBinaryString = function (f) {
                    var binary = "";
                    var rABS = false; //是否将文件读取为二进制字符串
                    var pt = this;
                    var wb; //读取完成的数据
                    var outdata;
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var bytes = new Uint8Array(reader.result);
                        var length = bytes.byteLength;
                        for (var i = 0; i < length; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        var XLSX = require('xlsx');
                        if (rABS) {
                            wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
                                type: 'base64'
                            });
                        } else {
                            wb = XLSX.read(binary, {
                                type: 'binary'
                            });
                        }
                        // outdata就是你想要的东西 excel导入的数据
                        outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
                        // excel 数据再处理
                        let arr = []
                        outdata.map(v => {
                            // let jsonString = JSON.stringify(v).replace(/\*/g, '').replace(/\s/ig,'');
                            let jsonString = JSON.stringify(v).replace(/\//g, '').replace(/\s/ig,'');
                            //debugger;
                            console.log(jsonString);
                            v = JSON.parse(jsonString);
                            let obj = {}
                            //xxx代表列名
                            obj.shoeCode = v.shoeCode
                            obj.shoeSize = v.shoeSize
                            obj.price = v.price
                            obj.profit = v.profit
                            obj.orderStatus = v.orderStatus
                            obj.remark = v.remark
                            obj.createdTime = v.createdTime
                            obj.updatedTime = v.updatedTime
                            // obj.id = v.id
                            arr.push(obj)
                        })
                        _this.accountList = [...arr];
                        console.log(_this.accountList )
                        cmsApi.importexcle(_this.accountList).then((res) => {
                            if (res.success) {
                                _this.query()
                            } else {
                                _this.$message({
                                    message: "导入失败",
                                    type: 'error'
                                })
                            }
                        })
                    }
                    reader.readAsArrayBuffer(f);
                }
                if (rABS) {
                    reader.readAsArrayBuffer(f);
                } else {
                    reader.readAsBinaryString(f);
                }
            },
            // 移除excel表
            handleRemove(file, fileList) {
                this.fileTemp = null
            },
            dateFormat: function (row, column) {
                var date = row[column.property];
                if (date == undefined) {
                    return "";
                }
                var moment = require("moment");
                return moment(date).format("YYYY-MM-DD HH:mm:ss");
            }
        },
        //mounted()方法是DOM元素渲染生成完成后调用
        //created()方法是vue实例已创建但是DOM元素还没有渲染生成
        mounted() {
            //当DOM元素渲染完成后调用query
            this.query()
            this.orderStatusList = [
                {
                    orderStatus: 0,
                    orderStatusName: '入库'
                },
                {
                    orderStatus: 1,
                    orderStatusName: '出库'
                }
            ]
        },
        //返回回显
        created() {
            //从路由上获取参数
            this.params.page = Number.parseInt(this.$route.query.page || 1);
            this.params.orderStatus = this.$route.query.orderStatus || '';
            this.params.shoeCode = this.$route.query.shoeCode || '';
            this.params.shoeSize = this.$route.query.shoeSize || '';
        }
    }
</script>
<style>
  /*编写页面样式，不是必须*/
</style>
