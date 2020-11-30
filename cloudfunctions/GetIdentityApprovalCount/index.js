// 云函数入口文件
//函数说明
//获取审核帖子，Post中的checkUsers是一个数组，已经审核过的用户的用户的OPENID会加在这个数据里面
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


  var userEntity = await db.collection('User')
    .where({
      openId: OPENID
    })
    .get().then(res => {
      return res.data[0]
    })
  var identityId = userEntity.IdentityId
  if (identityId == 1) {
    return 0
  } else {
    var count = await db.collection('IdentityApproval')
      .where({
        PassPercentage: _.lte(0.5),
        IdentityIdTarget: _.lte(identityId),
        CheckUsers: _.not(_.elemMatch(_.eq(OPENID)))
      })
      .count()
      .then(res => {
        return res.total;
      });

    return count
  }
}