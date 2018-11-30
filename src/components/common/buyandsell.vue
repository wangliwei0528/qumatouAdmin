<template>
  <div class="linkage">
    <el-dialog
      title="选择商户"
      :visible.sync="centerDialogVisible"
      :close-on-click-modal=false
      :show-close=true
      width="70%"
      center>
      <!-- 三级联动 -->
          <div  style='width:90%;margin:0 auto;'>            
              <el-form ref="form" :model="form" label-width="100px">
                  <!-- <el-form-item label="选择地区" prop='city'>
                      <City ref="headerChild" @choseBlock='choseBlock'/>
                  </el-form-item>  -->
                    <!-- 选择开始 -->
                  <div style='border-bottom:1px solid #dcdfe6;padding-bottom:30px;margin-bottom:30px'>           
                    <el-cascader
                      v-model="form.region_id"
                      placeholder="请选择地区"
                      :options="region"
                      filterable
                      change-on-select
                      @change="handleItemChange">
                    </el-cascader> 
                    <el-cascader
                      v-model="form.industry_id"
                      placeholder="请选择行业"
                      :options="industry"
                      filterable
                      change-on-select
                      @change="handleItemChanges">
                    </el-cascader>                        
                    <el-input v-model="form.title" placeholder="请输入商户名称" style='width:194px;display:inline-block'></el-input>        
                    <el-button type="primary" style='padding: 11px 20px;margin-left:100px' @click='search'>搜索</el-button>  
                  </div>
                  <!-- 选择结束 -->              
                  <!-- 商户开始 -->
                  <div class='shanghu'>
                      <el-card class='card' v-if="item.cover!=''"  v-for='(item,index) in list' :key='index'>
                            <div class='img'>
                              <img :src="item.cover" alt="">
                            </div>
                            <span class='title' style='width:100%;height:auto;margin:0 auto'>                            
                              <el-checkbox-group v-model="form.check" @change="onCheckChange">
                                <el-checkbox :label="item.id" :value='item.id'>{{item.title}}</el-checkbox>                                
                              </el-checkbox-group>
                            </span>
                      </el-card>                      
                  </div> 
                  <!-- 商户结束 -->
                  <!-- 分页开始 -->
                  <div class="block" v-show='list.length>10'>
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
                  <!-- 分页结束 -->
              </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <!-- <el-button @click="resetForm('form')">取 消</el-button> -->
            <el-button type="primary" @click="onSubmit()">确 定</el-button>
          </span>
    </el-dialog>    
  </div>
</template>
<script>
import City from "@/components/city";
import Mycomponent from "@/components/common/alert";
export default {
  components: { City, Mycomponent },
  props: ["title", "multipleSelectionAll"],
  data() {
    return {
      enumArr: [],
      centerDialogVisible: true,
      region: [], //地区
      list: [], //批发商列表
      industry: [], //行业
      mapJson: "../static/json/area.js",
      form: {
        region_id: [], //地区id
        industry_id: [], //地区id
        title: "", //商户名称
        check: []
      },
      total: 0, //总数默认为0
      currentPage: 1, //当前页默认为1
      pagesize: 10, //每页显示的数据
      page: 1, //当前页第一页
      per_page: 0 //前一页
    };
  },
  created() {
    this.getRegion(); //地区
    this.getList(); //行业数据转换
    this.wholelist(); //批发商列表
  },
  mounted() {},
  methods: {
    //三级选区
    // choseBlock(e) {
    //   this.E = e;
    //   console.log(this.E);
    // },
    //地区
    getRegion() {
      this.$axios.get(this.mapJson).then(res => {
        this.region = res.data;
      });
    },
    //行业数据转换
    getList() {
      this.$axios.get("api/admin/industry").then(res => {
        if (res.status == 200) {
          this.enumArr = [];
          this.getEnumsList(res.data.industry);
          res.data.industry.forEach(item => {
            this.keep(item);
            this.industry.push({
              value: item.id,
              label: item.title,
              children: item.child
            });
          });
        } else {
          this.$message.error("获取列表失败");
        }
      });
    },
    //获取枚举值列表（递归）获取所有的数据(子父级所有的数据)
    getEnumsList(val) {
      if (val && val.length != 0) {
        val.forEach(item => {
          this.enumArr.push(item);
          this.enumArr.shift();
          this.getEnumsList(item.child);
        });
      }
    },
    //循环子级
    keep(val) {
      val.children = [];
      if (val.child && val.child.length != 0) {
        val.child.forEach(item => {
          val.child.push({
            value: item.id,
            label: item.title,
            children: item.child
          });
          val.child.shift();
          this.keep(item);
        });
      } else {
        delete val.child;
      }
    },
    //地区选值
    handleItemChange(val, opt) {
      this.form.region_id = val;
    },
    //行业选值
    handleItemChanges(val, opt) {
      this.form.industry_id = val;
    },
    //批发商列表
    wholelist() {
      this.$axios
        .get("api/admin/wholesalers_List", {
          params: {
            page: this.currentPage ? this.currentPage : this.page,
            region_id: this.form.region_id[this.form.region_id.length - 1], //只取最后一位  字符串
            industry_id: this.form.industry_id[
              this.form.industry_id.length - 1
            ],
            title: this.form.title
          }
        })
        .then(res => {
          this.list = res.data.wholesalers_List.data;
          this.total = res.data.wholesalers_List.total;
          this.per_page = res.data.wholesalers_List.per_page;
        }); //批发商列表
    },
    //搜索
    search() {
      this.wholelist();
    },
    //复选按钮选中的值
    onCheckChange(item) {
      this.form.check = item;
    },
    //页码变更显示当前页的数据
    handleCurrentChanges(currentPage) {
      this.currentPage = currentPage;
      this.wholelist();
    },
    //取消
    // resetForm(ref) {
    //   this.$refs[ref].resetFields();
    // },
    //确定提交
    onSubmit() {
      //如果没有选择商户提醒选择商户
      if (this.form.check != "") {
        if(this.title){
          var data={
            wholes_id: this.form.check,
            page: this.currentPage ? this.currentPage : this.page,
            title: this.title,
            purchase_id: this.form.check,
          }
        }else{
          var data={
            wholes_id: this.form.check,
            page: this.currentPage ? this.currentPage : this.page,
            purchase_id: this.form.check,
          }
        }
        this.$axios({
          method: "post",
          url: "api/admin/Goods_List",
          data: data
        })
          .then(res => {
            if (res.data.status == 1) {
              //过滤已经代购的            
              for (var i = 0; i < this.multipleSelectionAll.length; i++) {
                for (var j = 0; j < res.data.goos_List.data.length; j++) {
                  if (
                    res.data.goos_List.data[j].id ===
                    this.multipleSelectionAll[i].id
                  ) {
                    // console.log(res.data.goos_List.data[j].id);
                    // console.log(this.multipleSelectionAll[i].id);
                    res.data.goos_List.data.splice(j, 1);
                    j--;
                  }
                }
              }
              this.$emit("listenChild", res); //向父组件传值
              this.centerDialogVisible = false;
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$message({
          message: "请选择代销商户",
          type: "warning"
        });
        this.centerDialogVisible = true;
      }
    }
  }
};
</script>

<style scoped>
.shanghu {
  /* display: flex;
  flex-wrap: wrap;
  justify-content: space-between; */
  margin-bottom: 30px;
}
.card {
  display: inline-block;
  padding: 0 98px 50px;
  width: 130px;
  height: 130px;
  margin-right: 30px;
}
.img img {
  width: 100%;
  height: 100%;
  margin-bottom: 30px;
}
.title {
  display: inline-block;
  width: 100%;
  text-align: center;
}
</style>
