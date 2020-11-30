// miniprogram/pages/share/share.js
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageQrUrl: app.globalData.qrUrl,
    showPopup:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  downloadClick: function (options) {
    let that = this
    wx.showLoading({
      title: '下载中...',
    })
    wx.cloud.downloadFile({
      fileID: app.globalData.qrUrl,
      success: res => {
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: res2 => {

            wx.hideLoading()
            wx.showToast({
              title: '已保存到相册',
              icon: 'success',
              duration: 3000
            })

            let fileMgr = wx.getFileSystemManager()
            fileMgr.unlink({
              filePath: app.globalData.qrUrl,
              success: () => {
                // console.log('删除缓存成功!')
              }
            })
          },
          fail: err => {
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
              console.log("当初用户拒绝，再次发起授权")
              that.setData({
                showPopup:true
              })
         
            }
          },
          complete(res) {
            console.log(res);
            wx.hideLoading()
          }
        })
      },
      fail: err => {
        // handle error
      }
    })

  },
  operateOpenSetting(){
    let that = this
    that.setData({
      showPopup:false
    })
    wx.openSetting({
      success(settingdata) {
        // console.log("settingdata", settingdata)
        if (settingdata.authSetting['scope.writePhotosAlbum']) {
        
          wx.showModal({
            title: '提示',
            content: '获取权限成功,再次点击图片即可保存',
            showCancel: false,
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '获取权限失败，将无法保存到相册哦~',
            showCancel: false,
          })
        }
      },
      fail(failData) {
        console.log("failData", failData)
      },
      complete(finishData) {
        console.log("finishData", finishData)
      }
    })
  },
  onClosePopup(){
    this.setData({
      showPopup:false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onShareTimeline() {

    let shareItem = {}
    shareItem.title = "分享快乐，快乐加倍，分享悲伤，悲伤减半"
    shareItem.query = '/pages/index/index'
    shareItem.imageUrl = this.data.imageQrUrl
    return shareItem
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