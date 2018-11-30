<template>
	<div class="sso-box" v-layout data-bg="sso">
		<div class="centered-box">
			<div class="userlogin">
          <div class='lg' @click='btn()' :class="{ active: isActive }">
            账号密码登录
          </div>
          <div class='lg' @click='btn()' :class="{ active: isActives }">
            短信验证登录
          </div>
      </div>
			<el-form ref="form" :model="form" :rules="rules"  class='form'>
				<el-form-item label="" prop="mobile">
					<el-input v-model.trim="form.mobile" clearable placeholder="请输入手机号码" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="" prop="pwd" v-show='password'>
					<el-input v-model.trim="form.pwd" clearable placeholder="请输入密码"  type='password' @keyup.enter.native='login()'></el-input>            
        </el-form-item>
				<el-form-item label="" prop="code" v-show='duanxin'>
					<el-input type="text" v-model.trim="form.sms" clearable placeholder="请输入手机验证码" :maxlength="20" style='width:250px' @keyup.enter.native='login()'></el-input>
				  <el-button type="primary" style='float:right;' @click="getCode">
            <span v-show="show" >获取验证码</span>
            <span v-show="!show" class="count">{{count}} s后重新发送</span>
          </el-button>
        </el-form-item>
				<el-form-item>
					<el-button type="primary" @click="login" style='width:100%'>登录</el-button>	
				</el-form-item>        
			</el-form>
		</div>
	</div>
</template>

<script>
export default {
  name: "signin",
  data() {
    return {
      show: true,
      count: "",
      timer: null,
      password: true,
      duanxin: false,
      isActive: true,
      isActives: false,
      form: {
        mobile: "",
        sms: "",
        pwd: ""
      },
      rules: {
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { min: 11, max: 11, message: "长度 11 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //获取验证码并倒计时
    getCode() {
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.show = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.show = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
      this.$axios({
        method: "post",
        url: "/api/admin/sendSms",
        data: {
          mobile: this.form.mobile
        }
      });
    },
    //登录
    login() {
      this.$refs.form.validate(valid => {
        if (this.form.pwd) {
          if (valid) {
            let data = {
              mobile: this.form.mobile,
              pwd: this.form.pwd
            };
            this.$axios.post("/api/admin/login", data).then(res => {
              // console.log(res)
              if (res.data.status == 1) {
                this.$router.push("/views/merchant/merchant");
                localStorage.setItem("date", res.data.expires_in); //token存储日期
                localStorage.setItem("token", res.data.token); //token
                localStorage.setItem("tag", res.data.tag); //判断信息完整与否的参数
                localStorage.setItem("mobile", res.data.mobile); //登入手机号
                localStorage.setItem("is_proxy", res.data.is_proxy); //权限是否显示代购代销
              }
            });
          } else {
            return false;
          }
        } else {
          if (valid) {
            let data = {
              mobile: this.form.mobile,
              sms: this.form.sms
            };
            this.$axios.post("/api/admin/getSms", data).then(res => {
              // console.log(res)
              this.$router.push("/views/merchant/merchant");
                localStorage.setItem("date", res.data.expires_in); //token存储日期
                localStorage.setItem("token", res.data.token); //token
                localStorage.setItem("tag", res.data.tag); //判断信息完整与否的参数
                localStorage.setItem("mobile", res.data.mobile); //登入手机号
                localStorage.setItem("is_proxy", res.data.is_proxy); //权限是否显示代购代销
            });
          } else {
            return false;
          }
        }
      });
    },
    //登录方式切换
    btn() {
      this.password = !this.password;
      this.duanxin = !this.duanxin;
      this.isActive = !this.isActive;
      this.isActives = !this.isActives;
    }
  }
};
</script>

<style scoped>
.weixin {
  width: 100%;
  height: 50px;
  border-top: 1px solid #ccc;
  position: relative;
}
.weixin-box {
  width: 130px;
  margin: 0 auto;
  background: #fff;
  position: absolute;
  top: -21px;
  left: 50%;
  transform: translate(-50%);
  text-align: center;
  font-size: 12px;
}
img {
  display: block;
  width: 50px;
  height: 50px;
  position: absolute;
  bottom: -46px;
  left: 50%;
  transform: translate(-50%);
  cursor: pointer;
}
.userlogin {
  display: flex;
  justify-content: space-between;
}
.userlogin .lg {
  width: 50%;
  height: 100%;
  color: #fff;
  font-weight: bolder;
}
.userlogin .lg.active {
  color: #409eff;
  font-weight: bolder;
}
</style>