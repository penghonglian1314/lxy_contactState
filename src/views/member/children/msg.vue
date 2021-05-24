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
import { queryMember } from "@/api/member";
import TablePage from "@/components/ZC/TablePage/index";
import MyForm from "@/components/ZC/Form/index";

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
          label: "头像",
          prop: "AvatarUrl",
          type: "avatar",
          width: 60
        },
        {
          label: "用户ID",
          prop: "MemberID",
          width: 260
        },
        {
          label: "用户名称",
          prop: "MemberName"
        },
        {
          label: "联系电话",
          prop: "Tel",
          width: 160
        },
        {
          label: "创建时间",
          prop: "CreateTime",
          type: "time",
          width: 170
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
          label: "聊天",
          event: this.toMsg,
          color: "blue"
        },
        {
          label: "动态",
          event: this.toDynamic,
          color: "green"
        },
        {
          label: "收藏",
          event: this.toCollect,
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
      return data.map(item => {
        const temp = { ...item };
        return temp;
      });
    },
    // 上方按钮功能
    // ===========
    async queryData(queryParams) {
      let res = await queryMember(queryParams);
      this.total = res.TotalSize * 1;
      this.tableData = this.handleData(res.Records);
    }
  }
};
</script>

<style>
</style>