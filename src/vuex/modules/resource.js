import * as types from '@/vuex/mutation-types'

const state = {
	resources: [],
	resource: {},
	currentPage: 1,
	total: 0,
	pageCount: 0
}

const getters = {
	[types.GET_RESOURCE]: state => state.resource
}

const actions = {
}

const mutations = {
	[types.LIST_RESOURCES]: (state, { resources } ) => {
		state.resources = resources.rows
		state.currentPage = resources.currentPage
		state.total = resources.total
		state.pageCount = resources.pageCount
	},
	[types.GET_RESOURCE]: (state, { resource }) => {
		state.resource = resource
	},
	[types.CREATE_RESOURCE]: (state, { resource }) => {
		state.resources.push(resource)
	},
	[types.DELETE_RESOURCE]: (state, { deleted_id }) => {
    	let idx = state.resources.map(resource => resource.id).indexOf(deleted_id)
    	state.resources.splice(idx, 1)
	}
}

export default {
  state,
  getters,
  actions,
  mutations
}