const baseURL = 'http://traininggatewaydev.gshbzw.com'
const school = `${baseURL}/training-provider-school/school`
const clazz = `${baseURL}/training-provider-clazz`
const teacher = `${baseURL}/training-provider-teacher`
const listOption = `${baseURL}/training-provider-enumer/enumer`
const listOption1 = `${baseURL}/training-provider-enumer`
const area = `${baseURL}/training-provider-area/area`
const agence = `${baseURL}/training-provider-agence/agence`
const student = `${baseURL}/training-provider-student`
const inspection = `${baseURL}/training-provider-inspection/inspection`
const file = `${baseURL}/training-provider-file/file`
const job = `${baseURL}/training-provider-job/job`
const job2 = `${baseURL}/training-provider-job/getjob`
const employment = `${baseURL}/training-provider-employment/employment`
const device = `${baseURL}/training-provider-device/device`
const check = `${baseURL}/training-provider-check/check`
const account = `${baseURL}/training-provider-account/account`
const statistics = `${baseURL}/training-provider-statistics/common`
const statisticsJob = `${baseURL}/training-provider-statistics/job/statistics`
const excel = `${baseURL}/training-provider-excel/excel`

const api = {
  /* 学校相关接口 */
  findById: `${school}/getByTid`, // 根据ID获取单个学校信息
  save: `${school}/save`, // 新增学校
  update: `${school}/update`, // 更新学校信息
  selectPage: `${school}/selectPage`, // 学校分页查询
  querySchoolList: `${school}/selectSlaveSchoolInfo`, // 获取所有学校列表
  selectSchoolEnum: `${school}/selectSchoolEnum`, // 获取管理学校枚举值

  /* 班级相关接口 */
  classSelectPage: `${clazz}/class/selectPage`, // 班级分页查询
  getClassDetail: `${clazz}/class/findById/`, // 获取班级详细信息
  getClassTeacher: `${clazz}/class/classSchoolAndTeacher/`, // 根据班级查询班级人数和任课老师
  getClassStdent: `${clazz}/class/pageClassStudent`, // 根据班级ClassId查询班级学生列表  --- 分页
  addNewClass: `${clazz}/class/save`, // 新增班级
  classCountByScholl: `${clazz}/school/classCountByScholl/`, // 学校开班统计
  getSchoolsAllClass: `${clazz}/class/getSchoolsAllClass/`, // 根据学校查询所有的班级
  addStdToClass: `${clazz}/class/addStudent`, // 从学校空闲列表中择取学生到班级中列表中
  getTrainTotalDaysByClassId: `${clazz}/class/getTrainTotalDaysByClassId/`, // 通过课程id 查询课程的培训时长
  editClass: `${clazz}/class/editClass`, // 编辑班级信息
  selectList: `${clazz}/class/selectList/`, // 根据学校查询所有班级
  selectClazzThisJobNotPush: `${clazz}/class/selectClazzThisJobNotPush/`, // 查询没有被推荐的班级
  getClassCountDataBySchoolId: `${clazz}/class/getClassCountDataBySchoolId/`, // 通过学校id查询学校的培训开班数 培训人数 合格率 等
  delClassById: `${clazz}/class/delClassById/`, // 根据ID删除班级
  deleteStudentFromClassById: `${clazz}/student/deleteStudentFromClassById/`, // 从班级列表删除学生
  findTrainCountbyClassId: `${clazz}/class/findTrainCountbyClassId/`, // 根据班级id获取四种人数
  findTrueCountbyClassId: `${clazz}/class/findTrueCountbyClassId/`, // 根据班级id获取四种人数（真实）
  savaOrUpdateTrainCount: `${clazz}/class/savaOrUpdateTrainCount`, //  单个插入(无id是插入 有id 是修改)
  getPassCount: `${clazz}/school/getPassCount/`, // 根据班级id获取合格人数

  /* 学员相关 */
  getStudentInfo: `${student}/student/findStudentById/`, // 根据studentId获取学员详细信息
  getClassStdList: `${student}/student/pageStudent`, // 根据班级classId获取班级学员列表
  getStdListBySchoolId: `${student}/student/pageStudentBySchoolId`, // 根据学校Id获取班级学员列表
  addNewStdtoClass: `${student}/student/addClassStudent`, // 添加新学员到班级
  deleteStdFromClass: `${student}/student/deleteStudentFromClassById`, // 删除学生从班级
  deleteStudentById: `${student}/student/deleteStudentById/`, // 根据ID删除学员
  editClassStudent: `${student}/student/editClassStudent`, // 编辑学生信息
  findStudentTrainDataList: `${student}/student/findStudentTrainDataList/`, // 根据学员id查询学员培训记录

  /* 教师相关 */
  getTeacherListBySchoolId: `${teacher}/teacher/selectClassTeacherOrNotBusyTeacher`, // 获取根据学校id获取所有教师
  getTeacherSelectPage: `${teacher}/teacher/selectPage`, //  教师分页查询
  getTeacherInfoById: `${teacher}/teacher/findById/`, //  教师分页查询
  addNewTeacher: `${teacher}/teacher/save`, //  教师分页查询
  deleteTeacher: `${teacher}/teacher/deleteTeacherById/`, // 删除教师
  editTeacher: `${teacher}/teacher/editTeacher/`, // 修改老师

  /* 地址相关 */
  area: `${area}/getByCode/`, // 拉取本级地区信息,并且可以查询父级code
  subArea: `${area}/getByPreCode/`, // 根据父级code获取下级地区信息

  /* 下拉类型相关 */
  //
  /* 枚举Key值：
  (学校类型)school_type
  (工作类型)work_type
  (行业等级)train_leave
  (培训级别)personnel_type
  (人员种类)personnel_category
  (文化程度)education
  (就业渠道)getjob_type
  */
  selectOption: `${listOption}/getByKey/`,
  saveRizhi: `${listOption1}/versionLog/save/`, // 单个插入(无id是插入 有id 是修改)
  getRizhiByTid: `${listOption1}/versionLog/getByTid/`, // 根据id获取日志
  pageVersionLog: `${listOption1}/versionLog/pageVersionLog/`, // 分页查询日志信息
  delete: `${listOption1}/versionLog/delete/`, // 删除

  /* 政府机构相关服务 */
  getAgenceList: `${agence}/getAgenceList`, // 获取政府机构列表

  /* 巡检相关 */
  pageInspectionList: `${inspection}/pageInspectionList`, // 获取巡检列表
  saveInspection: `${inspection}/saveInspection`, // 插入巡检信息
  selectInspectionByInspectionTid: `${inspection}/selectInspectionByInspectionTid/`, // 跟据巡检Tid获取巡检信息
  deleteInspectionByTid: `${inspection}/deleteInspectionByTid/`, // 删除巡检信息
  saveInspectionRecord: `${inspection}/saveInspectionRecord`, // 插入巡检记录
  selectInspectionRecordByInspectionTid: `${inspection}/selectInspectionRecordByInspectionTid/`, // 跟据巡检Tid获取巡检记录
  updateInspectionRecordByTid: `${inspection}/updateInspectionRecordByTid/`, // 跟据巡检Tid更新巡检记录
  deleteInspectionRecordByTid: `${inspection}/deleteInspectionRecordByTid/`, // 删除巡检记录

  /* 文件服务 */
  uploadImage: `${file}/uploadImage`,

  /* 账号相关 */
  getGovAccountList: `${agence}/pageAgenceList`, // 获取政府总账号 - 分页
  addGovAccount: `${agence}/saveAgence`, // 添加政府总账号
  getGovManagerList: `${agence}/getAgenceManageList`, // 获取政府管理员列表
  addGovManager: `${agence}/saveAgenceManage`, // 添加政府管理员
  getSchoolAccountList: `${account}/pageSchoolAccountList`, // 获取学校总账号
  addSchoolAccount: `${school}/saveMasterSchool`, // 添加学校总账号
  accountLogin: `${account}/login`, // 账号登录
  getMasrerSchoolList: `${school}/pageMasterSchool`, // 获取总校列表
  getSlaveSchoolList: `${school}/selectSlaveSchoolInfo`, // 获取分校列表
  addSlaveSchoolAccount: `${school}/saveSlaveSchool`, // 添加分校
  getSlaveSchoolManager: `${school}/selectSchoolManage/`, // 获取分校管理员列表
  addSlaveSchoolManager: `${school}/saveSchoolManage`, // 添加分校管理员
  updateSlaveSchoolInfo: `${school}/updateSlaveSchoolInfo`, // 编辑分校信息
  updatePassword: `${account}/updatePassword`, // 修改密码

  /* 岗位相关 */
  saveJob: `${job}/saveJob`, // 插入岗位信息
  deleteJob: `${job}/deleteJob`, // 删除岗位信息
  updateJob: `${job}/updateJob`, // 更新岗位信息,
  pageJob: `${job}/pageJob`, // 分面查询岗位信息
  getByTid: `${job}/getByTid/`, // 跟据tid获取岗位信息
  queryJobPush: `${job}/queryJobPush/`, // 岗位推荐
  queryJobPushListByJobTid: `${job}/queryJobPushListByJobTid/`, // 跟据岗位tid分页获取推荐记录列表
  queryPushClazzList: `${job}/queryPushClazzList/`, // 获取推荐班级列表
  getJobListByStudentId: `${job2}/getJobListByStudentId/`, // 根据学员id获取就业信息
  saveGetJob: `${job2}/saveGetJob/`, // 插入就业信息
  updateGetJob: `${job2}/updateGetJob/`, // 修改就业信息
  jobPushTop: `${job}/jobPushTop/`, // 根据班级id获取岗位推荐

  /* 就业相关 */
  queryEmploymentIntentionList: `${employment}/queryEmploymentIntentionList/`, // 查询就业意向学员列表
  queryUnemploymentList: `${employment}/queryUnemploymentList/`, // 查询未就业学员列表

  /* 设备相关 */
  bind: `${device}/class/bind/`, // 设备绑定
  change: `${device}/class/change/`, // 更换
  pageDeviceClass: `${device}/class/pageDeviceClass/`, // 分页查询设备班级绑定
  relet: `${device}/class/relet/`, // 续租/重新绑定
  updateState: `${device}/class/updateState/`, // 停用/恢复设备
  getFreeDevice: `${device}/class/getFreeDevice`, // 获取空闲设备
  getFreeClass: `${device}/class/getFreeClass`, // 获取班级列表

  deviceSave: `${device}/save/`, // 新增设备
  deviceDelete: `${device}/delete/`, // 删除设备
  deviceUpdate: `${device}/update/`, // 修改设备
  pageDevice: `${device}/pageDevice/`, // 分页查询设备租用

  /* 考勤相关 */
  checkCountByState: `${check}/checkCountByState/`, // 获取班级当天考勤异常人数
  checkIn: `${check}/checkIn/`, // 考勤打卡
  checkPageByStudent: `${check}/checkPageByStudent/`, // 分页查询学员考勤信息
  checksByDay: `${check}/checksByDay/`, // 获取学员某天考勤信息
  checksCountNow: `${check}/checksCountNow/`, // 获取学员当月考勤天数
  pageCheckTodayClass: `${check}/pageCheckTodayClass/`, // 分页查询班级今日考勤信息
  pageCheckTodayStudent: `${check}/pageCheckTodayStudent`, // 分页查询学员今日考勤信息
  pageStudentCheckByClass: `${check}/pageStudentCheckByClass/`, // 根据班级获取学员考勤信息
  processStuCheck: `${check}/processStuCheck/`, // 一键恢复学员考勤
  getCheckDateListByClass: `${check}/getCheckDateListByClass/`, // 获取班级考勤记录日期集合
  getCheckDateListByStu: `${check}/getCheckDateListByStu/`, // 获取学员考勤记录日期集合

  /* 考勤统计 */
  checkCountOnDay: `${check}/statis/checkCountOnDay/`, // 每日培训人数趋势
  checkOnTime: `${check}/statis/checkOnTime/`, // 实时考勤信息展示
  classCheckCount: `${check}/statis/classCheckCount/`, // 各班级考勤情况统计
  getCheckCountToday: `${check}/statis/getCheckCountToday/`, // 获取今日应到人数/今日实到人数/考勤班级数/考勤异常数

  /* 综合统计 */
  countInfo: `${statistics}/countInfo`, // 查询培训人数等
  trainCheckOnTop: `${statistics}/trainCheckOnTop`, // 培训班级考勤里top6
  trainDaysData: `${statistics}/trainDaysData`, // 查询每日培训趋势
  trainPersonnelTypeData: `${statistics}/trainPersonnelTypeData`, // 培训人员类别同比
  trainWorkTypeData: `${statistics}/trainWorkTypeData`, // 职业技能课程占比
  trainClassAndEmpData: `${statistics}/trainClassAndEmpData`, // 结业班级就业分析

  /* 学校统计 */
  // getSchoolTrainPersonData: `${statistics}/getTrainClassAndStudent/`, // 培训人员类别同比

  /* 岗位统计 */
  getClazz: `${statisticsJob}/getClazz/`, // 统计岗位推荐的班级总数
  getStudent: `${statisticsJob}/getStudent/`, // 统计岗位推荐的学生总数
  getEmploymentRateByClass: `${statisticsJob}/getEmploymentRateByClass/`, // 获取班级就业率,
  getEmploymentRateBySchool: `${statisticsJob}/getEmploymentRateBySchool`, // 获取学校就业率（政府，总校）,
  getEmploymentRateBySchoolSmall: `${statisticsJob}/getEmploymentRateBySchoolSmall/`, // 获取学校就业率（分校）,

  /* 导入导出相关 */
  exportExcel: `${excel}/exportExcel`, // 根据班级id导出学员花名册
  exportStudentScore: `${excel}/exportStudentScore`, // 根据班级id导出学员成绩表
  studentInport: `${excel}/studentInport`, // 导入学生花名册
  studentScoreInport: `${excel}/studentScoreInport/`, // 导入学生成绩
  exportMod: `${excel}/exportMod`, // 下载学员导入模板
  exportTrainPay: `${excel}/exportTrainPay`, // 导出培训经费申请表
  classInport: `${excel}/studentInportWithClass/`, // 导入学生花名册到班级

  /* 工种管理 */
  deleteWorkType: `${listOption}/workType/delete/`, // 根据id删除工种
  saveWorkType: `${listOption}/workType/save`, // 单个插入(无id是插入 有id 是修改)
  workTypeChildList: `${listOption}/workType/workTypeChildList/`, // 根据一级工种id获取二级工种列表
  workTypeList: `${listOption}/workType/workTypeList/` // 获取一级工种列表
}

export default api
