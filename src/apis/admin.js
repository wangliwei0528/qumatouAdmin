import http from '@/utils/http'

const admin = {

	/**
	* 分页获取管理员列表
	* @param {integer}		page				页码
	* @param {function}		cb					成功回调
	*/
	list(page, cb) {
		http.post.call(this, '/admins/list/' + Number(page), null, cb)
	},

	/**
	* 修改密码
	* @param {integer}		id					账户编号
	* @param {json}			data				数据
	* @param {function}		cb					成功回调
	*/
	password(id, data, cb) {
		http.post.call(this, '/admins/password/' + Number(id), data, cb)
	},

	/**
	* 创建账户
	* @param {json}			data				数据
	* @param {function}		cb					成功回调
	*/
	create(data, cb) {
		http.post.call(this, '/admins/create', data, cb)
	},

	/**
	* 编辑账户
	* @param {integer}		id					账户编号
	* @param {function}		cb					成功回调
	*/
	edit(id, cb) {
		http.get.call(this, '/admins/edit/' + Number(id), cb)
	},

	/**
	* 更新账户
	* @param {json}			data				数据
	* @param {function}		cb					成功回调
	*/
	update(data, cb) {
		http.post.call(this, '/admins/update', data, cb)
	},

	/**
	* 删除账户
	* @param {json}			data				数据
	* @param {function}		cb					成功回调
	*/
	delete(data, cb) {
		http.post.call(this, '/admins/delete', data, cb)
	}
}

export default admin