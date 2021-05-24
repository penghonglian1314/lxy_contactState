<template>
  <div>
    <el-form :model="ruleForm" label-width="190px" label-suffix=":" v-if="flag">
      <el-form-item
        v-for="item in Config"
        :key="item.value"
        :label="item.label"
        :prop="item.value"
      >
        <span v-if="!item.type" v-text="ruleForm[item.value]"></span>
        <span v-else-if="item.type === 'time'">{{
          ruleForm[item.value] | formatTime
        }}</span>
        <!-- 数据类型为 头像 类型 -->
        <template v-else-if="item.type === 'avatar'">
          <span v-if="ruleForm[item.value] === ''">
            "--"
          </span>
          <el-avatar v-else :size="90" :src="ruleForm[item.value]" />
        </template>
        <!-- 数据类型为 图片列表 类型 -->
        <template v-else-if="item.type === 'imgs'">
          <el-row :gutter="20">
            <el-col v-for="(img, k) in ruleForm[item.value]" :key="k" :span="4">
              <img :src="img" alt style="width:100%" />
            </el-col>
          </el-row>
        </template>
        <template v-else-if="item.type === 'divider'">
          <el-divider></el-divider>
        </template>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// const inputType = ["input", "text", "textarea", "number"];
// const selectType = ["select", "switch"];
// const uploadType = ["upload"];
import { queryDynamic } from "@/api/dynamic";
// import TablePage from "@/components/ZC/TablePage/index";
import thisReflect from "@/config/reflect/dynamic";

import { queryMember } from "@/api/member";

export default {
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
    }
  },

  data() {
    return {
      Config: [],
      ruleForm: {},
      flag:false
      // rules: {},
      // item: {}
    };
  },
  async created() {
    this.Config = [
      {
        label: "举报人",
        value: "SenderName"
      },
       {
        label: "被举报人",
        value: "RecverName"
      },
      {
        label: "举报类型",
        value: "ComplaintType"
      },
      {
        label: "举报理由",
        value: "ComplaintMsg"
      },
      {
        label: "举报图片",
        value: "ComplaintImgs",
        type: "imgs"
      },
      {
        label: "举报时间",
        value: "CreateTime",
        type: "time"
      },
      // 
      
    ];
    this.ruleForm = Object.assign({}, this.handleData(this.$route.query));
    // 举报的是动态
    if (this.ruleForm.ComplaintClass === "0") {
      this.Config.push(
        ...[
          {
            label: "动态详情",
            type: "divider"
          },
          // {
          //   label: "头像",
          //   value: "AvatarUrl",
          //   type: "avatar"
          // },
          // {
          //   label: "用户ID",
          //   value: "MemberID"
          // },
          {
            label: "用户名称",
            value: "MemberName"
          },
          {
            label: "是否允许评论",
            value: "CanComment"
          },
          // {
          //   label: "评论数量",
          //   value: "CommentCnt"
          // },
          {
            label: "动态状态",
            value: "Status1"
          },
          {
            label: "是否对同性别用户隐藏",
            value: "Status2"
          },
          {
            label: "发布时间",
            value: "DynameicTime",
            type: "time"
          },
          {
            label: "动态内容",
            value: "Desctet"
          },
          {
            label: "动态图片",
            value: "PicUrls",
            type: "imgs"
          }
        ]
      );
      let res = await queryDynamic({
        DynamicID: this.ruleForm.ComplaintDynameic
      });
      // this.handleData(res.Records, thisReflect)
      res.Records[0].DynameicTime = res.Records[0].CreateTime;
      delete res.Records[0].CreateTime;
      this.ruleForm = Object.assign(
        this.ruleForm,
        this.handleData(res.Records[0], thisReflect)
      );
    } else {
      // 举报的是用户
      this.Config.push(
        ...[
          {
            label: "用户详情",
            type: "divider"
          },
          {
            label: "头像",
            value: "AvatarUrl",
            type: "avatar"
          },
          {
            label: "用户ID",
            value: "MemberID"
          },
          {
            label: "用户名称",
            value: "MemberName"
          },
          {
            label: "联系方式",
            value: "Tel"
          },
          {
            label: "性别",
            value: "Sex"
          }
        ]
      );
      let res = await queryMember({
        MemberID: this.ruleForm.Recver
      });
      delete res.Records[0].CreateTime;
      this.ruleForm = Object.assign(
        this.ruleForm,
        this.handleData(res.Records[0], {
          sex:{
            '0':'男',
            '1':'女'
          }
        })
      );
      console.log(this.ruleForm)
    }
    this.flag = true
  },
  methods: {
    // 数据处理
    // =========
    handleData(data, theReflect) {
      let item = data;
      const temp = {};
      Object.keys(item).forEach(key => {
        // 存在映射
        if (theReflect && theReflect[key]) {
          temp[key] = theReflect[key][item[key]];
        } else {
          if (
            this.Config &&
            this.Config.some(col => col.value === key && col.type === "imgs")
          ) {
            temp[key] = item[key]?Array.isArray(item[key])?item[key]:(item[key].split(",")):'';
          } else {
            temp[key] = item[key];
          }
        }
      });

      return temp;
    }
    // handleData2Form(data) {
    //   const that = this;
    //   const temp = {};
    //   Object.keys(data).forEach(key => {
    //     const opt = that.Config.find(e => e.value === key);
    //     if (opt && opt.type && uploadType.includes(opt.type)) {
    //       if (!data[key]) {
    //         temp[key] = [];
    //       } else {
    //         temp[key] = data[key].split(",");
    //       }
    //     } else {
    //       temp[key] = data[key];
    //     }
    //   });
    //   return temp;
    // },

    // ==============================================================
    // 部分数据处理函数
    // ==============================================================
    // handleOperate(operate, args) {
    //   if (operate) {
    //     if (typeof operate === "string") {
    //       this.$emit(operate, args);
    //     } else if (typeof operate === "function") {
    //       operate(args);
    //     } else {
    //       return;
    //     }
    //   } else {
    //     return;
    //   }
    // },
    // btnClick(operate, validate) {
    //   if (validate) {
    //     this.$refs["form"].validate(valid => {
    //       if (valid) {
    //         this.handleOperate(operate, this.handleForm2Data(this.ruleForm));
    //       } else {
    //         console.error("表单验证未通过");
    //       }
    //     });
    //   } else {
    //     this.handleOperate(operate, this.handleForm2Data(this.ruleForm));
    //   }
    // },
    // fileChange(filelist, attr) {
    //   // console.log(filelist)
    //   this.ruleForm[attr] = filelist;
    // }
  }
};
</script>

<style>
</style>