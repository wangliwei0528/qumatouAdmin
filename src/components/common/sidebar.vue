<template>
	<el-aside>    
		<el-row>
			<el-col :span="24">
				<div class="grid-content logo">
					<!-- <img src="/static/logo.png" alt=""> -->
				</div>
			</el-col>
		</el-row>
		<el-menu 
			background-color="#222430" 
			text-color="#fff" 
			active-text-color="#409eff"
			default-active="/home" 
			:unique-opened="false"
			:router="true"
			>
			<el-menu-item index="/home" style='text-align:center;font-size:20px;color: rgb(64, 158, 255);'>趣码头商户后台管理系统</el-menu-item>
			<el-menu-item index="/home"><i class="el-icon-menu"></i>概览</el-menu-item>
			<el-submenu v-for="(menu,index) in menus" :key="index" :index="menu.url?menu.url:(index + '')" >
				<template slot="title">
					<i :class="menu.icon"></i>
					{{menu.title}}
				</template>
				<el-menu-item v-for="(child,index) in menu.childs" :key="index" :index="child.url" style='padding-left:86px'>
					{{child.title}}
				</el-menu-item>
			</el-submenu>
		</el-menu>
	</el-aside>
</template>

<script>
export default {
  name: "sidebar",
  data() {
    return {
      menus: [
        {
          title: "轮播管理",
          icon: "el-icon-picture",
          childs: [
            {
              title: "轮播列表",
              name: "banner",
              url: "/views/banner/banner"
            }
          ]
        },
        {
          title: "卡券管理",
          name: "card",
          icon: "el-icon-message",
          childs: [
            {
              title: "我的卡券",
              name: "mycard",
              url: "/views/card/mycard/mycard"
            },
            {
              title: "卡券投放",
              name: "pushcard",
              url: "/views/card/pushcard/pushcard"
            },
            {
              title: "投放列表",
              name: "pushlist",
              url: "/views/card/pushlist/pushlists"
            },
            {
              title: "我的投放",
              name: "mypush",
              url: "/views/card/mypush/mypush"
            },
            {
              title: "投放订单",
              name: "pushorder",
              url: "/views/card/pushorder/pushorder"
            },
            {
              title: "卡券设置",
              name: "setcard",
              url: "/views/card/setcard/setcard"
            },
            {
              title: "分润列表",
              name: "profit",
              url: "/views/card/profit/profit"
            },
            {
              title: "卡券领取",
              name: "getlist",
              url: "/views/card/getlist/getlist"
            }
          ]
        },
        {
          title: "商户管理",
          icon: "el-icon-location-outline",
          childs: [
            {
              title: "商户信息",
              name: "merchant",
              url: "/views/merchant/merchant"
            },
            {
              title: "会员列表",
              name: "memberlist",
              url: "/views/merchant/memberlist"
            }
          ]
        },
        {
          title: "积分抽奖",
          icon: "el-icon-star-off",
          childs: [
            {
              title: "积分列表",
              name: "integrallist",
              url: "/views/integrallist/integrallist"
            }
          ]
        },
        {
          title: "代购代销",
          icon: "el-icon-goods",
          childs: [
            {
              title: "代购代销",
              name: "buyandsell",
              url: "/views/buyandsell/buyandsell"
            },
            {
              title: "代购商品",
              name: "buyed",
              url: "/views/buyed/buyed"
            }
          ]
        },
        {
          title: "采购",
          icon: "el-icon-sold-out",
          childs: [
            {
              title: "采购列表",
              name: "purchase",
              url: "/views/purchase/purchase"
            }
          ]
        }
      ]
    };
  },
  created() {
    //条件满足 代购代销不显示
    let is_proxy = localStorage.getItem("is_proxy");    
    if (is_proxy == 0) {
      for(let i=0;i<this.menus.length;i++){
      if(this.menus[i].title==='代购代销'){
          this.menus.splice(i, 1);
      }
    }     
    }
  }
};
</script>

<style scoped>
</style>