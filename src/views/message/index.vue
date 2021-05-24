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
import { queryMessage, deleteMessage } from "@/api/message";
import TablePage from "@/components/ZC/TablePage/index";

export default {
  components: { TablePage },
  data() {
    return {
      SearchParamsList: [
        {
          label: "发送者",
          value: "senderMemberName"
        },
        {
          label: "接收者",
          value: "recverMemberName"
        },
        {
          label: "发送时间",
          value: "timeRange",
          type: "datetimerange",
          vformat: "timestamp"
        }
      ],
      tableData: [],
      total: 0,
      tableCols: [
        {
          label: "消息分类",
          prop: "MsgClassify",
          width: 140
        },
        {
          label: "消息类型",
          prop: "MsgType",
          width: 140
        },
        {
          label: "发送者",
          prop: "senderMemberName",
          width: 160
        },
        {
          label: "接收者",
          prop: "recverMemberName",
          width: 160
        },
        {
          label: "内容",
          prop: "Message",
          type: "customize"
        },
        {
          label: "发送时间",
          prop: "MsgTime",
          type: "timeStamp",
          width: 160
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
          label: "删除",
          event: this.deleteData,
          color: "blue"
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
      const MsgClassifyMap = {
        "0": "P2P消息",
        "1": "分组消息",
        "2": "系统消息"
      };
      const MsgTypeMap = {
        "0": "P2P消息",
        "2": "申请相册消息",
        "3": "互动消息" //(点赞跟评论）
      };
      return data.map(item => {
        const temp = { ...item };
        temp.MsgClassify = MsgClassifyMap[item.MsgClassify];
        temp.MsgType = MsgTypeMap[item.MsgType];
        return temp;
      });
    },
    // 上方按钮功能
    // ===========
    async queryData(queryParams) {
      let res = await queryMessage(queryParams);
      this.total = res.TotalSize * 1;
      this.tableData = this.handleData(res.Records);
    },
    // 行按钮功能
    async deleteData(queryParams) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await deleteMessage({ SeqID: queryParams.SeqID });
          this.$refs["tablepage"].queryData();
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
    }
  }
};
</script>

<style>
</style>