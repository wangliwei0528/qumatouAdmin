<template>
    <div>
        <!--是否完善信息  -->
        <div v-if='tag==0'>
            <Mycomponent v-show='isshow'></Mycomponent>  
        </div>  
        <!--是否完善信息  -->
        <Buy @listenChild='queryData'/>
        <el-card>
             <div slot="header" class='header'>
                <span>采购商品列表</span>            
            </div>
            caigou
        </el-card>
    </div>
</template>
<script>
import Buy from "@/components/common/buyandsell";
import Mycomponent from "@/components/common/alert";
export default {
  components: { Buy, Mycomponent },
  data() {
    return {
      isshow: true,
      tag: "",
      pagination: {
        totalRows: 0, //总条数
        pageSize: 10, //每页显示条数
        pageSizes: [10],
        pageNumber: 1,
        per_page: 0, //前一页
        layout: "total, sizes, prev, pager, next, jumper"
      },
    };
  },
  created() {
    this.tag = localStorage.getItem("tag"); //判断是否完善信息
  },
  methods: {
    queryData(data) {
      //以后要排除已经选择的
      this.tableData = data.data.goos_List.data;
      this.wholes_id = data.data.wholes_id;
      this.pagination.totalRows = data.data.goos_List.total;
      this.pagination.per_page = data.data.goos_List.per_page;
    } // 得到选中的所有数据
  }
};
</script>

