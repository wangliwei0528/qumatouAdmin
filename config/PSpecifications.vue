<template>
  <div class="user">
    <div class="top">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>产品管理</el-breadcrumb-item>
        <el-breadcrumb-item>产品规格</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="menu_input" style="margin-top: 30px">
        <div>
          <span style="font-size: 16px;margin-right: 10px">产品规格名称</span>
          <span>
            <el-input
              placeholder="搜索产品规格名称"
              prefix-icon="el-icon-search"
              v-model="name"
              @keyup.enter.native="getTableData"
            ></el-input>
            <button icon="el-icon-search" class="newlyBuild" @click="getTableData">搜索</button>
          </span>
          <button class="newlyBuild" @click="addrole()">新建</button>
        </div>
      </div>
    </div>

    <div class="center">
      <el-table :data="data" stripe style="width:100%;">
        <el-table-column label="产品品牌列表">
          <el-table-column prop="ctitle" label="分类名称" align="center"></el-table-column>
          <el-table-column prop="title" label="规格名称" align="center"></el-table-column>
          <el-table-column prop="item_title" label="规格值" align="center"></el-table-column>
          <el-table-column prop="status" label="用户状态" align="center">
            <template slot-scope="scope">
              <div
                :style="{color: scope.row.status==1?'#4F4F4F':'red'}"
              >{{scope.row.status == 1?'启用':'禁用'}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="时间" align="center"></el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <button @click="editClick(scope.$index, scope.row)" size="small" class="modify">修改</button>
              <el-button
                @click="deleteClick(scope.$index, scope.row)"
                size="small"
                class="delete"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div class="mask" v-if="mask" @click="mask1"></div>
    <div class="editrole" v-if="mask">
      <div class="editrole_top">
        <div>新建(修改)产品规格</div>
        <div @click="cancel">
          <button>×</button>
        </div>
      </div>
      <div class="editrole_center">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
          <el-form-item label="规格名称" prop="inputName" style="width: 300px">
            <el-input v-model="ruleForm.inputName" placeholder="请输入规格名称" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="分类" prop="inputRole" style="width: 300px">
            <el-select v-model="value1" style="width: 180px">
              <el-option v-for="item in data1" :key="item.id" :label="item.title" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-for="(domain, index) in dynamicValidateForm.domains"
            :label="'规格值' + (index ? index : '')"
            :key="domain.key"
          >
            <el-input v-model="domain.value" style="width:200px"></el-input>
            <button
              @click.prevent="removeDomain(domain)"
              style="margin-left: 10px;height:40px"
              v-show="index!==0"
              class="modify"
            >-</button>
            <el-button @click.prevent="addDomain" class="modify" style='height:40px'>+</el-button>
          </el-form-item>
          <el-form-item label="用户状态" prop="inputStatus" style="width:300px" v-show="this.id">
            <el-radio v-model="ruleForm.inputStatus" label="1">启用</el-radio>
            <el-radio v-model="ruleForm.inputStatus" label="0">禁用</el-radio>
          </el-form-item>
        </el-form>
      </div>
      <div class="editrole_bottom">
        <button @click="submission()" class="modify1">确定</button>
        <button @click="cancel" class="modify1">取消</button>
      </div>
    </div>
    <div class="block" v-if="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[per_page]"
        :page-size="per_page"
        layout="total, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      dynamicValidateForm: {
        domains: [
          {
            value: ""
          }
        ]
      },
      data: [],
      data1: [],
      mask: false,
      inputRole: "",
      inputRemarks: "",
      token: "",
      total: 0,
      currentPage: 1,
      page: 1,
      group_id: "",
      name: "",
      per_page: 1,
      pagination: true,
      data4: [],
      ruleForm: {
        inputName: "",
        inputRole: "",
        inputStatus: ""
      },
      //添加用户表单验证规则
      rules: {
        inputName: [{ required: true, message: "请填写标题名称" }],
        inputRole: [{ required: true, message: "请选择分类ID" }],
        inputStatus: [{ required: true, message: "请选择用户状态" }]
      },
      radio: 1,
      first: [],
      two: [],
      three: [],
      value: "",
      value1: "",
      inputRole1: "",
      inputStatus1: "",
      id: "",
      imgUrl: ""
    };
  },
  created() {
    this.token = localStorage.getItem("token");
    this.getTableData();
  },
   mounted() {
      this.date();
    },
  methods: {
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== 0) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: "",
        key: Date.now()
      });
    },
    getTableData() {
      axios
        .get("/api/admin/spec_index", {
          headers: {
            Authorization: "Bearer " + this.token,
            Accept: "application/vnd.lingmo.v1+json"
          },
          params: {
            page: this.page,
            title: this.name
          }
        })
        .then(res => {
          // console.log(res);
          this.data = res.data.data.data;
          if (res.data.data.total < res.data.data.per_page) {
            this.pagination = false;
          } else {
            this.pagination = true;
          }
          this.total = res.data.data.total;
          this.per_page = res.data.data.per_page;
        });
    },
    editClick(index, row) {
      this.id = row.id;
      this.mask = true;
      axios
        .get("api/admin/spec_create_show", {
          headers: {
            Authorization: "Bearer " + this.token,
            Accept: "application/vnd.lingmo.v1+json"
          }
        })
        .then(res => {
          // console.log(res);
          this.data1 = res.data.data;
        });
      axios
        .get("api/admin/spec_edit_show/" + row.id, {
          headers: {
            Authorization: "Bearer " + this.token,
            Accept: "application/vnd.lingmo.v1+json"
          }
        })
        .then(res => {
          this.specs = res.data.data.specs;
          this.items = res.data.data.items;
          let tmpDomain = this.items.map(itm => ({
            value: itm.title,
            id: itm.id
          }));
          this.dynamicValidateForm.domains = tmpDomain;
          let { title, status, p_category_id } = this.specs;
          this.ruleForm = {
            inputName: title,
            inputStatus: `${status}`
          };
          this.value1 = p_category_id;
          this.dynamicValidateForm.domains.map(itm => itm.value);
        });
    },
    addrole() {
      this.mask = true;     
      axios
        .get("api/admin/spec_create_show", {
          headers: {
            Authorization: "Bearer " + this.token,
            Accept: "application/vnd.lingmo.v1+json"
          }
        })
        .then(res => {
          this.data1 = res.data.data;
        });
    },
    submission() {
      if (this.id) {
        //修改
        let data = {
          title: this.ruleForm.inputName,
          category_id: this.value1,
          items: this.dynamicValidateForm.domains.map(itm => itm.value),
          status: this.ruleForm.inputStatus,
          id: this.id
        };
        axios
          .post("api/admin/spec_edit", data, {
            headers: {
              Authorization: "Bearer " + this.token,
              Accept: "application/vnd.lingmo.v1+json"
            }
          })
          .then(res => {
            if (res.data.data.data.status == 200) {
              this.$message({
                message: res.data.data.data.message,
                type: "success"
              });
              this.getTableData();
              this.mask = false;
            } else {
              this.$message({
                message: res.data.data.data.message,
                type: "warning"
              });
            }
          });
      } else {
        let data = {
          title: this.ruleForm.inputName,
          category_id: this.value1,
          items: this.dynamicValidateForm.domains.map(itm => itm.value)
        };
        axios
          .post("api/admin/spec_create", data, {
            headers: {
              Authorization: "Bearer " + this.token,
              Accept: "application/vnd.lingmo.v1+json"
            }
          })
          .then(res => {
            if (res.data.data.data.status == 200) {
              this.$message({
                message: res.data.data.data.message,
                type: "success"
              });
               this.ruleForm.inputName = "";
                this.value1 = "";
                this.ruleForm.inputStatus = "";
                console.log(this.dynamicValidateForm.domains)
                this.dynamicValidateForm.domains.forEach(
                  item=>{
                    item.value=''
                  }
                )
              this.getTableData();
              this.mask = false;
            } else {
              this.$message({
                message: res.data.data.data.message,
                type: "warning"
              });
            }
          });
      }
    },
    mask1() {
      this.mask = false;
    },
    cancel() {
      this.mask = false;
    },
    deleteClick(index, row) {
      axios
        .get("api/admin/spec_del/" + row.id, {
          headers: {
            Authorization: "Bearer " + this.token,
            Accept: "application/vnd.lingmo.v1+json"
          }
        })
        .then(res => {
          this.getTableData();
          if (res.data.data.data.status == 200) {
            this.$message({
              message: res.data.data.data.message,
              type: "success"
            });
          } else {
            this.$message({
              message: res.data.data.data.message,
              type: "warning"
            });
          }
        });
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.page = currentPage;
      this.getTableData();
    }
  }
};
</script>
<style scoped>
#inputs input {
  width: 200px;
  height: 20px;
}

#inputs button {
  width: 40px;
  height: 26px;
  margin-left: 5px;
}

#inputs > div:nth-child(1) button {
  width: 40px;
  height: 26px;
  margin-left: 0;
}

#inputs > div {
  margin-top: 5px;
}

.fileBox {
  width: 178px;
}

.fileinput-button {
  height: 178px;
  width: 178px;
  float: left;
  display: flex;
  margin-top: 10px;
  margin-right: 50px;
  line-height: 150px;
  position: relative;
  color: #ccc;
  border: 1px solid #ccc;
  background-position: center 50px;
}

.fileinput-button input {
  position: absolute;
  left: 0px;
  top: 80px;
  opacity: 0;
  -ms-filter: "alpha(opacity=0)";
}

.font {
  font-size: 20px;
  position: absolute;
  left: 80px;
  top: 80px;
}

.text {
  width: 100%;
  border: 0;
  background: #fafafa;
  padding: 10px;
  border-radius: 10px;
  height: 100px;
}

.select {
  float: left;
  margin-left: 20px;
  width: 200px;
}

.delete {
  border: 1px solid #ff6a6d !important;
  background: #ffffff !important;
  color: #ff6a6d !important;
}

.user {
  text-align: center;
}

.menu_input {
  text-align: center;
  margin-top: 10px;
}

.menu_input span:nth-child(2) {
  text-align: left;
  display: inline-block;
  width: 419px;
  background: #f7f4fc;
  border-radius: 10px;
}

.el-input {
  width: 328px;
}

.el-button {
  border: 0;
  border-radius: 10px;
  background: #00c6b0;
  color: #fff;
}

.center {
  margin-top: 40px;
}

th {
  font-weight: bold;
  color: #000;
}

.el-table th > .cell {
  position: relative;
  word-wrap: normal;
  text-overflow: ellipsis;
  vertical-align: middle;
  width: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 24px;
}

.block {
  text-align: left;
  padding-left: 120px;
}

.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.editrole {
  width: 10rem;
  padding: 0 0.2rem 0 0.2rem;
  background: #ffffff;
  position: fixed;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  z-index: 2;
  text-align: center;
  border-radius: 0.1rem;
}

.editrole_top {
  line-height: 60px;
  height: 60px;
  border-bottom: 1px solid #fafafa;
  font-size: 20px;
  display: block;
}

.editrole_top div:nth-child(1) {
  text-align: right;
  width: 300px;
  float: left;
  margin-right: 20px;
}

.editrole_top div:nth-child(2) {
  color: #00c6b0;
  border: 1px solid #00c6b0;
  border-radius: 50%;
  height: 20px;
  width: 20px;
  float: right;
  margin-right: 10px;
  margin-top: 20px;
  position: relative;
}

.editrole_top button {
  position: absolute;
  bottom: -1px;
  right: 1px;
  border: 0;
  color: #00c6b0;
}

.editrole_center {
  text-align: left;
  height: 300px;
  overflow: auto;
  margin-top: 20px;
}

.editrole_bottom {
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #fafafa;
}

.block {
  margin-top: 0.8rem;
  width: 100%;
  text-align: center;
}

.modify {
  background-color: #00c6b0;
  color: #fff;
  border: 0;
  width: 60px;
  height: 30px;
  border-radius: 10px;
}

.modify1 {
  background-color: #00c6b0;
  color: #fff;
  border: 0;
  width: 70px;
  height: 40px;
  border-radius: 10px;
  font-size: 15px;
}

.newlyBuild {
  background-color: #00c6b0;
  color: #fff;
  border: 0;
  width: 86.5px;
  height: 40px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
}
.delete:focus,
.delete:hover {
  background: red !important;
  border: 0;
  color: #fff !important;
}
.el-button--small,
.el-button--small.is-round {
  padding: 8px 17px;
}
.el-button + .el-button {
  margin-left: 0px;
}
</style>
<style>
.el-table__empty-block {
  min-height: 600px;
}

.el-input__inner {
  border: 0;
  background: #fafafa;
  /*border-bottom-left-radius: 10px;*/
  /*border-top-left-radius: 10px;*/
  border-radius: 10px;
}

.el-pager li.active {
  color: #00c6b0;
  cursor: default;
}

.el-pager li:hover {
  color: #00c6b0;
  cursor: default;
}

.el-pagination button:hover {
  color: #00c6b0;
}

.el-table thead.is-group th {
  background: #fafafa !important;
}

.el-form-item__content {
  width: 70%;
}

.el-radio__input.is-checked + .el-radio__label {
  color: #333;
}

.el-radio__input.is-checked .el-radio__inner {
  background: #00c6b0;
  border-color: #00c6b0;
}
</style>
