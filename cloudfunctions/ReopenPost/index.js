//一票否决帖子

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数

exports.main = async (event, context) => {
  let {
    OPENID,
    APPID
  } = cloud.getWXContext()

  const postId = event.postId

  var globalConfig = await db.collection('GlobalConfig')
  .limit(1)
  .get()
  .then(res => {
    return res.data[0];
  });


  var postEntity =  await db.collection('Post')
  .doc(postId).get().then(res=>{
    return res.data
  })
  var vetoOpenId = postEntity.VetoOpenId
  await db.collection('Post')
    .doc(postId)
    .update({
      data: {
        PassResult: 0,
        PassResultPercentage:0,
        CheckUsers:[],
        Veto:0,
        VetoOpenId:'',
        Reopen:1,
        ReopenOpenId:OPENID
      }
    }).then(res=>{
  //若帖子被否决，则发帖用户的典值不改变，没有改变的必要
  //但是需要通知一下用户
        //发通知给用户
        db.collection('Notify')
        .add({
          data: {
            Content: '一票否决的帖子被重新打开',
            CreatedTime:Date.parse(new Date()),
            PostId:postId,
            ScoreWave:globalConfig.ReopenMinusScore,
            //type2是扣分选项，type1是加分项
            Type:2,
            UserOpenId:vetoOpenId
          }
        }).then(res=>{
             //插入log
           db.collection('Log').add({
            data: {
              UserOpenId: OPENID,
              Content: "重新打开帖子成功",
              Result: 1,
              Type: 1 //发帖成功的type
            }
          })



          //voteOpenId用户的典值减去一定的数值
          // db.collection('User')
          // .where({
          //   openId:vetoOpenId
          // }).update({
          //   data:{
          //     score: $.add(['$score',globalConfig.ReopenMinusScore])
          //   }
          // })
        })
    })



 
  return 1

}