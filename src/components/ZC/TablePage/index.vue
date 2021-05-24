<template>
  <div>
    <!-- 上方搜索区域 -->
    <el-card class="ipt-wrapper">
      <el-form :inline="true" class="flexRow">
        <!-- 搜索参数设置区域 -->
        <el-form-item
          v-for="SearchParamItem in SearchParamsList"
          :key="SearchParamItem.value"
          class="flexCol iptCol"
          :label="SearchParamItem.label"
        >
          <!-- 搜索框 标签 -->
          <!-- <span v-if="SearchParamItem.ifLabel !== false" class="searchTitle">
            {{ SearchParamItem.label | formatLabel }}
          </span> -->
          <!-- ---------- -->
          <!-- 搜索框 主体 -->
          <!-- ---------- -->
          <!-- 默认使用 input -->
          <el-input
            v-if="!SearchParamItem.type || SearchParamItem.type === 'input'"
            v-model="SearchParams[SearchParamItem.value]"
            :placeholder="
              SearchParamItem.placeholder || `请输入${SearchParamItem.label}`
            "
            clearable
            style="maxWidth:217px;"
          ></el-input>
          <!-- number类型输入框 -->
          <el-input-number
            class="inputNumber"
            v-else-if="
              SearchParamItem.type && SearchParamItem.type === 'number'
            "
            v-model="SearchParams[SearchParamItem.value]"
            :placeholder="
              SearchParamItem.placeholder || `请输入${SearchParamItem.label}`
            "
            controls-position="right"
            clearable
          ></el-input-number>
          <!-- 选择器 -->
          <el-select
            v-else-if="
              SearchParamItem.type && SearchParamItem.type === 'select'
            "
            v-model="SearchParams[SearchParamItem.value]"
            :placeholder="
              SearchParamItem.placeholder || `请选择${SearchParamItem.label}`
            "
          >
            <el-option
              v-for="item in SearchParamItem.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <!-- 日期时间范围选择器 -->
          <el-date-picker
            v-else-if="
              SearchParamItem.type && SearchParamItem.type === 'datetimerange'
            "
            v-model="unSearchParams[SearchParamItem.value]"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            :value-format="SearchParamItem.vformat || 'yyyyMMddHHmmss'"
            @change="
              datePickerChange(SearchParamItem.value, SearchParamItem.keys)
            "
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          class="flexCol btnCol"
          v-for="BtnItem in BtnsList"
          :key="BtnItem.label"
        >
          <el-button :type="BtnItem.type" @click="btnClick(BtnItem.event)">
            {{ BtnItem.label }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-divider></el-divider>
    <!-- 表格数据展示区 -->
    <div>
      <el-table
        border
        :data="TableData"
        stripe
        style="width: 100%"
        :row-class-name="tableRowClassName"
        :cell-style="cellStyle"
        :cell-class-name="'td'"
      >
        <!-- 表格数据区 -->
        <!-- 索引 -->
        <el-table-column
          v-if="indexed"
          type="index"
          align="center"
          :index="indexMethod"
        >
        </el-table-column>
        <!-- 扩展区 -->
        <el-table-column type="expand" v-if="ExtandCols.length">
          <template slot-scope="props">
            <el-form
              label-position="left"
              label-width="180px"
              class="demo-table-expand"
              style="width:100%"
            >
              <el-form-item
                v-for="extandCol in ExtandCols"
                :key="extandCol.prop"
                :label="extandCol.label"
                style="width:100%"
              >
                <!-- 数据类型为 头像 类型 -->
                <template v-if="extandCol.type === 'avatar'">
                  <span v-if="props.row[extandCol.prop] === ''">{{
                    extandCol.placeholder || "--"
                  }}</span>
                  <el-avatar
                    v-else
                    :size="extandCol.size || 60"
                    :src="props.row[extandCol.prop]"
                  />
                </template>
                <!-- 数据类型为 图片 类型 -->
                <template v-else-if="extandCol.type === 'img'">
                  <span v-if="props.row[extandCol.prop] === ''">{{
                    extandCol.placeholder || "--"
                  }}</span>
                  <img
                    v-else
                    :src="props.row[extandCol.prop]"
                    :alt="extandCol.alt"
                    style="width:300px"
                  />
                </template>
                <!-- 数据类型为 图片列表 类型 -->
                <template v-else-if="extandCol.type === 'imgs'">
                  <el-row :gutter="20">
                    <el-col
                      v-for="(img, k) in props.row[extandCol.prop]"
                      :key="k"
                      :span="4"
                    >
                      <img :src="img" alt style="width:100%" />
                    </el-col>
                  </el-row>
                </template>
                <!-- 数据类型为 时间 类型 -->
                <template v-else-if="extandCol.type === 'time'">
                  <span>{{ props.row[extandCol.prop] | formatTime }}</span>
                </template>
                <!-- 数据类型为 时间戳 类型 -->
                <template v-else-if="extandCol.type === 'timeStamp'">
                  <span>{{ props.row[extandCol.prop] | formatTimeStamp }}</span>
                </template>
                <!-- 数据类型为 金钱 类型 -->
                <template v-else-if="extandCol.type === 'money'">
                  <span>{{
                    Number(props.row[extandCol.prop]).toFixed(2)
                  }}</span>
                </template>
                <!-- 默认类型 直接展示 -->
                <template v-else>{{ props.row[extandCol.prop] }}</template>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          v-for="tableCol in TableCols"
          :key="tableCol.prop"
          :prop="tableCol.prop"
          :label="tableCol.label"
          :width="tableCol.width || 'auto'"
          :align="tableCol.align || 'center'"
        >
          <template slot-scope="scope">
            <!-- 数据类型为 头像 类型 -->
            <template v-if="tableCol.type === 'avatar'">
              <span v-if="scope.row[tableCol.prop] === ''">{{
                tableCol.placeholder || "--"
              }}</span>
              <el-avatar
                v-else
                :size="tableCol.size || tableCol.width * 0.8"
                :src="scope.row[tableCol.prop]"
              />
            </template>
            <!-- 数据类型为 图片 类型 -->
            <template v-else-if="tableCol.type === 'img'">
              <span v-if="scope.row[tableCol.prop] === ''">{{
                tableCol.placeholder || "--"
              }}</span>
              <img
                v-else
                :size="90"
                :src="scope.row[tableCol.prop]"
                :alt="tableCol.alt"
                style="width:80%"
              />
            </template>
            <!-- 数据类型为 金钱 类型 -->
            <template v-else-if="tableCol.type === 'money'">
              <span>{{ Number(scope.row[tableCol.prop]).toFixed(2) }}</span>
            </template>
            <!-- 数据类型为 时间 类型 -->
            <template v-else-if="tableCol.type === 'time'">
              <span>{{ scope.row[tableCol.prop] | formatTime }}</span>
            </template>
            <!-- 数据类型为 时间戳 类型 -->
            <template v-else-if="tableCol.type === 'timeStamp'">
              <span>{{ scope.row[tableCol.prop] | formatTimeStamp }}</span>
            </template>
            <!-- 表格操作区 -->
            <template
              slot-scope="scope"
              v-else-if="tableCol.type === 'operate' && OperateCols.length"
            >
              <el-button
                v-for="operation in OperateCols"
                :key="operation.label"
                :style="`color:${operation.color};`"
                type="text"
                @click="operateClick(operation.event, scope.row)"
              >
                {{ operation.label }}
              </el-button>
            </template>
            <!-- 自定义展示 -->
            <template v-else-if="tableCol.type === 'customize'">
              <template v-if="scope.row.ContentType === '0'">
                {{ scope.row[tableCol.prop] }}
              </template>
              <template v-else-if="scope.row.ContentType === '1'">
                <span v-if="scope.row[tableCol.prop] === ''">{{
                  tableCol.placeholder || "--"
                }}</span>
                <el-image
                  v-else
                  :src="scope.row[tableCol.prop]"
                  fit="contain"
                  :preview-src-list = "[scope.row[tableCol.prop]]"
                  :hide-on-click-modal='true'
                  alt=""
                  :style="{height:'50px'}"
                />
              </template>
            </template>
            <!-- 默认类型 直接展示 -->
            <template v-else>{{ scope.row[tableCol.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器区域 -->
      <div class="page" v-if="pageShow">
        <el-pagination
          :page-sizes="PageConfig.sizes"
          :page-size="SearchParams.limit"
          :total="total * 1"
          :current-page="SearchParams.current"
          :layout="PageConfig.layout"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
// 常量声明
// =========
// Props常量
const SP = "SearchParamsList";
const BTNS = "Btns";
const IFPRINT = "ifPrint";
const TABLEDATA = "TableData";
const TC = "TableCols";
const OC = "OperateCols";
// 方法常量
const QUERYDATA = "Query";
const PRINTDATA = "Print";
// 数据常量
const SEARCHPARAMS = "SearchParams";

const imgType = ["img", "imgs", "avatar"];
import { parseTime } from "@/utils/index";

export default {
  props: {
    //==================================================================
    // 搜索栏相关参数
    //==================================================================

    // 搜索栏输入列表
    SearchParamsList: {
      type: Array,
      default: () => [
        {
          // 必填！！！！
          // 字段，该数据所对应的键值
          // 类型：string
          value: "",

          // 搜索是否显示标题
          // 类型：booleon
          // 默认值：true
          ifLabel: true,

          // 标题
          // 类型：string
          label: "",

          // 搜索框占位字符串
          // 类型：string
          placeholder: "",

          // 搜索框类型
          // 可选：input number select
          // 默认：input
          // 类型：string
          type: "",

          // 当搜索框类型为select时，其子选项数值
          options: [
            {
              label: "",
              value: ""
            }
          ]
        }
      ]
    },
    // 搜索栏按钮列表
    Btns: {
      type: Array,
      default: () => []
    },
    // ifQuery: {
    //   type: Boolean,
    //   default: true
    // },
    // ifPrint: {
    //   type: Boolean,
    //   default: false
    // },
    //==================================================================
    // 列表整体相关参数
    //==================================================================

    // 列表数据
    TableData: {
      type: Array,
      default: () => []
    },
    // 列表列设置
    indexed: {
      type: Boolean,
      default: false
    },
    TableCols: {
      type: Array,
      default: () => [
        // {
        //   // 表头属性字段
        //   prop: "",
        //   // 表头属性名称
        //   label: "",
        //   // 数据格式类型
        //   // 默认不处理
        //   // 可选 img avator time
        //   type: "",
        //   // 表格宽度
        //   // 默认auto
        //   width: "",
        //   // 水平对齐方式
        //   // 默认居中
        //   align: ""
        // }
      ]
    },
    ExtandCols: {
      type: Array,
      default: () => [
        // {
        //   // 表头属性字段
        //   prop: "",
        //   // 表头属性名称
        //   label: "",
        //   // 数据格式类型
        //   // 默认不处理
        //   // 可选 img imgs avator time
        //   type: "",
        // }
      ]
    },
    // 列表操作设置
    OperateCols: {
      type: Array,
      default: () => [
        {
          // 操作名称
          label: "",
          // 操作事件
          // 可选类型 string function
          // P.S. 当event类型为string时，必须在父级绑定同名的函数，否则不会生效
          event: "",
          // 按钮颜色
          color: ""
        }
      ]
    },
    //==================================================================
    // 分页相关参数
    //==================================================================
    // 数据总数量
    total: {
      type: Number,
      default: 0
    },
    // 分页器配置
    PageConfig: {
      type: Object,
      default: () => ({
        sizes: [5, 10, 20, 30],
        layout: "total, sizes, prev, pager, next, jumper"
      })
    }
  },
  data() {
    // console.log(this.PageConfig.sizes[0]);
    return {
      [SEARCHPARAMS]: {
        limit: this.PageConfig.sizes[0],
        current: 1
      },
      BtnsList: [],
      // 未处理的搜索的参数，需要经过处理后作为搜索参数
      unSearchParams: {},
      pageShow:true
    };
  },
  created() {
    // if(this.ifQuery){
    //   this.BtnsList.push(
    //     {
    //       label: "查询",
    //       type: "primary",
    //       event: QUERYDATA
    //     }
    //   )
    // }

    // if (this.ifPrint) {
    //   this.BtnsList.push(
    //     {
    //       label: "打印",
    //       type: "primary",
    //       event: PRINTDATA
    //     }
    //   )
    // }
    this.BtnsList.push(...this.Btns);

    // console.log(this.SearchParamsList);
    // 初始化 查询table数据
    this.queryData();
  },
  filters: {
    formatTime(time) {
      if (!time) {
        return "--";
      }
      const date = time.toString();
      return (
        date.substr(0, 4) +
        "-" +
        date.substr(4, 2) +
        "-" +
        date.substr(6, 2) +
        " " +
        date.substr(8, 2) +
        ":" +
        date.substr(10, 2) +
        ":" +
        date.substr(12, 2)
      );
    },
    formatTimeStamp(timeStamp) {
      return parseTime(timeStamp);
    },
    formatLabel(label) {
      return label.endsWith(":") ? label : label + ":";
    }
  },
  computed:{
    rowTotal(){
      return this.TableData.length
    }
  },
  watch: {
    rowTotal(val) {
      console.log(val)
      if (val === 0 && this[SEARCHPARAMS].current > 1) {
        this[SEARCHPARAMS].current=this[SEARCHPARAMS].current-1;
        console.log('this[SEARCHPARAMS]',this[SEARCHPARAMS])
        this.pageShow = false
        this.$emit(QUERYDATA, {...this[SEARCHPARAMS]});
        this.$nextTick(()=>{
          this.pageShow = true
        })
      }
    }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "even-row";
      } else if (rowIndex % 2 === 1) {
        return "odd-row";
      }
      return "";
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      const cellStyle = {
        padding: "10px 0",
        lineHeight: "inherit"
      };
      if (this.TableCols.some(col => imgType.includes(col.type))) {
        cellStyle.padding = "2px 0";
      }
      return cellStyle;
    },
    indexMethod(index) {
      return (
        this[SEARCHPARAMS].limit * (this[SEARCHPARAMS].current - 1) + index + 1
      );
    },
    datePickerChange(key, newKeys = ["StartTime", "EndTime"]) {
      if (this.unSearchParams[key]) {
        newKeys.forEach((newkey, index) => {
          this[SEARCHPARAMS][newkey] = this.unSearchParams[key][index];
        });
      } else {
        newKeys.forEach((newkey, index) => {
          delete this[SEARCHPARAMS][newkey];
        });
      }
    },
    // ==============================================================
    // 部分数据处理函数
    // ==============================================================
    handleOperate(operate, args) {
      if (operate) {
        if (typeof operate === "string") {
          this.$emit(operate, args);
        } else if (typeof operate === "function") {
          operate(args);
        } else {
          return;
        }
      } else {
        return;
      }
    },
    // ==============================================================
    // extendArgs 父级传递的参数
    queryData(extendArgs) {
      return this.$emit(QUERYDATA, this[SEARCHPARAMS], extendArgs);
    },

    btnClick(operate) {
      this.handleOperate(operate, this[SEARCHPARAMS]);
      // this.$emit(operate, this[SEARCHPARAMS]);
    },

    operateClick(operate, row) {
      this.handleOperate(operate, row);
    },

    handleSizeChange(size) {
      this[SEARCHPARAMS].limit = size;
      this.$emit(QUERYDATA, this[SEARCHPARAMS]);
    },
    handleCurrentChange(current) {
      this[SEARCHPARAMS].current = current;
      this.$emit(QUERYDATA, this[SEARCHPARAMS]);
    }
  }
};
</script>


<style>
.inputNumber .el-input__inner {
  text-align: left !important;
}
/* .el-table__body-wrapper .el-table__row--striped{
  background-color: #000!important;
} */
.td .cell {
  line-height: inherit;
  padding: 0 !important;
  /* display: flex;
  justify-content: center;
  align-items: center; */
}
</style>

<style lang="scss" scoped>
.ipt-wrapper {
  width: 100%;
  .flexRow {
    .flexCol {
      padding: 10px 0;
      margin-right: 30px;
    }
  }
  // .searchTitle {
  //   font-size: 18px;
  //   margin-right: 8px;
  // }
}
.el-table .even-row {
  background: oldlace;
}

.el-table .odd-row {
  background: #f0f9eb;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  // width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
