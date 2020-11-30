// 云函数入口文件
//这个函数暂时用不上，先写着放在这里，目前仅需要用到用的openId就够了
//此函数未测试
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const userCode = wxContext.code

  var globalConfig = await db.collection('GlobalConfig')
    .get()
    .then(res => {
      return res.data[0];
    });
  // console.log(globalConfig)

  var userInfo = {}
  wx.request({
    url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + globalConfig.appid + '&secret=' + globalConfig.appsecret + '&js_code=' + userCode + '&grant_type=authorization_code',
    success: res => {
      userInfo = res.data
    }
  });
  return userInfo
}