import http from '@/utils/http'

const setting = {

	/**
	* 获取系统设置
	* @param {function}		cb					成功回调
	*/
	edit(cb) {
		http.get.call(this, '/setting/edit', cb)
	},

	/**
	* 更新系统设置
	* @param {json}		data					数据
	* @param {function}		cb					成功回调
	*/
	update(data, cb) {
		http.post.call(this, '/setting/update', data, cb)
	}
}

export default setting