// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 1. 获取数据库引用
const db = cloud.database();
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {

  let postId = event.PostId
  //console.log(postId)
  let {
    OPENID,
    APPID
  } = cloud.getWXContext()

  var postEntity = await db.collection('Post')
    .doc(postId)
    .get()
    .then(res => {
      return res.data;
    });

  return postEntity
}