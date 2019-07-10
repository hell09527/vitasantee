// pages/index/couponDetail/couponDetail.js
const SERVERS = require('../../../utils/servers.js');
Page({
  data: {
    id: '',
    url: ''
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.initData();
  },
  // 初始化数据
  initData(){
    let that = this;
    SERVERS.MEMBER.couponShow.post({
      coupon_id: this.data.id
    }).then(res => {
        that.setData({
          url: res.data
        })
    }).catch(e => console.log(e));
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})