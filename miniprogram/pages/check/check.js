// miniprogram/pages/check.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canDisplayImage: false,
    showRigh1: false,
    current: 'check',
    refuseReason: [],
    title: "",
    imageUrl: "",
    postId: "",
    noDataImageUrl: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      noDataImageUrl: app.globalData.noDataImageUrl
    })

    //检查用户级别，普通用户无法审核
    var that = this
    wx.cloud.callFunction({
      name: 'GetUser',
      data: {}
    }).then((res2) => {

      if (res2.result.data != null && res2.result.data != null != undefined && res2.result.data[0].IdentityId < 2) {
        wx.getStorage({
          key: 'isTencentTest',
          success(res) {
            let isTencentTest = res.data
            if (isTencentTest) {
              //显示数据
              that.GetCheckPost()
            } else {
              //提示权限不足
              wx.showToast({
                title: '普通用户无法审核',
                icon: 'none',
                duration: 3000
              })
              //显示空的icon图标
              that.setData({
                canDisplayImage: false
              })
            }
          }
        })
      } else {
        //显示数据
        that.GetCheckPost()
        that.GetReson()
      }
    })
  },
  GetReson(){
    var that = this
    //获取拒绝的理由列表
    wx.cloud.callFunction({
      name: 'GetRefuseReson',
      data: {}
    }).then((res2) => {
      that.setData({
        refuseReason: res2.result.data[0].RefuseReason
      })
    })
  },
  GetCheckPost() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.cloud.callFunction({
      name: 'GetCheckPost',
      data: {}
    }).then((res6) => {
      var postEntity = res6.result
      if (postEntity != null) {
        that.setData({
          title: postEntity.Title,
          postId: postEntity._id
        })
        that.setData({
          imageUrl: postEntity.Image,
          canDisplayImage: !(postEntity == null || postEntity == undefined || postEntity.Image == undefined )
        })
        wx.hideLoading({
          complete: (res) => {},
        })
      } else {
        wx.hideLoading({
          success: (res) => {},
        })
        that.setData({
          title: "",
          imageUrl: "",
          postId: "",
          canDisplayImage:false
        });
      }
    })
  },
  passClick() {
    wx.showLoading({
      title: '稍等',
    })
    var that = this
    wx.cloud.callFunction({
      name: 'ApprovalPost',
      data: {
        postId: this.data.postId,
        passValue: 1
      }
    }).then(res => {
      wx.showToast({
        title: '审核完成',
        duration: 1500,
        success: function () {
          wx.reLaunch({
            url: '/pages/check/check',
          })
        }
      })
    })
  },
  openRefuseClick() {
    this.setData({
      showRight1: !this.data.showRight1
    })
  },
  refuseClick: function (e) {
    wx.showLoading({
      title: '稍等',
    })
    var that = this
    var refuseData = e.currentTarget.dataset.refuse
    wx.cloud.callFunction({
      name: 'ApprovalPost',
      data: {
        postId: that.data.postId,
        passValue: 0,
        refuseReason: refuseData
      }
    }).then(res => {
      wx.showToast({
        title: '审核完成',
        duration: 1500,
        success: function () {
          that.GetCheckPost()
        }
      })
    })
  },
  closeHidden(){
    this.setData({
      showRight1: !this.data.showRight1
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