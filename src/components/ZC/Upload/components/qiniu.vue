<template>
  <div>
    <el-upload
      ref="upload"
      :action="setting.uploadUrl"
      :class="{ hide: filelist.length >= limit }"
      :file-list="filelist"
      list-type="picture-card"
      :limit="limit"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-preview="handlePreview"
      :auto-upload="auto"
      :data="postDatas"
      :drag="drag"
      :disabled="disabled"
      multiple
    >
      <!--
      :http-request="uploadRequest" -->
      <i class="el-icon-plus" />
      <!-- <div v-if="drag" class="el-upload__text">
        将文件拖到此处，或<em>点击上传</em>
      </div> -->
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" append-to-body size="tiny">
      <img :src="dialogImageUrl" width="100%" alt />
    </el-dialog>
  </div>
</template>

<script>
import deletes from '../mixins/delete.js'
// import { uploadFileServer } from '@/api/qiniu'

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
      return this.date.getFullYear() + this.addZero(this.date.getMonth() + 1) + this.addZero(this.date.getDay())
    }

    /*
         * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933
         * 返回值：返回GUID日期格式的字条串
         */
    GUID.prototype.getGUIDTime = function() {
      return this.addZero(this.date.getHours()) + this.addZero(this.date.getMinutes()) + this.addZero(this.date.getSeconds()) + this.addZero(parseInt(this.date.getMilliseconds() / 10))
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
function getError(action, option, xhr) {
  let msg
  if (xhr.response) {
    msg = `${xhr.response.error || xhr.response}`
  } else if (xhr.responseText) {
    msg = `${xhr.responseText}`
  } else {
    msg = `fail to post ${action} ${xhr.status}`
  }

  const err = new Error(msg)
  err.status = xhr.status
  err.method = 'post'
  err.url = action
  return err
}

function getBody(xhr) {
  const text = xhr.responseText || xhr.response
  if (!text) {
    return text
  }

  try {
    return JSON.parse(text)
  } catch (e) {
    return text
  }
}
export default {
  name: 'QnUpload',
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
      default: () => ([])
    },
    postData: {
      type: Object,
      default: () => ({ token: '' })
    },
    setting: {
      type: Object,
      default: () => ({
        // // 上传地址
        // uploadUrl: 'https://upload.qiniup.com',
        // // 返回图片拼接地址
        // imgUrl: 'http://mall-imag.linxyun.com/'
      })
    }
  },
  data() {
    return {
      // 上传地址
      // uploadUrls: 'https://upload.qiniup.com',
      // 返回图片拼接地址
      // imgUrl: 'http://mall-imag.linxyun.com/',
      postDatas: {
        token: '',
        key: ''
      },

      filelist: [],
      dialogImageUrl: '',
      dialogVisible: false,

      count: 0

    }
  },
  watch: {
    filelist: {
      handler() {
        // console.log('下层', this.filelist)
        if (this.auto) {
          this.$emit('fileChange', this.filelist.filter(e => !e.url.includes('blob:')))
        } else {
          if (this.count && this.count === this.filelist.length) {
            this.count = 0
            this.$emit('fileChange', this.filelist.filter(e => !e.url.includes('blob:')))
          }
        }
      },
      deep: true
    }
  },
  created() {
    this.postDatas = {
      ...this.postData
    }
    this.filelist = [... this.fileList]
  },
  methods: {

    uploadRequest(option) {
      console.log('option', option)
      if (typeof XMLHttpRequest === 'undefined') {
        return
      }

      const xhr = new XMLHttpRequest()
      const action = option.action

      // if (xhr.upload) {
      //   xhr.upload.onprogress = function progress(e) {
      //     if (e.total > 0) {
      //       e.percent = e.loaded / e.total * 100
      //     }
      //     option.onProgress(e)
      //   }
      // }

      const formData = new FormData()
      if (option.data) {
        Object.keys(option.data).forEach(key => {
          formData.append(key, option.data[key])
        })
      }
      if (!option.data.key) { formData.append('key', (new GUID()).newGUID()) }

      formData.append(option.filename, option.file, option.file.name)

      xhr.onerror = function error(e) {
        option.onError(e)
      }

      xhr.onload = function onload() {
        if (xhr.status < 200 || xhr.status >= 300) {
          return option.onError(getError(action, option, xhr))
        }
        // console.log('getBody(xhr)', xhr, getBody(xhr))
        option.onSuccess(getBody(xhr))
      }

      xhr.open('post', action, true)

      if (option.withCredentials && 'withCredentials' in xhr) {
        xhr.withCredentials = true
      }

      const headers = option.headers || {}

      for (const item in headers) {
        if (headers.hasOwnProperty(item) && headers[item] !== null) {
          xhr.setRequestHeader(item, headers[item])
        }
      }
      xhr.send(formData)
      return xhr
    },
    getImgUrl(res, file, fileList) {
      return this.setting.imgUrl + res.key
    },

    async beforeUpload(file) {
      console.log('before upload')
      if ((this.type === 'text')) return true
      if (!this.postData.token) {
        throw new Error('token 过期')
      }

      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 2048 / 2048 < 4
      if (!isJPG) { this.$message.error('上传图片只能是 JPG 格式!'); return false }
      if (!isLt2M) { this.$message.error('上传图片大小不能超过 4MB!'); return false }
      return isJPG && isLt2M
    },

    handleRemove(file, filelist) {
      this.deleteImg(file.url)
      this.filelist = filelist
    },

    handleSuccess(res, file, filelist) {
      console.log('success')

      file.url = this.getImgUrl(res)
      this.filelist = filelist
      this.count++
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

    async submitFile(file, keys) {
      // let theKey = null
      if (keys) {
        const ress = await this.deleteImg(keys)
        console.log('res', ress)
        // theKey = keys.split('/').pop()
      }

      console.log('qn submit', file)
      const that = this
      const option = {
        file: file,
        data: {
          ...this.postData,
          key: (new GUID()).newGUID()
        },
        filename: 'file',
        action: this.setting.uploadUrl,
        onSuccess: res => {
          this.handleSuccess(res)
          // delete this.reqs[uid];
        },
        onError: err => {
          this.handleError(err)
          // delete this.reqs[uid];
        }
      }

      if (typeof XMLHttpRequest === 'undefined') {
        return
      }

      const xhr = new XMLHttpRequest()
      const action = option.action

      const formData = new FormData()

      if (option.data) {
        Object.keys(option.data).forEach(key => {
          formData.append(key, option.data[key])
        })
      }

      formData.append(option.filename, option.file)

      xhr.onerror = function error(e) {
        option.onError(e)
      }

      xhr.onload = function onload() {
        if (xhr.status < 200 || xhr.status >= 300) {
          return option.onError(getError(action, option, xhr))
        }
        console.log(getBody(xhr), file, that.filelist)
        that.filelist.push({ file, url: that.getImgUrl(getBody(xhr)) })
        that.handleSuccess(getBody(xhr), { file }, that.filelist)
      }

      xhr.open('post', action, true)
      xhr.send(formData)
      return xhr
    }
  }
}
</script>

