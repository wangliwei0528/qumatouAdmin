<template>
    <div>
      <el-row class='top'>
            <div class="breadcrumb">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/home' }">欢迎页</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{name:'merchant'}">商户管理</el-breadcrumb-item>
                    <el-breadcrumb-item>会员列表</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </el-row>
        <el-card class="box-card">
            <div slot="header" class='header'>
                <span>会员列表</span>    
            </div>
            <el-table
            :data='listData'
            border
            style='width:100%'
            >
            <el-table-column
                prop="user_id"
                label="会员ID"
                align='center'
                >
              </el-table-column>
              <el-table-column
                prop="mobile"
                label="手机号"
                align='center'
                >
              </el-table-column>
              <el-table-column
                prop="nickname"
                label="卡券名称"
                align='center'
                >
              </el-table-column>
            </el-table>
            <div class="block" v-if="pagination">
              <el-pagination
                    v-if="pagination"
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
      tag: "",
      isshow: true,
      listData: [],
      total: 0, //总数默认为0
      currentPage: 1, //当前页默认为1
      pagesize: 10, //每页显示的数据
      page: 1, //当前页第一页
      per_page: 0, //前一页
      pagination: true //分页器
    };
  },
  created() {
    this.tag = localStorage.getItem("tag");
    this.getData()
  },
  methods: {
    getData() {
      this.$axios
        .get("/api/admin/member_Lists", {
          params: {
            page: this.currentPage ? this.currentPage : this.page
          }
        })
        .then(res => {
          this.listData = res.data.member_List.data;
          if (res.data.member_List.total < res.data.member_List.per_page) {
            this.pagination = false;
          } else {
            this.pagination = true;
          }
          this.total = res.data.member_List.total;
          this.per_page = res.data.member_List.per_page;
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