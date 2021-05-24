<template>
  <div>
    <el-upload
      ref="upload"
      action="#"
      :class="{ hide: filelist.length >= limit }"
      :file-list="filelist"
      list-type="picture-card"
      :limit="limit"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-preview="handlePreview"
      :on-exceed="handleExceed"
      :http-request="uploadRequest"
      :auto-upload="auto"
      :drag="drag"
      :disabled="disabled"
      multiple
    >
      <div v-if="drag" class="el-upload__text">
        将文件拖到此处，或<em>点击上传</em>
      </div>
      <i v-else class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" append-to-body size="tiny">
      <img :src="dialogImageUrl" width="100%" alt>
    </el-dialog>
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5' // 脚手架安装

// import { setting } from '@/api/tencent'
import deletes from '../mixins/delete.js'

function GUID() {
  this.date = new Date()

  /* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
  if (typeof this.newGUID !== 'function') {
    /* 生成GUID码 */
    GUID.prototype.newGUID = function() {
      this.date = new Date()
      let guidStr = ''
      const sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16)
      const sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16)
      for (let i = 0; i < 9; i++) {
        guidStr += Math.floor(Math.random() * 16).toString(16)
      }
      guidStr += sexadecimalDate
      guidStr += sexadecimalTime
      while (guidStr.length < 32) {
        guidStr += Math.floor(Math.random() * 16).toString(16)
      }
      return this.formatGUID(guidStr)
    }
    /*
     * 功能：获取当前日期的GUID格式，即8位数的日期：19700101
     * 返回值：返回GUID日期格式的字条串
     */
    GUID.prototype.getGUIDDate = function() {
      return (
        this.date.getFullYear() +
        this.addZero(this.date.getMonth() + 1) +
        this.addZero(this.date.getDay())
      )
    }

    /*
     * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933
     * 返回值：返回GUID日期格式的字条串
     */
    GUID.prototype.getGUIDTime = function() {
      return (
        this.addZero(this.date.getHours()) +
        this.addZero(this.date.getMinutes()) +
        this.addZero(this.date.getSeconds()) +
        this.addZero(parseInt(this.date.getMilliseconds() / 10))
      )
    }

    /*
     * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现
     * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串
     * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串
     */
    GUID.prototype.addZero = function(num) {
      if (Number(num).toString() !== 'NaN' && num >= 0 && num < 10) {
        return '0' + Math.floor(num)
      } else {
        return num.toString()
      }
    }

    /*
     * 功能：将y进制的数值，转换为x进制的数值
     * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10
     * 返回值：返回转换后的字符串
     */
    GUID.prototype.hexadecimal = function(num, x, y) {
      if (y !== undefined) {
        return parseInt(num.toString(), y).toString(x)
      } else {
        return parseInt(num.toString()).toString(x)
      }
    }
    /*
     * 功能：格式化32位的字符串为GUID模式的字符串
     * 参数：第1个参数表示32位的字符串
     * 返回值：标准GUID格式的字符串
     */
    GUID.prototype.formatGUID = function(guidStr) {
      const str1 = guidStr.slice(0, 8)
      const str2 = guidStr.slice(8, 12)
      const str3 = guidStr.slice(12, 16)
      const str4 = guidStr.slice(16, 20)
      const str5 = guidStr.slice(20)
      return str1 + str2 + str3 + str4 + str5
    }
  }
}

export default {
  name: 'TxUpload',
  mixins: [deletes],
  props: {
    limit: {
      type: Number,
      default: 1
    },
    auto: {
      type: Boolean,
      default: false
    },
    drag: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'img'
    },
    fileList: {
      type: Array,
      default: () => []
    },
    postData: {
      type: Object,
      default: () => ({})
    },
    setting: {
      type: Object,
      default: () => ({
        Bucket: '',
        Region: ''
      })
    }
  },
  data() {
    return {
      filelist: [],
      dialogImageUrl: '',
      dialogVisible: false,

      count: 0,
      key: new GUID().newGUID(),
      length: 0
    }
  },
  watch: {
    filelist() {
      // console.log('下层', this.filelist)
      if (this.auto) {
        this.$emit('fileChange', this.filelist)
      } else {
        if (this.count && this.count === this.filelist.length) {
          this.count = 0
          this.$emit('fileChange', this.filelist)
        }
      }
    }
  },
  created() {
    this.filelist = [...this.fileList]
  },

  methods: {
    beforeUpload(file) {
      this.length++
      if ((this.type === 'text')) return true
      this.key = new GUID().newGUID()
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
        return false
      }
      if (isJPG && isLt2M) {
        // this.filelist.push({ ...file })
        return true
      }
    },
    handleRemove(file, filelist) {
      this.deleteImg(file.url)
      this.filelist = filelist
    },
    handleSuccess(res, file, filelist) {
      console.log('success', res, file, filelist)
      this.count++
      //   return  this.getImgUrl(res)
    },
    handleError(err) {
      this.$message({ type: 'error', message: '上传图片失败！' })
      throw new Error(err)
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleExceed() {
      this.$message({
        type: 'info',
        message: '上传图片数量超过上限'
      })
    },
    uploadRequest() {
      const that = this
      const afile = arguments[0].file
      // if (!this.beforeUpload(afile)) {
      //   // this.$message({ type: 'fail', message: '文件类型错误!' })
      //   return
      // }
      const cos = new COS({
        getAuthorization: function(options, callback) {
          callback({
            TmpSecretId: that.postData.credentials.tmpSecretId,
            TmpSecretKey: that.postData.credentials.tmpSecretKey,
            XCosSecurityToken: that.postData.credentials.sessionToken,
            // ========
            StartTime: that.postData.startTime,
            ExpiredTime: that.postData.expiredTime
          })
        }
      })
      if (arguments[0].key) this.key = arguments[0].key
      console.log('that', that.key)
      cos.putObject(
        {
          ...that.setting,
          Key: this.key,
          StorageClass: 'STANDARD',
          Body: afile, // 上传文件对象
          onProgress: function(progressData) {
            // console.log('cos onProgress', progressData)
          }
        },
        function(err, data) {
          console.log('put obj', err || data)
          if (data && data.statusCode === 200) {
            that.filelist.push({ ...afile, url: that.getImgUrl(data) })
            // console.log(that.getImgUrl(data))
            // console.log(that.filelist, afile, that.filelist.filter(e => e.uid === afile.uid))
            // Object.assign(that.filelist.filter(e => e.uid === afile.uid)[0], { ...afile }, { url: that.getImgUrl(data) })
            // that.filelist.filter(e => e.uid === afile.uid)[0] = { ...afile, url: that.getImgUrl(data) }
            // that.filelist.filter(e => e.uid === afile.uid)[0].url = that.getImgUrl(data)

            that.handleSuccess(data, afile, that.filelist)
          } else {
            that.handleError(data)
          }
        }
      )
    },
    getImgUrl(res) {
      return 'http://' + res.Location
    },
    submitFile(file, key) {
      // this.key =key? key.split('/').pop()
      // console.log('uploadFiles', this.$refs.upload)
      this.uploadRequest({
        file: file,
        key: key ? key.split('/').pop() : null
      })
    }
  }
}
</script>

