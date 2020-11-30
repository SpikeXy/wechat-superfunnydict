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
  var name = event.name
  var avatarUrl = event.avatarUrl
  let {
    OPENID,
    APPID
  } = cloud.getWXContext()

  var user = await db.collection('User')
  .where({
    openId:OPENID
  })
  .get()
  .then(res=>{
    return res.data[0];
  });
  await db.collection('User')
  .where({
    openId:OPENID
  })
  .update({
    data: {
      upgradeState: 1
    }
  })
  //查询identityIdName
  var userIdentityEntity = await db.collection('UserIdentity')
  .where({
    Id:user.IdentityId+1
  }).get().then(res=>{
    return res.data[0]
  });
 
  var identityTargetName = userIdentityEntity.ChineseName
  //先查询下IdentityApproval中有没有这个用户的记录
  //如果存着则修改，不存在则新增
  var userTemp = await db.collection('IdentityApproval')
  .where({
    UserOpenId:OPENID
  }).get().then(res=>{
    return res
  });
  if(userTemp.data.length!=0){
    //如果存在，则修改
    return await db.collection('IdentityApproval')
    .where({
      UserOpenId:OPENID
    })
    .update({
      data: {
        UserOpenId:OPENID,
        IdentityIdOriginal:user.IdentityId,
        IdentityIdTarget:user.IdentityId+1,
        IdentityNameTarget:identityTargetName,
        PassUserNumber:0,
        PassPercentage:0,
        CheckUsers:[],
        //处理状态，1表示正在处理中，0标识已经处理完成
        ApprovalState:1
      }
    })
    .then(res => {
  
      return 1;
    })
  }else{
    //如果不存在，则新增
    return await db.collection('IdentityApproval')
    .add({
      data: {
        UserOpenId:OPENID,
        Name:name,
        AvatarUrl:avatarUrl,
        IdentityIdOriginal:user.IdentityId,
        IdentityIdTarget:user.IdentityId+1,
        IdentityNameTarget:identityTargetName,
        PassUserNumber:0,
        PassPercentage:0,
        CheckUsers:[],
        //处理状态，1表示正在处理中，0标识已经处理完成
        ApprovalState:1

      }
    })
    .then(res => {
  
      return 1;
    })
  }


}