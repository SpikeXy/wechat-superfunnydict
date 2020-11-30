// miniprogram/pages/user/user.js
const app = getApp()

Page({


  data: {
    isTencentTest: true,
    isHide: true,
    userName: '',
    avatarLink: '',
    //我的典值
    myScore: 0,
    //我的发布数据
    myPostCount: 0,
    //待审批数据
    myApprovalValue: 0,
    //全局日志数据
    allLogValue: 0,
    identityId: 0,
    myIdentityName: "",
    viewHeight: "100px",
    appid: '',
    appsecret: '',
    isClickGetUserInfo: false,
    errorMsg: ""
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this

    //设置高度
    wx.getSystemInfo({
      success: function (res, rect) {
        var heightText = res.windowHeight - 2
        var heightData = heightText + "px"
        that.setData({
          viewHeight: heightData
        })
      }
    })

    this.checkUser()
    wx.getStorage({
      key: 'isTencentTest',
      success(res) {
        if (res.data != undefined && res.data != null) {
          that.setData({
            isTencentTest: res.data
          })
        }
      }
    })
  },
  checkUser() {
    var that = this
    //检查用户是否已经存在
    wx.cloud.callFunction({
      name: 'GetUser',
      data: {}
    }).then((res) => {

      //显示用户页面
      //console.log("获得的"+res.result.data)
      if (res.result != null && res.result != undefined && res.result.data.length > 0) {
        var reEntity = res.result.data[0]
        //console.log("reEntity")
        //console.log(res.result.data[0])
        that.setData({
          isHide: res.result == null || res.result == undefined || res.result.data.length == 0,
          myScore: reEntity.score,
          isHide: false,
          identityId: reEntity.IdentityId,

          userName: reEntity.nickName,
          avatarLink: reEntity.avatarUrl,
          gender: reEntity.gender
        })
        //设置用户头像和名称的全局变量
        app.globalData.gender = reEntity.gender
        app.globalData.avatarLink = reEntity.avatarUrl
        app.globalData.nickName = reEntity.nickName

        //获得用户的身份的名称
        //console.log("identityId"+that.data.identityId)
        wx.cloud.callFunction({
          name: 'GetIdentityName',
          data: {
            IdentityId: that.data.identityId
          }
        }).then(res3 => {
          that.setData({
            myIdentityName: res3.result.data[0].ChineseName
          })
        })
        //获取待审批的数据
        wx.cloud.callFunction({
          name: 'GetIdentityApprovalCount',
          data: {}
        }).then(res4 => {
          that.setData({
            myApprovalValue: res4.result
          })
        })


      } else {
        that.setData({
          isHide: true
        })
      }

    })
  },
  uploadClick() {
    //console.log("开始上传")
  },
  bindGetUserInfo: function (e) {

    this.setData({
      isClickGetUserInfo: true
    })
    wx.showLoading({
      title: '等待..',
    })

    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;

      // console.log(e.detail.userInfo);
      const userInfoEntity = e.detail.userInfo

      //新增用户数据到集合
      wx.cloud.callFunction({
        name: 'AddUser',
        data: {
          userInfoEntity: userInfoEntity
        }
      }).then(res3 => {
        that.checkUser()
        wx.hideLoading({
          complete: (res4) => {},
        })
      })



    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入界面，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            //console.log('用户点击了“返回授权”');
          }
        }
      });
    }
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
    var that = this
    //获取我的发布的总数据
    wx.cloud.callFunction({
      name: 'GetMyPostCount',
      data: {}
    }).then(res6 => {
      that.setData({
        myPostCount: res6.result
      })
    })
    //获取我的典值
    wx.cloud.callFunction({
      name: 'GetUser',
      data: {}
    }).then((res) => {
      //console.log("getUset的结果是：")
      //console.log(res)
      //显示用户页面
      //console.log("获得的"+res.result.data)
      if (res.result.data.length > 0) {
        var reEntity = res.result.data[0]
        //console.log("reEntity"+res.result.data[0])
        that.setData({
          myScore: reEntity.score,
        })
      }
    })
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