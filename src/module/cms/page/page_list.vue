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
      <el-button type="primary" size="small" v-on:click="query">查询</el-button>
      <router-link class="mui‐tab‐item" :to="{path:'/cms/page/add/',query:{
        page:this.params.page,
        orderStatus:this.params.orderStatus,
        shoeCode:this.params.shoeCode,
        shoeSize:this.params.shoeSize
      }}">
        <el-button type="primary" size="small">新增页面</el-button>
      </router-link>
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
          <el-button v-on:click="del(scope.row.orderId)" type="text" size="small" align="left">删除</el-button>
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
                orderStatusList: [],//状态列表
                list: [],
                total: 0,
                params: {
                    orderStatus: '',
                    shoeCode: '',
                    shoeSize: '',
                    page: 1,
                    size: 10
                }
            }
        },
        methods: {
            query: function () {
                // alert('查询')
                //调用服务端的接口
                cmsApi.page_list(this.params.page, this.params.size, this.params).then((res) => {
                    //将res结果数据赋值给数据模型对象
                    console.log(res)
                    this.list = res.data.records;
                    this.total = res.data.total;
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
                this.$router.push({
                    path: '/cms/page/edit/' + orderId,
                    query: {
                        page: this.params.page,
                        orderStatus: this.params.orderStatus,
                        shoeCode: this.params.shoeCode,
                        shoeSize: this.params.shoeSize,
                    }
                })
            },
            del: function (orderId) {
                this.$confirm('确认删除吗？', '提示', {}).then(() => {
                    cmsApi.page_delete(orderId).then(res => {
                        if (res.success) {
                            this.$message({
                                message: '删除成功',
                                type: 'true'
                            })
                            this.query()
                        } else {
                            this.$message({
                                message: '删除失败',
                                type: 'false'
                            })
                        }
                    })
                })
            },
            post: function (orderId) {
                this.$confirm('确认发布吗？', '提示', {}).then(() => {
                    cmsApi.page_post(orderId).then(res => {
                        if (res.success) {
                            this.$message({
                                message: '发布成功',
                                type: 'true'
                            })
                        } else {
                            this.$message({
                                message: '发布失败',
                                type: 'true'
                            })
                        }
                    })
                })
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
