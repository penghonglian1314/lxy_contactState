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
  </el-container>
</template>

<script>
import { queryAuthorization, addAuthorization } from "@/api/authorization";
import TablePage from "@/components/ZC/TablePage/index";

export default {
  components: { TablePage },
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
          label: "邀请码所有者",
          prop: "MemberName"
        },
        {
          label: "邀请码",
          prop: "AuthorizationCode",
          width: 270
        },
        {
          label: "邀请码状态",
          prop: "AuthStatus",
          width: 270
        },
        {
          label: "创建时间",
          prop: "CreateTime",
          type: "time",
          width: 170
        }
        // {
        //   label: "操作",
        //   prop: "operate",
        //   type: "operate",
        //   width: 270
        // }
      ],
      OperateCols: [
        // {
        //   label: "修改",
        //   event: this.updateData,
        //   color: "green"
        // },
        // {
        //   label: "删除",
        //   event: this.deleteData,
        //   color: "red"
        // }
      ],
      Btns: [
        {
          label: "查询",
          type: "primary",
          event: this.queryData
        },
        {
          label: "生成邀请码",
          type: "primary",
          event: this.addData
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
        temp.MemberName =
          item.MemberID === "business" ? "后台管理员" : item.MemberName;

        temp.AuthStatus = item.AuthStatus === '0' ? "未使用" : "已使用";
        return temp;
      });
    },
    // 上方按钮功能
    // ===========
    async queryData(queryParams) {
      let res = await queryAuthorization(queryParams);
      this.total = res.TotalSize * 1;
      this.tableData = this.handleData(res.Records);
    },
    async addData() {
      this.$confirm("此操作将生成一个邀请码, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await addAuthorization({
            BusinessID: sessionStorage.getItem("BusinessID"),
            MemberID: "business"
          });
          this.$refs["tablepage"].queryData();
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消" });
        });
    }
  }
};
</script>

<style>
</style>