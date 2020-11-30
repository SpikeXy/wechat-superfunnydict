// miniprogram/pages/post/post.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postEntity:{},
    imageUrl:"",
    percentage:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const postId = options.PostId;
    var that = this
    wx.cloud.callFunction({
      name: 'GetSingalPost',
      data: {
        PostId:postId
      }
    }).then(res=>{
      //console.log(res.result)
      let  percentageTemp = (Math.round(res.result.PassResultPercentage * 10000)/100).toFixed(0) + '%';
      that.setData({
          postEntity:res.result,
          percentage:percentageTemp
        })
        wx.cloud.downloadFile({
          fileID: res.result.Image
        }).then(res2 => {
          // get temp file path
          //console.log(res2.tempFilePath)
          that.setData({
            imageUrl: res2.tempFilePath
          })
          //重新设置post的ViewUsers数据

        }).catch(error => {
          // handle error
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