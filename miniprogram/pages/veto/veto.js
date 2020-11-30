// miniprogram/pages/veto/veto.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canDisplayImage:false,
    showLoading:true,
    showRigh1: false,
    current: 'check',
    refuseReason: [],
    title: "",
    imageUrl: "",
    postId: "",
    noDataImageUrl:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      noDataImageUrl :  app.globalData.noDataImageUrl
    })

    //获取已经通过的帖子列表
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'GetPassedPost',
      data: {}
    }).then((res2) => {
      // console.log("结果为")
      // console.log(res2.result)
      var postEntity = res2.result
      if (postEntity != null) {

        that.setData({
          title: postEntity.Title,
          postId: postEntity._id
        })
        //获取image的Url
        wx.cloud.downloadFile({
          fileID: postEntity.Image
        }).then(res2 => {
          // get temp file path
          // console.log(res2.tempFilePath)
          //显示图像，隐藏加载的文字
       
          that.setData({
            imageUrl: res2.tempFilePath,
            canDisplayImage: !(res2.tempFilePath==null || res2.tempFilePath ==undefined),
            showLoading:!(res2.tempFilePath==null || res2.tempFilePath ==undefined)
          })
          //重新设置post的ViewUsers数据
          wx.hideLoading({
            success: (res) => {},
          })
        }).catch(error => {
          // handle error
        })
      } else {
        wx.hideLoading({
          success: (res) => {},
        })
        that.setData({
          title: "",
          imageUrl: "",
          postId: ""
        });
      }
    })
  },
  vetoClick() {
    var that = this
    wx.cloud.callFunction({
      name: 'VetoPost',
      data: {
        postId: this.data.postId
      }
    }).then(res => {
      wx.reLaunch({
        url: '/pages/veto/veto',
      })
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