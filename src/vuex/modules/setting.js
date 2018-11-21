import * as types from '@/vuex/mutation-types'

const state = {
	setting: {}
}

const getters = {
	[types.GET_SETTING]: state => state.setting
}

const actions = {
}

const mutations = {
	[types.GET_SETTING]: (state, { setting }) => {
		state.setting = setting
	}
}

export default {
  state,
  getters,
  actions,
  mutations
}
