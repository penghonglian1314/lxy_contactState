<template>
  <el-container>
    <el-main>
      <!-- <TablePage
        ref="tablepage"
        :SearchParamsList="SearchParamsList"
        :total="total"
        :TableData="tableData"
        :TableCols="tableCols"
        :ExtandCols="extandCols"
        :OperateCols="OperateCols"
        :Btns="Btns"
        @Query="queryData"
      ></TablePage> -->
      <h3 v-if="!tableData.length">该用户相册为空</h3>
      <MyUpload
        v-if="tableData.length"
        :file-list="tableData"
        @fileChange="handleChange"
        :limit='0'
      ></MyUpload>
    </el-main>
  </el-container>
</template>

<script>
import { queryPhoto, updatePhoto } from "@/api/photo";
import TablePage from "@/components/ZC/TablePage/index";
import MyUpload from "@/components/ZC/Upload/index";

// import theReflect from "@/config/reflect/photo";

export default {
  components: { TablePage, MyUpload },
  data() {
    return {
      // SearchParamsList: [
      //   // {
      //   //   label: "用户名称",
      //   //   value: "MemberName"
      //   // }
      // ],
      tableData: []
      // total: 0,
      // tableCols: [
      //   {
      //     label: "相册图片",
      //     prop: "PhotoUrl",
      //     width: 100,
      //     type: "img"
      //   },
      //   // {
      //   //   label: "相册描述",
      //   //   prop: "Desc"
      //   // },
      //   // {
      //   //   label: "创建时间",
      //   //   prop: "CreateTime",
      //   //   type: "time",
      //   //   width: 170
      //   // },
      //   {
      //     label: "操作",
      //     prop: "operate",
      //     type: "operate",
      //     width: 170
      //   }
      // ],
      // extandCols: [],
      // OperateCols: [
      //   {
      //     label: "删除",
      //     event: this.deleteData,
      //     color: "blue"
      //   }
      //   // {
      //   //   label: "动态",
      //   //   event: this.toPhoto,
      //   //   color: "green"
      //   // },
      //   // {
      //   //   label: "收藏",
      //   //   event: this.toCollect,
      //   //   color: "red"
      //   // }
      // ],
      // Btns: [
      //   // {
      //   //   label: "查询",
      //   //   type: "primary",
      //   //   event: this.queryData
      //   // }
      // ]
    };
  },
 async created() {
   await this.queryData();
  },
  methods: {
    // 数据处理
    // =========
    // handleData(data, theReflect) {
    //   // return data.map(item => {
    //   //   const temp = {};
    //   //   Object.keys(item).forEach(key => {
    //   //     // 存在映射
    //   //     if (theReflect && theReflect[key]) {
    //   //       temp[key] = theReflect[key][item[key]];
    //   //     } else {
    //   //       if (
    //   //         this.extandCols &&
    //   //         this.extandCols.some(
    //   //           col => col.prop === key && col.type === "imgs"
    //   //         )
    //   //       ) {
    //   //         temp[key] = item[key].split(",");
    //   //       } else {
    //   //         temp[key] = item[key];
    //   //       }
    //   //     }
    //   //   });

    //   //   return temp;
    //   // });
    //   this.PhotoID = data[0].PhotoID;
    //   return data[0].PhotoUrl.split(",");
    // },
    // 上方按钮功能
    // ===========
    async queryData(queryParams) {
      let res = await queryPhoto({
        ...queryParams,
        MemberID: this.$route.query.MemberID
      });
      // this.total = res.TotalSize * 1;
      const data = res.Records[0]
      this.PhotoID = data.PhotoID;
      
      this.tableData =data.PhotoUrl?data.PhotoUrl.split(","):[];
      console.log(this.tableData);
    },
    // 行按钮功能
    // ===========
    // async deleteData(queryParams) {
    //   this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(async () => {
    //       await deletePhoto({ PhotoID: queryParams.PhotoID });
    //       this.$refs["tablepage"].queryData();
    //     })
    //     .catch(() => {
    //       this.$message({ type: "info", message: "已取消删除" });
    //     });
    // }
    handleChange(filelist) {
      console.log(filelist);
      const p = {
        PhotoUrl: filelist.join(",")||'',
        PhotoID: this.PhotoID    
      };
      updatePhoto(p).then(()=>{
        this.queryData();
      });
    }
  }
};
</script>

<style>
</style>