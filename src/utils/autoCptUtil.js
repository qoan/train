/** 信息自动识别生成 **/

import { PROVICE } from '@/data/nationEnum'

// 根据身份证号码识别性别
const getSexByIdCard = (idCard) => {
  return parseInt(idCard.charAt(16)) % 2 ? '1' : '2'
}

// 根据身份证号码识别年龄
const getAgeByIdCard = (idCard) => {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  return year - parseInt(idCard.slice(6, 10)) - (month <= parseInt(idCard.slice(10, 12)))
}

// 根据身份证号码识别出生年月日
const getBirthByIdCard = (idCard) => {
  return `${idCard.slice(6, 10)}-${idCard.slice(10, 12)}-${idCard.slice(12, 14)}`
}

// 根据身份证号码识别籍贯 - 只具体到省级
const getAareByIdCard = (idCard) => {
  return PROVICE[idCard.slice(0, 2)]
}

const AutoCptUtil = {
  getSexByIdCard,
  getAgeByIdCard,
  getAareByIdCard,
  getBirthByIdCard
}

export default AutoCptUtil
