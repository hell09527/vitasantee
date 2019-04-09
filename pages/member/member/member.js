const app = new getApp();
var time = require("../../../utils/util.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    indexCheck: 0,
    classCheck: 0,
    cartCheck: 0,
    userCheck: 1,
    Base: '',
    defaultImg: '',
    member_info: {},

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let base = app.globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;

    that.setData({
      Base: base,
      defaultImg: defaultImg
    })
  },

  //跳转
  listClick: function (e) {
    let data_url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '/pages/' + data_url ,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // vip_overdue_time

  },

  REUSE_member: function () {
    let that = this;
    app.sendRequest({
      url: 'api.php?s=member/memberIndex',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          that.setData({
            unpaidOrder: data.unpaidOrder,
            shipmentPendingOrder: data.shipmentPendingOrder,
            goodsNotReceivedOrder: data.goodsNotReceivedOrder,
            giftGiveOrder: data.giftGiveOrder,
            refundOrder: data.refundOrder,
            integralConfig: data.integralConfig,
            isSign: data.isSign,
            is_verification: data.is_verification,
            is_open_virtual_goods: data.is_open_virtual_goods,
            memberCouponCount: data.memberCouponCount,
            goodsFavoritesCount: data.goodsFavoritesCount,
          })
        }
        // console.log(res)
      }
    })


    app.sendRequest({
      url: "api.php?s=member/getMemberDetail",
      success: function (res) {
        let data = res.data
        if (res.code == 0) {
          let member_info = data;
          let distributor_type = data.distributor_type;
          console.log(distributor_type)
          let img = member_info.user_info.user_headimg;
          member_info.user_info.user_headimg = app.IMG(img); //图片路径处理
          let tel = data.user_info.user_tel;
          console.log(tel);
          that.setData({
            member_info: res.data,
            tel: tel,
            distributor_type,
          })
        }
      }
    })
  },

  /**触发*/
  Crossroad: function () {
    let _that = this;
    let Tel = _that.data.tel;
    if (app.globalData.unregistered == 1 || Tel == '') {
      wx.navigateTo({
        url: '/pages/member/resgin/resgin',
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    //是否授权数据更新
    let updata = app.globalData.unregistered;
    console.log(updata)
    let vip_overdue_time = app.globalData.vip_overdue_time
    // console.log(vip_overdue_time)
    //会员有效期
    let vip_validity = time.formatTime(vip_overdue_time, 'Y年M月D日');
    // console.log(time.formatTime(vip_overdue_time, 'Y年M月D日'))
    let tab_parm = app.globalData.tab_parm;
    let tab_type = app.globalData.tab_type;
    let tab = app.globalData.tab;
    // console.log(tab)
    let is_vip = app.globalData.is_vip
    // console.log(is_vip, tab_type)

    that.setData({
      vip_validity: vip_validity,
      unregistered: updata,
      is_vip
    })

    if (tab_parm == 'cancle_pay') {
      if (tab == 2) {
        let url = tab_type == 2 ? '/pages/order/myvirtualorderlist/myvirtualorderlist' : '/pages/member/givingRecords/givingRecords?status=1';
        app.setTabParm('');
        app.setTabType('');

        wx.navigateTo({
          url: url,
        })
      } else {
        let url = tab_type == 2 ? '/pages/order/myvirtualorderlist/myvirtualorderlist' : '/pages/order/myorderlist/myorderlist?status=1';
        app.setTabParm('');
        app.setTabType('');
        wx.navigateTo({
          url: url,
        })
      }

    }


    let member_info = that.data.member_info;
    app.restStatus(that, 'listClickFlag');
    //回调解决执行的先后顺序的问题
    if (app.globalData.token && app.globalData.token != '') {
      //判断是否是付费会员的接口
      that.REUSE_member();
    } else {
      app.employIdCallback = employId => {
        if (employId != '') {
          //判断是否是付费会员的接口
          that.REUSE_member();

        }
      }
    }

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