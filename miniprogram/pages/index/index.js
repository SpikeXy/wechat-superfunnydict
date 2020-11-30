
//index.js
const app = getApp()

Page({
  data: {
    title: "",
    imageUrl: "",
    likeCount: 0,
    postId: "",
    announcement: "",
    showData: false,
    disableLike: 0,
    pageIndex: 1,
    listData: [],
    currentId: "",
    showShare: false,
    imageHight:app.globalData.windowHeight,
    imageWidth:app.globalData.windowWidth,
    CustomBar:app.globalData.CustomBar,
    StatusBarHeight:app.globalData.StatusBar,
    swiperItemHeight:  app.globalData.windowHeight  - app.globalData.CustomBar
  },

  onLoad: function () {
    var that = this
    this.loadData(this.data.pageIndex)
    wx.cloud.callFunction({
      name: 'GetGlobalInfo',
      data: {}
    }).then(res => {
      wx.setStorage({
        data: res.result.data[0].isTencentTest,
        key: 'isTencentTest',
      })
    })

  },
  zanClick: function (e) {
    var that = this
    let postId = e.target.dataset.id
    wx.cloud.callFunction({
      name: 'AddZan',
      data: {
        postId: postId
      }
    }).then(res => {
      let groupData = that.data.listData
      for(var i = 0 ; i < groupData.length ; i++){
        if(groupData[i]._id == postId){
          groupData[i].LikeCount++
          groupData[i].IsLike = 1
          break
        }
      }
      that.setData({
        listData: groupData
      })
    })
  },
 
  changeCurrentItem(e) {
    let _this = this
    let tempId = e.detail.currentItemId
    this.setData({
      currentId: tempId,
      showShare: false
    })
    let groupData = this.data.listData
    let j = 0
    for (var i = 0; i < groupData.length; i++) {
      if (tempId == groupData[i]._id) {
        j = i
        _this.setData({
          title: groupData[i].Title,
          imageUrl: groupData[i].Image,
        })
        break
      }
    }
    //这里需要判断一下 currentId 在 groupList中的位置，如果是倒数第二位置了，就重新对 groupList 进行组合
    if (j == (groupData.length - 5)) {
      let pageIndexTemp = this.data.pageIndex + 1
      this.setData({
        pageIndex: pageIndexTemp
      })
      this.loadData(pageIndexTemp)
    }
  },
  loadData(pageIndex) {
    var that = this
    //获取post信息
    wx.cloud.callFunction({
      name: 'GetPostList',
      data: {
        pageIndex: pageIndex,
        pageSize: 10
      }
    }).then(res6 => {
      var postEntityList = res6.result
      if (postEntityList != null && postEntityList.length > 0) {
        let tempList = that.data.listData
        tempList = tempList.concat(postEntityList)
        if(pageIndex == 1){
          that.setData({
            listData: tempList,
            showData: true,
            currentId: tempList[0]._id
          })
        }else{
          that.setData({
            listData: tempList,
            showData: true
          }) 
        }


        wx.hideLoading({
          complete: (res) => {},
        })

      } else {
        wx.showToast({
          title: '已到最后一页',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  onShow: function () {

    this.setData({
      noDataImageUrl: app.globalData.noDataImageUrl
    })
  },
  onShareAppMessage: function (res) {
        //发送给朋友
        let postId = this.data.currentId
        let groupData = this.data.listData
        let title = ""
        let image = ""
        for (var i = 0; i < groupData.length; i++) {
          if (postId == groupData[i]._id) {
            title = groupData[i].Title
            image = groupData[i].Image
            console.log(title)
            break
          }
        }
        let shareItem = {}
        shareItem.title = title
        shareItem.path = '/pages/postsingle/index?postid=' + postId
        shareItem.imageUrl = image != undefined ? image : ""
        return shareItem
  },
  // onShareTimeline() {
  //   //转发到朋友圈设置
  //   let postId = this.data.currentId
  //   let groupData = this.data.listData
  //   let title = ""
  //   let image = ""
  //   for (var i = 0; i < groupData.length; i++) {
  //     if (postId == groupData[i]._id) {
  //       title = groupData[i].Title
  //       image = groupData[i].Image
  //       break
  //     }
  //   }
  //   let shareItem = {}
  //   shareItem.title = title
  //   shareItem.query = '/pages/postsingle/index?postid=' + postId
  //   // shareItem.query = '/pages/index/index'
  //   shareItem.imageUrl = image != undefined ? image : ""
  //   return shareItem
  // }

})