<template>
    <div class="setcard">
      <el-row class='top'>
            <div class="breadcrumb">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/home' }">欢迎页</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{name:'pushcard'}">卡券投放</el-breadcrumb-item>
                    <el-breadcrumb-item>卡券设置</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </el-row>
        <el-card class="box-card">
            <div slot="header" class='header'>
                <span>卡券设置</span>               
            </div> 
            <div>
                <span style='font-size:12px'>有投放卡券时,该投放设置不可编辑</span>                                
                <el-form ref="form" :model="form" label-width="80px" style='margin-top:30px;width:50%'>
                    <el-form-item label="投放数量">
                        <el-input v-model="form.coupons" controls-position="right" @change="handleChange" :min="0" type=number></el-input>
                        <span style='color:red'>* 投放数量 元/张</span>
                    </el-form-item>                    
                    <el-form-item label="投放天数">
                        <el-input v-model="form.times" controls-position="right" @change="handleChange" :min="0" type=number></el-input>
                        <span style='color:red'>* 投放时长按天计算 元/天</span>
                    </el-form-item>
                    <el-form-item label="橱窗数量">
                        <el-input v-model="form.nums" controls-position="right" @change="handleChange" :min="0" type=number></el-input>
                    </el-form-item>
                    <el-form-item label="最少天数">
                        <el-input v-model="form.least_times" controls-position="right" @change="handleChange" :min="0" type=number></el-input>
                    </el-form-item>                                        
                </el-form>
            </div>          
        </el-card>
        <div v-if='tag==0'>
          <Mycomponent v-show='isshow'></Mycomponent>  
        </div> 
    </div>
</template>
<script>
import Mycomponent from "@/components/common/alert";
export default {
  components: { Mycomponent },
  data() {
    return {
      isshow:true,
      tag:'',
      form: {
        coupons: "",
        times: "",
        nums: "",
        least_times: ""
      },
      num: 1,
    };
  },
  created() {
    this.tag=localStorage.getItem("tag")
    this.getData();   
  },
  mounted() {
    // this.date();
  },
  methods: {
    //是否有数据
    getData() {
      this.$axios({
        method: "get",
        url: "/api/admin/position_info"       
      })
        .then(res => {         
          this.form.coupons = res.data.ma_position.coupons / 100;
          this.form.times = res.data.ma_position.times / 100;
          this.form.nums = res.data.ma_position.nums;
          this.form.least_times = res.data.ma_position.least_times;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //保存
    save() {
      this.$axios({
        method: "post",
        url: "/api/admin/add_position",        
        data: {
          coupons: this.form.coupons,
          times: this.form.times,
          nums: this.form.nums,
          least_times: this.form.least_times
        }
      })      
    },
    handleChange(value) {
      console.log(value);
    }
  }
};
</script>
<style>
</style>


