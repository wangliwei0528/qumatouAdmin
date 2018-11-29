<template>
  <div>
    <el-dialog
      title="微信扫码支付"
      :visible.sync="pic"
      width="30%"
      center>
      <div style='width:210px;margin-left:50%;transform:translateX(-50%)'>
        <div style='font-weight:bold'>
         <span>订单编号:</span><span>{{trade_no}}</span>
       </div>
        <div>       
          <img :src="url" alt="" style='width:200px;height:200px;'>       
        </div> 
        <div class='btn'>
          <span>总金额:</span><span>¥{{total}}</span>
        </div> 
      </div>      
    </el-dialog>
    <el-row class="top">
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">欢迎页</el-breadcrumb-item>
          <el-breadcrumb-item>采购商品列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </el-row>
    <Buy
      @listenChild="queryData"
      :title="title"
      :multipleSelectionAll="multipleSelectionAll"
      ref="childMethod"
    />
    <el-card class="box-card">
      <div slot="header" class="header">
        <span>采购商品列表</span>
      </div>
      <div style="width:300px;margin-bottom:30px">
        <el-input placeholder="请输入内容" v-model="title" @keyup.enter.native="getData()">
          <el-button slot="append" @click="getData()" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <el-table
        ref="table"
        :data="tableData"
        border
        tooltip-effect="dark"
        style="width: 100%"
        :row-key="getRowKeys"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" :reserve-selection="true" align="center"></el-table-column>
        <el-table-column prop="title" label="名称" align="center"></el-table-column>
        <el-table-column prop="cover" label="SKU封面" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.cover" alt style="width:50px;height:50px">
          </template>
        </el-table-column>
        <el-table-column prop="cate_name" label="分类" align="center"></el-table-column>
        <el-table-column prop="brand_name" label="品牌" align="center"></el-table-column>
        <el-table-column prop="price" label="批发价(元)" align="center"></el-table-column>
        <el-table-column prop="takeaway_itemTitle" label="规格值" align="center"></el-table-column>
        <el-table-column prop="quality" label="库存" align="center"></el-table-column>
        <el-table-column prop="quality" label="采购量(件)" align="center">
          <template slot-scope="scope">
            <el-input              
              type="number"
              :value='scope.row.quality'
              :max="scope.row.quality"
              :min="0"
              :placeholder="scope.row.quality"
              @change="getval"
              @blur="change(scope.$index, scope.row)"
              @keyup.enter.native="change(scope.$index, scope.row)"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin:20px 0;">
        <div style="float:right" v-if="tableData.length>10">
          <el-pagination
            :page-size="pagination.pageSize"
            @current-change="currentChange"
            :current-page="pagination.pageNumber"
            :page-sizes="pagination.pageSizes"
            :total="pagination.totalRows"
            :layout="pagination.layout"
            @size-change="sizeChange"
          ></el-pagination>
        </div>
        <div style="float:left">
          <el-badge
            :value="multipleSelection.length"
            :max="10"
            :min="1"
            :hidden="istrue"
            class="item"
            style="margin-right:20px"
          >
            <el-button type="primary" size="small" @click="handleChooseData">批量采购</el-button>
          </el-badge>
          <el-button type="primary" size="small" @click="allPurchase">一键采购</el-button>
        </div>
      </div>
    </el-card>
    <!--是否完善信息  -->
    <div v-if="tag==0">
      <Mycomponent v-show="isshow"></Mycomponent>
    </div>
    <!--是否完善信息  -->
  </div>
</template>
<script>
import Buy from "@/components/common/purchase";
import Mycomponent from "@/components/common/alert";
export default {
  components: { Buy, Mycomponent },
  data() {
    return {
      getRowKeys(row) {
        return row.id;
      },
      url:'',
      pic: false,//支付页面是否显示
      total:'',//总金额
      trade_no:'',//订单编号
      val:'',//采购量
      isshow: true,
      istrue: true,
      tempArr:[],
      multipleSelectionAll: [], // 所有选中的数据包含跨页数据
      multipleSelection: [], // 当前页选中的数据
      idKey: "id", // 标识列表数据中每一行的唯一键的名称
      tableData: [], // 表格数据
      pagination: {
        totalRows: 0, //总条数
        pageSize: 10, //每页显示条数
        pageSizes: [10],
        pageNumber: 1,
        per_page: 0, //前一页
        layout: "total, sizes, prev, pager, next, jumper"
      },
      title: "", //搜索
      ids: [],
      wholes_id: [], //商户id
      centerDialogVisible: true,
      form: {
        price: ""
      },
      rules: {
        price: [{ required: true, message: "请输入商品价格", trigger: "blur" }]
      }
    };
  },
  created() {
    this.tag = localStorage.getItem("tag"); //判断是否完善信息
    // let a = [["白色", "黑色"], ["XL", "L"]].reduce(
    //   function(a, b) {
    //     return a
    //       .map(function(x) {
    //         return b.map(function(y) {
    //           return x.concat(y);
    //         });
    //       })
    //       .reduce(function(a, b) {
    //         return a.concat(b);
    //       }, []);
    //   },
    //   [[]]
    // );
    // console.log(a);
  },
  mounted() {},
  methods: {
    handleChooseData() {
      // 获取之前需要执行一遍记忆分页处理
      this.changePageCoreRecordData();
      this.setSelectRow();
      if (this.tableData != "") {
        if (this.ids != "") {
          this.$confirm(
            `您要采购的商品数量为:${this.multipleSelectionAll.length}`,
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
              center: true
            }
          )
            .then(() => {
              this.$axios({
                method: "post",
                url: "api/admin/purchase_Off",
                data: {
                  sku_goods: this.tempArr
                }
              }).then(res => {
                console.log(res)
                if(res.data.status==1){
                  this.url='data:image/png;base64,'+res.data.data.qrcode;
                  this.trade_no=res.data.data.trade_no;
                  this.total=res.data.data.total;
                  this.pic=true;//显示二维码
                  this.istrue = true;//清空购物车消息
                }               
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消批量采购"
              });
            });
        } else {
          this.$message({
            type: "warning",
            message: "请选择商品"
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: "暂无商品"
        });
      }
    },
    // 设置选中的方法
    setSelectRow() {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        return;
      }
      // 标识当前行的唯一键的名称
      let idKey = this.idKey;
      let selectAllIds = [];
      let that = this;
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
        // console.log(this.multipleSelectionAll);
      });
      this.$refs.table.clearSelection();
      for (var i = 0; i < this.tableData.length; i++) {
        if (selectAllIds.indexOf(this.tableData[i][idKey]) >= 0) {
          // 设置选中，记住table组件需要使用ref="table"
          this.$refs.table.toggleRowSelection(this.tableData[i], true);
        }
      }
    },
    // 记忆选择核心方法
    changePageCoreRecordData() {
      // 标识当前行的唯一键的名称
      let idKey = this.idKey;
      let that = this;
      // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
      if (this.multipleSelectionAll.length <= 0) {
        this.multipleSelectionAll = this.multipleSelection;
        return;
      }
      // 总选择里面的key集合
      let selectAllIds = [];
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });
      let selectIds = [];
      // 获取当前页选中的id
      this.multipleSelection.forEach(row => {
        selectIds.push(row[idKey]);
        // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          that.multipleSelectionAll.push(row);
        }
      });
      let noSelectIds = [];
      // 得到当前页没有选中的id
      this.tableData.forEach(row => {
        if (selectIds.indexOf(row[idKey]) < 0) {
          noSelectIds.push(row[idKey]);
        }
      });
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < that.multipleSelectionAll.length; i++) {
            if (that.multipleSelectionAll[i][idKey] == id) {
              // 如果总选择中有未被选中的，那么就删除这条
              that.multipleSelectionAll.splice(i, 1);
              break;
            }
          }
        }
      });
    },
    currentChange(val) {
      // 改变页的时候调用一次
      this.changePageCoreRecordData();
      this.pagination.pageNumber = val;
      this.$axios({
        method: "post",
        url: "api/admin/Goods_List",
        data: {
          wholes_id: this.wholes_id,
          page: val
        }
      }).then(res => {
        this.tableData = res.data.goos_List.data;
      });
    },
    sizeChange(val) {
      // 改变每页显示条数的时候调用一次
      this.changePageCoreRecordData();
      this.pagination.pageSize = val;
    },
    handleSelectionChange(val) {
      // table组件选中事件,记得加上@selection-change="handleSelectionChange"
      this.multipleSelection = val;
      if (this.multipleSelection.length != 0) {
        this.istrue = false;
      }
      this.ids = this.multipleSelection.map(item => item.id);
    },
    queryData(data) {
      // console.log(data)
      this.tableData = data.data.goos_List.data.map(item => {
        item.price = item.price / 100;
        return item;
      });
      this.wholes_id = data.data.wholes_id;
      this.pagination.totalRows = data.data.goos_List.total;
      this.pagination.per_page = data.data.goos_List.per_page;
    }, // 得到选中的所有数据
    getAllSelectionData() {
      // 再执行一次记忆勾选数据匹配，目的是为了在当前页操作勾选后直接获取选中数据
      this.changePageCoreRecordData();
      // console.log(this.multipleSelectionAll);
    },
    //全选与反选切换
    toggleSelect(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, !this.allSelect);
        });
        this.allSelect = !this.allSelect;
      }
    },
    //一键代购 全部
    allPurchase(index, row) {
      if (this.tableData != "") {
        this.$confirm("此操作将代购所有商品, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(() => {
            this.$axios({
              method: "post",
              url: "api/admin/sell_All"
            }).then(res => {});
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消一键代购"
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: "暂无商品"
        });
      }
    },
    //搜索 父组件调用子组件方法
    getData() {
      // console.log(this.$refs.childMethod); //返回的是一个vue对象，所以可以直接调用其方法
      this.$refs.childMethod.onSubmit(); //调用子组件的方法
    },
    getval(val){
      this.val=val
    },
    change(index, row) {
      let goods={
        id:row.id,
        qty:this.val
      };
      if(row.qty>row.quality){
        this.$message({
          type: "warning",
          message: "库存不够,请重新输入"
        });
      }
      this.tempArr.push(goods)
    }
  }
};
</script>

<style scoped>
.box-card {
  padding-bottom: 20px;
}
.btn{
  width:200px;
  height:30px;
  background:#1aad19;
  text-align:center;
  font-weight:bold;
  color:#fff;
  font-size:20px;
  padding:10px 0
}
</style>
