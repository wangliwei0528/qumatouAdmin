import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import BaiduMap from 'vue-baidu-map'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import routes from './routes'


NProgress.inc(0.5)
NProgress.configure({
  easing: 'ease',
  speed: 1000,
  showSpinner: false
})

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(VueAxios, axios)
Vue.use(ElementUI)
Vue.use(require('vue-moment'))
Vue.use(BaiduMap, {
  ak: 'OcGhM2vkWGZ4l9rPwCQV76HtrKjgaChv'
})

import Axios from 'axios'
Vue.prototype.$axios = Axios;
import {
  Loading,
  Message
} from 'element-ui'


//拦截器
let loadinginstace
let date = localStorage.getItem('date')
let currDate = parseInt(new Date().getTime() / 1000)
Axios.interceptors.request.use(
  config => {
    loadinginstace = Loading.service({
      fullscreen: true,
      text: '拼命加载中...',
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)"
    })
    if (window.localStorage.getItem('token')) { // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
      config.headers.common['Authorization'] = `Bearer ` + localStorage.getItem('token');
      config.headers.common['Accept'] = 'application/vnd.lingmo.v1+json'
      config.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
    } else {
      router.replace({
        path: '/' // 到登录页重新获取token
      })
    }
    return config;
  },
  err => {
    loadinginstace.close()
    Message.error({
      message: '加载超时'
    })
    return Promise.reject(err);
  });
// http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
Axios.interceptors.response.use(
  response => {
    loadinginstace.close()
    if (date && currDate > date) {
      Message.warning({
        message: '登录信息过期，请重新登录'
      })
      router.replace({
        path: '/' // 到登录页重新获取token
      })
    } else if (response.data.message) {
      if (response.data.status == 1) {
        Message.success({
          message: response.data.message
        })
      } else if (response.data.status == 2) {
        router.replace({
          path: '/'
        })
      } else {
        Message.warning({
          message: response.data.message
        })
      }
    } else if (response.data.token) { // 判断token是否存在，如果存在说明需要更新token
      window.localStorage.setItem('token', response.data.token) // 覆盖原来的token(默认一天刷新一次)
    }
    return response;
  },
  error => {
    loadinginstace.close()
    Message.error({
      message: '加载失败'
    })
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 这里写清除token的代码
          router.replace({
            path: '/',
            query: {
              redirect: router.currentRoute.fullPath
            } //登录成功后跳入浏览的当前页面
          })
      }
    }
    return Promise.reject(error.response.data)
  });
//拦截器
//引入公共方法
// import common from './commonFunction/common.js'
// Vue.prototype.common = common

Vue.directive('layout', {
  inserted: function (el, binding) {
    document.body.setAttribute('class', el.dataset.bg)
  }
})

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})
// router.beforeEach((to, from, next) => {
// 	window.scrollTo(0,0)
// 	NProgress.start()
// 	if(to.matched.some( route => route.meta.requiresAuth)){
// 		if (!store.state.sso.token) {
// 			next({
// 				name: 'signin'
// 			})
// 		} else {
// 			if (to.path === '/sso/signin') {
// 				next({
// 					name: 'index'
// 				})
// 			} else {
// 				next()
// 			}
// 		}
// 	} else {
// 		next()
// 	}

// })
// router.afterEach((to, from, next) => {
//   NProgress.done()
//   if (to.meta.title) {
//     document.title = to.meta.title
//   }
//   // console.log('APP、微信、小程序开发 - 西安梦想魔方网络科技有限公司 http://www.dreamscube.cn 欢迎致电：18629091980')
// })

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
