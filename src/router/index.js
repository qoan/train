import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/comprehensive'
    },
    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      meta: { title: '自述文件' },
      children: [
        {
          path: '/comprehensive',
          name: 'comprehensive',
          component: resolve => require(['../view/comprehensive/index.vue'], resolve),
          meta: { title: '综合管理', requireAuth: true }
        },
        {
          path: '/school',
          name: 'school',
          component: resolve => require(['../view/school/School.vue'], resolve),
          meta: { title: '学校管理', requireAuth: true }
        },
        {
          path: '/school/detail',
          component: resolve => require(['../view/school/SchoolDetail.vue'], resolve),
          meta: { title: '学校详情', requireAuth: true }
        },
        {
          path: '/class',
          component: resolve => require(['../view/class/Class.vue'], resolve),
          meta: { title: '班级管理', requireAuth: true }
        },
        {
          path: '/class/detail',
          name: 'classDetail',
          component: resolve => require(['../view/class/ClassDetail.vue'], resolve),
          meta: { title: '班级详情', requireAuth: true }
        },
        {
          path: '/class/chart',
          component: resolve => require(['../view/class/ClassChart.vue'], resolve),
          meta: { title: '班级统计', requireAuth: true }
        },
        {
          path: '/student',
          component: resolve => require(['../view/student/Student.vue'], resolve),
          meta: { title: '学员管理', requireAuth: true }
        },
        {
          name: 'studentDetail',
          path: '/student/detail',
          component: resolve => require(['../view/student/StudentDetail.vue'], resolve),
          meta: { title: '学员详情', requireAuth: true }
        },
        {
          path: '/student/chart',
          component: resolve => require(['../view/student/StudentChart.vue'], resolve),
          meta: { title: '学员统计', requireAuth: true }
        },
        {
          path: '/teacher',
          component: resolve => require(['../view/teacher/Teacher.vue'], resolve),
          meta: { title: '教师管理', requireAuth: true }
        },
        {
          path: '/check',
          component: resolve => require(['../view/check/Attendance.vue'], resolve),
          meta: { title: '考勤管理', requireAuth: true }
        },
        {
          path: '/check/chart',
          component: resolve => require(['../view/check/AttendanceChart.vue'], resolve),
          meta: { title: '考勤统计', requireAuth: true }
        },
        {
          path: '/check/class/detail',
          component: resolve => require(['../view/check/CheckClassDetail.vue'], resolve),
          meta: { title: '班级考勤详情', requireAuth: true }
        },
        {
          path: '/check/student/detail',
          component: resolve => require(['../view/check/CheckStudentDetail.vue'], resolve),
          meta: { title: '学员考勤详情', requireAuth: true }
        },
        {
          path: '/employment/unEmployment',
          component: resolve => require(['../view/employment/UnEmployment.vue'], resolve),
          meta: { title: '未就业人员', requireAuth: true }
        },
        {
          path: '/employment/wantEmployment',
          component: resolve => require(['../view/employment/WantToEmployment.vue'], resolve),
          meta: { title: '就业意向人员', requireAuth: true }
        },
        {
          path: '/employment/infoPush',
          component: resolve => require(['../view/employment/EmploymentInfoPush.vue'], resolve),
          meta: { title: '就业推送', requireAuth: true }
        },
        {
          path: '/employment/detail',
          component: resolve => require(['../view/employment/PostDetail.vue'], resolve),
          meta: { title: '岗位详情', requireAuth: true }
        },
        {
          path: '/tabs',
          component: resolve => require(['../components/page/Tabs.vue'], resolve),
          meta: { title: '消息中心', requireAuth: true }
        },
        {
          path: '/organization/govenment',
          name: 'organizationGov',
          component: resolve => require(['@/view/organization/govenment/index.vue'], resolve),
          meta: { title: '政府账号管理', requireAuth: true }
        },
        {
          path: '/organization/school',
          name: 'organizationSch',
          component: resolve => require(['@/view/organization/school/index.vue'], resolve),
          meta: { title: '学校账号管理', requireAuth: true }
        },
        {
          path: '/account/school',
          name: 'accountSchool',
          component: resolve => require(['@/view/account/school/index.vue'], resolve),
          meta: { title: '学校账号管理', requireAuth: true }
        },
        {
          path: '/account/govenment',
          name: 'accountGovenment',
          component: resolve => require(['@/view/account/govenment/index.vue'], resolve),
          meta: { title: '政府账号管理', requireAuth: true }
        },
        {
          path: '/account/newnote',
          name: 'accountNewnote',
          component: resolve => require(['@/view/account/newnote/index.vue'], resolve),
          meta: { title: '系统更新日志', requireAuth: true }
        },
        {
          path: '/device/rent',
          component: resolve => require(['@/view/device/index.vue'], resolve),
          meta: { title: '设备租用', requireAuth: true }
        },
        {
          path: '/device/bind',
          component: resolve => require(['@/view/device/BindDevice.vue'], resolve),
          meta: { title: '设备绑定', requireAuth: true }
        },
        {
          path: '/export',
          name: 'export',
          component: resolve => require(['@/view/exports/index.vue'], resolve),
          meta: { title: '批量导出', requireAuth: true }
        },
        {
          path: '/patrol',
          name: 'patrol',
          component: resolve => require(['@/view/patrol/Index.vue'], resolve),
          meta: { title: '培训巡检', requireAuth: true }
        },
        {
          path: '/patrol/add',
          name: 'patrolAdd',
          component: resolve => require(['@/view/patrol/PatrolAdd.vue'], resolve),
          meta: { title: '添加巡检记录', requireAuth: true }
        },
        {
          path: '/patrol/details',
          name: 'patrolDetails',
          component: resolve => require(['@/view/patrol/PatrolDetails.vue'], resolve),
          meta: { title: '巡检详情', requireAuth: true }
        },
        {
          path: '/JobTypeManagement',
          name: 'JobTypeManagement',
          component: resolve => require(['@/view/JobTypeManagement/index.vue'], resolve),
          meta: { title: '工种管理', requireAuth: true }
        },
        {
          // 权限页面
          path: '/permission',
          component: resolve => require(['../components/page/Permission.vue'], resolve),
          meta: { title: '权限测试', permission: true }
        },
        {
          path: '/404',
          component: resolve => require(['../components/page/404.vue'], resolve),
          meta: { title: '404' }
        },
        {
          path: '/403',
          component: resolve => require(['../components/page/403.vue'], resolve),
          meta: { title: '403' }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})

/* 全局前置守卫导航 */
router.beforeEach((to, from, next) => {
  // 判断该路由是否需要登录权限
  if (to.meta.requireAuth) {
    // 判断当前是否登录
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    if (!userInfo || !userInfo.token) {
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    } else next()
  } else next()
})

export default router
