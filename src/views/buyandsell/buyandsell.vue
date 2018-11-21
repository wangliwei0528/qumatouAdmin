<template>
  <div>
    <Buy @listenChild='showMsgFromChild' :title='title' ref="childMethod"/>
    <el-card class="box-card">
        <div slot="header" class='header'>
          <span>代购商品列表</span>            
        </div>
        <div style='width:300px;margin-bottom:30px'>
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
        <el-table
          ref="table"
          :data="tableData"
          border
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55"
            align="center">
          </el-table-column>
          <el-table-column
            prop="title"
            label="名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="subtitle"
            label="副标题"
            align="center">
          </el-table-column>
          <el-table-column
            prop="cover"
            label="封面图"
            align="center">
            <template slot-scope="scope">
              <img :src="scope.row.cover" alt="">
            </template>
          </el-table-column>
          <el-table-column
            prop="cate_name"
            label="分类名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="cun_name"
            label="品牌"
            align="center">
          </el-table-column>
          <el-table-column
            prop="brand_name"
            label="单位"
            align="center">
          </el-table-column>
          <el-table-column
            prop="item_title"
            label="规格值"
            align="center">
          </el-table-column>          
        </el-table>
        <div style='margin:20px 0;'>
          <div style='float:right' v-show='tableData.length>10'>
            <el-pagination 
                :page-size="pagination.pageSize"
                @current-change="handleCurrentChanges"
                :current-page="pagination.pageNumber"
                :page-sizes="pagination.pageSizes"
                :total="pagination.totalRows"
                :layout="pagination.layout"
                @size-change='sizeChange'>
            </el-pagination>
          </div>
          <div style="float:left">
            <!-- <el-checkbox @change="toggleSelect(data)" size="mini" style='margin-right:40px'>全选/反选</el-checkbox> -->
            <el-button type="primary" size="small" @click="handleChooseData">获取选中的内容</el-button>
            <el-button type="primary" size="small" @click='batchPurchase(tableData)'   >批量代购</el-button>
            <el-button type="primary" size="small" @click='allPurchase'>一键代购</el-button>
          </div>
        </div>        
    </el-card>
     <!--是否完善信息  -->
    <div v-if='tag==0'>
      <Mycomponent v-show='isshow'></Mycomponent>  
    </div>  
    <!--是否完善信息  -->
  </div>
</template>
<script>
import Buy from "@/components/buyandsell";
export default {
  components: { Buy },
  data() {
    return {
      multipleSelectionAll: [], // 所有选中的数据包含跨页数据
      multipleSelection: [], // 当前页选中的数据
      idKey: "id", // 标识列表数据中每一行的唯一键的名称(需要按自己的数据改一下)
      tableData: [], // 表格数据
      pagination: {
        totalRows: 0, //总条数
        pageSize: 10, //每页显示条数
        pageSizes: [10],
        pageNumber: 1,
        per_page: 0, //前一页
        layout: "total, sizes, prev, pager, next, jumper"
      },
      title: ""
    };
  },
  created() {
    this.tag = localStorage.getItem("tag"); //判断是否完善信息
  },
  mounted() {},
  methods: {
    //最终选中数据
    handleChooseData() {
      // 获取之前需要执行一遍记忆分页处理
      this.changePageCoreRecordData();
      this.$alert(`选中条数为:${this.multipleSelectionAll.length}`, "提示", {
        confirmButtonText: "确定",
        callback: action => {
          alert(JSON.stringify(this.multipleSelectionAll));
        }
      });
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
    //改变每页显示条数的时候调用一次
    sizeChange(val) {
      // 改变每页显示条数的时候调用一次
      this.changePageCoreRecordData();
      this.pagination.pageSize = val;
    },
    //当页选中的值
    handleSelectionChange(val) {
      // table组件选中事件,记得加上@selection-change="handleSelectionChange"
      this.multipleSelection = val;
    },
    //分页切换
    handleCurrentChanges(val) {
      this.changePageCoreRecordData();
      this.pagination.pageNumber = val;
      this.$axios
        .get("api/admin/Goods_List", {
          params: {
            page: currentPage
          }
        })
        .then(res => {
          //以后要排除已经选择的
          this.tableData = data.data.goos_List.data;
          this.pagination.totalRows = data.data.goos_List.total;
        })
        .catch(err => console.log(err));
    },
    //接受子组件传过来的值
    showMsgFromChild(data) {
      //以后要排除已经选择的
      this.tableData = data.data.goos_List.data;
      this.pagination.totalRows = data.data.goos_List.total;
      this.pagination.per_page = data.data.goos_List.per_page;
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
    //批量代购当前页面 并将所选ID放入临时数组ids方便以后排除
    batchPurchase(index, row) {
      // this.tempArr=this.ids;//引用
      console.log(this.tempArr);
    },
    //一键代购 全部
    allPurchase(index, row) {
      // console.log(row.id)
    },
    //搜索 父组件调用子组件方法
    getData(val) {
      // console.log(this.$refs.childMethod); //返回的是一个vue对象，所以可以直接调用其方法
      this.$refs.childMethod.onSubmit(); //调用子组件的方法
    }
  }
};
</script>

<style scoped>
.box-card {
  padding-bottom: 20px;
}
</style>
