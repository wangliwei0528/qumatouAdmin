<template>
	<div class="workplace">
		<el-row>
			<div class="breadcrumb">
				<el-breadcrumb separator="/">
					<el-breadcrumb-item :to="{ path: '/home' }">欢迎页</el-breadcrumb-item>
					<el-breadcrumb-item>修改密码</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</el-row>
		<el-row class="form">
			<el-col :span="8">
				<el-form :model="form" :rules="rules" ref="form" label-width="100px">
					<el-form-item label="原始密码" prop="origin">
						<el-input type="password" v-model.trim="form.origin" :maxlength="20"></el-input>
					</el-form-item>
					<el-form-item label="新的密码" prop="newpwd">
						<el-input type="password" v-model.trim="form.newpwd" :maxlength="20"></el-input>
					</el-form-item>
					<el-form-item label="再次确认" prop="retype">
						<el-input type="password" v-model.trim="form.retype" :maxlength="20"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleSubmit('form')">更新</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import admin from '@/apis/admin.js'
export default {
	name: 'password',
	data() {
		return {
			form: {
				origin: '',
				newpwd: '',
				retype: '',
			},
			rules: {
				origin: [
					{ required: true, message: '原始密码不能为空', trigger: 'blur' }
				],
				newpwd: [
					{ required: true, message: '新的密码不能为空', trigger: 'blur' },
					{ min: 6, max: 20, message: '长度 6-20 个字符', trigger: 'blur' }
				],
				retype: [
					{ required: true, message: '确认密码不能为空', trigger: 'blur' },
					{ min: 6, max: 20, message: '长度 6-20 个字符', trigger: 'blur' }
				]
			}
		}
	},
	computed:{
		...mapState({
			admin: state => state.sso.admin
		})
	},
	methods: {
		handleSubmit(ref) {
			this.$refs[ref].validate((valid) => {
				if (valid && this.form.newpwd === this.form.retype) {
					admin.password.call(
						this,
						this.admin.id,
						this[ref],
						(data) => {
							this.$store.dispatch('CLEAN_TOKEN').then(() => {
								this.$message.success('操作成功!')
								this.$router.push({ name: 'signin' })
							})
						}
					)
				} else {
					this.$message.error('数据验证失败!')
				}
			})
		}
	}
}
</script>

<style scoped>
</style>