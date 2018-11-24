<template>
    <div>
        <!--是否完善信息  -->
        <div v-if='tag==0'>
            <Mycomponent v-show='isshow'></Mycomponent>  
        </div>  
        <!--是否完善信息  -->
        <Buy/>
        <el-card>
             <div slot="header" class='header'>
                <span>采购商品列表</span>            
            </div>
            caigou
        </el-card>
    </div>
</template>
<script>
import Buy from "@/components/buyandsell";
import Mycomponent from "@/components/common/alert";
export default {
    components: { Buy, Mycomponent },
    data(){
        return{
            isshow:true,
            tag:''
        }
    },
    created(){
         this.tag = localStorage.getItem("tag"); //判断是否完善信息
    },
    methods:{

    }
}
</script>

