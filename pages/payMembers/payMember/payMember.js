const app = new getApp();
// pages/members/payMember/payMember.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',  //等待标识
    nextImg:[],   //赠送礼物商品图片
    firstImg:[],   //上半截商品图片
    goods_id:'',   //会员模拟商品id
    member_money:""   //会员价格
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 会员标题
    wx.setNavigationBarTitle({
      title: "会员开通",
    })
    let that = this;

    app.sendRequest({
      url: 'api.php?s=goods/getVipCardList',
      success: function (res) {
        let code = res.code;
        let data = res.data;
        let memberInfo = data.data;
        let firstImg = memberInfo.slice(0, -6);
        let nextImg = memberInfo.slice(-6);
        let member_money = data.info.promotion_price
        let goods_id = data.info.goods_id
        // console.log(member_money)
        if (code == 0) {
          that.setData({
            firstImg: firstImg,
            nextImg: nextImg,
            goods_id: goods_id,
            member_money
          })

          wx.hideLoading()

        }
      }
    })

  },
  toOpen:function(){
    let that=this
    let member_money= that.data.member_money
    let goods_id = that.data.goods_id
    console.log(goods_id)
    wx.navigateTo({
      url: '/pages/payMembers/perfectInfo/perfectInfo?goods_id=' + goods_id+'&member_money=' + member_money,
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
  },

  // 点击到商品详情页
  toDetail: function (event) {
    let that = this
    let member_money = that.data.member_money
    let goods_id = that.data.goods_id
    let goodsId = event.currentTarget.dataset.id;
    let goodsTitle = event.currentTarget.dataset.title;
    if (goodsId) {
      wx.navigateTo({
        url: "/pages/goods/goodsdetail/goodsdetail?goods_id=" + goodsId + "&&goods_name=" + goodsTitle
      })
    } else {
      // wx.navigateTo({
      //   url: '/pages/payMembers/perfectInfo/perfectInfo?goods_id=' + goods_id + '&member_money=' + member_money,
      // })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})