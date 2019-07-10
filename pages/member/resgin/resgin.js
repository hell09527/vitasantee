// pages/member/resgin/resgin.js
const app = new getApp();
const SERVERS = require('../../../utils/servers.js');
const core = require('../../../utils/core.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    layout: false,
    suffix: '',//后缀
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //是否授权数据更新
    that.setData({
      unregistered: app.globalData.unregistered,
    })
    if (options.suffix) {
      that.setData({
        suffix: options.suffix,
      })
    }
  },

  /**登录分支点*/
  Branch: function (e) {
    let _that = this;
    let suffix = _that.data.suffix;
    let branch = e.currentTarget.dataset.status;
    if (branch == "mobile") {
      _that.setData({
        layout: false,
        Choice: false
      })

      wx.navigateTo({
        url: '/pages/member/updatemobile/updatemobile?cho=1' + '&suffix=' + suffix,
      })
    } else if (branch == "no") {
      _that.setData({
        Choice: false
      })
    }
  },

  hideModal: function () {
    this.setData({
      showModal: false,
      layout: false,
    })
  },
  /**触发*/
  Crossroad: function () {
    let _that = this;
    _that.setData({
      Choice: true
    })
  },

  //获取微信手机号
  getPhoneNumber: function (e) {
    let that = this;
    //判断是否容许获取微信手机号码
    if (e.detail.iv) {
      let setIv = e.detail.iv;
      let setEncryptedData = e.detail.encryptedData;
      that.setData({ setIv, setEncryptedData });
      //判断是否继续弹出获取个人信息弹窗
      if (app.globalData.unregistered == 0) {
        that.weChatMobileLoginModify(e.detail);
      } else {
        that.setData({
          showModal: true,
        })
      }
    }
  },

  //获取头像
  bindgetuserinfo: function (res) {
    let that = this;
    let { iv, encryptedData } = res.detail;
    if (iv) {
      app.globalData.iv = iv;
      app.globalData.encryptedData = encryptedData;
      app.globalData.unregistered = 0;
      let branch = res.currentTarget.dataset.status;

      this.setData({
        showModal: false
      });

      if (branch == "mobile") {
        this.setData({
          layout: true
        })
        that.weChatLoginModify(res.detail);
      } else {
        that.weChatLoginModify(res.detail,that.weChatMobileLoginModify);
      }
    } else {
      this.setData({
        showModal: false,

      })
    }
  },
  /***
   * (修改)微信登录获取用户信息部分
   * @param {object} info  用户授权后返回的数据(e.detail)
   * @param {function} fn  用户登录后回调
   *  */ 
  weChatLoginModify(info,fn){
    let that = this;
    // 微信登录获取code
    core.wxApi().then(res => {
      let code = res.code;
      // 登录api
      SERVERS.LOGIN.getWechatEncryptInfo.post({
        code,
        iv: info.iv,
        encryptedData: info.encryptedData,
        traffic_acquisition_source: app.globalData.traffic_acquisition_source
      }).then(res => {
        if (res.code == 0) {
          app.globalData.openid = res.data.openid;
          app.globalData.token = res.data.token;
          that.setData({
            unregistered: 0, //已登录状态0，未登录1
            heder_img: info.userInfo.avatarUrl,
            wx_name: info.userInfo.nickName
          });
          fn&&fn();
        }
      }).catch(e => console.log(e));
    }).catch(e => console.log(e));
  },
  /***
   * (修改)微信登录绑定手机号部分
   *  */ 
  weChatMobileLoginModify(){
    let that = this;
    core.wxApi().then(res => {
      let code = res.code;
      SERVERS.MEMBER.getWechatMobile.post({
        code: code,
        mobileEncryptedData: that.data.setEncryptedData,
        mobileIv: that.data.setIv
      }).then(res => {
        if(res.code == 0){
          that.setData({
            tel: res.data.user_tel
          });
          // 返回
          that.toBack();
        }
        if(res.message == '手机号已存在')return that.toBack();
      }).catch(e => console.log(e));
    }).catch(e => console.log(e));
  },
  // 返回
  toBack: function () {
    let _that = this;
    let suffix = _that.data.suffix;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    //console.log(currPage, prevPage);

    if (prevPage.route == "pages/member/kolApply/kolApply") {
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        uid: app.globalData.recommendUser,
      })
      wx.redirectTo({
        url: '/pages/member/kolApply/kolApply?uid=' + app.globalData.recommendUser,
      })
    } else if (prevPage.route == "pages/goods/goodsdetail/goodsdetail") {
      console.log(11);
      console.log(suffix)
      //  商品详情页面
      wx.redirectTo({
        url: "/pages/goods/goodsdetail/goodsdetail?goods_id=" + suffix,
      })

    } else if (prevPage.route == "pages/member/member/member") {
      console.log(22)
      //  个人中心页面
      wx.redirectTo({
        url: "/pages/member/member/member",
      })

    } else if (prevPage.route == "pages/goods/shareRepertoire/shareRepertoire") {
      console.log(33)
      //  购物清单页面
      wx.redirectTo({
        url: "/pages/goods/shareRepertoire/shareRepertoire?share_li=" + suffix,
      })
    } else if (prevPage.route == "package/backPage/fetchGift/fetchGift") {
      console.log(44)
      //  领取礼物页面
      wx.redirectTo({
        url: "/package/backPage/fetchGift/fetchGift?order_id=" + suffix,
      })
    }

    wx.navigateBack({ changed: true });//返回上一页  
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