// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  const  content = event.content
  const  result = event.result

  return  await db.collection('Log')
    .add({
      data: {
        CreatedDate: Date.parse(new Date()),
        Content: content,
        Result: result,
        UserOpenId:openid
      }
    })
    .then(res => {
      //console.log(res)

      return 1;
    })
    .catch(res => {

      return 0
    });

}