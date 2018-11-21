import http from '@/utils/http'

const sso = {
	/**
	* 登录
	* @param {json}			data				数据
	* @param {function}		cb					成功回调
	*/
	signin(data, cb) {
		http.post.call(this, '/sso/signin', data, cb)
	},

	/**
	* 注册
	* @param {json}			data				数据
	* @param {function}		cb					成功回调
	*/
	signup(data, cb) {
		http.post.call(this, '/sso/signup', data, cb)
	}
}

export default sso