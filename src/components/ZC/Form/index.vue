<template>
  <div>
    <el-form
      :model="ruleForm"
      ref="form"
      :label-width="LabelWidth + 'px'"
      :rules="rules"
    >
      <el-form-item
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
  </div>
</template>

<script>
const inputType = ["input", "text", "textarea", "number"];
const selectType = ["select", "switch"];
const uploadType = ["upload"];

import { deepClone } from "@/utils/index";
import Upload from "@/components/ZC/Upload";
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
    myUpload: Upload
  },
  data() {
    return {
      ruleForm: {},
      rules: {},
      item: {}
    };
  },
  created() {
    this.ruleForm = this.handleData2Form(this.Data);

    this.rules = deepClone(this.Rules);
    this.Config.forEach(item => {
      // 绑定相应属性

      // 绑定校验规则
      let key = this.rules[item.value];
      // 如果本身不存在该属性的校验
      if (!key) {
        this.rules[item.value] = this.handleRules(item);
      } else if (Array.isArray(key)) {
        // 如果本身存在该属性的校验且校验为数组
        key.push(...this.handleRules(item));
      } else if (typeof key === "object") {
        this.rules[item.value] = [key, ...this.handleRules(item)];
      } else {
        console.error("添加校验条件错误");
      }
    });
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
    }
  }
};
</script>

<style>
</style>