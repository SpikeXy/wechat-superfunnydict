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

  var pageSize = parseInt( event.pageSize )
  var pageIndex = parseInt( event.pageIndex  ) - 1
  var pageSumCount = pageSize * pageIndex

  var postEntityList = await db.collection('Post')
    .where({
      UserOpenId: OPENID
    })
    .orderBy("CreatedDate" ,'desc')
    .field({
      Title: true, //典值
      LikeCount: true, //发帖总数
      _id: true,
    })
    .skip(pageSumCount)
    .limit(pageSize)
    .get()
    .then(res => {
      return res.data;
    });

  return postEntityList
}