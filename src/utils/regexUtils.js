/** 一些正则验证 **/

// 验证是否时中文姓名, 长度 2 ~ 10
const isCZName = (str) => {
  return /^[\u4e00-\u9fa5]{2,10}$/.test(str)
}

// 验证是否是身份证
const isIdCard = (str) => {
  return /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(str)
}

// 验证年龄
const isAgeRange = (str, range = { min: 0, max: 120 }) => {
  return parseInt(str) >= range.min && parseInt(str) <= range.max
}

// 验证是否是电话号码 - 做简单校验，防止后期很多出错
const isPhone = (str) => {
  return /^1[0-9]{10}$/.test(str)
}

// 非中文密码：非中文 ，长度6 ~ 16位
const isNotCzPwd = (str) => {
  return /^[^\u4e00-\u9fa5]{6,16}$/.test(str)
}

const RegexUtils = {
  isCZName,
  isIdCard,
  isAgeRange,
  isPhone,
  isNotCzPwd
}

export default RegexUtils
