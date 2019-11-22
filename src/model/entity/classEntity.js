/* 班级实体类 */
class ClassEntity {
  constructor(obj) {
    if (obj === null || obj === undefined) {
      this.__constructorNull()
    } else if (typeof obj === 'object') {
      this.__constructor(obj)
    }
  }

  // 基础信息
  tid = null // 班级id
  className = null // 班级名
  schoolId = null // 班级所属学校id
  schoolName = null // 班级所属学校名
  studentCount = null // 班级学生数量
  theoryCount = null // 班级培训理论课时
  practiceCount = null // 班级培训实操课时
  classTable = null // 班级课程表
  theoryTeacher={
    teacherId: 0,
    teacherName: '',
    classType: 0
  }
  practiceTeacher={
    teacherId: 0,
    teacherName: '',
    classType: 0
  }
  classTime = [] // 培训时间
  classBeginTime = null // 班级培训上课起始时间
  classOverTime = null // 班级培训上课结束时间
  trainDate = [] // 培训日期
  trainDateStart = null // 班级培训结束日期
  trainDateEnd = null // 班级培训开始日期
  trainType = null// 培训类别
  classType = null// 培训类别

  // 枚举类型
  workType = ''  // 培训工种
  workTypeTid = -1 // 培训工种Id
  trainLevel = '' // 班级培训技能等级 初级 中级  高级
  trainLevelTid = -1 // 班级培训技能Id

  // 统计信息
  actualGoStdCount = null // 实到人数
  trainPasaRate = 0 // 培训合格率

  // 地址相关
  trainAddress = null // 班级培训地址
  classAddress = null // 办学地址
  classAreacode = null // 办学地址最后一级地址码
  areaAddress = { // 暂时用于地址回显的问题, 后期去掉
    province: '',
    city: '',
    county: '',
    district: '',
    village: '',
    fullName: '',
    lastLevel: ''
  }

  __constructorNull() { }

  __constructor({ tid, className, schoolId, schoolName, studentCount, theoryCount, practiceCount, timetableUrl,
    workType, workTypeTid, teacherName, trainAddress, areacodeAddress, areacode, trainLevel, trainLevelTid, classBeginTime,
    classOverTime, trainDateEnd, trainDateStart, checkCount, trainPasaRate, trainType, classType
  }) {
    this.tid = tid
    this.className = className
    this.schoolId = schoolId
    this.schoolName = schoolName
    this.studentCount = studentCount
    this.theoryCount = theoryCount
    this.practiceCount = practiceCount
    this.classTable = timetableUrl
    this.workType = workType
    this.workTypeTid = workTypeTid
    this.teacherList = teacherName
    this.trainAddress = trainAddress
    this.classAddress = areacodeAddress
    this.classAreacode = areacode
    this.trainLevel = trainLevel
    this.trainLevelTid = trainLevelTid
    this.classBeginTime = classBeginTime
    this.classOverTime = classOverTime
    this.classTime = [classBeginTime, classOverTime]
    this.trainDateStart = trainDateStart
    this.trainDateEnd = trainDateEnd
    this.trainDate = [trainDateStart, trainDateEnd]
    this.actualGoStdCount = checkCount
    this.trainPasaRate = trainPasaRate
    this.trainType = trainType
    this.classType = classType
  }
}

export default ClassEntity
