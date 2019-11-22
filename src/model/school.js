/* 学校模型层 */
import BaseModel from './base'

class SchoolModel extends BaseModel {
  // 获取学校中处于空闲的教师列表
  getIdleTeacherList(params) {
    return this.context
      .axios
      .post(this.context.$api.getTeacherListBySchoolId + `?classId=${params.schoolId}`)
      .then(res => {
        if (res.data.result !== 'ok') {
          this._errorNotify('获取教师列表失败!')
          throw new Error(res.data.error.message)
        }
        console.log(res)
        return res.data.data
      })
      .catch(err => {
        this._errorConsole(err)
        return Promise.reject(err) // 这里抛出一个reject, 否则默认promise状态是resolve
      })
  }
}

export default new SchoolModel()
