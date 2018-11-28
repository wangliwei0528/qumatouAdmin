<template>
<div>
  <el-row class='top'>
        <div class="breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/home' }">欢迎页</el-breadcrumb-item>
                <el-breadcrumb-item>我的卡券</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
    </el-row>
<el-card class="box-card">
      <!-- 头部标题 -->
      <div slot="header" class='header'>
        <span>卡券列表</span>    
      </div>
      <!-- 顶部 -->
      <div class="search">     
        <div>
          <el-input 
          placeholder="请输入内容"  
          v-model="title"
          @keyup.enter.native="getData()">       
            <el-button 
            slot="append"             
            @click='getData()'
            icon="el-icon-search">
            </el-button>
          </el-input>      
        </div>
        <div>
          <el-button type="primary" 
          @click='addCard' 
          icon="el-icon-plus">
          添加</el-button>
        </div>    
      </div> 
      <!-- 表格数据 -->
      <el-table
        :data="dataList"
        style="width: 100%"
        border  
        @row-click="handleCurrentChange" 
        @selection-change="selsChange" 
        ref="table">
        <el-table-column
          type="selection"
          width="55"
          align="center">
        </el-table-column>
        <el-table-column
          prop="m_name"
          label="卡券名称"
          width="150"
          align="center">
        </el-table-column>
        <el-table-column
          prop="type"
          label="卡券类型"
          width="120"
          align="center">
          <template slot-scope="scope">
            <div>{{scope.row.type==1?'优惠券':scope.row.type==2?'折扣券':'代金券'}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="卡券面值"
          width="120"
          align="center">
          <template slot-scope="scope">
            <div v-if='scope.row.type==1'>满{{scope.row.min_money}}减{{scope.row.amount}}</div>
            <div v-if='scope.row.type==2'>{{scope.row.amount}}折</div>
            <div v-if='scope.row.type==3'>{{scope.row.amount}}元</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="卡券有效期"
          align="center">
          <template slot-scope="scope">
            <div v-if='scope.row.begin_time!=0'>
              <span>{{scope.row.begin_time}}</span>至
              <span>{{scope.row.end_time}}</span>
            </div>
            <div v-if='scope.row.begin_time==0'>
              永久有效
            </div>              
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="120"
          align="center">
          <template slot-scope="scope">
              <span>{{scope.row.status==1?'已上架':'已下架'}}</span>
          </template>
        </el-table-column> 
        <el-table-column
          prop="status"
          label="投放状态"
          width="120"
          align="center">
          <template slot-scope="scope">
              <span :style="{color: scope.row.flag==1?'#4F4F4F':'red'}">{{scope.row.flag==1?'已投放':'未投放'}}</span>
          </template>
        </el-table-column>    
        <el-table-column
          fixed="right"
          label="操作"
          width='180'
          align="center">
          <template slot-scope="scope" >
            <span v-if='scope.row.flag==0&&scope.row.status==1'>
            <el-button 
            size="small"
            type='text'
            @click.native.prevent="editRow(scope.$index, scope.row)"
            >
              编辑
            </el-button>
            </span>            
            <el-button 
            size="small"
            type='text'
            @click.native.prevent="deleteRow(scope.$index, scope.row)"
            >
              <span>{{scope.row.status==0?'已下架':'下架'}}</span>
            </el-button>        
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="bottom">
        <div class='alldel'>
          <el-button type="primary" 
          @click="delGroup" 
          :disabled="this.sels.length === 0" 
          icon="el-icon-delete">
          批量下架
          </el-button>   
        </div>
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
  //初始化数据
  data() {
    return {
      isshow: true,
      flag: "", //是否投放
      sels: [], //选中的值显示
      dataList: [],
      // loading: true,
      total: 0, //总数默认为0
      currentPage: 1, //当前页默认为1
      pagesize: 10, //每页显示的数据
      page: 1, //当前页第一页
      per_page: 0, //前一页
      pagination: false, //分页器
      title: "", //搜索
      tag: ""
    };
  },
  created() {
    this.tag = localStorage.getItem("tag");
    this.getData();
  },
  mounted() {
    // this.date();
  },
  methods: {
    //数据列表
    getData() {
      this.$axios
        .get("/api/admin/coupons", {
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
    //页码变更显示当前页的数据
    handleCurrentChanges: function(currentPage) {
      this.currentPage = currentPage;
      this.getData()
    },
    //单行删除
    deleteRow(index, row) {
      this.$axios({
        method: "post",
        url: "api/admin/del_coupons/" + row.id
      })
        .then(res => {
          if (res.data.status == 1) {
            this.getData();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //选中要删除的行
    selsChange(sels) {
      //得到的是该行数据 对象数组
      this.sels = sels;
    },
    //批量删除
    delGroup() {
      //找到对应对象id并组成数组
      let ids = this.sels.map(item => item.id).join(); //获取所有选中行的id组成的字符串，以逗号分隔
      this.$axios({
        method: "post",
        url: "api/admin/del_coupons/" + ids
      })
        .then(res => {
          if (res.data.status == 1) {
            this.getData();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleCurrentChange(row, event, column) {
      this.$refs.table.toggleRowSelection(row);
    },
    //编辑
    editRow(index, row) {
      this.$router.push("/views/card/mycard/mycardHandle/" + row.id);
      // this.$router.push('/views/card/mycard/addcard/'+row.id);
    },
    //添加
    addCard() {
      this.$router.push({ name: "addcard" });
    }
  }
};
</script>



