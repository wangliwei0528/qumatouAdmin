<template>
    <div>
        <el-card>
            <div slot="header" class='header'>
                <!-- 轮播类型 -->
                <el-button-group>
                    <el-button type="primary" v-for='(item,index) in bannerType' :key='index' @click=gettype(index) :class="{active:index==dynamic}">{{item}}</el-button>
                </el-button-group>
                 <!-- 轮播类型 -->
            </div>  
             <!-- 搜索 -->
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
                    @click='addBanner' 
                    icon="el-icon-plus">
                    添加
                </el-button>
                </div>    
            </div>                      
            <!-- 表格数据 -->
            <el-table
                ref="multipleTable"
                :data="dataList"
                border
                tooltip-effect="dark"
                style="width: 100%">  
                 <el-table-column
                prop="id"
                label="ID"
                align='center'>
                </el-table-column>
                <el-table-column
                prop="title"
                label="标题"
                align='center'
                show-overflow-tooltip>
                </el-table-column>             
                <el-table-column
                label="封面"  align='center'>
                    <template slot-scope="scope">
                        <img :src="scope.row.cover" alt="" style='width:50px;height:50px'>
                    </template>
                </el-table-column>
                <el-table-column
                prop="price"
                align='center'
                label="价格">
                </el-table-column>             
                <el-table-column prop="is_show" label="状态" align="center">
                  <template slot-scope="scope">
                    <div :style="{color: scope.row.status==1?'#4F4F4F':'red'}">{{scope.row.status?'显示':'隐藏'}}</div>
                  </template>
                </el-table-column>
                <el-table-column
                fixed="right"
                label="操作"
                align="center" >
              <template slot-scope="scope">
          <el-button @click="editClick(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
          <el-button type="text" size="small">
            <el-dropdown>
                  <span class="el-dropdown-link" style="font-size:12px;color:#409EFF">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button @click="deleteClick(scope.$index, scope.row)" type="text">删除</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button @click="hideClick(scope.$index, scope.row)" type="text">{{scope.row.status?'隐藏':'显示'}}
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-button>
        </template>     
            </el-table-column>
            </el-table>
            <!-- 表格数据 -->
            <!--是否完善信息  -->
            <div v-if='tag==0'>
                <Mycomponent v-show='isshow'></Mycomponent>  
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
                    :background="true">
                </el-pagination>
            </div> 
        </el-card>
    </div>
</template>
<script>
export default {
  data() {
    return {
      isshow: true,
      tag: "",
      dynamic:0,
      bannerType: [], //轮播类型
      dataList: [], //
      title: "",
      type: 0,
      total: 0, //总数默认为0
      current_page: 1, //当前页默认为1
      pagesize: 10, //每页显示的数据
      page: 1, //当前页第一页
      per_page: 0, //前一页
      pagination: false //分页器
    };
  },
  created() {
    this.tag = localStorage.getItem("tag");
    this.getData(); //数据
    this.getType(); //轮播类型
  },
  methods: {
    //轮播类型
    getType() {
      this.$axios.get("api/admin/carousel_Info").then(res => {
        this.bannerType = res.data.carousel_array;
      });
    },
    //获取点击的轮播类型
    gettype(index) {
      if (index == this.type) {
        this.dynamic = index;
      }
      this.type = index;
      this.getData()
    },
    getData() {
      this.$axios.get("api/admin/carousel_List",{
        params:{
          page: this.current_page?this.current_page:this.page,
          type:this.type
        }
      }).then(res => {
        this.dataList = res.data.carousel_List.data;
        for (let i = 0; i < this.dataList.length; i++) {
          this.dataList[i].price = this.dataList[i].price / 100;
        }
        if (res.data.carousel_List.total < res.data.carousel_List.per_page) {
          this.pagination = false;
        } else {
          this.pagination = true;
        }
        this.total = res.data.carousel_List.total;
        this.per_page = res.data.carousel_List.per_page;
      });
    },
    //页码切换
    handleCurrentChanges: function(current_page) {
      this.current_page = current_page;
      this.getData()
    },
    
    //编辑
    editClick(index, row) {
      this.$router.push({ name: "addbanner", query: { id: row.id } });
    },
    //删除
    deleteClick(index, row) {
      this.$axios({
        method: "post",
        url: "api/admin/del_Carousel/" + row.id
      }).then(res => {
        if (res.data.status == 1) {
          this.getData(); //数据
        }
      });
    },
    //隐藏
    hideClick(index, row) {
      if (row.status == 1) {
        this.status = 0;
      } else {
        this.status = 1;
      }
      this.$axios({
        method: "post",
        url: "api/admin/is_Carousel/" + row.id,
        data: {
          status: this.status
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.getData(); //数据
        }
      });
    },
    //添加
    addBanner() {
      this.$router.push({ name: "addbanner", query: { type: this.type } });
    }
  }
};
</script>
<style scoped>
.active {
  background: #66b1ff;
  border-color: #66b1ff;
  color: #fff;
}
</style>


