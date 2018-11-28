<template>
<div>
<el-row class='top'>
        <div class="breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/home' }">欢迎页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{name:'pushcard'}">卡券投放</el-breadcrumb-item>
                <el-breadcrumb-item>创建卡券投放</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
    </el-row>
  <el-card>
      <div slot="header" class='header' >
        <span>{{'创建卡券投放'}}</span>
      </div>
      <el-form ref="form" :model="form" label-width="100px" style='width:670px'>
            <el-form-item label="选择卡券">
                <el-select placeholder="请选择卡券类型" v-model="form.valueType.id">                                              
                        <el-option 
                        v-for='item in form.valueType'
                        :key='item.id'
                        :label='item.m_name'
                        :value='item.id'
                        ></el-option>                      
                </el-select>
            </el-form-item>
                <el-form-item label="投放类型" >
                   <template v-if='this.$route.query.types==1'>
                      <el-radio-group v-model="form.type">
                        <el-radio :label="1" :value='form.type'>按卡券数量投放</el-radio>
                        <el-radio :label="2" :value='form.type'>卡投放效果投放</el-radio>                    
                    </el-radio-group>
                  </template>
                  <template v-if='this.$route.query.types!=1'>
                      <el-radio-group v-model="form.type">                       
                        <el-radio :label="2" :value='form.type'>卡投放效果投放</el-radio>                    
                    </el-radio-group>
                  </template>               
            </el-form-item>
            <el-form-item label="投放数量" >
                <el-input v-model="form.stock" type="number" min='0'></el-input>
            </el-form-item> 
            <el-form-item label="投放天数">
                <el-input v-model="form.days" type="number" min='0'></el-input>
            </el-form-item> 
            <div style='width:300px;margin:0 auto'>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button @click='cancle'>取消</el-button>
            </el-form-item>
            </div>
        </el-form>
  </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        valueType: [],
        type: 2,
        ma_merchant_coupon_id: "",
        stock: "",
        days: ""
      },
      tag: ""
    };
  },
  created() {
    this.token = localStorage.getItem("token");
    //获取卡券类别信息
    this.$axios
      .get("api/admin/card_info", {       
      })
      .then(res => {
        this.form.valueType = res.data.card_lists;
        this.tag = res.data.tag;
      })
      .catch(err => {
        console.log(err);
      });
  },
  mounted() {
    // this.date();
  },
  methods: {
    //提交创建
    onSubmit() {
      let data = {
        ma_merchant_coupon_id: this.form.valueType.id,
        stock: this.form.stock,
        type: this.form.type,
        days: this.form.days,
        types: this.$route.params.types,
        merchant_id: this.$route.params.merchant_id
      };      
      this.$axios({
        method: "post",
        url: "api/admin/add_cardelivery",
        params: {
          types: this.$route.params.types,
          id: this.$route.params.id
        },        
        data: data
      })
        .then(res => { 
          if(res.data.status==1){
            this.$router.go(-1);   
          }                          
        })
        .catch(err => {
          console.log(err);
        });
    },
    //取消
    cancle() {
      this.$router.go(-1);
    }
  }
};
</script>

