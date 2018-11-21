import Vue from 'vue'
import Vuex from 'vuex'
import uploader from '@/vuex/modules/uploader'
import sso from '@/vuex/modules/sso'
import setting from '@/vuex/modules/setting'
import admin from '@/vuex/modules/admin'
import resource from '@/vuex/modules/resource'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		uploader,
		sso,
		setting,
		admin,
		resource
	},
	strict: false
})