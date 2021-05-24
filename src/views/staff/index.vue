<template>
  <el-container>
    <el-main>
      <TablePage
        ref="tablepage"
        :SearchParamsList="SearchParamsList"
        :total="total"
        :TableData="tableData"
        :TableCols="tableCols"
        :OperateCols="OperateCols"
        :Btns="Btns"
        @Query="queryData"
      ></TablePage>
    </el-main>
    <el-dialog title="新增客服" v-if="isAdd" :visible.sync="isAdd">
      <MyForm :Config="formconfig" :Btns="addformbtns"></MyForm>
    </el-dialog>
    <el-dialog title="修改客服信息" v-if="isUpdate" :visible.sync="isUpdate">
      <MyForm :Config="formconfig" :Data="rowData" :Btns="upformbtns"></MyForm>
    </el-dialog>
  </el-container>
</template>

<script>
import { queryStaff, deleteStaff, insertStaff, updateStaff } from "@/api/staff";
// import {
//   queryAccount,
//   insertAccount,
//   updateAccount,
//   deleteAccount
// } from "@/api/account";
import TablePage from "@/components/ZC/TablePage/index";
import MyForm from "./components/form.vue";

export default {
  components: { TablePage, MyForm },
  data() {
    return {
      SearchParamsList: [
        {
          label: "用户名称",
          value: "MemberName"
        }
      ],
      tableData: [],
      total: 0,
      tableCols: [
        {
          label: "客服ID",
          prop: "MemberID",
          width: 260
        },
        {
          label: "客服名称",
          prop: "MemberName"
        },
        {
          label: "联系电话",
          prop: "Tel",
          width: 160
        },
        // {
        //   label: "创建时间",
        //   prop: "CreateTime",
        //   type: "time",
        //   width: 170
        // },
        {
          label: "操作",
          prop: "operate",
          type: "operate",
          width: 270
        }
      ],
      OperateCols: [
        {
          label: "修改",
          event: this.updateData,
          color: "green"
        },
        {
          label: "删除",
          event: this.deleteData,
          color: "red"
        }
      ],
      Btns: [
        {
          label: "查询",
          type: "primary",
          event: this.queryData
        },
        {
          label: "新增",
          type: "primary",
          event: this.addData
        }
      ],
      isAdd: false,
      isUpdate: false,
      formconfig: [
        {
          label: "客服ID",
          value: "MemberID",
          required: true
        },
        {
          label: "客服名称",
          value: "MemberName",
          required: true
        },
        {
          label: "联系电话",
          value: "Tel",
          required: true
        }
      ],
      rowData: {},
      addformbtns: [
        {
          label: "提交",
          type: "primary",
          event: this.submitAddForm,
          validate: true
        },
        {
          label: "取消",
          type: "default",
          event: this.initDialog
        }
      ],
      upformbtns: [
        {
          label: "提交",
          type: "primary",
          event: this.submitUpForm,
          validate: true
        },
        {
          label: "取消",
          type: "default",
          event: this.initDialog
        }
      ]
    };
  },
  methods: {
    // 数据处理
    // =========
    handleData(data) {
      return data.map(item => {
        const temp = { ...item };
        return temp;
      });
    },
    // 上方按钮功能
    // ===========
    async queryData(queryParams) {
      let res = await queryStaff(queryParams);
      this.total = res.TotalSize * 1;
      this.tableData = this.handleData(res.Records);
    },
    addData() {
      this.isAdd = true;
    },
    // 行按钮功能
    // ===========
    // 删除
    async deleteData(row) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await deleteStaff(row);
          //   const temp = { BusinessID: row.BusinessID };
          //   const res = await queryAccount(temp);
          //   console.log(res);
          //   // 判断原先是否有账号
          //   // 如果有则删除账号
          //   if (res.TotalSize === 1) {
          //     // 有账号
          //     deleteAccount({ UserID: res.Records[0].UserID });
          //   }
          this.$refs["tablepage"].queryData();
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
    },
    // 修改
    async updateData(row) {
      this.rowData = { ...row };
      this.isUpdate = true;
    },
    // 新增客服
    async submitAddForm(form) {
      const res = await insertStaff(form);
      console.log("res", res);
      this.initDialog();
    },
    // 修改客服数据
    // ===========
    // 修改客服
    async submitUpForm(form) {
      const res = await updateStaff(form);
      console.log("res", res);
      this.initDialog();
    },
    initDialog() {
      this.isAdd = false;
      this.isUpdate = false;
      this.rowData = {};
      this.$refs["tablepage"].queryData();
    }
  }
};
</script>

<style>
</style>