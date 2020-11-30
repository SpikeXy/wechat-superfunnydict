//获取被超级用户一票否决的帖子


// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 1. 获取数据库引用
const db = cloud.database();
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {

  let {
    OPENID,
    APPID
  } = cloud.getWXContext()

  var postEntity = await db.collection('Post')
    .where({
      PassResult: 0,
      Veto:1,
    })
    .field({
      Title: true, //典值
      Image: true, //用户身份的ID序号
      LikeCount: true, //发帖总数
      _id: true,
      CheckUsers: true,
      VetoOpenId:true,
      Veto:true
    })
    .limit(1)
    .get()
    .then(res => {
      return res.data[0];
    });



  return postEntity
}