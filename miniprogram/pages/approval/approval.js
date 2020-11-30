// miniprogram/pages/approval/approval.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    haveData: false,
    toggle: false,
    noDataImageUrl: "",
    approvalDataList: [],
    pageIndex: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.setData({
      noDataImageUrl: app.globalData.noDataImageUrl
    })
    wx.getStorage({
      key: 'isTencentTest',
      success(res) {
        let isTencentTest = res.data
        if (isTencentTest) {
          that.getPageData(that.data.pageIndex)
        } else {
          wx.cloud.callFunction({
            name: 'GetUser',
            data: {}
          }).then(res2 => {
            if (res2.result.data != null && res2.result.data != null != undefined && res2.result.data[0].IdentityId < 3) {
              //提示权限不足
              wx.showToast({
                title: '非守望者无法审核',
                icon: 'none',
                duration: 3000
              })
            } else {
              that.getPageData(that.data.pageIndex)
            }
          })



        }
      }
    })

  },
  prePageClick: function (options) {
    this.getPageData(this.data.pageIndex - 1)
    this.setData({
      pageIndex: this.data.pageIndex - 1
    })
  },
  nextPageClick: function (options) {
    this.getPageData(this.data.pageIndex + 1)
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
  },
  getPageData: function (pageIndex) {
    var that = this
    //获取需要审核的用户列表
    wx.cloud.callFunction({
      name: 'GetIdentityApproval',
      data: {
        pageSize: 10,
        pageIndex: pageIndex
      }
    }).then(res => {
      let dataList = res.result
      for(var i = 0 ; i < dataList.length ; i++){
        dataList[i].buttons = [
          {
            text: '拒绝',
            src: 'cloud://superfunnydictionary-ehx7q.7375-superfunnydictionary-ehx7q-1301739628/pic/global/拒绝.svg', // icon的路径
            data: dataList[i].UserOpenId
          },
          {
            text: '通过',
            src: 'cloud://superfunnydictionary-ehx7q.7375-superfunnydictionary-ehx7q-1301739628/pic/global/通过.svg', // icon的路径
            data: dataList[i].UserOpenId
          },
        ]
      }
      that.setData({
        approvalDataList: dataList,
        haveData: dataList.length != 0
      })
    })
  },
  slideButtonTap(e) {
    // console.log('slide button tap', e.detail)
    let userOpenId = e.detail.data
    let that = this
    switch(e.detail.index){
      case 1 :
      //通过
      that.passClick(userOpenId)
      case 0 :
      //拒绝
      that.refuseClick(userOpenId)
    }
},
  passClick: function (userOpenId) {
    wx.showLoading({
      title: '处理中',
    })
    var that = this
    // var userOpenId = e.currentTarget.dataset['useropenid']
    wx.cloud.callFunction({
      name: 'ApprovalIdentity',
      data: {
        userOpenId: userOpenId,
        passValue: 1
      }
    }).then(res => {
      // console.log("ApprovalIdentity的返回结果是")
      // console.log(res.result)
      that.getPageData(that.data.pageIndex)
       wx.hideLoading()
    })
  },
  refuseClick: function (userOpenId) {
    wx.showLoading({
      title: '处理中',
    })

    var that = this

    // let userOpenId = e.currentTarget.dataset['useropenid']

    wx.cloud.callFunction({
      name: 'ApprovalIdentity',
      data: {
        userOpenId: userOpenId,
        passValue: 0
      }
    }).then(res => {
      that.getPageData(that.data.pageIndex)
      wx.hideLoading()
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