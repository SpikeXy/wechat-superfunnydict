// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 1. 获取数据库引用
const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var identityId = event.IdentityId
  //openId 用户的唯一标识
  
  var userIdentifyEntity =await db.collection('UserIdentity')
  .where({
    Id:  identityId
  })
  .field({
    Name: true,
    ChineseName: true
  })
  .limit(1)
  .get()
  .then(res=>{
    return res;
  });

  return userIdentifyEntity
}