<template>
    <el-card>
        <!-- 分类 -->
        <div slot="header" class='header'>
           <el-button-group>
              <el-button type="primary" icon="el-icon-arrow-left" @click='other()'>他人店铺</el-button>
              <el-button type="primary" @click='me()'>我的店铺<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-button-group>
        </div> 
        <!-- 分类 -->        
        <!-- 他人店铺 -->       
        <div v-if='this.types==1'>
          <div class='search'>
            <div>
                <el-select v-model="region_id" filterable placeholder="请选择" style='float:left'>
                  <el-option
                    v-for="item in region"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id">
                  </el-option>         
                </el-select> 
                <div style='float:left'>   
                  <el-button type="primary" @click='search()'>搜索</el-button>
                </div>
            </div> 
            <div>
              <el-button type="primary" @click='allpush()'>批量投放</el-button>
            </div>                  
          </div>
            <el-table
                ref="multipleTable"
                :data="lounch_lists"
                border
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  align='center'>
                </el-table-column>
                <el-table-column
                  label="商户名称"
                  prop='title'
                  align='center'
                  >
                </el-table-column>
            </el-table>     
        </div>  
        <!-- 他人店铺 -->
        <!-- 我的店铺 -->
        <div v-if='types==2'>
          <el-tag>店铺名称</el-tag>
          <el-tag type="info">{{title}}</el-tag>
           <el-button type="primary" size="small" @click='push()'>投放</el-button>
        </div> 
        <!-- 我的店铺 --> 
        <div v-if='tag==0'>
          <Mycomponent v-show='isshow'></Mycomponent>    
        </div>                                       
    </el-card>  
</template>
<script>
import Mycomponent from "@/components/common/alert";
export default {
  components: { Mycomponent },
  data() {
    return {
      tag:'',
      isshow:true,
      region: [],
      lounch_lists: [],
      loading: true,
      region_id: "",
      types: 1,
      merchant: "",
      ids: [],
      firstid: 1,
      title: "",
      allSelect:true,//默认全选
    };
  },
  created() {
    this.tag=localStorage.getItem("tag")
    this.token = localStorage.getItem("token");
    this.getData();   
  },
  mounted(){},
  methods: {
    //搜索
    search() {
      this.getData();
    },
    //我的店铺
    me() {
      this.types = 2;
      this.getData();
    },
    //他人店铺
    other() {
      this.types = 1;
      this.getData();
    },
    //批量投放
    allpush() {
      this.$router.push({
        name: "createPush",
        params: { types: 1, merchant_id: this.ids }
      });
    },
    //单个投放
    push() {
      this.$router.push({ name: "createPush", params: { id: this.id,types: 2 } });
    },
    //获取数据
    getData() {
      this.$axios
        .get("api/admin/launch_lists", {
          params: {
            types: this.types,
            region_id: this.region_id
          },          
        })
        .then(res => {          
          this.region = res.data.region;
          this.region_id = res.data.region_id;
          this.lounch_lists = res.data.lounch_lists;
          //默认全选
          let rows = res.data.lounch_lists;
          //页面渲染完执行否则取不到
          this.$nextTick(function() {
            if (rows) {
              rows.forEach(row => {
                this.$refs.multipleTable.toggleRowSelection(row,this.allSelect);
              });
            }
          });
          if (res.data.merchant) {
            this.merchant = res.data.merchant;
            this.id = res.data.merchant.id;
            this.title = res.data.merchant.title;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //复选框切换
    handleSelectionChange(val) {
      let ids = val.map(item => item.id).join();//字符串
      this.ids = ids;
    }
  }
};
</script>

