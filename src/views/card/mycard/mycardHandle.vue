<style>
.el-table::before {
  content: "";
  position: absolute;
  background-color: none;
  z-index: 1;
}
.el-table th.is-leaf {
  border-bottom: none;
}
.el-table {
  border: none;
}
</style>

<template>
    <div class="addcard">
        <el-card>
            <div slot="header" >
                <span>{{'编辑卡券'}}</span>
            </div>
            <el-form ref="form" :model="form" label-width="100px" style='width:800px' :rules="rules">                
                <el-form-item label="优惠券类型" prop='type'>
                    <el-select v-model="form.type" placeholder="请选择优惠券类型" >                                                                      
                         <el-option 
                         v-for='item in form.types'
                         :key='item.key'
                         :label='item.val'
                         :value='item.key'>                         
                         </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="优惠券名称" prop='m_name'>
                    <el-input v-model="form.m_name" placeholder="优惠券名称"></el-input>
                </el-form-item>
                <el-form-item label="代金券面值" v-if='form.type==3' prop='amount'>
                    <el-input v-model="form.amount" placeholder="代金券面值" type='number'></el-input>
                </el-form-item>
                <el-form-item label="满足金额" v-if='form.type==3' prop='amount'>
                    <el-input v-model="form.min_money" placeholder="请输入满足条件的金额" type='number' ></el-input>
                </el-form-item>
                <el-form-item label="优惠券折扣" v-if='form.type==2' prop='amount'>
                    <el-input v-model="form.amount" placeholder="请输入1-10的优惠券折扣" type='number' :max='10' :min="1"></el-input>
                </el-form-item>
                 <el-form-item label="满足金额" v-if='form.type==2' prop='amount'>
                    <el-input v-model="form.min_money" placeholder="请输入满足条件的金额" type='number' ></el-input>
                </el-form-item>
                <el-form-item label="优惠券满减" v-if='form.type==1' prop='min_money'>
                    <el-col :span="11">
                        <el-input v-model="form.min_money" placeholder="满多少元" type='number'></el-input>
                    </el-col>
                    <el-col class="line" :span="2">&nbsp;&nbsp;减</el-col>
                    <el-col :span="11">
                        <el-input v-model="form.amount" placeholder="减多少元" type='number'></el-input>
                    </el-col>
                </el-form-item>                        
                <el-form-item label="是否有期限" prop='dat'>
                  <el-switch
                    v-model="form.dat"
                    active-color="#66b1ff"
                    active-value=1
                    inactive-value=0
                    inactive-color="#ccc">
                  </el-switch>
                    <!-- <el-radio-group v-model="form.dat">
                        <el-radio :label="0" :value='form.dat'>不限制</el-radio>
                        <el-radio :label="1" :value='form.dat'>有限制</el-radio>                    
                    </el-radio-group> -->
                </el-form-item>
                <template v-if='form.dat==1'>
                    <el-form-item label='开始时间' prop='begin_time'>                 
                        <div class="block" style='margin-left:0'>
                        <el-date-picker
                        v-model="form.begin_time"
                        type="date"
                        value-format='yyyy-MM-dd'
                        default-value
                        start-placeholder
                        @change="changeTime"
                        :picker-options="pickerBeginDateBefore"
                        placeholder="选择日期">
                        </el-date-picker>
                    </div>          
                    </el-form-item>
                    <el-form-item label='结束时间' prop='end_time'>  
                        <div class="block" style='margin-left:0'>
                            <el-date-picker
                            v-model="form.end_time"
                            :picker-options="pickerBeginDateAfter"
                            type="date"
                            end-placeholder
                            value-format='yyyy-MM-dd'
                            placeholder="选择日期">
                            </el-date-picker>
                        </div>       
                    </el-form-item>
                </template>                
                <el-form-item label="是否限制商品" prop='usetype'>
                   <el-switch
                    v-model="form.usetype"
                    active-color="#66b1ff"
                    active-value=2
                    inactive-value=1
                    inactive-color="#ccc">
                  </el-switch>
                    <!-- <el-radio-group v-model="form.usetype">
                        <el-radio :label="1" :value='form.usetype'>不限制</el-radio>
                        <el-radio :label="2" :value='form.usetype'>有限制</el-radio>                    
                    </el-radio-group> -->
                </el-form-item>
                <el-form-item label="选择商品" v-if='form.usetype==2' prop='sku_goods'>
                  <el-button type="text" @click="goodChoose">编辑商品</el-button> 
                </el-form-item>
                <el-table v-if='data!=""'
                    :data="data"
                    style="width:80%;margin-left:100px">
                    <el-table-column
                    prop="takeaway.title"
                    label="商品名称"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="takeaway.cover"
                    label="封面图">
                    <template slot-scope="scope">
                        <img  :src="scope.row.takeaway.cover?scope.row.takeaway.cover:scope.row.cover" alt="" style="width: 30px;height: 30px">
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="takeaway.price"
                    label="商品价格">
                    <template slot-scope="scope">
                        {{scope.row.takeaway.price?scope.row.takeaway.price:scope.row.price/100}}
                    </template>         
                    </el-table-column>
                    <el-table-column
                    fixed="right"
                    label="操作"
                    align="center">
                    <template slot-scope="scope">
                      <el-button 
                      size="small"
                      @click.native.prevent="deleteRow(scope.$index, scope.row)"
                      >
                        删除
                      </el-button>        
                    </template>
                   </el-table-column>
                </el-table>
                <el-form-item label="优惠券简介" prop='content'>
                    <el-input type="textarea" v-model="form.content" :maxlength='20' :rows='5' placeholder="请输入商品简介"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">保存</el-button>
                    <el-button @click='quxiao'>取消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <!-- 选择商品列表 -->
        <el-dialog title="商品库" :visible.sync="goodlist">
            <el-card>
                <div slot="header">
                    <div class="search">
                         <el-input placeholder="请输入内容">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </div>  
                </div>
                <el-table
                    :data="goodlistdata"
                    border
                     :row-key="getRowKeys"
                    @selection-change="selsChange"
                    style="width: 100%">
                    <el-table-column
                    type="selection"
                     :reserve-selection="true"
                    width="55">
                    </el-table-column>
                    <el-table-column
                    prop="takeaway.title"
                    label="商品名称"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="takeaway_itemTitle"
                    label="sku名称"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="cover"
                    label="封面图"
                    width="180">
                    <template slot-scope="scope">
                        <img  :src="scope.row.cover" alt="" style="width: 50px;height: 50px">
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="price"
                    label="商品价格"
                    width="180">
                    </el-table-column>
                </el-table>
                <!-- 分页设置 -->
                <div class="block" v-if="pagination">
                    <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[per_page]"
                        :page-size="per_page"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                        :background="true">
                    </el-pagination>
                </div>
                <!-- 分页设置 -->
            </el-card>                                  
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 选择商品列表 -->        
    </div>
</template>
<script>
export default {
  data() {
    return {
      itemArr: [],
      getRowKeys(row) {
        return row.id;
      },
      pickerBeginDateBefore: {
        disabledDate: time => {
          let beginDateVal = this.form.end_time;
          if (beginDateVal) {
            return time.getTime() > beginDateVal;
          }
        }
      },
      pickerBeginDateAfter: {
        disabledDate: time => {
          let beginDateVal = this.form.begin_time;
          if (beginDateVal) {
            return time.getTime() < beginDateVal;
          }
        }
      },
      // loading: true,
      sels: "",
      tableshow: false, //选择商品表格是否显示
      addbtnshow: true, //添加按钮是否显示
      formLabelWidth: "140px", //弹出框宽度
      goodlist: false, //默认商品列表隐藏
      goodlistdata: [], //商品列表信息
      Coupon_Goods: [], //限制商品
      form: {
        type: "", //优惠券类型
        types: [],
        m_name: "", //优惠券名称
        min_money: "", //满减最少钱数
        amount: "", //满减钱数
        begin_time: new Date(), //开始时间
        end_time: new Date(), //结束时间
        usetype: 0, //判断券使用是否限制，默认显示不限制
        dat: "", //判断日期是否限制，默认显示限制
        content: "", //优惠券简介
        sku_goods: [] //选择的商品
      },
      data: [],
      datas: [],
      total: 0, //总数默认为0
      currentPage: 1, //当前页默认为1
      pagesize: 10, //每页显示的数据
      page: 1, //当前页第一页
      per_page: 0, //前一页
      pagination: true, //分页器
      rules: {
        type: [{ required: true, message: "请选择优惠券类型" }],
        m_name: [
          { required: true, message: "请输入优惠券名称", trigger: "blur" }
        ],
        min_money: [
          { required: true, message: "请输入满减最少钱数", trigger: "blur" }
        ],
        amount: [
          { required: true, message: "请输入满减钱数", trigger: "blur" }
        ],
        begin_time: [
          { required: true, message: "请选择开始时间", trigger: "blur" }
        ],
        end_time: [
          // { required: true, message: "请选择结束时间", trrigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入优惠券简介", trigger: "blur" }
        ],
        usetype: [
          { required: true, message: "优惠券使用是否有限制", trigger: "blur" }
        ],
        dat: [{ required: true, message: "优惠是否有期限", trigger: "blur" }]
        // sku_goods: [{ required: true, message: "请选择商品", trigger: "blur" }]
      }
    };
  },
  created() {
    //调用获取分类信息
    this.getValue();
  },
  mounted() {
    // this.date();
  },
  methods: {
    //获取开始时间
    changeTime(date) {
      this.form.end_time = "";
      this.pickerBeginDateAfter = {
        disabledDate(time) {
          //开始时间-结束时间
          return time.getTime() < new Date(date).getTime();
        }
      };
    },
    //添加选择商品按钮
    add(index) {
      (this.tableshow = true), (this.addbtnshow = false);
      this.itemArr.push({});
    },
    //删除选择商品按钮
    // deleteRow(index) {
    //   this.itemArr.splice(index, 1);
    // },
    //转换
    certainFunction(obj, keys) {
      return keys.reduce((result, key) => {
        if (obj.hasOwnProperty(key)) {
          result[key] = obj[key];
        }
        return result;
      }, {});
    },
    //出现选择商品列表
    goodChoose() {
      //弹出商品列表
      this.goodlist = true;
      //调接口获取商品列表信息
      this.$axios
        .get("/api/admin/skugoods_info", {})
        .then(res => {
          if (res) {
            //商品列表信息
            this.goodlistdata = res.data.data;
            //判断是否显示分页器
            if (res.data.total < res.data.per_page) {
              this.pagination = false;
            } else {
              this.pagination = true;
            }
            this.total = res.data.total;
            this.per_page = res.data.per_page;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //页码变更显示当前页的数据
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.$axios
        .get("/api/admin/skugoods_info", {
          params: {
            page: currentPage
          }          
        })
        .then(res => {
          this.data = res.data.data;
          this.total = res.data.total;
        })
        .catch(err => console.log(err));
    },
    cancle() {
      //隐藏商品列表
      this.goodlist = false;
    },
    //选中要添加的
    selsChange(sels) {
      //得到的是该行数据 对象数组
      this.sels = sels;
      this.data = sels;
      this.form.sku_goods[this.form.sku_goods.indexOf(this.sels)] = null;
      this.form.sku_goods.splice(this.form.sku_goods.indexOf(null), 1);
    },
    save() {
      this.datas = this.sels;
      let arr = [];
      for (let i = 0; i < this.data.length; i++) {
        let res = this.certainFunction(this.sels[i], ["id", "takeaway_id"]);
        let newobj = {};
        newobj.takeaway_sku_id = res.id;
        newobj.takeaway_id = res.takeaway_id;
        arr.push(newobj);
      }
      this.form.sku_goods = arr;
      // //隐藏商品列表
      this.goodlist = false;
    },
    //获取原信息
    getValue() {
      this.$axios
        .get("/api/admin/coupons_info", {
          params: {
            id: this.$route.params.id
          }
        })
        .then(res => {
          this.form = res.data.ma_coupoms;
          this.form.dat = res.data.ma_coupoms.dat; //是否限制日期
          this.form.usetype = res.data.ma_coupoms.usetype; //是否限制商品
          //如果返回商品数组为空  限制商品则为不限制
          if (res.data.Coupon_Goods.length == 0) {
            this.form.usetype = 1;
          }
          //价格除100
          for (let i = 0; i < res.data.Coupon_Goods.length; i++) {
            res.data.Coupon_Goods[i].takeaway.price =
              res.data.Coupon_Goods[i].takeaway.price / 100;
          }
          //开始时间初始化为当天
          this.form.begin_time =
            res.data.ma_coupoms.begin_time != 0
              ? res.data.ma_coupoms.begin_time
              : new Date(); //开始时间
          //结束时间初始化为当天
          this.form.end_time =
            res.data.ma_coupoms.end_time != 0
              ? res.data.ma_coupoms.end_time
              : new Date(); //结束时间
          //商品匹配
          this.data = res.data.Coupon_Goods;
          let arrs = [];
          for (let i = 0; i < res.data.Coupon_Goods.length; i++) {
            let newobj = {};
            newobj.takeaway_sku_id = res.data.Coupon_Goods[i].id;
            newobj.takeaway_id = res.data.Coupon_Goods[i].takeaway_id;
            arrs.push(newobj);
          }
          this.form.sku_goods = arrs;
          //卡券数据类型转换
          let obj = res.data.type_array;
          var arr = [];
          for (let i in obj) {
            let o = {
              key: i,
              val: obj[i]
            };
            arr.push(o);
          }
          this.form.types = arr;
          //比较分类 通过key显示对应的val
          this.form.type = res.data.ma_coupoms.type;
          for (let i = 0; i < arr.length; i++) {
            if (this.form.type == arr[i].key) {
              this.form.type = arr[i].val;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //删除商品
    deleteRow(index, row) {
      this.data.splice(index, 1);
      let arr = [];
      for (let i = 0; i < this.data.length; i++) {
        let newobj = {};
        newobj.takeaway_sku_id = this.data[i].id;
        newobj.takeaway_id = this.data[i].takeaway_id;
        arr.push(newobj);
      }
      this.form.sku_goods = arr;
    },
    //编辑提交
    onSubmit() {
      //类型转换 对应的val---key
      let arr = this.form.types;
      for (let i = 0; i < arr.length; i++) {
        if (this.form.type == arr[i].val) {
          this.form.type = arr[i].key;
        }
      }
      //提交数据
      let data = {
        type: this.form.type,
        begin_time: this.form.begin_time ? this.form.begin_time : 0,
        end_time: this.form.end_time ? this.form.end_time : 0,
        min_money: this.form.min_money,
        usetype: this.form.usetype,
        dat: this.form.dat,
        amount: this.form.amount,
        content: this.form.content,
        m_name: this.form.m_name,
        sku_goods: this.form.sku_goods
      };
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$axios({
            method: "post",
            url: "api/admin/edit_coupons/" + this.$route.params.id,
            data: data
          })
            .then(res => {
              if (res.data.status == 1) {
                this.$router.push({ name: "mycard" }), (data = null);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    //取消
    quxiao() {
      this.$router.go(-1);
    }
  }
};
</script>
<style>
.goods {
  width: 90%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.title {
  margin-left: 30px;
}
</style>

