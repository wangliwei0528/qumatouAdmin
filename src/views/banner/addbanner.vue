<template>    
    <div>
        <el-card>
            <div slot="header" class='header'>
                <span>{{this.$route.query.id?'编辑轮播图':'添加轮播图'}}</span>
            </div>
            <el-form ref="form" :model="form" label-width="100px" style='width:670px' :rules='rules'>
            <el-form-item label="轮播图标题" prop='title'>
                <el-input v-model="form.title" placeholder="请输入轮播图标题"></el-input>
            </el-form-item>
            <el-form-item label="轮播图封面" prop='cover'>
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
                  <i class="el-icon-plus"></i>
                </el-upload>
                <img width="100%" :src="imgurl" alt="" class='pic'>
                <el-dialog title="原始轮播图片"  :visible.sync="dialogVisible" append-to-body>
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>                
            </el-form-item>           
            <el-form-item label="轮播图地址" prop='url'>
                 <el-input v-model="form.url" placeholder="请输入url">
                    <template slot="prepend">Http://</template>
                </el-input>
            </el-form-item>
            <el-form-item label="轮播图价格" prop='price'>
                <el-input v-model="form.price" placeholder="请输入轮播图价格" type='number' :min="1"></el-input>
            </el-form-item>           
            <div style='width:300px;margin:0 auto'>
              <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">确定</el-button>
                <el-button @click='back'>取消</el-button>
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
      imgurl:[],
      dialogImageUrl: "",
      dialogVisible: false,
      form: {
        title: "",
        cover: "",
        url: "",
        price: "",
        type: this.$route.query.type
      },
      rules: {
        title: [
          { required: true, message: "请输入轮播图标题", trigger: "blur" }
        ],
        cover: [
          { required: true, message: "请选择轮播图封面", trigger: "blur" }
        ],
        url: [{ required: true, message: "请输入轮播图地址", trigger: "blur" }],
        price: [
          { required: true, message: "请输入轮播图价格", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getheader(); //获取头部信息
    this.type = this.$route.query.type; //判断type确认是否显示price
    if(this.$route.query.id){//编辑的信息
        this.editMsg();
    }    
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
      this.imgurl=''//编辑时替换图片
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
    onSubmit(ref) {
      this.$refs[ref].validate(valid => {
        if (this.$route.query.id) {
            this.$axios({
            method: "post",
            url: "api/admin/edit_Carousel/"+this.$route.query.id,
            data: this[ref]
          })
            .then(res => {
              if (res.data.status == 1) {
                this.$router.push("/views/banner/banner");
              }
            })
        } else {
          this.$axios({
            method: "post",
            url: "api/admin/add_Carousel",
            data: this[ref]
          })
            .then(res => {
              if (res.data.status == 1) {
                this.$router.push("/views/banner/banner");
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    back() {
      this.$router.go(-1);
    },
    editMsg() {
      this.$axios({
        method: "get",
        url: "api/admin/carousel_Info",
        params: {
          id: this.$route.query.id
        }
      }).then(res => {
        // console.log(res)
        this.form = res.data.carousel;
        this.form.price = res.data.carousel.price/100;
        this.imgurl=res.data.carousel.cover
      });
    }
  }
};
</script>
<style>
.el-upload--picture-card{
  background-color:transparent;
  position:relative;
  z-index:2
}
.pic{
  width:148px;
  height:148px;
  position:absolute;
  top:0;
  left:0
}
.el-upload--picture-card i {
  font-size:14px
}
</style>


