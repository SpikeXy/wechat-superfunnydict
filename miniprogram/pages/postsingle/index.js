// miniprogram/pages/post/post.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postEntity:{},
    imageUrl:"",
    // percentage:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const postId = options.postid;
    var that = this
    wx.cloud.callFunction({
      name: 'GetSingalPost',
      data: {
        PostId:postId
      }
    }).then(res=>{
      //console.log(res.result)
      // let  percentageTemp = (Math.round(res.result.PassResultPercentage * 10000)/100).toFixed(0) + '%';
      that.setData({
          postEntity:res.result,
          // percentage:percentageTemp
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
  returnIndexClick(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})