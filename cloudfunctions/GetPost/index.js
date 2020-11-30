// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 1. 获取数据库引用
const db = cloud.database();
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {

  var pageSize = parseInt( event.pageSize )
  var pageIndex = parseInt( event.pageIndex  ) - 1
  var pageSumCount = pageSize * pageIndex
  console.log(pageIndex)
  let {
    OPENID,
    APPID
  } = cloud.getWXContext()

  var postEntity = await db.collection('Post')
    .where({
      PassResult: 1
      //ViewUsers: _.not(_.elemMatch(_.eq(OPENID)))
    })
    .field({
      Title: true, //典值
      Image: true, //用户身份的ID序号
      LikeCount: true, //发帖总数
      _id: true
    })
    .orderBy('CreatedDate', 'desc')
    .skip(pageSumCount)
    .limit(pageSize)
    .get()
    .then(res => {
      return res.data[0];
    });
  
  if (postEntity != null) {
    var isLikeClicked =  await db.collection('Post')
    .where({
      _id:postEntity._id,
      LikeUsers: _.elemMatch(_.eq(OPENID))
    })
    .count().then(res=>{
      return res.total
    })

    //console.log(postEntity.ViewUsers)
    //更新此条Post的ViewUsers
    db.collection('Post')
      .doc( postEntity._id)
      .update({
        data: {
          ViewUsers: _.addToSet(OPENID)
        }
      })
      postEntity.IsLiked = isLikeClicked
  }
  
  return postEntity
}