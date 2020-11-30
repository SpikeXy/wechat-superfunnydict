
const app = getApp()

// miniprogram/pages/myidentify/myidentify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    verticalCurrent:0,
    userIdentityId:0,
    userUpgradeState:0,
    identityData:[],
    userUpgradeText:"申请升级"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })

    wx.cloud.callFunction({
      name: 'GetUserIdentity',
      data: {}
    }).then(res=>{
      //console.log(res)
      let resData = res.result
      var stepsData = []
      for(var i = 0 ;  i < resData.length ; i++){
        let step = {}
        step.text = resData[i].ChineseName
        step.desc = resData[i].Description
        // step.Id = resData[i].Id
        stepsData.push(step)
      }
      that.setData({
        identityData : stepsData
      })
      wx.cloud.callFunction({
        name: 'GetUser',
        data: {}
      }).then(res2=>{
       
        var tempText = ""
        if(res2.result.data[0].upgradeState==0){
          tempText = "申请升级"
        }else{
          tempText = "正在审核"
        }

        that.setData({
          userUpgradeState: res2.result.data[0].upgradeState,
          userIdentityId:  res2.result.data[0].IdentityId,
          verticalCurrent : res2.result.data[0].IdentityId-1,
          userUpgradeText:tempText
        })
        wx.hideLoading({
          complete: (res) => {},
        })
      })
    })
  },
  applyForUpgrade:function(){
    var that = this
    wx.showLoading({
      title: '提交中',
    })
    wx.getUserInfo({
      success: (res2) => {
        //console.log("get的结果是")
        var userInfo = res2.userInfo
        //console.log("开始执行函数")
        wx.cloud.callFunction({
          name: 'ApplyIdentity',
          data: {
            name:userInfo.nickName,
            avatarUrl:userInfo.avatarUrl
          }
        }).then(res=>{
          wx.hideLoading({
            complete: (res) => {},
          })
          // console.log("用户角色升级的处理的结果是"+res.result)
          if(res.result==1){
            that.setData({
              userUpgradeState:1,
              userUpgradeText:"正在审核"
            })
          }else{
            that.setData({
              userUpgradeState:1,
              userUpgradeText:"服务器出差，稍后再试"
            })
          }

        })
      },
      complete: (res) => {},
    })



 
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})