<template>
    <div>
        <el-card>
            <!-- tab切换 -->
            <div slot="header" class='header'>
                <el-button-group>
                  <!-- 循环对象{} -->
                    <el-button 
                    v-for='(val,key,index) in types' 
                    :key="index"
                    :class="{active:index==dynamic}" 
                    type="primary" 
                    @click='luckraw(key)'>
                    {{val}}
                    </el-button>                
                </el-button-group>
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
                @click='addluck' 
                icon="el-icon-plus">
                添加</el-button>
                </div>    
            </div>  
            <el-table
            :data='dataList'
            border
            style='width:100%'>
            <el-table-column
                prop="id"
                label="ID"
                align='center'>
              </el-table-column>
              <el-table-column
                prop="title"
                label="商品名称"
                align='center'>
              </el-table-column>
              <el-table-column
                prop="cover"
                label="商品封面"
                align='center'>
                <template slot-scope="scope">
                  <img :src="scope.row.cover" style='width:30px;height:30px'>
                </template>
              </el-table-column>
              <el-table-column
                prop="cost"
                label="商品原价"
                align='center'>
              </el-table-column>
              <el-table-column
                prop="integral"
                label="商品积分"
                align='center'>
              </el-table-column>
               <el-table-column
                prop="people_num"
                label="所需人数"
                align='center'>
              </el-table-column>
               <el-table-column
                prop="details"
                label="商品详情"
                align='center'
                :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <p v-html='scope.row.details'></p>
              </template>
              </el-table-column>
              <el-table-column
                prop="price"
                label="商品价格"
                align='center'
                v-if='type==2'>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                align="center" >
              <template slot-scope="scope" >
                <el-button 
                @click="handleopen(scope.$index, scope.row)"   
                type="text" 
                size="small"
                :disabled='join_num!=people_num' >
                  <span :style="{color: scope.row.status==1?'red':'#409eff'}">{{scope.row.status==1?'已开奖':'开奖'}}</span>
                </el-button>
              </template>
            </el-table-column>
            </el-table>
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
      isshow: true,
      tab: "",
      types: {},
      type: "",
      dynamic: 0,
      dataList: [],
      join_num: "", //加入人数
      people_num: "",
      total: 0, //总数默认为0
      current_page: 1, //当前页默认为1
      pagesize: 10, //每页显示的数据
      page: 1, //当前页第一页
      per_page: 0, //前一页
      pagination: false, //分页器
      title: "" //搜索
    };
  },
  created() {
    this.tag = localStorage.getItem("tag");
    this.getTab();
    this.getData();
  },
  methods: {
    //Tab切换获取tab的值
    getTab() {
      this.$axios.get("api/admin/integral_Info").then(res => {
        this.types = res.data.type;
        //转数组取第一条数据赋值给默认现实的数据type
        var arr = [];
        for (let i in res.data.type) {
          arr.push({
            key: i,
            val: res.data.type[i]
          });
        }
        this.type = arr[0].key;//默认选中tab的第一个即返回数据的第一条
        this.getData();//将type传入获取数据
      });
    },
    //Tab切换
    luckraw(key, index) {
      if (index == this.type) {
        this.dynamic = index;
      }
      //点击添加字体颜色，其他的删除class名称
      this.dynamic = index;
      this.type = key;
      this.getData();
    },
    //获取信息列表
    getData() {
      this.$axios
        .get("api/admin/integral_Lists", {
          params: {
            page: this.page,
            title: this.title,
            type: this.type
          }
        })
        .then(res => {
          this.dataList = res.data.integral_Lists.data;
          for (let i = 0; i < this.dataList.length; i++) {
            this.join_num = this.dataList[i].join_num;
            this.people_num = this.dataList[i].people_num;
            this.dataList[i].price = this.dataList[i].price / 100;
            this.dataList[i].cost = this.dataList[i].cost / 100;
          }
          if (
            res.data.integral_Lists.total < res.data.integral_Lists.per_page
          ) {
            this.pagination = false;
          } else {
            this.pagination = true;
          }
          this.total = res.data.integral_Lists.total;
          this.per_page = res.data.integral_Lists.per_page;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //页码变更显示当前页的数据
    handleCurrentChanges: function(current_page) {
      this.current_page = current_page;
      this.$axios
        .get("/api/admin/integral_Lists", {
          params: {
            page: current_page,
            type: this.type
          }
        })
        .then(res => {
          this.dataList = res.data.integral_Lists.data;
          this.total = res.data.integral_Lists.total;
        })
        .catch(err => console.log(err));
    },
    //添加积分
    addluck() {
      this.$router.push({ name: "addluck", query: { type: this.type } });
    },
    //开奖
    handleopen(index, row) {
      this.$axios({
        method: "post",
        url: "api/admin/open_Integral/" + row.id
      }).then(res => {
        console.log(res);
      });
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


