<template>
  <div>
    <el-row class='top'>
        <div class="breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/home' }">欢迎页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: 'buyandsell' }">代购代销</el-breadcrumb-item>
                <el-breadcrumb-item>已购商品</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
    </el-row>
    <el-card>
      <div slot="header" class="header">
        <span>已代购商品列表</span>
      </div>
      <!-- 已经代购商品列表 -->
      <el-table ref="table" :data="dataList" border tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="title" label="名称" align="center"></el-table-column>
        <el-table-column prop="subtitle" label="标题" align="center"></el-table-column>
        <el-table-column prop="cover" label="封面" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.cover" alt style='width:50px;height:50px'>
          </template>
        </el-table-column>
        <el-table-column prop="cate_name" label="分类" align="center"></el-table-column>
        <el-table-column prop="cun_name" label="品牌" align="center"></el-table-column>
        <el-table-column prop="brand_name" label="单位" align="center"></el-table-column>
        <el-table-column prop="price" label="价格(元)" align="center">
          <template slot-scope="scope">
              <span>{{(scope.row.price)/100}}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 已经代购商品列表 -->
      <!--是否完善信息  -->
      <div v-if="tag==0">
        <Mycomponent v-show="isshow"></Mycomponent>
      </div>
      <!--是否完善信息  -->
      <div class="block" v-if="pagination">
        <el-pagination
          @current-change="handleCurrentChanges"
          :current-page="current_page"
          :page-sizes="[per_page]"
          :page-size="per_page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :background="true"
        ></el-pagination>
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
      isshow: true,
      tag: "",
      dataList: [],
      total: 0, //总数默认为0
      current_page: 1, //当前页默认为1
      pagesize: 10, //每页显示的数据
      page: 1, //当前页第一页
      per_page: 0, //前一页
      pagination: false //分页器
    };
  },
  created() {
    this.tag = localStorage.getItem("tag"); //判断是否完善信息
    this.getData();
  },
  methods: {
    getData() {
      this.$axios
        .get("api/admin/consignment_List", {
          params: {
            page: this.current_page ? this.current_page : this.page
          }
        })
        .then(res => {
          this.dataList = res.data.consignment_List.data;
          if (res.data.consignment_List.total < res.data.consignment_List.per_page) {
            this.pagination = false;
          } else {
            this.pagination = true;
          }
          this.total = res.data.consignment_List.total;
          this.per_page = res.data.consignment_List.per_page;
        });
    },
    handleCurrentChanges: function(current_page) {
      this.current_page = current_page;
      this.getData();
    }
  }
};
</script>

