<template>
	<el-container>
		<sidebar></sidebar>
		<el-container>
			<el-header>
					<!-- <el-dropdown @command="handleCommand" v-if='admin'> -->
					<el-dropdown @command="handleCommand">
						<span>
							<!-- [{{admin.role.title}}] {{admin.mobile}} -->
							{{mobile?mobile:'admin'}}
							<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="password">修改密码</el-dropdown-item>
							<el-dropdown-item command="logout">退出系统</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>				
			</el-header>
			<el-main>
				<transition name="router-fade" mode="out-in">
					<router-view/>
				</transition>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
import { mapState } from 'vuex'
import sidebar from '@/components/common/sidebar.vue'
export default {
	name: 'layout',
	components: {
		sidebar
	},
	data(){
		return{
			mobile:''
		}
	},
	created(){
		this.$nextTick(function(){
			this.mobile=localStorage.getItem('mobile')
		})		
	},
	computed: {
      ...mapState({
        admin: state => state.sso.admin
      })
    },
	methods: {
		handleCommand(command) {
			if('logout' != command) {
				this.$router.push({ name: command })
			}
			if('logout' === command) {
				this.$store.dispatch('CLEAN_TOKEN').then(() => {
					this.$router.push({ name: 'signin' })
					localStorage.clear();
				})
			}
		}
	}
}
</script>


<style scoped>
</style>