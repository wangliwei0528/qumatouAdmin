const home = {
	path: '/',
	name: 'index',
	redirect: { name: 'home' },
	component(resolve) {
		require.ensure(['@/components/common/layout'], () => {
			resolve(require('@/components/common/layout'))
		})
	},
	meta: {
		requiresAuth: true
	},
	children:[
		{
			path: 'home',
			name: 'home',
			component(resolve) {
				require.ensure(['@/components/home/index'], () => {
					resolve(require('@/components/home/index'))
				})
			},
			meta: {
				title: '首页',
				requiresAuth: true
			}
		},
		{
			path: 'profile/password',
			name: 'password',
			component(resolve) {
				require.ensure(['@/components/profile/password'], () => {
					resolve(require('@/components/profile/password'))
				})
			},
			meta: {
				title: '修改密码',
				requiresAuth: true
			}
		},
		{
			path: '/views/card/mycard/mycard',
			name: 'mycard',
			component(resolve) {
				require.ensure(['@/views/card/mycard/mycard'], () => {
					resolve(require('@/views/card/mycard/mycard'))
				})
			},
			meta: {
				title: '我的卡券',
				requiresAuth: true
			}		
		},
		{
			path: '/views/card/mycard/mycardHandle/:id?',
			name: 'mycardHandle',
			component(resolve) {
				require.ensure(['@/views/card/mycard/mycardHandle'], () => {
					resolve(require('@/views/card/mycard/mycardHandle'))
				})
			},
			meta: {
				title: '卡券编辑',
				requiresAuth: true
			}			
		},
		{
			path: '/views/card/mycard/addcard/:id?',
			name: 'addcard',
			component(resolve) {
				require.ensure(['@/views/card/mycard/addcard'], () => {
					resolve(require('@/views/card/mycard/addcard'))
				})
			},	
			meta: {
				title: '卡券添加',
				requiresAuth: true
			}		
		},	
		{
			path: '/views/card/setcard/setcard',
			name: 'setcard',
			component(resolve) {
				require.ensure(['@/views/card/setcard/setcard'], () => {
					resolve(require('@/views/card/setcard/setcard'))
				})
			},	
			meta: {
				title: '卡券设置',
				requiresAuth: true
			}		
		},
		{
			path: '/views/card/pushcard/pushcard',
			name: 'pushcard',
			component(resolve) {
				require.ensure(['@/views/card/pushcard/pushcard'], () => {
					resolve(require('@/views/card/pushcard/pushcard'))
				})
			},	
			meta: {
				title: '卡券投放',
				requiresAuth: true
			}		
		},
		{
			path: '/views/card/pushcard/pushlist/:id?',
			name: 'pushlist',
			component(resolve) {
				require.ensure(['@/views/card/pushcard/pushlist'], () => {
					resolve(require('@/views/card/pushcard/pushlist'))
				})
			},
			meta: {
				title: '投放列表',
				requiresAuth: true
			}			
		},
		{
			path: '/views/card/pushcard/createPush/:id?',
			name: 'createPush',
			component(resolve) {
				require.ensure(['@/views/card/pushcard/createPush'], () => {
					resolve(require('@/views/card/pushcard/createPush'))
				})
			},	
			meta: {
				title: '创建投放',
				requiresAuth: true
			}	
		},
		{
			path: '/views/card/pushlist/pushlists',
			name: 'pushlists',
			component(resolve) {
				require.ensure(['@/views/card/pushlist/pushlists'], () => {
					resolve(require('@/views/card/pushlist/pushlists'))
				})
			},	
			meta: {
				title: '投放列表',
				requiresAuth: true
			}		
		},
		{
			path: '/views/card/mypush/mypush',
			name: 'mypush',
			component(resolve) {
				require.ensure(['@/views/card/mypush/mypush'], () => {
					resolve(require('@/views/card/mypush/mypush'))
				})
			},
			meta: {
				title: '我的投放',
				requiresAuth: true
			}	
		},
		{
			path: '/views/card/pushorder/pushorder',
			name: 'pushorder',
			component(resolve) {
				require.ensure(['@/views/card/pushorder/pushorder'], () => {
					resolve(require('@/views/card/pushorder/pushorder'))
				})
			},
			meta: {
				title: '投放订单',
				requiresAuth: true
			}			
		},
		{
			path: '/views/card/profit/profit',
			name: 'profit',
			component(resolve) {
				require.ensure(['@/views/card/profit/profit'], () => {
					resolve(require('@/views/card/profit/profit'))
				})
			},
			meta: {
				title: '分润列表',
				requiresAuth: true
			}			
		},
		{
			path: '/views/card/getlist/getlist',
			name: 'getlist',
			component(resolve) {
				require.ensure(['@/views/card/getlist/getlist'], () => {
					resolve(require('@/views/card/getlist/getlist'))
				})
			},
			meta: {
				title: '卡券领取列表',
				requiresAuth: true
			}			
		},
		{
			path: '/views/merchant/merchant',
			name: 'merchant',
			component(resolve) {
				require.ensure(['@/views/merchant/merchant'], () => {
					resolve(require('@/views/merchant/merchant'))
				})
			},
			meta: {
				title: '商户管理',
				requiresAuth: true
			}			
		},
		{
			path: '/views/merchant/memberlist',
			name: 'memberlist',
			component(resolve) {
				require.ensure(['@/views/merchant/memberlist'], () => {
					resolve(require('@/views/merchant/memberlist'))
				})
			},
			meta: {
				title: '会员列表',
				requiresAuth: true
			}			
		},
		{
			path: '/views/integrallist/integrallist',
			name: 'integrallist',
			component(resolve) {
				require.ensure(['@/views/integrallist/integrallist'], () => {
					resolve(require('@/views/integrallist/integrallist'))
				})
			},
			meta: {
				title: '积分列表',
				requiresAuth: true
			}			
		},
		{
			path: '/views/integrallist/addluck',
			name: 'addluck',
			component(resolve) {
				require.ensure(['@/views/integrallist/addluck'], () => {
					resolve(require('@/views/integrallist/addluck'))
				})
			},
			meta: {
				title: '添加积分',
				requiresAuth: true
			}			
		},
		{
			path: '/views/buyandsell/buyandsell',
			name: 'buyandsell',
			component(resolve) {
				require.ensure(['@/views/buyandsell/buyandsell'], () => {
					resolve(require('@/views/buyandsell/buyandsell'))
				})
			},
			meta: {
				title: '代购代销',
				requiresAuth: true
			}			
		},	
		{
			path: '/views/buyandsell/buyed',
			name: 'buyed',
			component(resolve) {
				require.ensure(['@/views/buyandsell/buyed'], () => {
					resolve(require('@/views/buyandsell/buyed'))
				})
			},
			meta: {
				title: '代购代销',
				requiresAuth: true
			}			
		},		
		{
			path: '/views/banner/banner',
			name: 'banner',
			component(resolve) {
				require.ensure(['@/views/banner/banner'], () => {
					resolve(require('@/views/banner/banner'))
				})
			},
			meta: {
				title: '轮播列表',
				requiresAuth: true
			}			
		},
		{
			path: '/views/banner/addbanner',
			name: 'addbanner',
			component(resolve) {
				require.ensure(['@/views/banner/addbanner'], () => {
					resolve(require('@/views/banner/addbanner'))
				})
			},
			meta: {
				title: '添加轮播',
				requiresAuth: true
			}			
		},
		{
			path: '/views/purchase/purchase',
			name: 'purchase',
			component(resolve) {
				require.ensure(['@/views/purchase/purchase'], () => {
					resolve(require('@/views/purchase/purchase'))
				})
			},
			meta: {
				title: '采购商品',
				requiresAuth: true
			}			
		},
		{
			path: '/views/purchase/purchaselist',
			name: 'purchaselist',
			component(resolve) {
				require.ensure(['@/views/purchase/purchaselist'], () => {
					resolve(require('@/views/purchase/purchaselist'))
				})
			},
			meta: {
				title: '采购列表',
				requiresAuth: true
			}			
		},		
		
		
					
	]
}

export default home