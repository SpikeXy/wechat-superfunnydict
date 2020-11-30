// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 1. 获取数据库引用
const db = cloud.database();
const _ = db.command

const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {

  let {
    OPENID,
    APPID
  } = cloud.getWXContext()

  var postId = event.postId

  var result = await db.collection('Post')
    .doc(postId)
    .update({
      data:{
        LikeCount: _.inc(1),  //发帖总数,
        LikeUsers: _.addToSet(OPENID)
      }
    })
    .then(res => {
      return 1;
    });

  return result
}