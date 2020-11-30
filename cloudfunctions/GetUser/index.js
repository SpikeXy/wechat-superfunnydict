// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 1. 获取数据库引用
const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var openid = wxContext.OPENID
  //openId 用户的唯一标识
  
  var userInfoEntity =await db.collection('User')
  .where({
    openId:  openid
  })
  .field({
    score: true,//典值
    IdentityId: true,//身份名称的ID序号
    postCount:true,//发帖总数,
    upgradeState:true,
    nickName: true,
    avatarUrl: true,
    gender : true

  })
  .limit(1)
  .get()
  .then(res=>{
    return res;
  });

  return userInfoEntity
}