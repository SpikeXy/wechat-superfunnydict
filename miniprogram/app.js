//app.js
App({
  onLaunch: function () {
    this.globalData = {
      'gender':0,
      'avatarLink':'',
      'nickName':'',
      'userOpenId':'',
      'noDataImageUrl':'cloud://superfunnydictionary-ehx7q.7375-superfunnydictionary-ehx7q-1301739628/pic/nodata.png',
      'qrUrl':'cloud://superfunnydictionary-ehx7q.7375-superfunnydictionary-ehx7q-1301739628/pic/小程序二维码.jpg'
    }
    let that = this
    let e = wx.getSystemInfoSync()
    that.globalData.StatusBar = e.statusBarHeight;
    that.globalData.windowHeight = e.windowHeight;
    that.globalData.windowWidth = e.windowWidth;
    let custom = wx.getMenuButtonBoundingClientRect();
    that.globalData.Custom = custom;  
    that.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'superfunnydictionary-ehx7q',
        traceUser: true,
      })
    }


  }
})
