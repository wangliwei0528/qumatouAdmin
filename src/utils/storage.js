import config from '@/config'

class Storage {

	constructor() {
		this.storage = window.localStorage
		this.prefix = config.storageKeyPrefix
	}

	set(key, value) {
		try {
			value = JSON.stringify(value)
		} catch (e) {
			value = value
		}

		this.storage.setItem(this.prefix + key, value)
	}

	get(key) {
		if (!key) {
			throw new Error('can not find key')
			return
		}
		if (typeof key === 'object') {
			throw new Error('The key can not a object.')
			return
		}
		var value = this.storage.getItem(this.prefix + key)
		if (value !== null) {
			try {
				value = JSON.parse(value)
			} catch (e) {
				value = value
			}
		}
		return value
	}

	remove(key) {
		this.storage.removeItem(this.prefix + key)
	}
}

export default new Storage()