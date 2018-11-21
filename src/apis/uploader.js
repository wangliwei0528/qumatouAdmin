import http from '@/utils/http'

const uploader = {

	/**
	* 二进制图片上传
	* @param {Json}			data				数据
	* @param {function}		cb					成功回调
	*/
	uploadWithBinary(data, cb) {
		http.post.call(this, '/uploader/binary', data, cb)
	}

}

export default uploader