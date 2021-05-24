<template>
  <component
    :is="which"
    v-if="which"
    ref="upload"
    :limit="limit"
    :file-list="filelist"
    :auto="auto"
    :drag="drag"
    :type="type"
    :post-data="postData"
    :setting="setting"
    :disabled="disabled"
    @fileChange="fileChange"
  />
</template>

<script>
import qnupload from "./components/qiniu";
import txupload from "./components/tencent";
import { uploadFileServer } from "@/api/upload";

export default {
  name: "ZFUpload",
  components: {
    qn: qnupload,
    tx: txupload
  },
  props: {
    // which: {
    //   type: String,
    //   default: 'qn'
    // },
    limit: {
      type: Number,
      default: 1
    },
    auto: {
      type: Boolean,
      default: true
    },
    drag: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "img"
    },
    fileList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      which: "tx",
      postData: null,
      setting: {
        uploadUrl: "",
        imgUrl: ""
      },
      filelist: []
    };
  },
  async created() {
    this.filelist = this.fileList.map(url => ({ url: url }));
    console.log('this.filelist',this.filelist)
    // =================================================
    const FtpType = localStorage.getItem("FtpType");
    const postData = localStorage.getItem("postData");
    const setting = localStorage.getItem("setting");
    // 本地存在数据
    if (FtpType) {
      // 七牛云
      if (FtpType === "1") {
        // 本地存在token等数据
        if (postData && setting) {
          this.postData = JSON.parse(postData);
          // 本地token未过期
          if (
            JSON.parse(window.atob(this.postData.token.split(":")[2]))
              .deadline -
              800 >
            Math.floor(new Date().getTime() / 1000)
          ) {
            this.setting = JSON.parse(setting);
            this.which = "qn";
          }
          // 本地token存在，但过期了
          else {
            this.queryInit();
          }
        }
        // 本地不存在token等数据
        else {
          this.queryInit();
        }
      }
      // 腾讯云
      else {
        // 本地存在token等数据，且token未过期
        if (
          postData &&
          setting &&
          JSON.parse(postData).expiredTime - 800 >
            Math.floor(new Date().getTime() / 1000)
        ) {
          // console.log('本地')
          this.postData = JSON.parse(postData);
          this.setting = JSON.parse(setting);
          this.which = "tx";
        }
        // 其他情况
        else {
          this.queryInit();
        }
      }
    } else {
      this.queryInit();
    }
    // =================================================

    // this.queryInit()
  },
  methods: {
    async queryInit() {
      // console.log('query init')
      const res = await uploadFileServer();
      if (res.FtpType === 1) {
        // console.log('token', res.Token)
        this.postData = { token: res.Token };
        this.setting = {
          uploadUrl: res.uploadUrl,
          imgUrl: res.imgUrl
        };
        this.which = "qn";
      } else {
        this.postData = res.credential;
        this.setting = {
          Region: res.Region,
          Bucket: res.Bucket
        };
        this.which = "tx";
      }
      localStorage.setItem("FtpType", res.FtpType);
      localStorage.setItem("postData", JSON.stringify(this.postData));
      localStorage.setItem("setting", JSON.stringify(this.setting));
    },
    fileChange(filelist) {
      // console.log('中间层', filelist)
      this.$emit(
        "fileChange",
        filelist.map(e => e.url)
      );
    },
    submitFile(file, key) {
      this.$refs.upload.submitFile(file, key);
    }
  }
};
</script>

<style>
.hide .el-upload--picture-card {
  display: none;
}
</style>
