/* 班级实体类 */
class ClassEntity {
  constructor (obj) {
    if (obj === null || obj === undefined) {
      this.__constructorNull()
    } else if (typeof obj === 'object') {
      this.__constructor(obj)
    }
  }

  // 基础信息
  tid = null  // 学生id
  sex = '' // 学员性别
  name = '' // 学员姓名
  phone = '' // 学员电话
  nation = '' // 学员民族
  birthday = '' // 学员生日
  idCard = '' // 学员身份证号码
  schoolId = '' // 学员所属学校Id
  schoolName = '' // 学员所属学校名
  nativePlace = '' // 学员籍贯

  // 枚举信息
  education = '' // 学员教育程度
  educationTid = '' // 学员教育程度枚举
  personnelType = '' // 学员所属类型
  personnelTypeTid = '' // 学员所属类型Id
  personnelCategory = '' // 学员所属种类
  personnelCategoryTid = '' // 学员所属种类Id

  // 地址、文件信息
  headImg = '' // 学员头像
  idCardUrl = '' // 身份证正反面
  registerUrl = '' // 户口本正反面
  otherFileUrl = '' // 其它证明
  trainAddress = '' // 班级培训地址
  classAddress = '' // 办学地址

  __constructorNull () {}

  __constructor ({ tid, sex, name, phone, nation, birthday, idCard, headImg, schoolId, schoolName,
    nativePlace, education, educationTid, personnelType, personnelTypeTid, personnelCategory, personnelCategoryTid,
    idCardUrl, registerUrl, otherFileUrl, trainAddress, trainclassAddressPasaRate
  }) {
    this.tid = tid
    this.sex = sex
    this.name = name
    this.phone = phone
    this.nation = nation
    this.birthday = birthday
    this.idCard = idCard
    this.headImg = headImg
    this.schoolId = schoolId
    this.schoolName = schoolName
    this.nativePlace = nativePlace
    this.education = education
    this.educationTid = educationTid
    this.personnelType = personnelType
    this.personnelTypeTid = personnelTypeTid
    this.personnelCategory = personnelCategory
    this.personnelCategoryTid = personnelCategoryTid
    this.idCardUrl = idCardUrl
    this.registerUrl = registerUrl
    this.otherFileUrl = otherFileUrl
    this.trainAddress = trainAddress
    this.trainclassAddressPasaRate = trainclassAddressPasaRate
  }
}

export default ClassEntity
