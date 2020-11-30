// miniprogram/pages/mypost/mypost.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postData: [],
    pageIndex: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.GetPostData(this.data.pageIndex)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  GetPostData(index) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.cloud.callFunction({
      name: 'GetMyPost',
      data: {
        pageIndex: index,
        pageSize: 10
      }
    }).then(res => {
      res.result.forEach(element => {
        element.NavUrl = '/pages/post/post?PostId=' + element._id
      });
 
      var reLength = res.result.length
      that.setData({
        postData: res.result
      })
      //对页码按钮的禁用进行设置
      if (index == 1) {
        that.setData({
          //禁用上一页按钮
          disablePre: true
        })

      } else {
        that.setData({
          //禁用上一页按钮
          disablePre: false
        })
      }
      if (reLength < 10) {
        that.setData({
          //禁用下一页按钮
          disableNext: true
        })

      } else {
        that.setData({
          //禁用下一页按钮
          disableNext: false
        })
      }
      wx.hideLoading()
    })
  },
  prePageClick: function (options) {
    this.GetPostData(this.data.pageIndex - 1)
    this.setData({
      pageIndex: this.data.pageIndex - 1
    })
  },
  nextPageClick: function (options) {
    this.GetPostData(this.data.pageIndex + 1)
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
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