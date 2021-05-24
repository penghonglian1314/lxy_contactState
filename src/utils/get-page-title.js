// 设置网页标题
// 在 @/permission.js 中使用
import defaultSettings from '@/settings.js'

const title = defaultSettings.title || ''

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
