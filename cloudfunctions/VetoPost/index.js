//一票否决帖子

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command

// 云函数入口函数

exports.main = async (event, context) => {
  let {
    OPENID,
    APPID
  } = cloud.getWXContext()

  //console.log("openId是"+OPENID)
  const postId = event.postId
  //let checkUsersArray = event.checkUsers
  const passValue = event.passValue
  const refuseReason = event.refuseReason
  //const checkUsersArrayNew = checkUsersArray.push(openid)

  await db.collection('Post')
    .doc(postId)
    .update({
      data: {
        PassResult: 0,
        RefuseTag: _.addToSet("一票否决"),
        //搞到这里了，这里的addToSet无法使用
        CheckUsers: _.addToSet(OPENID),
        Veto:1,
        VetoOpenId:OPENID
      }
    }).then(res=>{
  //若帖子被否决，则发帖用户的典值不改变，没有改变的必要
  //但是需要通知一下用户
        //发通知给用户
        db.collection('Notify')
        .add({
          data: {
            Content: '已通过帖子被一票否决',
            CreatedTime:Date.parse(new Date()),
            PostId:postId,
            ScoreWave:1,
            Type:1,
            UserOpenId:OPENID
          }
        })
    })



 
  return 1

}