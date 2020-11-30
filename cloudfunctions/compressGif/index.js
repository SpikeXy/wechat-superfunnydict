// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require("request");
// const stream = require('stream');

//get module
const OSS = require('ali-oss')
const client = new OSS({
  bucket: 'super-funy-dict',
  // region以杭州为例（oss-cn-hangzhou），其他region按实际情况填写。
  region: 'oss-cn-beijing',
  // 阿里云主账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM账号进行API访问或日常运维，请登录RAM控制台创建RAM账号。
  accessKeyId: 'xxxx',
  accessKeySecret: 'xxxxxxx',
});

cloud.init({
  env: 'superfunnydictionary-ehx7q'
})


let getImageBuffer = function (url) {
  return new Promise(function (resolve, reject) {
    request({
      url: url,
      encoding: null
    }, (err, resp, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    })
  });
}


// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()

  let fileName = event.fileName
  let fileId = event.fileId
  const downloadFileRes = await cloud.downloadFile({
    fileID: fileId,
  })
  const bufferData = downloadFileRes.fileContent
  // //通过文件后缀获得文件类型
  //这个event.file的传输大小有限制，不能使用这个方式，大一点的gif就传不过来了
  // let bufferData = Buffer.from(event.file, 'base64')
  try {
    //object-name可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
    let result = await client.put(fileName, bufferData);
    if (result.name != undefined && result.name == fileName) {
      //执行成功了，把webp格式的下载到本地的gif文件夹中去
      //获取返回的url
      let fileUrl = result.url
      //根据url的地址来获取webp格式的图片
      let fileOperateUrl = fileUrl + '?x-oss-process=image/format,webp'
      let buffer = await getImageBuffer(fileOperateUrl)
      let fileNewName = fileName + '.webp'
      const fileIDs = [fileId]
      await cloud.deleteFile({
        fileList: fileIDs,
      })
      return await cloud.uploadFile({
        cloudPath: 'webp/' + fileNewName,
        fileContent: buffer
      })
      .then(fileRes=>{
        //成功后删除原来的fileId文件，减小云开发的存储
  
        return fileRes.fileID
      })
    } else {
      return ""
    }
  } catch (e) {
    // console.log(e);
    return ""
  }

}