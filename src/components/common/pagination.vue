<template>
    <div class="block" v-if="pagination">
        <el-pagination
            @current-change="handleCurrentChanges"
            :current-page="currentPage"
            :page-sizes="[per_page]"
            :page-size="per_page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :background="true">
        </el-pagination>
    </div>  
</template>
<script>
export default {
    props:{
        currentPage:{
            type:Number,
            default:()=>{}
        },
        pageSize:{
            type:Number,
            default:()=>{}
        },
        total:{
            type:Number,
            default:()=>{}
        }
    },
    methods:{
        //向父级传递事件
    }
}
</script>
