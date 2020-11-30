// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID


  const userInfoEntity = event.userInfoEntity
  
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
  console.log(2)
  let initIdenityId = 1
  if(isTencentTest){
    initIdenityId = 4
  }


  var re = await db.collection('User')
    .add({
      data: {
        openId: openid,
        createdDate: Date.parse(new Date()),
        nickName: userInfoEntity.nickName,
        avatarUrl: userInfoEntity.avatarUrl,
        gender: userInfoEntity.gender,
        score: 0,
        IdentityId: initIdenityId,
        postCount: 0,
        upgradeState: 0
      }
    })
    .then(res => {
      //console.log(res)

      return 1;
    })
    .catch(res => {

      return 0
    });

  if (re == 1) {
    //插入log
    await db.collection('Log').add({
      data: {
        UserOpenId: openid,
        Content: "新建用户成功",
        CreatedDate:Date.parse(new Date()),
        Result: 1,
        Type: 1 //发帖成功的type
      }
    })
  } else {
    //插入log
    await db.collection('Log').add({
      data: {
        UserOpenId: openid,
        Content: "新建用户失败",
        Result: 0,
        CreatedDate: Date.parse(new Date()),
        Type: 2 //发帖失败的type
      }
    })
  }
  return re

}