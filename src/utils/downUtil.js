/* 批量下载 */
import axios from 'axios'
import JSZip from 'jszip'
import FileSaver from 'file-saver'

// 请求 - 下载文档
const getFile = url => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url,
      responseType: 'arraybuffer',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      proxy: {
        host: 'http://training-prod.oss-cn-qingdao.aliyuncs.com'
      }
    }).then(data => {
      resolve(data.data)
    }).catch(error => {
      reject(error.toString())
    })
  })
}

// 批量下载并打包zip
const batchDown = (urlList) => {
  const zip = new JSZip()
  const cache = {}
  const promises = []
  // 循环批量下载并存成ArrayBuffer对象
  urlList.forEach(item => {
    const promise = getFile(item).then(data => {
      const arrName = item.split('/')
      const fileName = arrName[arrName.length - 1]
      // 打包文件
      zip.file(fileName, data, { binary: true })
      cache[fileName] = data
    })
    promises.push(promise)
  })

  // 执行promise
  Promise.all(promises).then(() => {
    // 生成二进制流, 利用file-saver保存文件
    zip.generateAsync({ type: 'blob' }).then(content => {
      FileSaver.saveAs(content, '打包下载.zip')
    })
  })
}

export default {
  batchDown
}

/* 调用
render(h) {
  return (<a on-click={() => this.batchDown()} href="javascript:;" rel="external nofollow" >批量下载</a>)
},
*/
