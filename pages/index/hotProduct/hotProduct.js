// pages/index/hotProduct/hotProduct.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [
      {
        isActive: true,
      },
      {
        isActive: false,
      },
      {
        isActive: true,
      },
      {
        isActive: false,
      },
      {
        isActive: true,
      },
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.sendRequest({
      url: 'api.php?s=Goods/getHotGoods',
      data: {},
      success: function (res) {
        // console.log(res)
        let code = res.code;
        if (code == 0) {
          let data = res.data;

          console.log(data);
          let new_pro = data;

          that.setData({
            goodsList: new_pro, //新品推荐
          });
        }
      }
    })
  },

  /**
    * 收藏
    */
  toCollect: function (e) {
    let that = this;
    let goodsList = that.data.goodsList;
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    var index = e.currentTarget.dataset.index;
    let is_fav = goodsList[index].is_member_fav_goods;
    let method = is_fav == 0 ? 'FavoritesGoodsorshop' : 'cancelFavorites';
    let message = is_fav == 0 ? '收藏' : '取消收藏';
    is_fav = is_fav == 0 ? 1 : 0;
    goodsList[index].is_member_fav_goods = is_fav;

    app.sendRequest({
      url: 'api.php?s=member/' + method,
      data: {
        fav_id: id,
        fav_type: 'goods',
        log_msg: name
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if (data > 0) {
            app.showBox(that, message + '成功');

            that.setData({
              goodsList: goodsList
            })
          } else {
            app.showBox(that, message + '失败');
          }
        }
      }
    });
  },

  // 跳转商品详情页
  toGood: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var url = e.currentTarget.dataset.url;
    if (url) {
      wx.navigateTo({
        url: '/pages/' + url,
      })
    } else {
      wx.navigateTo({
        url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + id,
      })
    }
  },

  // 返回首页
  toHome:function(e){
    wx.switchTab({
      url: '/pages/index/index',
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