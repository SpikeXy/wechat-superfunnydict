const app = getApp()

Page({
    data: {
        files: [],
        isUploadCompleted: false,
        titleValue: '',
        fileKey: '',
        uploadImageResult: false
    },
    onLoad() {

        this.setData({
            selectFile: this.selectFile.bind(this),
            uplaodFile: this.uplaodFile.bind(this)
        })
    },
    goback() {
        wx.navigateBack({
            delata: 1
        })
    },
    handleSuccess() {
        wx.showToast({
            title: '成功',
            icon: 'success'
        })
    },
    handleError() {
        wx.showToast({
            title: '失败',
            icon: 'none'
        })
    },
    handleImageError() {
        wx.showToast({
            title: '图片未上传成功，请稍等',
            icon: 'none'
        })
    },

    submitClick() {
        wx.showLoading({
            title: '加载中',
        })

        var that = this
        if (!that.data.uploadImageResult) {
            that.handleImageError()
        } else {
            //console.log("fileName为"+that.data.fileKey)
            wx.cloud.callFunction({
                    name: 'SubmitPost',
                    data: {
                        title: that.data.titleValue,
                        fileName: that.data.fileKey
                    }
                })
                .then(res => {
                    if (res.result == 1) {

                        //提示上传成功
                        that.handleSuccess()

                        //重新跳转到"我的"界面
                        //console.log("开始增加用户的典值")
                        //用户的典值+1
                        wx.cloud.callFunction({
                            name: 'UpdateUserScore',
                            data: {
                                addScore: 1,
                            }
                        }).then(() => {
                            wx.hideLoading({
                                complete: (res) => {
                                    that.goback()

                                },
                            })

                        })


                    } else {
                        //上传失败，给出原因，给出确定按钮返回"我的"页面
                        //提示上传成功
                        that.handleError()
                        wx.hideLoading({
                            complete: (res) => {
                                //重新跳转到"我的"界面
                                that.goback()

                            },
                        })

                    }
                })
        }

    },
    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                    files: that.data.files.concat(res.tempFilePaths)
                });
            }
        })
    },
    previewImage: function (e) {
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览的图片http链接列表
        })
    },
    selectFile(files) {

        // 返回false可以阻止某次文件上传
    },
    uplaodFile(files) {
        wx.showLoading({
          title: '上传中',
        })
        var that = this
        // 文件上传的函数，返回一个promise
        return new Promise((resolve, reject) => {
            const path = files.tempFilePaths[0];
            const fileNameTemp = path.substr(String(path).lastIndexOf('/') + 1)

            //const filePathTemp = files.tempFilePaths[0]
            //var fileBuffer = files.contents[0]
            //console.log(filePathTemp)

            const fileSuffix = fileNameTemp.substr(fileNameTemp.lastIndexOf('.'))

            const dateTimeFileName = (new Date().getFullYear()) + (new Date().getMonth()) + (new Date().getDay()) + String(parseInt(Math.random() * 1000000000)) + fileSuffix

            wx.cloud.uploadFile({
                cloudPath: 'image/' + dateTimeFileName,
                filePath: path, // 文件路径
            }).then(res => {
                let fileId = res.fileID
                //对上传文件进行webp处理，处理后上传到数据库中
                wx.cloud.callFunction({
                    name: "compressGif",
                    data: {
                        fileName: dateTimeFileName,
                        // file: fileRes.data,
                        fileId: fileId
                    }
                }).then(resFinal => {
                    let finalFileId = resFinal.result
                    var urlArray = []
                    urlArray.push(finalFileId)
                    that.setData({
                        // uploadImg: path,
                        isUploadCompleted: true,
                        fileKey: finalFileId
                    });
                    resolve({
                        urls: urlArray
                    })
                })

            }).catch(error => {
                // handle error
            })
        })
    },
    uploadError(e) {
        // console.log('upload error', e.detail)
        //加个alert，提示上传图片错误
    },
    uploadSuccess(e) {
        // console.log('upload success', e.detail)
        wx.hideLoading({
          success: (res) => {},
        })

    }
});