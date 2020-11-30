// post审核函数，审核用户的identityId必须大于1

const cloud = require('wx-server-sdk')

cloud.init({
  env: 'superfunnydictionary-ehx7q',
})
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

  var userInfoEntity = await db.collection('User')
    .where({
      openId: OPENID
    })
    .field({
      score: true, //典值
      IdentityId: true, //身份名称的ID序号
      postCount: true, //发帖总数,
      upgradeState: true
    })
    .get()
    .then(res => {
      return res.data[0];
    });

  //如果是审核状态则不检查用户的身份，可以直接审核
  if (isTencentTest) {

  } else {
    if (userInfoEntity.IdentityId < 2) {
      return -1
    }
  }



  let postEntity = await db.collection('Post')
    .doc(postId)
    .get()
    .then(res => {
      return res.data
    });

  let passResultPer = 0
  let checkUserCount = 0
  if (postEntity.CheckUsers != null && postEntity.CheckUsers != undefined) {
    checkUserCount = postEntity.CheckUsers.length
  }
  if (postEntity.PassResultPercentage != null && postEntity.PassResultPercentage != undefined) {
    passResultPer = postEntity.PassResultPercentage
  }
  let passCount = passResultPer * checkUserCount
  let passResultPerNew = 0
  if (passValue == 1) {
    passResultPerNew = (passCount + 1) / (checkUserCount + 1)
  } else {
    passResultPerNew = (passCount) / (checkUserCount + 1)
  }

  let passResultNew = passResultPerNew > 0.5 ? 1 : 0
  await db.collection('Post')
    .doc(postId)
    .update({
      data: {
        PassResult: passResultNew,
        RefuseTag: _.addToSet(refuseReason),
        PassResultPercentage: passResultPerNew,
        //搞到这里了，这里的addToSet无法使用
        CheckUsers: _.addToSet(OPENID)
      }
    })
  //若帖子审核通过了，则发帖用户的典值+1
  if (passResultNew > 0) {

    await db.collection('User')
      .where({
        openId: postEntity.UserOpenId
      })
      .update({
        data: {
          score: _.inc(1)
        }
      }).then(res10 => {
        //插入log

        db.collection('Log').add({
          data: {
            UserOpenId: OPENID,
            CreatedTime: Date.parse(new Date()),
            Content: "帖子审核通过",
            Result: 1,
            Type: 0 //发帖成功的type
          }
        })

        //发通知给用户
        db.collection('Notify')
          .add({
            data: {
              Content: '帖子审核通过',
              CreatedTime: Date.parse(new Date()),
              PostId: postId,
              ScoreWave: 1,
              Type: 1,
              UserOpenId: postEntity.UserOpenId
            }
          })
      })
  } else {
    //插入log

    await db.collection('Log').add({
      data: {
        UserOpenId: OPENID,
        Content: "帖子审核没通过",
        CreatedTime: Date.parse(new Date()),
        Result: 1,
        Type: 0 //发帖成功的type
      }
    })
    //发通知给用户
    await db.collection('Notify')
      .add({
        data: {
          Content: '帖子审核不通过',
          CreatedTime: Date.parse(new Date()),
          PostId: postId,
          ScoreWave: 1,
          Type: 0,
          UserOpenId: postEntity.UserOpenId
        }
      })

  }
  return 1

}