/* 班级模型层 */
import BaseModel from './base'
import ClassEntity from './entity/classEntity'

class ClassModel extends BaseModel {
  // 获取班级教师信息  --- 可和获取班级信息合并废弃接口
  getClassTeacherInfo(classEntity) {
    return this.context
      .axios
      .post(this.context.$api.getClassTeacher + classEntity.tid)
      .then(res => {
        if (res.data.result !== 'ok') {
          this._errorNotify('获取班级教师信息失败!')
          throw new Error(res.data.error.message)
        }

        classEntity.actualGoStdCount = res.data.data.checkCount
        classEntity.theoryTeacher = res.data.data.theoryTeacher
        classEntity.practiceTeacher = res.data.data.practiceTeacher
        classEntity.studentCount = res.data.data.totalStudent
        return classEntity
      })
      .catch(err => {
        this._errorConsole(err)
        return Promise.reject(err)
      })
  }

  // 获取班级信息
  getClassInfo(params) {
    return this.context
      .axios
      .post(this.context.$api.getClassDetail + params.classId)
      /*
      .then(res => {
        if (res.data.result !== 'ok') {
          this._errorNotify('获取班级信息失败!')
          throw new Error(res.data.error.message)
        }
        return new ClassEntity(res.data.data)
      })
      */
      .then(res => {
        if (res.data.result !== 'ok') {
          this._errorNotify('获取班级信息失败!')
          throw new Error(res.data.error.message)
        }
        return new ClassEntity(res.data.data)
      })
      .then(classEntity => {
        return this.getClassTeacherInfo(classEntity)
      })
      .catch(err => {
        this._errorConsole(err)
        return Promise.reject(err) // 这里抛出一个reject, 否则默认promise状态是resolve
      })
  }

  // 获取班级列表 - 分页查询
  getClassList(params) {
    return this.context
      .axios
      .post(this.context.$api.classSelectPage, params)
      .then(res => {
        if (res.data.result !== 'ok') {
          this._errorNotify('获取班级列表失败!')
          throw new Error(res.data.error.message)
        }
        return {
          classListData: res.data.data.records.map(item => new ClassEntity(item)),
          pageTotle: res.data.data.total

        }
      })
      .catch(err => {
        this._errorConsole(err)
        return Promise.reject(err)
      })
  }

  // 修改班级信息
  editClassInfo(params) {
    return this.context
      .axios
      .post(this.context.$api.editClass, params)
      .then(res => {
        if (res.data.result !== 'ok') {
          this._errorNotify('修改信息失败!')
          throw new Error(res.data.error.message)
        }
        return res.data
      })
      .catch(err => {
        this._errorConsole(err)
        return Promise.reject(err) // 这里抛出一个reject, 否则默认promise状态是resolve
      })
  }
}

export default new ClassModel()
