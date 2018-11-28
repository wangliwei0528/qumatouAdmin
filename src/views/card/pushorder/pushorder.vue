<template>
    <div class="pushorder">
      <el-row class='top'>
            <div class="breadcrumb">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/home' }">欢迎页</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{name:'pushcard'}">卡券投放</el-breadcrumb-item>
                    <el-breadcrumb-item>投放订单</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </el-row>
       <el-card>
           <div slot="header" class='header'>
                <span>投放订单</span>             
            </div>
            <div class="search">     
                <div>
                <el-input placeholder="请输入内容"  class="input-with-select" v-model="title"
          @keyup.enter.native="getData()">        
                    <el-button 
                    slot="append"
                     @click='getData()' 
                    icon="el-icon-search">
                    </el-button>
                </el-input>      
                </div>
            </div>   
                <el-table
                :data="dataList"
                    style="width: 100%"
                    border             
                    ref="table"
                >               
                <el-table-column
                prop="id"
                label="ID"
                 align="center">
                >
                </el-table-column>
                 <el-table-column
                prop="total"
                label="订单金额"
                 align="center">
                >
                </el-table-column>
                 <el-table-column
                prop="created_at"
                label="下单时间"
                 align="center">
                >
                </el-table-column>                 
           </el-table>
             <div class="block" v-if="pagination">
                <el-pagination
                    @current-change="handleCurrentChanges"
                    :current-page="currentPage"
                    :page-sizes="[per_page]"
                    :page-size="per_page"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    :background="true">
                </el-pagination>
            </div> 
            <div v-if='tag==0'>
              <Mycomponent v-show='isshow'></Mycomponent>  
            </div>     
       </el-card>
    </div>
</template>
<script>
import Mycomponent from "@/components/common/alert";
export default {
  components: { Mycomponent },
  data() {
    return {
      tag:'',
      isshow:true,
      dataList: [],
      total: 0, //总数默认为0
      currentPage: 1, //当前页默认为1
      pagesize: 10, //每页显示的数据
      page: 1, //当前页第一页
      per_page: 0, //前一页
      pagination: false, //分页器
      title: ""
    };
  },
  created() {
    this.tag=localStorage.getItem("tag")
    this.token = localStorage.getItem("token");
    this.getData();   
  },
  mounted() {
    // this.date();
  },
  methods: {
    getData() {
      this.$axios
        .get("api/admin/index", {
          params: {
            page: this.currentPage?this.currentPage:this.page,
            title: this.title
          }          
        })
        .then(res => {
          this.dataList = res.data.data;
          if (res.data.total < res.data.per_page) {
            this.pagination = false;
          } else {
            this.pagination = true;
          }
          this.total = res.data.total;
          this.per_page = res.data.per_page;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleCurrentChanges: function(currentPage) {
      this.currentPage = currentPage;
      this. getData()
    }
  }
};
</script>

