import Vue from 'vue'
import VueAxios from 'vue-axios'
import axios from 'axios'
import config from '@/config'
import storage from '@/utils/storage'


//拦截器配置
axios.interceptors.request.use(
	config => {
		let token = storage.get('token')
		if (token) {
			config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

axios.interceptors.response.use(
	response => {
		return response
	},
	error => {
		return Promise.reject(error)
	}
)

Vue.use(VueAxios, axios)
Vue.axios.defaults.timeout = config.timeout
Vue.axios.defaults.baseURL = config.apiUrl



/**
* 封装axios的通用请求
* @param  {string}   type      get或post
* @param  {string}   url       请求的接口URL
* @param  {object}   data      传的参数，没有则传空对象
* @param  {Function} cb        成功回调
*/
var http = {
	post: function(url, data, cb) {
		return new Promise((resolve, reject) => {
			Vue.axios.post(url, data).then((response) => {
				if (response.data.status === 200) {
					cb(response.data.data)
				} else {
					this.$message.error(response.data.message)
				}
				resolve()
			}).catch((error) => {
				if(error.response.status === 401){
					this.$message.error('登录超时!')
					this.$router.push({ name: 'signin' })
				} else {
					this.$message.error(error.message)
				}
			})
		})
	},
	get: function(url, cb) {
		return new Promise((resolve, reject) => {
			Vue.axios.get(url).then((response) => {
				if (response.data.status === 200) {
					cb(response.data.data)
				} else {
					this.$message.error(response.data.message)
				}
				resolve()
			}).catch((error) => {
				if(error.response.status === 401){
					this.$message.error('登录超时!')
					this.$router.push({ name: 'signin' })
				} else {
					this.$message.error(error.message)
				}
			})
		})
	}
}

export default http