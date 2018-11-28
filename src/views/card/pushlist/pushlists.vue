<template>
    <div class="pushlist">
        <el-row class='top'>
        <div class="breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/home' }">欢迎页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{name:'pushcard'}">卡券投放</el-breadcrumb-item>
                <el-breadcrumb-item>投放列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
    </el-row>
        <el-card>
            <div style='margin-bottom:20px'>
                <el-button-group>
                    <el-button type="primary" @click='nomal'>正常</el-button>
                    <el-button type="primary" @click='dated'>已过期</el-button>
                </el-button-group>
        </div>
            <div class="search">    
                <div>
                    <el-input placeholder="请输入内容"  class="input-with-select" 
                    v-model.trim="title"
                     @keyup.enter.native="getData()">           
                        <el-button slot="append" icon="el-icon-search" @click='getData'></el-button>
                    </el-input>
                </div>               
            </div>   
            <el-table 
                :data="listData"
                border
                style="width: 100%">                
                <el-table-column
                    fixed
                    align='center'
                    prop="merchant_id"
                    label="商户ID">
                </el-table-column>               
                <el-table-column
                    fixed
                    align='center'
                    prop="merchant_launch.title"
                    label="投放商户">
                </el-table-column>
                <el-table-column
                    fixed
                    align='center'
                    prop="coupon.m_name"
                    label="卡券名称">
                </el-table-column>
                <el-table-column
                    fixed
                    align='center'
                    prop="end_times"
                    label="过期时间">
                </el-table-column> 
                <el-table-column
                    fixed
                    align='center'
                    prop="stock"
                    label="投放数量">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="投放状态"
                    width="120"
                    align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.end_time > new Date().getTime()/1000 ?'正常':'已过期'}}</span>
                    </template>
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
  components: { Mycomponent},
  data() {
    return {
      isshow: true,
      listData: [],
      s_type: 1,
      total: 0, //总数默认为0
      currentPage: 1, //当前页默认为1
      pagesize: 10, //每页显示的数据
      page: 1, //当前页第一页
      per_page: 0, //前一页
      pagination: false, //分页器
      title: "" ,//搜索
      tag:''
    };
  },
  created() {
    this.tag=localStorage.getItem("tag")    
    this.getData();
  },
  mounted() {
    // this.date();
  },
  methods: {
    //切换状态
    nomal() {
      if (this.s_type != 1) {
        this.s_type = 1;
      }
      this.getData();
    },
    dated() {
      if (this.s_type != 0) {
        this.s_type = 0;
      }
      this.getData();
    },
    //获取数据
    getData() {
      this.$axios
        .get("api/admin/launch_mys", {
          params: {
            page: this.currentPage?this.currentPage:this.page,
            s_type: this.s_type == 0 ? this.s_type : 1,
            title: this.title
          }
        })
        .then(res => {
          if (res) {
            this.listData = res.data.data;
            if (res.data.total < res.data.per_page) {
              this.pagination = false;
            } else {
              this.pagination = true;
            }
            this.total = res.data.total;
            this.per_page = res.data.per_page;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleCurrentChanges: function(currentPage) {
      this.currentPage = currentPage;
      this.getData()
    }
  }
};
</script>

