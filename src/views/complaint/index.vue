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
      <!-- :ExtandCols="extandCols" -->
    </el-main>
    <el-dialog title="举报处理" :visible.sync="dialogVisible" width="30%">
      <span>如何处理这条举报</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="disagreeComplaint">不 通 过</el-button>
        <el-button type="primary" @click="agreeComplaint">通 过</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import {
  queryComplaint,
  deleteComplaint,
  updateComplaint,
  sendComplaintMsg
} from "@/api/complaint";
// import { deleteDynamic } from "@/api/dynamic";
import TablePage from "@/components/ZC/TablePage/index";
// import thisReflect from "@/config/reflect/complaint";

export default {
  components: { TablePage },
  data() {
    return {
      SearchParamsList: [
        {
          label: "举报人",
          value: "SenderName"
        },
        {
          label: "被举报人",
          value: "RecverName"
        },
        {
          label: "举报时间",
          value: "timeRange",
          type: "datetimerange"
        }
      ],
      tableData: [],
      total: 0,
	  name: '--99-',
      tableCols: [
        {
          label: "举报人",
          prop: "SenderName",
          width: 200
        },
        {
          label: "被举报人",
          prop: "RecverName",
          width: 200
        },
        {
          label: "举报理由",
          prop: "ComplaintMsg"
        },
        {
          label: "举报时间",
          prop: "CreateTime",
          type: "time",
          width: 170
        },
        {
          label: "举报状态",
          prop: "ComplaintStatus",
          width: 90
        },
        {
          label: "操作",
          prop: "operate",
          type: "operate",
          width: 170
        }
      ],
      extandCols: [
        {
          label: "举报人",
          prop: "SenderName"
        },
        {
          label: "举报类型",
          prop: "ComplaintType"
        },
        {
          label: "举报理由",
          prop: "ComplaintMsg"
        },
        {
          label: "举报图片",
          prop: "ComplaintImgs",
          type: "imgs"
        },
        {
          label: "举报时间",
          prop: "CreateTime",
          type: "time"
        }
      ],
      OperateCols: [
        {
          label: "举报详情",
          event: this.toDetail,
          color: "green"
        },
        {
          label: "处理",
          event: this.handleComplaint,
          color: "blue"
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
        }
      ],

      dialogVisible: false,
      row: {}
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
      let res = await queryComplaint(queryParams);
      this.total = res.RowCnt * 1 && res.TotalSize * 1;
      this.tableData = this.handleData(res.Records, {
        ComplaintStatus: {
          "0": "举报待处理",
          "1": "举报通过",
          "2": "举报未通过"
        }
      });
    },
    // 行按钮功能
    // ===========
    async deleteData(row) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await deleteComplaint({ ComplaintID: row.ComplaintID });
          this.$refs["tablepage"].queryData();
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
    },

    async handleComplaint(row) {
      if (row.ComplaintStatus === "举报待处理") {
        this.row = { ...row };
        this.dialogVisible = true;
      } else {
        this.$message("该举报已处理");
      }
    },

    async agreeComplaint() {
      const params = {
        ...this.row,
        ComplaintStatus: 1
      };
      await updateComplaint(params);
      sendComplaintMsg(params);
      // deleteDynamic({ DynamicID: this.row.ComplaintDynameic });
      this.dialogVisible = false;
      this.$refs["tablepage"].queryData();
    },

    async disagreeComplaint() {
      const params = {
        ...this.row,
        ComplaintStatus: 2
      };
      await updateComplaint(params);
      sendComplaintMsg(params);
      this.dialogVisible = false;
      this.$refs["tablepage"].queryData();
    },

    toDetail(row) {
      console.log('to detail',row)
      this.$router.push({ path: "/complaint/detail", query: row });
    }
  }
};
</script>

<style>
</style>