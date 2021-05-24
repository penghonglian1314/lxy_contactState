import { uploadFileServer,deleteFileServer } from '@/api/upload'
// import { setting } from '@/api/tencent'
import COS from 'cos-js-sdk-v5' // 脚手架安装

export default {
  methods: {
    async deleteImg(url) {
      if (url && !url.includes('blob')) {
        if (url.includes('myqcloud')) {
          let cos = null
          console.log('try delete tencent file')
          const res = await uploadFileServer()
          let setting = {
            Region: res.Region,
            Bucket: res.Bucket
          }
          if (res.FtpType === 2) {
            const postData = res.credential
            cos = new COS({
              getAuthorization: function(options, callback) {
                callback({
                  TmpSecretId: postData.credentials.tmpSecretId,
                  TmpSecretKey: postData.credentials.tmpSecretKey,
                  XCosSecurityToken: postData.credentials.sessionToken,
                  // ========
                  StartTime: postData.startTime,
                  ExpiredTime: postData.expiredTime
                })
              }
            })
          } else {
            console.log('token错误')
          }
          try {
            cos.deleteObject({
              ...setting,
              Key: url /* 必须 */
            }, function(err, data) {
              console.log(err || data)
            })
          } catch (error) {
            console.log('图片不存在', error)
          }
        } else {
          let key = ''
          if (url.includes('com/')) {
            key = url.split('com/')[1]
          } else {
            key = url
          }
          try {
            console.log('try delete qiniu file')
            deleteFileServer({ FileID: key })
          } catch (error) {
            console.log('图片不存在', error)
          }
        }
      }
    }
  }}
