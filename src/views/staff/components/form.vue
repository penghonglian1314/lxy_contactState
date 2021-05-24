<template>
  <div>
    <el-form
      :model="ruleForm"
      ref="form"
      :label-width="LabelWidth + 'px'"
      :rules="rules"
    >
      <!-- <el-form-item
        v-for="item in Config"
        :key="item.value"
        :label="item.label"
        :prop="item.value"
      >
        <el-input
          v-if="!item.type || item.type === 'text' || item.type === 'input'"
          v-model="ruleForm[item.value]"
          :disabled="item.disabled"
        ></el-input>
        <el-input
          v-else-if="item.type === 'textarea'"
          type="textarea"
          v-model="ruleForm[item.value]"
          :disabled="item.disabled"
        ></el-input>
        <el-input-number
          v-else-if="item.type === 'number'"
          v-model="ruleForm[item.value]"
          :disabled="item.disabled"
        ></el-input-number>
        <el-select
          v-else-if="item.type === 'select'"
          v-model="ruleForm[item.value]"
          :disabled="item.disabled"
        ></el-select>
        <el-switch
          v-else-if="item.type === 'switch'"
          v-model="ruleForm[item.value]"
          :disabled="item.disabled"
        ></el-switch>
        <my-upload
          v-else-if="item.type === 'upload'"
          :file-list="ruleForm[item.value]"
          @fileChange="fileChange($event, item.value)"
          :disabled="item.disabled"
        ></my-upload>
        <span v-else>暂不支持此格式</span>
      </el-form-item> -->
      <el-form-item prop="MemberID" label="客服ID">
        <div :style="{ width: '70%' }">
          {{ ruleForm.MemberID || "暂未选择" }}
        </div>
        <el-button @click="isSelect = true">选择用户</el-button>
      </el-form-item>
      <el-form-item prop="MemberName" label="客服名称">
        <el-input v-model="ruleForm.MemberName"></el-input>
      </el-form-item>
      <el-form-item prop="Tel" label="联系电话">
        <el-input v-model="ruleForm.Tel"></el-input>
      </el-form-item>

      <el-row :style="{ marginLeft: LabelWidth + 'px' }">
        <el-button
          v-for="btn in Btns"
          :key="btn.label"
          :type="btn.type || 'primary'"
          @click="btnClick(btn.event, btn.validate)"
          >{{ btn.label }}</el-button
        >
      </el-row>
    </el-form>

    <el-dialog
      title="选择用户"
      v-if="isSelect"
      :visible.sync="isSelect"
      append-to-body
    >
      <TablePage
        ref="tablepage"
        :SearchParamsList="SearchParamsList"
        :total="total"
        :TableData="tableData"
        :TableCols="tableCols"
        :OperateCols="OperateCols"
        :Btns="Btnss"
        @Query="queryData"
      ></TablePage>
    </el-dialog>
  </div>
</template>

<script>
const inputType = ["input", "text", "textarea", "number"];
const selectType = ["select", "switch"];
const uploadType = ["upload"];
import { queryMember } from "@/api/member";
// import { deepClone } from "@/utils/index";
import Upload from "@/components/ZC/Upload";
import TablePage from "@/components/ZC/TablePage/index";
export default {
  props: {
    LabelWidth: {
      type: Number,
      default: 140
    },
    Rules: {
      type: Object,
      default: () => ({})
    },
    Config: {
      type: Array,
      default: () => []
    },
    Btns: {
      type: Array,
      default: () => []
    },
    Data: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    myUpload: Upload,
    TablePage
  },
  data() {
    return {
      ruleForm: { MemberID: "", MemberName: "", Tel: "" },
      rules: {
        MemberID: [
          { required: true, message: "请选择客服人选", trigger: "blur" }
        ],
        MemberName: [
          { required: true, message: "请输入客服名称", trigger: "blur" }
        ],
        Tel: [{ required: true, message: "请输入客服电话", trigger: "blur" }]
      },
      item: {},
      isSelect: false,

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
          width: 220
        },
        {
          label: "用户名称",
          prop: "MemberName"
        },
        {
          label: "联系电话",
          prop: "Tel",
          width: 140
        },
        {
          label: "操作",
          prop: "operate",
          type: "operate",
          width: 90
        }
      ],
      OperateCols: [
        {
          label: "选择",
          event: this.selectMember,
          color: "blue"
        }
      ],
      Btnss: [
        {
          label: "查询",
          type: "primary",
          event: this.queryData
        }
      ]
    };
  },
  created() {
    this.ruleForm.MemberID = this.Data.MemberID;
    this.ruleForm.MemberName = this.Data.MemberName;
    this.ruleForm.Tel = this.Data.Tel;
    // this.rules = deepClone(this.Rules);
    // this.Config.forEach(item => {
    //   // 绑定相应属性
    //   // 绑定校验规则
    //   let key = this.rules[item.value];
    //   // 如果本身不存在该属性的校验
    //   if (!key) {
    //     this.rules[item.value] = this.handleRules(item);
    //   } else if (Array.isArray(key)) {
    //     // 如果本身存在该属性的校验且校验为数组
    //     key.push(...this.handleRules(item));
    //   } else if (typeof key === "object") {
    //     this.rules[item.value] = [key, ...this.handleRules(item)];
    //   } else {
    //     console.error("添加校验条件错误");
    //   }
    // });
  },
  methods: {
    handleData2Form(data) {
      const that = this;
      const temp = {};
      Object.keys(data).forEach(key => {
        const opt = that.Config.find(e => e.value === key);
        if (opt && opt.type && uploadType.includes(opt.type)) {
          if (!data[key]) {
            temp[key] = [];
          } else {
            temp[key] = data[key].split(",");
          }
        } else {
          temp[key] = data[key];
        }
      });
      return temp;
    },
    handleRules(item) {
      const rules = item.rules ? item.rules : [];
      if (item.required) {
        const temp = {};
        temp.required = true;
        if (item.message) {
          temp.message = item.message;
        } else {
          if (!temp.type || inputType.includes(item.type)) {
            temp.message = `请输入${item.label}`;
            temp.trigger = ["blur", "submit"];
          } else if (selectType.includes(item.type)) {
            temp.message = `请选择${item.label}`;
            temp.trigger = "submit";
          } else if (uploadType.includes(item.type)) {
            temp.message = `请上传${item.label}`;
            temp.trigger = "submit";
          }
        }
        rules.push(temp);
      }
      return rules;
    },
    handleForm2Data(data) {
      const that = this;
      const temp = {};
      Object.keys(data).forEach(key => {
        const opt = that.Config.find(e => e.value === key);
        if (opt && opt.type && uploadType.includes(opt.type)) {
          if (!data[key]) {
            temp[key] = "";
          } else {
            temp[key] = data[key].join();
          }
        } else {
          temp[key] = data[key];
        }
      });
      return temp;
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
    btnClick(operate, validate) {
      if (validate) {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.handleOperate(operate, this.handleForm2Data(this.ruleForm));
          } else {
            console.error("表单验证未通过");
          }
        });
      } else {
        this.handleOperate(operate, this.handleForm2Data(this.ruleForm));
      }
    },
    fileChange(filelist, attr) {
      // console.log(filelist)
      this.ruleForm[attr] = filelist;
    },
    async queryData(queryParams) {
      let res = await queryMember(queryParams);
      this.total = res.TotalSize * 1;
      this.tableData = res.Records;
    },
    selectMember(row) {
      this.ruleForm.MemberID = row.MemberID;
      this.ruleForm.MemberName = row.MemberName;
      this.ruleForm.Tel = row.Tel;

      this.isSelect = false;
    }
  }
};
</script>

<style>
</style>