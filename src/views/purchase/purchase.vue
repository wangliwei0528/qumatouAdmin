<template>
  <div>
    <!-- 头部 -->
    <el-row class="top">
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">欢迎页</el-breadcrumb-item>
          <el-breadcrumb-item>采购商品列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </el-row>
    <!-- 扫码 -->
    <el-dialog title="微信扫码支付" :visible.sync="pic" width="30%" center @close="closeDialog">
      <div style="width:220px;margin-left:50%;transform:translateX(-50%)">
        <div style="font-weight:bold">
          <span>订单编号:</span>
          <span>{{trade_no}}</span>
        </div>
        <div>
          <img :src="url" alt style="width:200px;height:200px;margin:0 auto">
        </div>
        <div class="btn">
          <span>总金额:</span>
          <span>¥{{total}}</span>
        </div>
      </div>
    </el-dialog>
    <!-- 新增收货地址 -->
    <el-dialog title="新增收货地址" :visible.sync="address" width="40%" center>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="收货人姓名" prop="name">
          <el-input v-model="ruleForm.name" placeholder="收货人姓名" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="收货人性别" prop="sex">
          <template>
            <el-radio v-model="ruleForm.sex" label="1">男</el-radio>
            <el-radio v-model="ruleForm.sex" label="2">女</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="收货人电话" prop="mobile">
          <el-input v-model="ruleForm.mobile" placeholder="收货人姓名" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="选择地区" prop="city">
          <template>
            <v-distpicker
              :province="ruleForm.province"
              :city="ruleForm.city"
              :area="ruleForm.area"
              @province="province"
              @city="city"
              @area="area"
            ></v-distpicker>
          </template>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input
            v-model="ruleForm.address"
            type="textarea"
            :rows="2"
            placeholder="请输入详细地址"
            style="width:300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="设为默认地址" prop="status">
          <el-switch
            v-model="ruleForm.status"
            active-color="#66b1ff"
            active-value="1"
            inactive-value="0"
            inactive-color="#ccc"
          ></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 确认订单 -->
    <el-dialog title="确认订单" :visible.sync="car" width="30%" center>
      <div style="padding:0 30px 60px">
        <div style="padding-left:40px">
          <el-select v-model="selectaddress" placeholder="请选择收获地址">
            <el-option
              v-for="item in addressList"
              :key="item.address"
              :label="item.address"
              :value="item.address"
            ></el-option>
          </el-select>
          <el-button type="primary" @click="addAddress">新增收货地址</el-button>
        </div>
        <ul>
          <li v-for="(item,index) in multipleSelectionAll" :key="index">
            <div style="width:100%;height:100px">
              <div style="width:80px;height:80px;float:left">
                <img :src="item.cover" alt style="width:100%;height:100%">
              </div>
              <div style="float:left;margin-top:15px;margin-left:30px">
                <div>
                  <span>名称:{{item.title}}</span>
                  <br>
                  <el-tag type="info" size="mini">{{item.takeaway_itemTitle}}</el-tag>
                  <br>
                  <span style="color:red">单价:¥{{item.distribution}}</span>
                  <!-- <span v-if='item.qty!=""'>数量:{{item.qty}}</span>
                  <span>数量:{{item.quality}}</span>-->
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div style="margin-left:50%;transform:translateX(-50%)">
          <el-button type="primary" size="small" @click="handleChooseData">确认采购</el-button>
          <el-button size="small" @click="back">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 选择商户弹框 -->
    <Buy
      @listenChild="queryData"
      :title="title"
      :multipleSelectionAll="multipleSelectionAll"
      ref="childMethod"
    />
    <!-- 搜索以及主图表格 -->
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
        <el-table-column type="selection" width="55" align="center" :reserve-selection="true"></el-table-column>
        <el-table-column prop="title" label="名称" align="center"></el-table-column>
        <el-table-column prop="cover" label="SKU封面" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.cover" alt style="width:50px;height:50px">
          </template>
        </el-table-column>
        <el-table-column prop="cate_name" label="分类" align="center"></el-table-column>
        <el-table-column prop="brand_name" label="品牌" align="center"></el-table-column>
        <el-table-column prop="distribution" label="批发价(元)" align="center"></el-table-column>
        <el-table-column prop="takeaway_itemTitle" label="规格值" align="center"></el-table-column>
        <el-table-column prop="quality" label="库存" align="center"></el-table-column>
        <el-table-column prop="quality" label="采购量(件)" align="center">
          <template slot-scope="scope">
            <el-input
              type="number"
              :value="scope.row.quality"
              :max="scope.row.quality"
              :min="0"
              ref="qty"
              :placeholder="scope.row.quality"
              @change="getval"
              @blur="change(scope.$index, scope.row)"
              @keyup.enter.native="change(scope.$index, scope.row)"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin:20px 0;">
        <div style="float:right" v-if="pagination.pagination">
          <el-pagination
            :page-size="pagination.pageSize"
            @current-change="currentChange"
            :current-page="pagination.pageNumber"
            :page-sizes="[per_page]"
            :total="pagination.totalRows"
            :layout="pagination.layout"
            @size-change="sizeChange"
          ></el-pagination>
        </div>
        <div style="float:left">
          <el-badge
            :value="this.multipleSelectionAll.length"
            :min="1"
            :hidden="istrue"
            class="item"
            style="margin-right:20px"
          >
            <el-button type="primary" size="small" @click="save">批量采购</el-button>
          </el-badge>
          <!-- <el-button type="primary" size="small" @click="allPurchase">一键采购</el-button> -->
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
import VDistpicker from "v-distpicker";
import Buy from "@/components/common/purchase";
import Mycomponent from "@/components/common/alert";
export default {
  components: { Buy, Mycomponent, VDistpicker },
  data() {
    return {
      getRowKeys(row) {
        return row.id;
      },
      url: "",
      pic: false, //支付页面是否显示
      car: false, //购物车
      address: false, //新增收货地址页面
      addressList: [], //收获地址列表
      selectaddress:'',
      select: { province: "", city: "", area: "" },
      ruleForm: {
        name: "", //收货人姓名
        sex: "", //收货人性别 1男2女
        mobile: "", //收货人联系方式
        province: "", //省
        city: "", //市
        area: "", //区
        address: "", //地址
        status: "" //是否默认地址
      },
      rules: {
        name: [{ required: true, message: "请输入收货人姓名" }]
      },
      total: "", //总金额
      trade_no: "", //订单编号
      val: "", //采购量
      isshow: true,
      istrue: true,
      tempArr: [],
      multipleSelectionAll: [], // 所有选中的数据包含跨页数据
      multipleSelection: [], // 当前页选中的数据
      idKey: "id", // 标识列表数据中每一行的唯一键的名称
      tableData: [], // 表格数据
      per_page: 0, //前一页
      pagination: {
        pagination: false,
        totalRows: 0, //总条数
        // pageSize: 2, //每页显示条数
        pageSizes: [10],
        pageNumber: 1,
        
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
      },
      timeName: null
    };
  },
  created() {
    this.tag = localStorage.getItem("tag"); //判断是否完善信息
  },
  mounted() {},
  methods: {
    //省
    province(val) {
      this.ruleForm.province = val.value;
    },
    //市
    city(val) {
      this.ruleForm.city = val.value;
    },
    //区
    area(val) {
      this.ruleForm.area = val.value;
    },
    //提交添加地址
    submitForm(formName) {
      let data=this[formName]
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios.post("api/admin/addAddress", data).then(res => {
            if (res.data.status == 1) {
              this.ruleForm = {};
              this.address = false;
              // console.log(data)
              if (data.status == 1) {
                this.addressList.unshift(data);
                this.selectaddress=this.addressList[0].address;//放到默认地址区域
              }
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //取消
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //获取默认收货地址
    getAddress() {
      this.$axios.get("api/admin/defaultAddress").then(res => {
        console.log(res);
        this.addressList = res.data.defaultAddress;
        this.selectaddress=this.addressList[0].address;//显示默认地址
      });
    },
    //新增收货地址
    addAddress() {
      this.address = true;
    },
    //关闭弹窗清除定时器
    closeDialog() {
      clearInterval(this.timeName);
    },
    //取消
    back() {
      this.car = false; //yincang购物车
      this.multipleSelectionAll = [];
      this.multipleSelection = [];
      this.tempArr = [];
      this.getData();
    },
    //批量采购
    handleChooseData() {
      // 获取之前需要执行一遍记忆分页处理
      this.changePageCoreRecordData();
      this.setSelectRow();
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
            if (res.data.status == 1) {
              this.url = "data:image/png;base64," + res.data.data.qrcode;
              this.trade_no = res.data.data.trade_no;
              this.total = res.data.data.total;
              this.pic = true; //显示二维码
              this.istrue = true; //清空购物车消息
              this.car = false; //yincang购物车
              // this.multipleSelectionAll = [];
              // this.multipleSelection = [];
              this.tempArr = [];
              this.getData();
              this.payed();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消批量采购"
          });
        });
    },
    //是否支付完成
    payed() {
      this.timeName = setInterval(() => {
        this.$axios
          .get("api/admin/query_Order", {
            params: {
              trade_no: this.trade_no
            }
          })
          .then(res => {
            console.log(res)
            if (res.data.status == 1) {
              this.pic = false;
              clearInterval(this.timeName);
            }
          });
      }, 5000);
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
      // this.$refs.table.clearSelection();
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
    //切换页码
    currentChange(val) {
      // 改变页的时候调用一次
      this.changePageCoreRecordData();
      this.pagination.pageNumber = val;
      this.$axios({
        method: "post",
        url: "api/admin/Goods_List",
        data: {
          purchase_id: this.purchase_id,
          page: val,
          type: 1
        }
      }).then(res => {
        this.tableData = res.data.goos_List.data;
      });
    },
    //每页数量改变
    sizeChange(val) {
      // 改变每页显示条数的时候调用一次
      this.changePageCoreRecordData();
      this.pagination.pageSize = val;
    },
    //将商品放入采购数组
    save() {
      this.changePageCoreRecordData();
      this.setSelectRow();
      // console.log(this.multipleSelectionAll);
      //将需要的采购数据push到数组而且对象数组去重
      if (this.multipleSelection != "") {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          var newobj = {
            id: this.multipleSelection[i].id,
            qty: this.multipleSelection[i].quality
          };
          this.tempArr.push(newobj);
        }
        //数组中对象去重 reduce 用法
        let obj = {};
        this.tempArr = this.tempArr.reduce((cur, next) => {
          obj[next.id] ? "" : (obj[next.id] = true && cur.push(next));
          return cur;
        }, []); //设置cur默认类型为数组，并且初始值为空的数组
        this.getAddress();
        this.car = true;
      } else {
        this.$message({
          type: "warning",
          message: "暂无商品"
        });
      }
    },
    //选中
    handleSelectionChange(val) {
      // table组件选中事件,记得加上@selection-change="handleSelectionChange"
      this.multipleSelection = val ? val : [];
      this.multipleSelectionAll = val ? val : [];
      if (this.multipleSelection.length != 0) {
        this.istrue = false;
      }
    },
    //渲染数据data
    queryData(data) {
      this.tableData = data.data.goos_List.data.map(item => {
        item.distribution = item.distribution / 100;
        return item;
      });
      this.purchase_id = data.data.purchase_id;
      if (data.data.goos_List.total < data.data.goos_List.per_page) {
            this.pagination.pagination = false;
          } else {
            this.pagination.pagination = true;
          }
          this.pagination.totalRows = data.data.goos_List.total;
          this.per_page = data.data.goos_List.per_page;      
    },
    // 得到选中的所有数据
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
    //input框值改变
    getval(val) {
      this.val = val;
    },
    //确定input的值并作为参数放入数组
    change(index, row) {
      let goods = {
        id: row.id,
        qty: parseInt(this.val)
      };
      if (this.val > row.quality) {
        this.$message({
          type: "warning",
          message: "库存不够,请重新输入"
        });
        return false;
      }
      this.tempArr.push(goods);
    }
  },
  //页面销毁
  beforeDestroy() {
    //            清楚定时器
    clearInterval(this.timeName);
  }
};
</script>

<style scoped>
.box-card {
  padding-bottom: 20px;
}
.btn {
  width: 200px;
  height: 30px;
  background: #1aad19;
  text-align: center;
  font-weight: bold;
  color: #fff;
  font-size: 20px;
  padding: 10px 0;
}
li {
  list-style-type: none;
}
</style>
