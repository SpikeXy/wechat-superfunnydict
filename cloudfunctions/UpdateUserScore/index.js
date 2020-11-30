// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 1. 获取数据库引用
const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {



  const wxContext = cloud.getWXContext()
  const userOpenIdTemp = wxContext.OPENID
  const addScore = parseInt(event.addScore)

  var entity = await db.collection('User').where({
      openId: userOpenIdTemp
    })
    .limit(1)
    .field({
      score: true,
      _id: true
    })
    .get().then(res=>{
      return res.data[0]
    });

  await db.collection('User').doc(entity._id)
    .update({
      data: {
        score: entity.score + addScore
      }
    }).then(res => {
      //插入log
       db.collection('Log').add({
        data: {
          UserOpenId: userOpenIdTemp,
          Content: "修改典值成功",
          Result: 1,
          Type: 1 //成功的都是1
        }
      })
    })
  return 1



}