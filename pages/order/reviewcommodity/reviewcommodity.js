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

  /**
   * 输入评价
   */
  inputContent: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let content = e.detail.value;
    let goodsEvaluate = that.data.goodsEvaluate;

    goodsEvaluate[index].content = content;

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

    if (goodsEvaluate[index].img_num >= 5) {
      return false;
    }
    //选择图片
    wx.chooseImage({
      count: 1,
      sizeType: 'compressed',
      success: function (res) {
        let filePath = res.tempFilePaths[0];
        let tempFiles = res.tempFiles[0];
        if (tempFiles.size > 1024 * 1024 * 8) {
          app.showBox(that, '上传图片过大');
          return;
        }

        //上传至服务器
        that.uplodeHeadImg(that, filePath, index, goodsEvaluate);
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

    wx.uploadFile({
      url: base + 'api.php?s=upload/uploadFile',
      filePath: filePath,
      name: name,
      formData: {
        token: app.globalData.token,
        file_path: 'upload/comment/',
      },
      success: function (res) {
        console.log(res);
        let data = res.data;

        if (JSON.parse(data)) {
          data = JSON.parse(data);
        } else {
          app.showBox(that, '上传失败');
        }

        let code = data.code;
        if (code == 0) {
          data = data.data;
          let code = data.code;
          let message = data.message;
          let img_url = data.data;
          img_url = app.IMG(img_url);

          if (code > 0) {
            //加入图片数组
            if (goodsEvaluate[index].imgs == '') {
              goodsEvaluate[index].imgs = img_url;
              goodsEvaluate[index].img_num = 1;
              img_list[index][0] = img_url;
            } else {
              goodsEvaluate[index].imgs += ',' + img_url;
              goodsEvaluate[index].img_num++;
              img_list[index][img_list[index].length] = img_url;
            }
            that.setData({
              goodsEvaluate: goodsEvaluate,
              img_list: img_list
            })

          } else {
            app.showBox(that, message);
          }

        } else {
          app.showBox(that, '上传失败');
        }
      },
      fail: function (res) {
        console.log(res);
        app.showBox(that, '上传失败');
      }
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
        goodsEvaluate[index].imgs = img_list[index].join();
        goodsEvaluate[index].img_num--;

        that.setData({
          img_list: img_list,
          goodsEvaluate: goodsEvaluate
        })
        if (code == 0) {
          if (data.success_count > 0) {

          } else {
            app.showBox(that, '删除失败');
          }
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
    }
    goodsEvaluate = JSON.stringify(goodsEvaluate);

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
