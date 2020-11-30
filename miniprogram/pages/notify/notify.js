// miniprogram/pages/check.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    notifyList: [],
    current: 'remind',
    pageIndex: 1,
    disablePre: true,
    disableNext: false,
    hasData:false,
    noDataImageUrl:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      noDataImageUrl :  app.globalData.noDataImageUrl
    })
    var that = this
    if (options.pageIndex == null || options.pageIndex == undefined) {
      that.GetNotifyData(this.data.pageIndex)
    } else {
      that.GetNotifyData(options.pageIndex)
    }

  },
  GetNotifyData(index) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'GetNotify',
      data: {
        pageSize: 10,
        pageIndex: index
      }
    }).then(res => {
      res.result.forEach(element => {
        if (element.Type == 1) {
          element.IconName = "passed"
        } else if (element.Type == 2) {
          element.IconName = "close"
        } else {
          element.IconName = "flag-o"
        }
        if (element.ScoreWave > 0) {
          element.ScoreWaveDescription = "典值增加 " + element.ScoreWave
        } else {
          element.ScoreWaveDescription = "典值减少 " + element.ScoreWave
        }
        element.NavUrl = '/pages/post/post?PostId=' + element.PostId
      });
      wx.hideLoading({
        complete: (res) => {},
      })
      if(res.result==null || res.result==undefined|| res.result.length==0){
        that.setData({
          hasData: false
        })
      }else{
        that.setData({
          hasData: true
        })
        var reLength = res.result.length
        that.setData({
          notifyList: res.result
        })
        //对页码按钮的禁用进行设置
        if (index == 1) {
          that.setData({
            //禁用上一页按钮
            disablePre:true
          })
          
        }else{
          that.setData({
            //禁用上一页按钮
            disablePre:false
          })
        }
        if (reLength < 10) {
          that.setData({
            //禁用下一页按钮
            disableNext:true
          })
  
        }else{
          that.setData({
            //禁用下一页按钮
            disableNext:false
          })
        }
       
      }
   

    })
  },
  prePageClick: function (options) {
    this.GetNotifyData(this.data.pageIndex - 1)
    this.setData({
      pageIndex:this.data.pageIndex - 1
    })
  },
  nextPageClick: function (options) {
    this.GetNotifyData(this.data.pageIndex + 1)
    this.setData({
      pageIndex:this.data.pageIndex + 1
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