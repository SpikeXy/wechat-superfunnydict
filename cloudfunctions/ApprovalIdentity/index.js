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


  const userOpenId = event.userOpenId
  const passValue = event.passValue


  var identityApprovalEntity = await db.collection('IdentityApproval')
    .where({
      UserOpenId: userOpenId
    })
    .get()
    .then(res => {
      return res.data[0];
    });


  var re = 0
  //若已经存在，修改用户数据
  if (passValue == 0) {
    //不通过
    //如果没有通过审核
    re = await db.collection('IdentityApproval')
      .doc(identityApprovalEntity._id)
      .update({
        data: {
          CheckUsers: _.addToSet(OPENID)
          //处理状态，1表示正在处理中，0标识已经处理完成
        }
      })
      .then(res => {
        return 1;
      })

  } else {
    //通过
    var targetIdentityId = identityApprovalEntity.IdentityIdTarget
    //查询所有此identity层级上一层用户的总数
    var countSum = await db.collection('User')
      .where({
        IdentityId: targetIdentityId
      })
      .count()
      .then(res => {
        return res.total
      })
    var percent = 1
    var state = 1
    if (countSum == 0) {
      //说明是越级提拔，直接赋值100%

    } else {
      percent = (identityApprovalEntity.PassUserNumber + 1) / countSum
      state = percent > 0.5 ? 0 : 1
    }

    //如果通过审核
    re = await db.collection('IdentityApproval')
      .doc(identityApprovalEntity._id)
      .update({
        data: {
          PassUserNumber: _.inc(1),
          PassPercentage: percent,
          CheckUsers: _.addToSet(OPENID),
          //处理状态，1表示正在处理中，0标识已经处理完成
          ApprovalState: state
        }
      })
      .then(res => {
        return 1
      })
    //修改user表的数据
    await db.collection('User')
      .where({
        openId: identityApprovalEntity.UserOpenId
      })

      .update({
        data: {
          upgradeState: 0,
          IdentityId: state > 0 ? identityApprovalEntity.IdentityIdTarget: identityApprovalEntity.IdentityIdOriginal 
        }
      })
  }
  return re

}