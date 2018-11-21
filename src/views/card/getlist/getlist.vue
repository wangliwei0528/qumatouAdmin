<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class='header'>
                <span>卡券领取列表</span>    
            </div>
            <el-table
            :data='listData'
            border
            style='width:100%'
            >
            <el-table-column
                prop="id"
                label="ID"
                align='center'
                >
              </el-table-column>
              <el-table-column
                prop="m_name"
                label="用户名称"
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
      isshow:true,
      tag: "",
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
    // if (localStorage.getItem("tag") == 0) {
    //   this.isshow = true;
    // } else if (this.tag == 1) {
    //   this.isshow = false;
    // }
    this.$axios
      .get("/api/admin/coupon_Logs")
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
  methods:{
    handleCurrentChanges:function(currentPage) {
      this.currentPage = currentPage;      
      this.$axios
        .get("/api/admin/coupon_Logs", {
          params: {
            page: currentPage
          },          
        })
        .then(res => {
          this.listData = res.data.data;
          this.total = res.data.total;
        })
        .catch(err => console.log(err));
    },
  }
};
</script>