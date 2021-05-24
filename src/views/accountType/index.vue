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
    <el-dialog title="新增账户类型" v-if="isAdd" :visible.sync="isAdd">
      <MyForm :Config="addformconfig" :Btns="addformbtns"></MyForm>
    </el-dialog>
    <el-dialog title="修改账户类型" v-if="isUpdate" :visible.sync="isUpdate">
      <MyForm
        :Config="upformconfig"
        :Data="typeData"
        :Btns="upformbtns"
      ></MyForm>
    </el-dialog>
  </el-container>
</template>

<script>
import {
  queryAccountType,
  deleteAccountType,
  insertAccountType,
  updateAccountType
} from "@/api/accounttype";
import TablePage from "@/components/ZC/TablePage/index";
import MyForm from "@/components/ZC/Form/index";
// import thisReflect from "@/config/reflect/daccountType";

export default {
  components: { TablePage, MyForm },
  data() {
    return {
      SearchParamsList: [
        // {
        //   label: "用户名称",
        //   value: "MemberName"
        // },
        // {
        //   label:'发布时间',
        //   value:'timeRange',
        //   type:'datetimerange'
        // }
      ],
      tableData: [],
      total: 0,
      tableCols: [
        {
          label: "账户类型",
          prop: "AccountType"
        },
        {
          label: "账户类型名称",
          prop: "AccountName"
        },
        {
          label: "操作",
          prop: "operate",
          type: "operate",
          width: 170
        }
      ],
      OperateCols: [
        {
          label: "修改",
          event: this.updateData,
          color: "blue"
        },
        {
          label: "删除",
          event: this.deleteData,
          color: "red"
        }
      ],
      Btns: [
        // {
        //   label: "查询",
        //   type: "primary",
        //   event: this.queryData
        // }
        {
          label: "新增",
          type: "primary",
          event: this.addData
        }
      ],
      // 新增弹窗相关数据
      isAdd: false,

      addformconfig: [
        {
          label: "账户类型",
          value: "AccountType",
          required: true
        },
        {
          label: "账户类型名称",
          value: "AccountName",
          required: true
        }
      ],
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
      // 修改弹窗相关数据
      isUpdate: false,
      typeData: {},
      upformconfig: [
        {
          label: "账户类型",
          value: "AccountType",
          required: true,
          disabled: true
        },
        {
          label: "账户类型名称",
          value: "AccountName",
          required: true
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
    handleData(data, theReflect) {
      return data.map(item => {
        const temp = {};
        Object.keys(item).forEach(key => {
          // 存在映射
          if (theReflect && theReflect[key]) {
            temp[key] = theReflect[key][item[key]];
          } else {
            if (
              this.extandCols &&
              this.extandCols.some(
                col => col.prop === key && col.type === "imgs"
              )
            ) {
              temp[key] = item[key].split(",");
            } else {
              temp[key] = item[key];
            }
          }
        });

        return temp;
      });
    },
    // 上方按钮功能
    // ===========
    async queryData(queryParams) {
      let res = await queryAccountType(queryParams);
      this.total = res.RowCnt * 1 && res.TotalSize * 1;
      this.tableData = this.handleData(res.Records);
    },
    addData() {
      this.isAdd = true;
    },
    // 行按钮功能
    // ===========
    // 修改
    async updateData(row) {
      this.typeData = { ...row };
      this.isUpdate = true;
    },
    async deleteData(queryParams) {
      await deleteAccountType(queryParams);
      this.$refs["tablepage"].queryData();
    },

    // 新增账户类型数据
    // ===========
    // 新增账户类型
    async submitAddForm(form) {
      const res = await insertAccountType(form);
      console.log(res,res.success,typeof res.success)
      if (res.msg&&res.msg==='fail') {
        this.$message({
          message: "账户类型错误",
          type: "error",
          duration: 5 * 1000
        });
      } else {
        this.$refs["tablepage"].queryData();
        this.initDialog();
      }
    },
    // 修改账户类型数据
    // ===========
    // 修改账户类型
    async submitUpForm(form) {
      await updateAccountType(form);
      this.$refs["tablepage"].queryData();
      this.initDialog();
    },
    initDialog() {
      this.isAdd = false;
      this.isUpdate = false;
      this.typeData = {};
    }
  }
};
</script>

<style>
</style>