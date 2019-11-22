import Vue from 'vue'

class BaseModel {
  constructor () {
    this.context = new Vue()
  }

  _errorNotify (errMsg) {
    this.context.$message.error(errMsg)
  }

  _errorConsole (errMsg) {
    console.log(errMsg)
  }
}

export default BaseModel
