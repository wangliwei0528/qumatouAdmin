<template>
    <div class="merchant">
       <el-row class='top'>
            <div class="breadcrumb">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/home' }">欢迎页</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{name:'merchant'}">商户管理</el-breadcrumb-item>
                    <el-breadcrumb-item>商户信息</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </el-row>
       <el-card class="box-card">
            <div slot="header" class='header'>
                <span>基本信息</span>
                <span v-if='tag==0' style='color:red'>(请完善您的信息)</span>
            </div> 
            <el-form ref="form" :model="form" label-width="100px" style='width:600px' :rules="rules">
                <el-form-item label="选择行业:" prop='industry_id'>
                     <el-select v-model="form.industry_id" placeholder="请选择" >
                        <el-option
                        v-for="item in form.industry"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id">
                        </el-option>
                    </el-select> 
                </el-form-item>
                <el-form-item label="选择地区:" prop='region_id'>
                     <el-select v-model="form.region_id" placeholder="请选择" filterable >
                        <el-option
                        v-for="item in form.region"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id">
                        </el-option>
                    </el-select> 
                </el-form-item>
                <el-form-item label="选择分类:" prop='shop_type'>
                     <el-select v-model="form.shop_type" placeholder="请选择" filterable >
                        <el-option
                        v-for="item in form.shop_types"
                        :key="item.key"
                        :label="item.val"
                        :value="item.key">
                        </el-option>
                    </el-select> 
                </el-form-item>
                <el-form-item label="手机号:" prop='mobile'>
                    <el-input v-model='form.mobile' placeholder="请输入手机号："></el-input>                                       
                </el-form-item>
                <el-form-item label="商户名称:" prop='title'>
                    <el-input v-model='form.title' placeholder="请输入商户名称："></el-input>                                       
                </el-form-item>
                <el-form-item label="真实姓名:" prop='name'>
                    <el-input v-model='form.name' placeholder="请输入真实姓名："></el-input>                                       
                </el-form-item>             
                 <el-form-item label="身份证号:" prop='id_card'>
                    <el-input v-model='form.id_card' placeholder="请输入身份证号："></el-input>                                       
                </el-form-item>
                <el-form-item label="详细地址:" prop='address'>
                    <el-input v-model='form.address' placeholder="请输入详细地址：" style='width:75%' @blur='getmap()'></el-input>                                       
                    <input type="hidden" ref="lng" name="lng">
                     <input type="hidden" ref="lat" name="lat">
                      <el-button id="getMap"  type="button" @click='getmap'>获取坐标</el-button>
                    <div id="container" style='width:375px;height:400px'></div>
                </el-form-item>
                <div style='width:300px;margin:0 auto'>
                  <el-form-item >
                    <el-button type="primary" @click="onSubmit">确定</el-button>
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
      title: "",
      isshow:false,
      tag: "",
      form: {
        region_id: "",
        industry_id: "",
        industry: [],
        region: [],
        name: "",
        lat: "",
        lng: "",
        addres: "",
        shop_type: "",
        shop_types: []
      },
      rules: {
        type: [{ required: true, message: "请选择优惠券类型" }],
        region_id: [{ required: true, message: "请选择地区", trigger: "blur" }],
        industry_id: [
          { required: true, message: "请选择行业", trigger: "blur" }
        ],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        title: [{ required: true, message: "请输入商户名称", trigger: "blur" }],
        name: [{ required: true, message: "请输入真实姓名", trrigger: "blur" }],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ],
        id_card: [
          { required: true, message: "请输入真实地址", trigger: "blur" }
        ],
        shop_type: [{ required: true, message: "请选择分类", trigger: "blur" }]
      }
    };
  },
  created() {    
    this.getOption(); //行业
    this.getRegion(); //地区  
    this.tag=localStorage.getItem('tag')//是否显示填写完整信息  
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      var myLatlng = new qq.maps.LatLng(39.897445, 116.331398);
      var myOptions = {
        zoom: 12,
        center: myLatlng,
        mapTypeId: qq.maps.MapTypeId.ROADMAP
      };
      var map = new qq.maps.Map(
        document.getElementById("container"),
        myOptions
      );
      //添加监听事件
      qq.maps.event.addListener(map, "click", function(event) {
        console.log(
          "您点击的位置为: [" +
            event.latLng.getLat() +
            ", " +
            event.latLng.getLng() +
            "]"
        );
      });
    },
    getmap() {
      let that = this;
      let address = this.form.address;
      let geocoder = new qq.maps.Geocoder(); //对指定地址进行解析
      geocoder.getLocation(address); //设置服务请求成功的回调函数
      geocoder.setComplete(function(result) {
        that.form.lat = result.detail.location.lat;
        that.form.lng = result.detail.location.lng;
      }); //若服务请求失败，则运行以下函数
      geocoder.setError(function() {
        alert("出错了，请输入正确的地址！！！");
      });
      let markersArray = [];
      let myLatlng = new qq.maps.LatLng(this.form.lat, this.form.lng);
      let myOptions = {
        zoom: 18,
        center: myLatlng,
        mapTypeId: qq.maps.MapTypeId.ROADMAP
      };
      let map = new qq.maps.Map(
        document.getElementById("container"),
        myOptions
      );
      let marker = new qq.maps.Marker({
        position: myLatlng,
        map: map
      });
      markersArray.push(marker);
    },

    //行业获取信息   获取信息
    getOption() {
      this.$axios
        .get("api/admin/merchants_info")
        .then(res => {
          if (res.data.merchants) {
            this.form = res.data.merchants;
            this.form.region = res.data.region;
            this.form.industry = res.data.industys;
            this.form.industry_id =
              res.data.merchants.industry_id == 0
                ? "请选择行业"
                : res.data.merchants.industry_id;
            let obj = res.data.shop_type;
            var arr = [];
            for (let i in obj) {
              let o = {
                key: i,
                val: obj[i]
              };
              arr.push(o);
            }
            this.form.shop_types = arr;
            //比较分类 key==>val
            this.form.shop_type = res.data.merchants.shop_type;
            this.form.shop_type =
              res.data.merchants.shop_type == 0
                ? "请选择分类"
                : res.data.merchants.shop_type;
            for (let i = 0; i < arr.length; i++) {
              if (this.form.shop_type == arr[i].key) {
                this.form.shop_type = arr[i].val;
              }
            }
          } else {
            this.form.industry = res.data.industys;
            this.form.shop_types = res.data.shop_type;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getmsg() {
      this.$axios
        .get("api/admin/merchants_info")
        .then(res => {
          this.form = res.data.merchants;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //地区
    getRegion() {
      this.$axios
        .get("api/admin/all_region")
        .then(res => {
          this.form.region = res.data.regions;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //地区搜索
    search() {
      this.$axios.get("api/admin/search_region", {
        params: {
          title: this.title
        }
      });
    },
    getData() {
      this.$axios({
        method: "post",
        url: "api/admin/edit_merchants",        
        data: data
      })
        .then(res => {          
          this.form = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    onSubmit() {
      //val==>key
      let arr = this.form.shop_types;
      for (let i = 0; i < arr.length; i++) {
        if (this.form.shop_type == arr[i].val) {
          this.form.shop_type = arr[i].key;
        }
      }
      let data = {
        region_id: this.form.region_id,
        industry_id: this.form.industry_id,
        mobile: this.form.mobile,
        title: this.form.title,
        name: this.form.name,
        address: this.form.address,
        id_card: this.form.id_card,
        lng: this.form.lng,
        lat: this.form.lat,
        shop_type: this.form.shop_type
      };
      this.$refs.form.validate(valid => {
        if (valid) {          
          this.$axios({
            method: "post",
            url: "api/admin/edit_merchants",           
            data: data
          })
          // .then(res=>{console.log(res)})          
        }
      });
    },    
  }
};
</script>
<style scoped>
.el-dialog__headerbtn {
  display: none important!;
}
</style>



