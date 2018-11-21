import * as types from '@/vuex/mutation-types'

const state = {
	admins: [],
	admin: {},
	currentPage: 1,
	total: 0,
	pageCount: 0
}

const getters = {
	[types.GET_ADMIN]: state => state.admin,
}

const actions = {
}

const mutations = {
	[types.LIST_ADMINS]: (state, { admins } ) => {
		state.admins = admins.rows
		state.currentPage = admins.currentPage
		state.total = admins.total
		state.pageCount = admins.pageCount
	},
	[types.GET_ADMIN]: (state, { admin }) => {
		admin.pwd = ''
		state.admin = admin
	},
	
	[types.CREATE_ADMIN]: (state, { admin }) => {
		state.admins.push(admin)
	},
	[types.DELETE_ADMIN]: (state, { deleted_id }) => {
    	let idx = state.admins.map(admin => admin.id).indexOf(deleted_id)
    	state.admins.splice(idx, 1)
	}
}

export default {
  state,
  getters,
  actions,
  mutations
}
