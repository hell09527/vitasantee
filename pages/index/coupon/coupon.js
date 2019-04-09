// pages/index/coupon/coupon.js
const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupon:[],    //优惠券列表
    selectId:'',    //选中的优惠券id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;

    // 优惠券列表获取
    app.sendRequest({
      url: "api.php?s=/member/receiveCoupon",
      data: {},
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        var coupon = res.data;
        var selectId='';
        for (let i = 0; i < coupon.length; i++) {
          coupon[i].status = 0;
          coupon[0].status = 1;
          selectId = coupon[0].coupon_type_id
        }
        that.setData({
          coupon,
          selectId,
        })
      }
    });

    app.sendRequest({
      url: "api.php?s=member/getMemberDetail",
      success: function (res) {
        let data = res.data
        if (res.code == 0) {
          that.setData({
            uid:res.data.uid,
          })
        }
      }
    })
  },

  // 单选
  selectCart:function(e){
    var id = e.currentTarget.dataset.id;
    var coupon=this.data.coupon;
    for (let i = 0; i < coupon.length;i++){
      coupon[i].status = 0;
      if (id == coupon[i].coupon_type_id){
        coupon[i].status=1;
      }
    }
    this.setData({
      coupon,
      selectId:id,
    })
  },

  // 点击分享优惠券
  // share: function () {
  //   var id = this.data.selectId;
  //   wx.navigateTo({
  //     url: '/pages/index/couponReceive/couponReceive?id=' + id, 
  //   })
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showShareMenu({
      withShareTicket: true
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
    let that = this;
    var id = this.data.selectId;
    var uid = this.data.uid;
    console.log(uid);
    return {
      imageUrl: 'https://static.bonnieclyde.cn/hui.jpg',
      title: ' 分享给你的优惠券',
      path: '/pages/index/couponReceive/couponReceive?id=' + id+'&uid='+uid,
      success: function (res) {
        app.showBox(that, '分享成功');
      },
      fail: function (res) {
        app.showBox(that, '分享失败');
      }
    }
  }

})