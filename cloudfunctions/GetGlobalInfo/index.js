// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'superfunnydictionary-ehx7q',
})

const db = cloud.database();
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()


  var globalConfig = await db.collection('GlobalConfig')
    .limit(1)
    .get()
    .then(res => {
      return res;
    });
  return globalConfig

}