// miniprogram/pages/reopen/reopen.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canDisplayImage:false,
    showRigh1: false,
    current: 'check',
    refuseReason: [],
    title: "",
    imageUrl: "",
    postId: "",
    noDataImageUrl:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.GetPost()
  },
  GetPost:function(options){
    var that = this
    //获取已经被超级用户否决的帖子，这个帖子有特殊标记
    wx.cloud.callFunction({
      name: 'GetVetoedPost',
      data: {}
    }).then((res2) => {
      // console.log("返回结果为")
      // console.log(res2)
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
          })
          //重新设置post的ViewUsers数据

        }).catch(error => {
          // handle error
        })
      } else {
        that.setData({
          title: "",
          imageUrl: "",
          postId: ""
        });
      }
    })
  },
  finallyDeleteClick:function(options){
    //彻底删除post
    wx.cloud.callFunction({
      name: 'FinallyDeletePost',
      data: {
        postId: this.data.postId
      }
    }).then(res => {
      // console.log("开始新的内容")
      //重新获取下一条审核内容
      wx.reLaunch({
        url: '/pages/reopen/reopen',
      })
    })
  },
  reopenClick:function(options){
    var that = this
    wx.cloud.callFunction({
      name: 'ReopenPost',
      data: {
        postId: this.data.postId
      }
    }).then(res => {
      // console.log("开始新的内容")
      //重新获取下一条审核内容
      wx.reLaunch({
        url: '/pages/reopen/reopen',
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