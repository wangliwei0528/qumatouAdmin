import http from '@/utils/http'

const resource = {

	/**
	* 获取所有资源列表
	* @param {function}		cb					成功回调
	*/
	all(cb) {
		http.get.call(this, '/resources/all', cb)
	},

	/**
	* 获取所有一级资源列表
	* @param {function}		cb					成功回调
	*/
	root(cb) {
		http.get.call(this, '/resources/root', cb)
	},

	/**
	* 分页获取资源列表
	* @param {integer}		page				页码
	* @param {function}		cb					成功回调
	*/
	list(page, cb) {
		http.post.call(this, '/resources/list/' + Number(page), null, cb)
	},

	/**
	* 创建资源
	* @param {json}			data				数据
	* @param {function}		cb					成功回调
	*/
	create(data, cb) {
		http.post.call(this, '/resources/create', data, cb)
	},

	/**
	* 编辑资源
	* @param {integer}		id					资源编号
	* @param {function}		cb					成功回调
	*/
	edit(id, cb) {
		http.get.call(this, '/resources/edit/' + Number(id), cb)
	},

	/**
	* 更新资源
	* @param {json}			data				数据
	* @param {function}		cb					成功回调
	*/
	update(data, cb) {
		http.post.call(this, '/resources/update', data, cb)
	},

	/**
	* 删除资源
	* @param {json}			data				数据
	* @param {function}		cb					成功回调
	*/
	delete(data, cb) {
		http.post.call(this, '/resources/delete', data, cb)
	}
}

export default resource