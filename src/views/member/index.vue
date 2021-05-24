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
          width: 270
        }
      ],
      OperateCols: [
        {
          label: "账户",
          event: this.toAccount,
          color: "blue"
        },
        // {
        //   label: "聊天",
        //   event: this.toMsg,
        //   color: "blue"
        // },
        {
          label: "动态",
          event: this.toDynamic,
          color: "green"
        },
        // {
        //   label: "关注",
        //   event: this.toCollect,
        //   color: "red"
        // },
        {
          label: "互动",
          event: this.toLike,
          color: "skyblue"
        },
        {
          label: "相册",
          event: this.toPhoto,
          color: "skyblue"
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
    },
    // 行按钮功能
    toAccount(query) {
      this.$router.push({
        path: "/member/account",
        query: { MemberID: query.MemberID }
      });
    },
    // toMsg(query) {
    //   this.$router.push({
    //     path: "/member/msg",
    //     query: { MemberID: query.MemberID }
    //   });
    // },
    toDynamic(query) {
      this.$router.push({
        path: "/member/dynamic",
        query: { MemberID: query.MemberID }
      });
    },
    toCollect(query) {
      this.$router.push({
        path: "/member/collect",
        query: { MemberID: query.MemberID }
      });
    },
    toLike(query) {
      this.$router.push({
        path: "/member/like",
        query: { MemberID: query.MemberID }
      });
    },
    toPhoto(query) {
      this.$router.push({
        path: "/member/photo",
        query: { MemberID: query.MemberID }
      });
    }
  }
};
</script>

<style>
</style>