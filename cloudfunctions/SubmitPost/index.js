// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 1. 获取数据库引用
const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {

  let fileNameTemp = event.fileName
  let fileType = fileNameTemp.substr(fileNameTemp.lastIndexOf('.')+1)
  let title = event.title
  let {
    OPENID,
    APPID
  } = cloud.getWXContext()

  var re = await db.collection('Post')
    .add({
      data: {
        Title: title, //帖子标题
        CreatedDate: Date.parse(new Date()), //生成日期
        RefuseTag: [], //用户帖子被拒绝的标签
        PassResult: 0, //通过状态，默认为0
        LikeCount:0, // 点赞量
        PassResultPercentage: 0, //通过率。百分比
        Image: fileNameTemp, //图片地址
        ImageType:fileType,
        UserOpenId: OPENID, //用户唯一ID
        ViewUsers:[],
        CheckUsers:[],
        LikeUsers:[]

      }
    })
    .then(res => {
      //console.log(res)

      return 1;
    })
    .catch(res => {

      return 0
    });

  if (re == 1) {
    //插入log
    await db.collection('Log').add({
      data: {
        UserOpenId: OPENID,
        Content: "发帖成功",
        Result: 1,
        Type: 0 //发帖成功的type
      }
    })
  } else {
    //插入log
    await db.collection('Log').add({
      data: {
        UserOpenId: OPENID,
        Content: "发帖失败",
        Result: 0,
        Type: 1 //发帖失败的type
      }
    })
  }
  return re


}