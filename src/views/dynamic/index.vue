<template>
  <el-container>
    <el-main>
      <TablePage
        ref="tablepage"
        :SearchParamsList="SearchParamsList"
        :total="total"
        :TableData="tableData"
        :TableCols="tableCols"
        :ExtandCols="extandCols"
        :OperateCols="OperateCols"
        :Btns="Btns"
        @Query="queryData"
      ></TablePage>
    </el-main>
  </el-container>
</template>

<script>
import { queryDynamic, deleteDynamic } from "@/api/dynamic";
import TablePage from "@/components/ZC/TablePage/index";
import thisReflect from "@/config/reflect/dynamic";

export default {
  components: { TablePage },
  data() {
    return {
      SearchParamsList: [
        {
          label: "用户名称",
          value: "MemberName"
        },
        {
          label: "发布时间",
          value: "timeRange",
          type: "datetimerange"
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
          label: "动态状态",
          prop: "Status1",
          width: 160
        },
        {
          label: "发布时间",
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
      extandCols: [
        {
          label: "头像",
          prop: "AvatarUrl",
          type: "avatar"
        },
        {
          label: "用户ID",
          prop: "MemberID"
        },
        {
          label: "用户名称",
          prop: "MemberName"
        },
        {
          label: "是否允许评论",
          prop: "CanComment"
        },
        // {
        //   label: "评论数量",
        //   prop: "CommentCnt"
        // },
        {
          label: "动态状态",
          prop: "Status1"
        },
        {
          label: "是否对同性别用户隐藏",
          prop: "Status2"
        },
        {
          label: "发布时间",
          prop: "CreateTime",
          type: "time"
        },
        {
          label: "动态内容",
          prop: "Desctet"
        },
        {
          label: "动态图片",
          prop: "PicUrls",
          type: "imgs"
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
      let res = await queryDynamic(queryParams);
      this.total = res.RowCnt * 1 && res.TotalSize * 1;
      this.tableData = this.handleData(res.Records, thisReflect);
    },
    // 行按钮功能
    // ===========
    async deleteData(queryParams) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {        
          await deleteDynamic({
            DynamicID: queryParams.DynamicID,
            PicUrls: queryParams.PicUrls
          });
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