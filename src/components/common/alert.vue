<template>
    <el-dialog
          title="提示"
          :visible.sync="centerDialogVisible"
          width="30%"
          :showClose=false
          :closeOnClickModal=false
          type='warning'
          center>
          <span>您的信息不完整，请完善信息</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="save" style='width:100%'>完善信息</el-button>
         </span>
      </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      centerDialogVisible: true
    };
  },
  methods: {
    save() {
      this.centerDialogVisible = false;
      this.$router.push("/views/merchant/merchant");
    }
  }
};
</script>

