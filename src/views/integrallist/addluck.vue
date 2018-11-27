<template>
    <el-card>
        <div slot="header" >
            <span>{{'积分抽奖/购买'}}</span>
        </div>
        <el-form ref="form" :model="form" label-width="100px" style='width:670px' :rules='rules'>
            <el-form-item label="商品名称" prop='title'>
                <el-input v-model="form.title" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <el-form-item label="商品封面" prop='cover'>
               <el-upload                  
                  action="api/admin/upFile"
                  list-type="picture-card"
                  name='img'
                  :headers='header'
                  :limit=1
                  :on-preview="handlePictureCardPreview"
                  :before-upload="beforeAvatarUpload"
                  :on-remove="handleRemove"
                  :on-success="uploadSuccess">
                  <i class="el-icon-plus" style='font-size:14px;color:#d1d2d6'>单图上传</i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>                
            </el-form-item>
             <el-form-item label="商品轮播" prop='banner'>
                 <el-upload
                  action="api/admin/upFiles"
                  list-type="picture-card"
                  name='files[]'
                  :limit=5
                  :multiple=true  
                  :file-list='fileList'               
                  :headers='header'
                  :on-preview="handlePictureCardPreview"
                  :before-upload="beforeAvatarUpload"
                  :on-remove="handleRemove"
                  :on-success="uploadSuccessed"
                  :on-exceed='uploadMore'>
                  <i class="el-icon-plus" style='font-size:14px;color:#d1d2d6'>多图上传(最多5张)</i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>                
            </el-form-item>
            <el-form-item label="商品原价" prop='cost'>
                <el-input v-model="form.cost" placeholder="请输入商品原价" type='number' :min="1"></el-input>
            </el-form-item>
            <el-form-item label="商品积分" prop='integral'>
                <el-input v-model="form.integral" placeholder="请输入商品积分" type='number' :min="1"></el-input>
            </el-form-item>
            <el-form-item label="所需人数" prop='people_num'>
                <el-input v-model="form.people_num" placeholder="请输入商品所需人数" type='number' :min="1"></el-input>
            </el-form-item>
            <el-form-item label="商品详情" prop='details'>
                <tinymce v-model="form.details"></tinymce>
            </el-form-item>
            <el-form-item label="价格" prop='price' v-if='type==2'>
                <el-input v-model="form.price" placeholder="请输入商品价格" type='number' :min="1"></el-input>
            </el-form-item>
            <div style='width:300px;margin:0 auto'>
              <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">确定</el-button>
                <el-button @click='back'>取消</el-button>
              </el-form-item>   
            </div>                    
        </el-form>
    </el-card>
</template>
<script>
import tinymce from "@/components/tinymce-vue";
export default {
  components:{tinymce},
  data() {
    return {
      img: "",
      files: "",
      fileList: [],
      header: {},
      dialogImageUrl: "",
      dialogVisible: false,
      form: {
        title: "", //商品名称
        cover: "", //商品封面
        cost: "", //商品原价
        integral: "", //积分
        people_num: "", //所需人数
        details: "", //详情
        banner: [], //banner
        type: this.$route.query.type, //1积分抽奖 2积分购买
        price: "" //所需金额
      },
      rules: {
        title: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        cover: [{ required: true, message: "请选择商品封面", trigger: "blur" }],
        cost: [{ required: true, message: "请输入商品原价", trigger: "blur" }],
        integral: [{ required: true, message: "请输入商品积分", trigger: "blur" }],
        people_num: [{ required: true, message: "请输入所需人数", trigger: "blur" }],
        details: [{ required: true, message: "请输入详情", trigger: "blur" }],
        banner: [{ required: true, message: "请选择banner", trigger: "blur" }],
        price: [{ required: true, message: "请输入所需金额", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getheader();//获取头部信息
    this.type = this.$route.query.type; //判断type确认是否显示price
  },
  methods: {
    //获取头部信息
    getheader() {
      this.header = {
        Authorization: "Bearer " + localStorage.getItem("token")
      };
    },
    //上传限制
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //移除图片列表
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    //展示图片列表
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //单图上传成功
    uploadSuccess(res, file) {
      this.form.cover = res;
    },
    //多图上传成功
    uploadSuccessed(res, file,fileList) {
      this.form.banner.push(res.join())
    },
    uploadMore(){
      this.$message.error("最多上传5张");
    },
    //提交
    onSubmit(ref) {    
      this.$refs[ref].validate(valid => {
        this.$axios({
          method: "post",
          url: "api/admin/add_Integral",
          data: this[ref]
        }).then(res => {
            if (res.data.status == 1) {
              this.$router.push("/views/integrallist/integrallist");
            }
          }).catch(err => {
            console.log(err);
          });
      });
    },
    //取消
    back() {
      this.$router.go(-1);
    }
  }
};
</script>
<style>
.el-upload--picture-card{
  background-color:transparent;
}

</style>


