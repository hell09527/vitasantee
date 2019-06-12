const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    FilePaths: '',  //正面
    prompt: '',  //提示语
    recitePaths: '',   //反面
    listData: {

    },    //全数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

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
   * 图片预览
   */
  preivewImg: function (e) {
    let imgUrls = e.currentTarget.dataset.img;
    let urls = [];

    urls.push(imgUrls);
    wx.previewImage({
      current: urls[0],
      urls: urls,
    })
  },
  // 身份证正面上传
  frontimage: function () {
    var FilePaths = this.data.FilePaths;
    // 判断此时上传的身份证是正面还是反面
    this.identityCard('front');
  },

  //   反面上传
  reciteimage: function () {
    var recitePaths = this.data.recitePaths;
    // 判断此时上传的身份证是正面还是反面
    this.identityCard('recite');
  },

  //   上传图片到服务器
  uplodeHeadImg: function (tempFilePaths, paths, listData) {
    var name = 'file_upload';
    var that = this;
    var base = app.globalData.siteBaseUrl;
    var token = app.globalData.token;
    // console.log(tempFilePaths)
    wx.uploadFile({
      url: base + 'api.php?s=upload/uploadFile',
      filePath: tempFilePaths,
      name: name,
      formData: {
        token: token,
        file_path: 'upload/comment/',
      },
      success: function (res) {
        var result = res.data
        // console.log(result);
        var data = JSON.parse(result)
        // console.log(data);
        if (data.code == 0) {
          data = data.data;
          var code = data.code;
          var message = data.message;
          var img_url = data.data;
          img_url = app.IMG(img_url);
          if (code > 0) {
            if (paths == 'face') {
              listData.id_face_pros = img_url;
              that.setData({
                FilePaths: tempFilePaths,
                listData,
              })
              // that.identityFace(tempFilePaths, listData);
            } else if (paths == 'back') {
              listData.id_face_cons = img_url;
              that.setData({
                recitePaths: tempFilePaths,
                listData,
              })
              // that.identityBack(tempFilePaths, listData);
            } else if (paths == 'bankCard') {
              listData.bank_card_pic = img_url;
              that.setData({
                bankCardImage: tempFilePaths,
                listData,
              })
              // that.bankCard(tempFilePaths, listData);
            }
          } else {
            wx.hideLoading();
            app.showBox(that, data.message);
          }
        } else {
          wx.hideLoading();
          app.showBox(that, data.message);
        }
      },
      fail: function (res) {
        wx.hideLoading();
        app.showBox(that, '上传失败');
      }
    })
  },
  // 身份证上传
  identityCard: function (paths) {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9 
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function (result) {
        // 判断图片是否过大
        var tempFiles = result.tempFiles[0];
        if (tempFiles.size > 1024 * 1024 * 8) {
          app.showBox(_this, '上传图片过大');
          return;
        }
        if (paths == 'recite') {
          wx.showLoading({
            title: '加载中',
            success: function () {
              _this.identityBack(result.tempFilePaths[0]);
              // _this.uplodeHeadImg(result.tempFilePaths[0], 'back');
            }
          })
        } else {
          wx.showLoading({
            title: '加载中',
            success: function () {
              _this.identityFace(result.tempFilePaths[0]);
              // _this.uplodeHeadImg(result.tempFilePaths[0], 'face');
            }
          })
        }
      },
      fail: function (res) {
        app.showBox(_this, '无法获取本地图片');
        console.log(res);
      }
    })
  },

  // 身份证正面识别
  identityFace: function (tempFilePaths) {
    var _this = this;
    var listData = this.data.listData;
    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    wx.getFileSystemManager().readFile({
      filePath: tempFilePaths, //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: res => { //成功的回调
        let base64 = 'data:image/jpeg;base64,' + res.data;
        // console.log(base64);
        wx.request({
          url: 'https://ocr2idcard.market.alicloudapi.com/OcridCard',
          data: {
            "image": base64
          },
          method: 'POST',
          header: {
            // "Host": "ocr2idcard.market.alicloudapi.com", 
            // "X-Ca-Timestamp": "1541043385872",
            "gateway_channel": "https",
            "X-Ca-Request-Mode": "debug",
            "X-Ca-Key": "24906978",
            "X-Ca-Stage": "RELEASE",
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
            "Authorization": "APPCODE 2b19f336b34e4b50a7e14ad8c8765932"
          },
          success: function (res) {
            wx.hideLoading();
            console.log(res)
            var data = res.data
            if (data.msg == '实名认证通过！') {
              var list = data.cert;
              //   var sexList = _this.data.sexList;
              //   for (let i = 0; i < sexList.length; i++) {
              //     sexList[i].checked = false;
              //     if (list.sex == '女' && sexList[i].name == '女') {
              //       sexList[i].checked = true;
              //       listData.sex = '女';
              //     } else if (list.sex == '男' && sexList[i].name == '男') {
              //       sexList[i].checked = true;
              //       listData.sex = '男';
              //     }
              //   }

              // 赋值
              listData.real_name = list.name;
              listData.birthday = data.ocr.birthday;
              listData.nation = data.ocr.nation;
              listData.address = data.ocr.address;
              listData.idCard = list.idCard;
              listData.sex = data.ocr.sex;

              _this.uplodeHeadImg(tempFilePaths, 'face', listData)
              //   _this.setData({
              //     sexList,
              //   })
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 2000
              })
              if (listData.issue && listData.real_name) {
                console.log(listData)
                _this.everlasting(_this, listData);

              }
            } else if (data.msg == '姓名格式不正确！') {
              console.log('进来了')
              _this.setData({
                prompt: '姓名格式不正确！'
              })
            } else {
              _this.setData({
                prompt: '请上传身份证人像面'
              })
            }
            setTimeout(function () {
              _this.setData({
                prompt: ''
              })
            }, 2000)
          },
          fail: function (res) {
            wx.hideLoading();
            console.log(res)
            app.showBox(_this, '上传失败')
          }
        });
      },
      fail: function (res) {
        wx.hideLoading();
        console.log(res)
        app.showBox(_this, '上传失败')
      }
    })
  },

  // 身份证反面识别
  identityBack: function (tempFilePaths) {
    var _this = this;
    var listData = this.data.listData;
    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    wx.getFileSystemManager().readFile({
      filePath: tempFilePaths, //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: res => { //成功的回调
        let base64 = res.data;
        // console.log(base64);
        wx.request({
          url: 'https://dm-51.data.aliyun.com/rest/160601/ocr/ocr_idcard.json',
          data: {
            "image": base64,
            "configure": "{\"side\":\"back\"}"
          },
          method: 'POST',
          header: {
            // "Host": "ocr2idcard.market.alicloudapi.com", 
            // "X-Ca-Timestamp": "1541043385872",
            "gateway_channel": "https",
            "X-Ca-Request-Mode": "debug",
            "X-Ca-Key": "24906978",
            "X-Ca-Stage": "RELEASE",
            "Content-Type": "application/octet-stream; charset=utf-8",
            "Authorization": "APPCODE 2b19f336b34e4b50a7e14ad8c8765932"
          },
          success: function (res) {
            wx.hideLoading();
            console.log(res)
            var data = res.data
            if (data.success == true) {
              // 赋值
              listData.issue = data.issue;
              listData.start_date = data.start_date;
              listData.end_date = data.end_date;
              listData.request_id = data.request_id;

              var end_date = data.end_date;


              //获取当前时间
              var date = new Date();
              var year = date.getFullYear();
              var month = date.getMonth() + 1;
              var day = date.getDate();
              if (month < 10) {
                month = "0" + month;
              }
              if (day < 10) {
                day = "0" + day;
              }
              var nowDate = year.toString() + month.toString() + day.toString();
              console.log(end_date)
              console.log(nowDate)
              console.log(parseInt(end_date) - parseInt(nowDate));
              if (parseInt(end_date) - parseInt(nowDate) >= 0) {
                _this.uplodeHeadImg(tempFilePaths, 'back', listData)
                wx.showToast({
                  title: '上传成功',
                  icon: 'success',
                  duration: 2000
                })
                if (listData.issue && listData.real_name) {
                  console.log(listData)
                  _this.everlasting(_this, listData);

                }


              } else {
                _this.setData({
                  prompt: '请上传有效身份证'
                })
              }
            } else {
              _this.setData({
                prompt: '请上传身份证国徽面'
              })
            }
            setTimeout(function () {
              _this.setData({
                prompt: ''
              })
            }, 2000)

          },
          fail: function (res) {
            wx.hideLoading();
            console.log(res)
            app.showBox(_this, '上传失败')
          }
        });
      },
      fail: function (res) {
        wx.hideLoading();
        console.log(res)
        app.showBox(_this, '上传失败')
      }
    })
  },
  // 删除图片
  toDelImg: function (e) {
    let img = e.currentTarget.dataset.img;
    // console.log(img);
    if (img == 'face') {
      this.setData({
        FilePaths: ''
      })
    } else if (img == 'back') {
      this.setData({
        recitePaths: ''
      })
    } else if (img == 'bankCard') {
      this.setData({
        bankCardImage: ''
      })
    }
  },
  everlasting: function (that, list) {
    console.log(list)
    let IN = {
      name: list.real_name,
      issue: list.idCard
    }
    setTimeout(function () {
      app.sendRequest({
        url: "api.php?s=distributor/upUserIDCard",
        data: list,
        success: function (res) {
          console.log(res.data)
          let code = res.code;
          if (code == 1) {
            wx.navigateTo({
              url: '/pages/member/Meinfo/Meinfo?info=' + JSON.stringify(IN),
            })
          }

        }
      })
    }, 1000)


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


})