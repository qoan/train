/* 获取枚举工具 - 后台存在很多枚举, 此处统一获取和处理 */

// 获取多个枚举
const getEnumList = (enumList) => {
  let data = {}
  enumList.forEach(key => {
    data[key] = JSON.parse(sessionStorage.getItem(key) || '[]')
  })
  return data
}

// 获取单个枚举
const getEnum = (key) => {
  return JSON.parse(sessionStorage.getItem(key) || '[]')
}

// 根据枚举tid获取对应的枚举值
const getEnumValue = (enumList, tid) => {
  return enumList.find(item => item.tid === tid).enumerValue
}

export default {
  getEnumList,
  getEnum,
  getEnumValue
}
