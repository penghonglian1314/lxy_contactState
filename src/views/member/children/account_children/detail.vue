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
import { queryMemberAccountRecord } from "@/api/money";
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
          label: "收支类型",
          prop: "RecordTypes1"
        },
        {
          label: "收支来源",
          prop: "RecordTypes2"
        },
        {
          label: "金额 /元",
          prop: "Amount",
          type: "money",
          width: 200
        },
        {
          label: "交易时间",
          prop: "CreateTime",
          type: "time",
          width: 170
        }

        // {
        //   label: "操作",
        //   prop: "operate",
        //   type: "operate",
        //   width: 170
        // }
      ],
      // extandCols: [],
      OperateCols: [
        // {
        //   label: "明细",
        //   event: this.toDetail,
        //   color: "blue"
        // }
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
          if (key === "RecordType") {
            temp.RecordTypes1 =
              theReflect.RecordTypes1[Math.floor((item.RecordType * 1) / 10)];
            temp.RecordTypes2 =
              theReflect.RecordTypes2[Math.floor((item.RecordType * 1) % 10)];
          }

          temp[key] = item[key];
        });
        return temp;
      });
    },
    // 上方按钮功能
    // ===========
    async queryData(queryParams) {
      let res = await queryMemberAccountRecord({
        ...queryParams,
        MemberID: this.$route.query.MemberID,
        AccountType: this.$route.query.AccountType
      });
      this.total = res.TotalSize * 1;
      this.tableData = this.handleData(res.Records, {
        RecordTypes1: {
          "1": "充值",
          "2": "消耗"
        },
        RecordTypes2: {
          "1": "钱包充值",
          "2": "解锁聊天",
          "3": "解锁相册",
          "4": "礼物"
        }
      });
    },
    // 行按钮功能
    // ===========
    toDetail(query) {
      this.$router.push({
        path: "/member/account/detail",
        query: { MemberID: query.MemberID }
      });
    }
  }
};
</script>

<style>
</style>