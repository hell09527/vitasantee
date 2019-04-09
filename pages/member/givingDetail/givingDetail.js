// pages/member/givingDetail/givingDetail.js
const app = new getApp();
var time = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Base: '',
    defaultImg: {},
    webSiteInfo: {},
    giftDetail: {},   //礼物数组
    allNum:0,    //总件数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "订单详情",
    })
    let that = this;
    let base = app.globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;
    let webSiteInfo = app.globalData.webSiteInfo;

    if (options.id) {
      console.log(options.id);
      that.setData({
        Base: base,
        defaultImg: defaultImg,
        webSiteInfo: webSiteInfo,
        order_id: options.id
      })
    }
  },
  /**
* 页面跳转
*/
  listClick: function (event) {
    let that = this;
    let url = event.currentTarget.dataset.url;
    let listClickFlag = that.data.listClickFlag;

    // if (listClickFlag == 1) {
    //   return false;
    // }
    // app.clicked(that, 'listClickFlag');

    wx.navigateTo({
      url: '/pages' + url,
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
    let that = this;
    let order_id = that.data.order_id;
    console.log(order_id)
    app.restStatus(that, 'goodsDetailFlag');
    app.restStatus(that, 'verificationFlag');
    app.restStatus(that, 'logisticsFlag');
    app.sendRequest({
      url: 'api.php?s=order/orderDetail',
      data: {
        order_id: order_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(data);
        if (code == 0) {
          let order_detail = data;
          let allNum=0;
          //图片处理
          for (let index in order_detail.order_goods_no_delive) {
            allNum = parseInt(allNum) +parseInt(order_detail.order_goods_no_delive[index].num);
            if (order_detail.order_goods_no_delive[index].picture_info != undefined) {
              let img = order_detail.order_goods_no_delive[index].picture_info.pic_cover_small;
              order_detail.order_goods_no_delive[index].picture_info.pic_cover_small = app.IMG(img);
            } else {
              order_detail.order_goods_no_delive[index].picture_info = {};
              order_detail.order_goods_no_delive[index].picture_info.pic_cover_small = '';
            }
          }
          //时间格式转化
          order_detail.create_time = time.formatTime(order_detail.create_time, 'Y-M-D h:m:s')
          order_detail.shipping_time = order_detail.shipping_time > 0 ? time.formatTime(order_detail.shipping_time, 'Y-M-D') : '工作日、双休日与节假日均可送货';
          // order_detail.address = order_detail.address.replace(/&nbsp;/g, '　');
          that.setData({
            giftDetail: order_detail,
            allNum:allNum,
          })
        }
        console.log(res);
      }
    })
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