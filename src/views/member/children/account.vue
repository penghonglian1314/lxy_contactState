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
import { queryMemberAccount } from "@/api/money";
import TablePage from "@/components/ZC/TablePage/index";

export default {
  components: { TablePage },
  data() {
    return {
      SearchParamsList: [],
      tableData: [],
      total: 0,
      tableCols: [
        {
          label: "账户类型名称",
          prop: "AccountName"
        },
        {
          label: "余额 /元",
          prop: "Balance",
          type: "money",
          width: 200
        },
        {
          label: "操作",
          prop: "operate",
          type: "operate",
          width: 170
        }
      ],
      // extandCols: [],
      OperateCols: [
        {
          label: "明细",
          event: this.toDetail,
          color: "blue"
        }
        // {
        //   label: "删除",
        //   event: this.deleteData,
        //   color: "blue"
        // }
      ],
      Btns: []
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
      let res = await queryMemberAccount({
        ...queryParams,
        MemberID: this.$route.query.MemberID
      });
      this.total = res.TotalSize * 1;
      this.tableData = this.handleData(res.Records);
    },
    // 行按钮功能
    // ===========
    toDetail(query) {
      this.$router.push({
        path: "/member/account/detail",
        query: { MemberID: query.MemberID,AccountType: query.AccountType }
      });
    }
  }
};
</script>

<style>
</style>