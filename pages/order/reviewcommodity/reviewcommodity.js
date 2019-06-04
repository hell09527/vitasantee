const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '',
    defaultImg: {},
    goods_list: [],
    img_list: [],
    order_id: '',
    order_no: '',
    goodsEvaluate: [], //评价信息
    scores: 0, //评价星级
    score: 5,
    explain_type: 1, //1好评 2中评 3差评
    explain_types: 5, //1好评 2中评 3差评
    is_anonymous: 0, //是否匿名
    commentvFlag: 0,
    imgNum:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let order_id = options.id;
    let base = app.globalData.siteBaseUrl;
    console.log(base)
    let defaultImg = app.globalData.defaultImg;
    let that = this;
    let goodsEvaluate = that.data.goodsEvaluate;
    let img_list = that.data.img_list;

    app.sendRequest({
      url: 'api.php?s=order/reviewCommodity',
      data: {
        orderId: order_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;

        if (code == 0) {
          let goods_list = data.list;
          let order_no = data.order_no;

          for (let index in goods_list) {
            //图片处理
            if (goods_list[index].picture_info != undefined) {
              let img = goods_list[index].picture_info.pic_cover_micro;
              goods_list[index].picture_info.pic_cover_micro = app.IMG(img);
            } else {
              goods_list[index].picture_info = {};
              goods_list[index].picture_info.pic_cover_micro = '';
            }
            goodsEvaluate[index] = {};
            goodsEvaluate[index].order_goods_id = goods_list[index].order_goods_id;
            goodsEvaluate[index].imgs = '';
            goodsEvaluate[index].img_num = 0;
            goodsEvaluate[index].content = '';
            img_list[index] = [];
          }

          that.setData({
            Base: base,
            defaultImg: defaultImg,
            order_id: order_id,
            order_no: order_no,
            goods_list: goods_list,
            goodsEvaluate: goodsEvaluate,
            img_list: img_list,
          })
        }
        console.log(res)
      }
    });
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
    let that = this;
    app.restStatus(that, 'commentvFlag');
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
   * 图片加载失败
   */
  errorImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let goods_list = that.data.goods_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = goods_list[index].picture_info.pic_cover_micro;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "goods_list[" + index + "].picture_info.pic_cover_micro";

        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  // 判断输入的文字是否有表情
  isEmojiCharacter: function (substring) {
    for (var i = 0; i < substring.length; i++) {
      var hs = substring.charCodeAt(i);
      if (0xd800 <= hs && hs <= 0xdbff) {
        if (substring.length > 1) {
          var ls = substring.charCodeAt(i + 1);
          var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
          if (0x1d000 <= uc && uc <= 0x1f77f) {
            return true;
          }
        }
      } else if (substring.length > 1) {
        var ls = substring.charCodeAt(i + 1);
        if (ls == 0x20e3) {
          return true;
        }
      } else {
        if (0x2100 <= hs && hs <= 0x27ff) {
          return true;
        } else if (0x2B05 <= hs && hs <= 0x2b07) {
          return true;
        } else if (0x2934 <= hs && hs <= 0x2935) {
          return true;
        } else if (0x3297 <= hs && hs <= 0x3299) {
          return true;
        } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
          || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
          || hs == 0x2b50) {
          return true;
        }
      }
    }
  },

  /**
   * 输入评价
   */
  inputContent: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let content = e.detail.value;
    let goodsEvaluate = that.data.goodsEvaluate;

    if (this.isEmojiCharacter(content)) {
      app.showBox(that, '内容不能含有表情');
    } else {
      goodsEvaluate[index].content = content;
    }

    that.setData({
      goodsEvaluate: goodsEvaluate
    })
  },

  /**
   * 上传图片至微信服务器
   */
  uploadImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let goodsEvaluate = that.data.goodsEvaluate;
    let img_list = that.data.img_list;
    let num=9;

    if (img_list[index].length >= 9) {
      app.showBox(that, '最多上传9张');
      return false;
    }
    num = num - img_list[index].length;
    //选择图片
    wx.chooseImage({
      count: num,
      sizeType: 'compressed',
      success: function (res) {
        // console.log(res);
        let filePath = res.tempFilePaths;
        let tempFiles = res.tempFiles;
        for (let i = 0; i < filePath.length; i++) {
          if (tempFiles[i].size > 1024 * 1024 * 8) {
            app.showBox(that, '第' + i + '上传图片过大');
            return;
          } else {
            //上传至服务器
            that.uplodeHeadImg(that, filePath[i], index, goodsEvaluate);
          }
        }

      },
      fail: function (res) {
        app.showBox(that, '无法获取本地图片');
        console.log(res);
      }
    })
  },

  /**
   * 上传至服务器
   */
  uplodeHeadImg: function (that, filePath, index, goodsEvaluate) {
    let name = 'file_upload';
    let img_list = that.data.img_list;
    let base = that.data.Base;

    if (filePath == '') {
      wx.navigateBack({
        delta: 1
      })
    }
    console.log(index)
    wx.showLoading({
      title: '加载中',
      success: function () {
        wx.uploadFile({
          url: base + 'api.php?s=upload/uploadFile',
          filePath: filePath,
          name: name,
          formData: {
            token: app.globalData.token,
            file_path: 'upload/comment/',
          },
          success: function (res) {
            let data = res.data;

            if (JSON.parse(data)) {
              data = JSON.parse(data);
            } else {
              app.showBox(that, '上传失败');
            }
            console.log(filePath, data);

            let code = data.code;
            if (code == 0) {
              data = data.data;
              let code = data.code;
              let message = data.message;
              let img_url = data.data;
              img_url = app.IMG(img_url);
              if (code > 0) {
                //加入图片数组
                if (img_list[index][0] == '') {
                  img_list[index][0] = img_url;
                } else {
                  img_list[index][img_list[index].length] = img_url;
                }
                console.log(img_list)

                that.setData({
                  img_list: img_list,
                })
                

              } else {
                app.showBox(that, message);
              }
              

            } else {
              app.showBox(that, '上传失败');
            }
            wx.hideLoading()
          },
          fail: function (res) {
            console.log(res);
            app.showBox(that, '上传失败');
            wx.hideLoading()
          }
        })
      },
    })
  },

  /**
   * 删除图片
   */
  deleteImg: function (e) {
    let that = this;
    let filename = e.currentTarget.dataset.url;
    let index = e.currentTarget.dataset.index;
    let key = e.currentTarget.dataset.key;
    let img_list = that.data.img_list;
    let goodsEvaluate = that.data.goodsEvaluate;

    app.sendRequest({
      url: 'api.php?s=upload/removeFile',
      data: {
        filename: filename
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        img_list[index].splice(key, 1);

        that.setData({
          img_list: img_list,
        })
        if (code == 0) {

          app.showBox(that, '删除成功');
        }
        console.log(res)
      }
    });
  },

  /**
   * 评价星级
   */
  stars: function (e) {
    let that = this;
    let scores = e.currentTarget.dataset.scores;
    let explain_type = 1;

    explain_type = parseInt(scores) > 1 ? 2 : 3;
    explain_type = parseInt(scores) > 3 ? 1 : explain_type;

    that.setData({
      scores: scores,
      explain_type: explain_type
    })
  },
  ends: function (e) {
    let that = this;
    let score = e.currentTarget.dataset.score;
    let explain_types = 5;

    explain_types = parseInt(score) > 5 ? 6 : 7;
    explain_types = parseInt(score) > 7 ? 5 : explain_types;

    that.setData({
      score: score,
      explain_types: explain_types
    })
  },
  /**
   * 选择匿名
   */
  checkAnonymous: function (e) {
    let that = this;
    let is_anonymous = that.data.is_anonymous;

    is_anonymous = is_anonymous == 0 ? 1 : 0;

    that.setData({
      is_anonymous: is_anonymous
    })
  },

  /**
   * 发表评价
   */
  commentv: function () {
    let that = this;
    let commentvFlag = that.data.commentvFlag;
    let order_id = that.data.order_id;
    let order_no = that.data.order_no;
    let goodsEvaluate = that.data.goodsEvaluate;
    let scores = that.data.scores;
    let explain_type = that.data.explain_type;
    let is_anonymous = that.data.is_anonymous;
    let img_list = that.data.img_list;

    if (commentvFlag == 1) {
      return false;
    }
    app.clicked(that, 'commentvFlag');

    for (let index in goodsEvaluate) {
      goodsEvaluate[index].scores = scores;
      goodsEvaluate[index].explain_type = explain_type;
      goodsEvaluate[index].is_anonymous = is_anonymous;
      if (goodsEvaluate[index].content == '' || goodsEvaluate[index].content == undefined) {
        app.showBox(that, '请输入要评价的内容');
        app.restStatus(that, 'commentvFlag');
        return false;
      }

      goodsEvaluate[index].imgs = img_list[index].join(',');
    }
    goodsEvaluate = JSON.stringify(goodsEvaluate);
    console.log(JSON.stringify(goodsEvaluate))

    app.sendRequest({
      url: 'api.php?s=order/addGoodsEvaluate',
      data: {
        order_id: order_id,
        order_no: order_no,
        goodsEvaluate: goodsEvaluate,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if (data > 0) {
            app.showBox(that, '评价成功');
            wx.navigateBack({
              delta: 1
            })
          } else {
            app.showBox(that, '评价失败');
            app.restStatus(that, 'commentvFlag');
          }
        }else{
          app.showBox(that, '您输入的内容包含敏感词汇！');
        }
        // console.log(res)
      }
    });
  }
})
