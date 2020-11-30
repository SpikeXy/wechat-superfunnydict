// 云函数入口文件
//目前这个通知的内容并不是非常的明确，所以暂时从log中取数据
const cloud = require('wx-server-sdk')

cloud.init()
// 1. 获取数据库引用
const db = cloud.database();
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {

  let pageSize = parseInt(event.pageSize)
  let pageIndex = parseInt(event.pageIndex)
  let pageSkipTotal = (pageIndex - 1) * pageSize
  let {
    OPENID,
    APPID
  } = cloud.getWXContext()

  // 查询获得最终数据
  var notifyItems = await db.collection('Notify')
    .where({
      UserOpenId: OPENID
    })
    .field({
      Content: true,
      Type: true,
      //典值变化
      ScoreWave:true,
      CreatedTime:true,
      PostId:true
    })
    .skip(pageSkipTotal)
    .limit(pageSize)
    .get()
    .then(res => {
      return res.data;
    });

  return notifyItems;
}