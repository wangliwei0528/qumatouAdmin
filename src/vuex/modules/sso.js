import * as types from '@/vuex/mutation-types'
import storage from '@/utils/storage'

const state = {
	admin: storage.get('admin') || null,
}

const getters = {
	[types.GET_TOKEN]: state => state.admin
}
const actions = {
	[types.SET_TOKEN]({ commit }, { admin }) {
		commit(types.SET_TOKEN, { admin: admin })
	},
	[types.CLEAN_TOKEN]({ commit }) {
		commit(types.CLEAN_TOKEN)
	}
}

const mutations = {
	[types.SET_TOKEN]: (state, { admin } ) => {
		state.admin = admin
		storage.set('admin', state.admin)
	},
	[types.CLEAN_TOKEN]: (state) => {
		storage.remove('admin')
		state.admin = null
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}