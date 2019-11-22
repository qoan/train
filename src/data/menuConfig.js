/**
 * 根据登录身份配置菜单侧边栏 - 暂时由前端控制
 * 类型： 1.超级管理员   2.政府总账号管理员   3.学校总账号管理员   4.政府分支管理员  5.学校分帐号管理员
 */

const MODULE_COMPREHENSIVE = 'module_comprehensive'
const MODULE_SCHOOL_MANAGE = 'module_school_manage'
const MODULE_CLASS_MANAGE = 'module_class_manage'
const MODULE_STUDENT_MANAGE = 'module_student_manage'
const MODULE_TEACHER_MANAGE = 'module_teacher_manage'
const MODULE_ATTENDANCE_MANAGE = 'module_attendance_manage'
const MODULE_EMPLOYMENT_MANAGE = 'module_employment_manage'
const MODULE_GOV_ORGANIZATION = 'module_gov_organization'
const MODULE_SCHOOL_ORGANIZATION = 'module_school_organization'
const MODULE_GOV_ACCOUNT = 'module_gov_account'
const MODULE_SCHOOL_ACCOUNT = 'module_school_account'
const MODULE_NEWNOTE_ACCOUNT = 'module_newnote_account'
const MODULE_DEVICE_MANAGE = 'module_device_manage'
const MODULE_EXPORT = 'module_export'
const MODULE_PATROL = 'module_patrol'
const MODULE_WORK_TYPE = 'module_work_type'

const MODULE_LIST = {
  [MODULE_COMPREHENSIVE]: {
    icon: 'iconfont icon-zhonghe',
    index: '/comprehensive',
    title: '综合管理'
  },
  [MODULE_SCHOOL_MANAGE]: {
    icon: 'iconfont icon-shcool-manage',
    index: '/school',
    title: '学校管理'
  },
  [MODULE_CLASS_MANAGE]: {
    icon: 'iconfont icon-class-manage',
    // index: '3',
    index: '/class',
    title: '班级管理'
    // subs: [
    //   {
    //     index: '/class',
    //     title: '班级管理'
    //   }
    //   /*
    //   {
    //     index: '/class/chart',
    //     title: '班级统计'
    //   }
    //   */
    // ]
  },
  [MODULE_STUDENT_MANAGE]: {
    icon: 'iconfont icon-std-manage',
    // index: '4',
    index: '/student',
    title: '学员管理'
    // subs: [
    //   {
    //     index: '/student',
    //     title: '学员管理'
    //   }
    //   /*
    //   {
    //     index: '/student/chart',
    //     title: '学员统计'
    //   }
    //   */
    // ]
  },
  [MODULE_TEACHER_MANAGE]: {
    icon: 'iconfont icon-teacher-manager',
    index: '/teacher',
    title: '教师管理'
  },
  [MODULE_ATTENDANCE_MANAGE]: {
    icon: 'iconfont icon-attendance',
    // index: '6',
    index: '/check',
    title: '考勤管理'
    // subs: [
    //   {
    //     index: '/check',
    //     title: '考勤管理'
    //   }
    //   // {
    //   //   index: '/check/chart',
    //   //   title: '考勤统计'
    //   // }

    // ]
  },
  [MODULE_EMPLOYMENT_MANAGE]: {
    icon: 'iconfont icon-job',
    index: '7',
    title: '就业管理',
    subs: [
      {
        index: '/employment/unEmployment',
        title: '未就业人员'
      },
      {
        index: '/employment/wantEmployment',
        title: '就业意向人员'
      },
      {
        index: '/employment/infoPush',
        title: '就业推送'
      }
    ]
  },
  [MODULE_GOV_ORGANIZATION]: {
    icon: 'iconfont icon-organization',
    index: '/organization/govenment',
    title: '政府组织架构管理'
  },
  [MODULE_SCHOOL_ORGANIZATION]: {
    icon: 'iconfont icon-organization',
    index: '/organization/school',
    title: '学校组织架构管理'
  },
  [MODULE_GOV_ACCOUNT]: {
    icon: 'iconfont icon-govenment',
    index: '/account/govenment',
    title: '政府账号管理'
  },
  [MODULE_SCHOOL_ACCOUNT]: {
    icon: 'iconfont icon-school-manage',
    index: '/account/school',
    title: '学校账号管理'
  },
  [MODULE_NEWNOTE_ACCOUNT]: {
    icon: 'iconfont icon-school-manage',
    index: '/account/newnote',
    title: '系统更新日志'
  },
  [MODULE_DEVICE_MANAGE]: {
    icon: 'iconfont icon-device',
    index: '11',
    title: '设备管理',
    subs: [
      {
        index: '/device/rent',
        title: '设备租用'
      },
      {
        index: '/device/bind',
        title: '设备绑定'
      }
    ]
  },
  [MODULE_EXPORT]: {
    icon: 'iconfont icon-export',
    index: '/export',
    title: '批量导出'
  },
  [MODULE_PATROL]: {
    icon: 'iconfont icon-scan',
    index: '/patrol',
    title: '培训巡检'
  },
  [MODULE_WORK_TYPE]: {
    icon: 'iconfont icon-scan',
    index: '/JobTypeManagement',
    title: '工种管理'
  }

}

/* 超级管理员 */
const ADMIN = [
  MODULE_LIST[MODULE_GOV_ACCOUNT],
  MODULE_LIST[MODULE_SCHOOL_ACCOUNT],
  MODULE_LIST[MODULE_DEVICE_MANAGE],
  MODULE_LIST[MODULE_WORK_TYPE],
  MODULE_LIST[MODULE_NEWNOTE_ACCOUNT]
]

/* 政府总账号管理员 */
const MAIN_GOV = [
  MODULE_LIST[MODULE_COMPREHENSIVE],
  MODULE_LIST[MODULE_SCHOOL_MANAGE],
  MODULE_LIST[MODULE_CLASS_MANAGE],
  MODULE_LIST[MODULE_STUDENT_MANAGE],
  MODULE_LIST[MODULE_TEACHER_MANAGE],
  MODULE_LIST[MODULE_ATTENDANCE_MANAGE],
  MODULE_LIST[MODULE_GOV_ORGANIZATION],
  MODULE_LIST[MODULE_PATROL]
]

/* 政府分账号管理员 */
const PART_GOV = [
  MODULE_LIST[MODULE_COMPREHENSIVE],
  MODULE_LIST[MODULE_SCHOOL_MANAGE],
  MODULE_LIST[MODULE_CLASS_MANAGE],
  MODULE_LIST[MODULE_STUDENT_MANAGE],
  MODULE_LIST[MODULE_TEACHER_MANAGE],
  MODULE_LIST[MODULE_ATTENDANCE_MANAGE],
  MODULE_LIST[MODULE_PATROL]
]

/* 学校总账号管理员 */
const MAIN_SCHOOL = [
  MODULE_LIST[MODULE_COMPREHENSIVE],
  MODULE_LIST[MODULE_SCHOOL_MANAGE],
  MODULE_LIST[MODULE_CLASS_MANAGE],
  MODULE_LIST[MODULE_STUDENT_MANAGE],
  MODULE_LIST[MODULE_TEACHER_MANAGE],
  MODULE_LIST[MODULE_ATTENDANCE_MANAGE],
  MODULE_LIST[MODULE_SCHOOL_ORGANIZATION]
]

/* 学校分校账号管理员 */
const PART_SCHOOL = [
  MODULE_LIST[MODULE_COMPREHENSIVE],
  MODULE_LIST[MODULE_CLASS_MANAGE],
  MODULE_LIST[MODULE_STUDENT_MANAGE],
  MODULE_LIST[MODULE_TEACHER_MANAGE],
  MODULE_LIST[MODULE_ATTENDANCE_MANAGE],
  MODULE_LIST[MODULE_EMPLOYMENT_MANAGE],
  MODULE_LIST[MODULE_EXPORT]
]

export default {
  ADMIN,
  MAIN_GOV,
  PART_GOV,
  MAIN_SCHOOL,
  PART_SCHOOL
}
