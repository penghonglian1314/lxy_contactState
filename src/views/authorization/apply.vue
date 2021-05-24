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
import {
  addAuthorization,
  queryAuthorizationApply,
  updateAuthorizationApply
} from "@/api/authorization";
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
          label: "申请人名称",
          prop: "MemberName"
        },
        {
          label: "申请状态",
          prop: "ApplyStatus",
          width:140
        },
        {
          label: "操作",
          prop: "operate",
          type: "operate",
          width:140
        }
      ],
      OperateCols: [
        {
          label: "同意",
          event: this.agreeApply,
          color: "green"
        },
        {
          label: "拒绝",
          event: this.refuseApply,
          color: "red"
        }
      ],
      Btns: [
        {
          label: "查询",
          type: "primary",
          event: this.queryData
        }
      ]
    };
  },
  methods: {
    // 数据处理
    // =========
    handleData(data) {
      const ApplyStatusMap = {
        "0": "待审核",
        "1": "审核通过",
        "2": "审核未通过"
      };
      return data.map(item => {
        const temp = { ...item };
        temp.ApplyStatus = ApplyStatusMap[temp.ApplyStatus];
        return temp;
      });
    },
    // 上方按钮功能
    // ===========
    async queryData(queryParams) {
      let res = await queryAuthorizationApply(queryParams);
      console.log(res);
      this.total = res.TotalSize * 1;
      this.tableData = this.handleData(res.Records);
    },
    // 行按钮功能
    // ===========
    // 删除
    async deleteData(row) {
      //   await deleteStaff(row);
      this.$refs["tablepage"].queryData();
    },
    // 拒绝邀请码
    async refuseApply(row) {
      if (row.ApplyStatus === "待审核") {
        const { ID , BusinessID, MemberID} = row;
        await updateAuthorizationApply({
          ID, BusinessID, MemberID,
          ApplyStatus: 2
        });
        this.$refs["tablepage"].queryData();
      } else {
        this.$message("该申请已审核结束");
      }
    },
    // 同意邀请码
    async agreeApply(row) {
      if (row.ApplyStatus === "待审核") {
        const { ID, BusinessID, MemberID } = row;
        await updateAuthorizationApply({
          ID,
           BusinessID, MemberID,
          ApplyStatus: 1
        });

        addAuthorization({
          BusinessID,
          MemberID
        });
        this.$refs["tablepage"].queryData();
      } else {
        this.$message("该申请已审核结束");
      }
    }
  }
};
</script>

<style>
</style>