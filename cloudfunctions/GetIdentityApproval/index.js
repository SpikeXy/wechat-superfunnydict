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
  var pageSize = parseInt( event.pageSize )
  //console.log("pageSize"+pageSize)
  var pageIndex = parseInt( event.pageIndex  ) - 1
  //console.log("pageIndex"+pageIndex)
  var pageSumCount = pageSize * pageIndex
  //console.log("pageSumCount"+pageSumCount)


  let {
    OPENID,
    APPID
  } = cloud.getWXContext()

  //获取用户的IdentityId

  let isTencentTest = false

  var globalConfig = await db.collection('GlobalConfig')
    .limit(1)
    .get()
    .then(res => {
      return res.data;
    });
  if (globalConfig != undefined && globalConfig != null && globalConfig.length > 0) {
    isTencentTest = globalConfig[0].isTencentTest
  }


  var userInfoEntity =await db.collection('User')
  .where({
    openId:  OPENID
  })
  .field({
    IdentityId: true,//身份名称的ID序号
  })
  .limit(1)
  .get()
  .then(res=>{
    return res.data[0];
  });

  var identityId = 1
  if(isTencentTest){
    identityId = 4
  }else{
    identityId = userInfoEntity.IdentityId
  }

  //console.log("目标的IdentityId是"+identityId)
  var identityApprovalList = await db.collection('IdentityApproval')
  .where({
    PassPercentage:  _.lte(0.5),
    CheckUsers:  _.not(_.elemMatch(_.eq(OPENID))),
    IdentityIdTarget: _.lte(identityId) 
  })
  .field({
    UserOpenId:true,
    Name:true,
    AvatarUrl:true,
    IdentityIdOriginal:true,
    IdentityIdTarget:true,
    IdentityNameTarget:true,
    CreatedTime:true,
    PassUserNumber:true,
    PassPercentage:true,
    ViewUsers:true,
    CheckUsers:true
  })
  .skip(pageSumCount)
  .limit(pageSize)
  .get()
  .then(res=>{
    return res.data;
  });
  //console.log(identityApprovalList)
  //console.log("identityApprovalList"+identityApprovalList)
 return identityApprovalList

}