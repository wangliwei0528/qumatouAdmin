<template>
    <div>
      <el-row class='top'>
            <div class="breadcrumb">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/home' }">欢迎页</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{name:'pushcard'}">卡券投放</el-breadcrumb-item>
                    <el-breadcrumb-item>分润列表</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </el-row>
        <el-card class="box-card">
            <div slot="header" class='header'>
                <span>分润列表</span>    
            </div>
            <el-table
            :data='listData'
            border
            style='width:100%'
            >
              <el-table-column
                prop="title"
                label="商家名称"
                align='center'
                >
              </el-table-column>
              <el-table-column
                prop="merchant_money"
                label="分润金额"
                align='center'
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
      tag: "",
      isshow: true,
      listData: [],
      total: 0, //总数默认为0
      currentPage: 1, //当前页默认为1
      pagesize: 10, //每页显示的数据
      page: 1, //当前页第一页
      per_page: 0, //前一页
      pagination: false //分页器
    };
  },
  created() {
    this.tag = localStorage.getItem("tag");
    this.getData();
  },
  methods: {
    getData() {
      this.$axios
        .get("/api/admin/dividedLists",{
          params:{
            page:this.currentPage?this.currentPage:this.page
          }
        })
        .then(res => {
          this.listData = res.data.data;
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
      this.getData()
    }
  }
};
</script>


