<template>
	<div class="sso-box" v-layout data-bg="sso">
		<div class="centered-box">
			<el-form ref="form" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="手机" prop="mobile">
					<el-input v-model.trim="form.mobile" clearable placeholder="请输入手机号码" :maxlength="11"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="pwd">
					<el-input type="password" v-model.trim="form.pwd" clearable placeholder="请输入帐号密码" :maxlength="20"></el-input>
				</el-form-item>
				<el-form-item>
				<el-button type="primary" @click="handleSignin('form')">注册</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import sso from '@/apis/sso.js'
export default {
	name: 'signin',
	data() {
		return {
			form: {
				mobile: '',
				pwd: ''
			},
			rules: {
				mobile: [
					{ required: true, message: '手机不能为空', trigger: 'blur' },
					{ min: 11, max: 11, message: '长度 11 个字符', trigger: 'blur' }
				],
				pwd: [
					{ required: true, message: '密码不能为空', trigger: 'blur' }
				]
			}
		}
	},
	methods: {
		handleSignin(ref) {
			this.$router.push('/home')
			this.$refs[ref].validate((valid) => {
				if (valid) {
					sso.signup.call(
						this,
						this[ref],
						console.log(this[ref]),
						(data) => {
							this.$store.dispatch({
								type:'SET_TOKEN',
								admin: data
							}).then(() => {
								this.$router.replace({ name: 'home' })
							})
						}
					)
				} else {
					this.$message.error('数据验证未通过!')
				}
			})
		}
	}
}
</script>

<style scoped>
</style>