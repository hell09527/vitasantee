// pages/member/kolRule/kolRule.js
const app = getApp();
const SERVERS = require('../../../utils/servers.js');
/**
 * 通用规则界面
 * 接受type类型
 *  */
Page({
  data: {
    type: '',
    title:{
      zhuanqian: '惠选师赚钱指南',
      huixuan: '惠选师规则说明',
      pintuan: '拼团活动规则',
    },
    TistData: [
      { "code": "分润待结算状态", "text": "订单付款后，订单获得的分润" },
      { "code": "分润审核期", "text": "订单已收货后7天内的维权期" },
      { "code": "待入账金额", "text": "订单获得的分润处于审核期" },
      { "code": "可提现金额", "text": "订单获得的分润已入账到惠选师账户，等待提现" },
      { "code": "考核期", "text": "每个季度为一个考核期" },
    ],
    distributor_type: 0
  },
  onLoad: function (options) {
    // 初始化规则类型
    this.setData({
      type: options.type,
    });
    // 依据规则类型设置标题
    wx.setNavigationBarTitle({
      title: this.data.title[options.type]
    });
  },
  onReady: function () {
    console.log(app.globalData.unregistered)
    console.log(app.globalData.distributor_type)
    // 分享隐藏列表
    let hideList = ['pintuan'];
    if(hideList.indexOf(this.data.type) != -1){
      wx.hideShareMenu();
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    if (app.globalData.token && app.globalData.token != '') {
      that.SY_reuse();
    } else {
      app.employIdCallback = employId => {
        if (employId != '') {
          that.SY_reuse();
        }
      }
    }
  },
  //获取会员所有信息
  SY_reuse: function () {
    let that = this;
    SERVERS.MEMBER.getMemberDetail.post().then(res => {
      let data = res.data
      if (res.code == 0) {
        let is_vip = data.is_vip;
        app.globalData.is_vip = data.is_vip;
        app.globalData.distributor_type = data.distributor_type;
        app.globalData.uid = data.uid;
        app.globalData.vip_gift = data.vip_gift;
        app.globalData.vip_goods = data.vip_goods;
        app.globalData.vip_overdue_time = data.vip_overdue_time;
        // console.log(data.user_info.user_tel)
        app.globalData.user_tel = data.user_info.user_tel;
        //  console.log(app.globalData.is_vip)
        that.setData({
          distributor_type: data.distributor_type
        })
      }
    }).catch(e => console.log(e));
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
    return {
      title: this.data.title[this.data.type],
      path: '/pages/common/rule/rule?type=' + this.data.type
    }
  }
})