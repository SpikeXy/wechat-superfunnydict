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

  var userIdentityList = await db.collection('UserIdentity')
  .field({
    ChineseName:true,
    Description:true,
    Id:true
  })
  .get()
  .then(res=>{
    return res.data;
  });

 
 return userIdentityList

}