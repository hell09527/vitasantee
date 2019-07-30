// pages/index/hotProduct/hotProduct.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    swiperCurrent: 0,
    imgUrls: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    that.initData();
    if (app.globalData.token && app.globalData.token != '') {
      //判断是否是付费会员的接口
      that.XXS_reuse();
    } else {
      app.employIdCallback = employId => {
        if (employId != '') {
          //判断是否是付费会员的接口
          that.XXS_reuse();
        }

      }
    }
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

  XXS_reuse: function () {
    let that = this;

    app.sendRequest({
      url: "api.php?s=member/getMemberDetail",
      success: function (res) {
        let data = res.data
        if (res.code == 0) {
          let is_vip = data.is_vip;
          app.globalData.is_vip = data.is_vip;
          app.globalData.distributor_type = data.distributor_type;
          let distributor_type = data.distributor_type;
          app.globalData.uid = data.uid;
          app.globalData.vip_gift = data.vip_gift;
          app.globalData.vip_goods = data.vip_goods;
          let tel = data.user_info.user_tel;
          if (tel !== null || tel !== undefined || tel !== '') {
            console.log(111)
          } else if (tel == '') {
            console.log(223)
          }

          let updata = that.data.unregistered;
          updata = app.globalData.unregistered;
          console.log(updata, 'updata', '134', data.is_employee);
          // console.log(app.globalData.is_vip)
          that.setData({
            is_vip: is_vip,
            tel: tel,
            distributor_type,
            unregistered: updata,
            is_employee: data.is_employee,
          })



        }
      }
    })
  },
  // 初始化数据
  initData(){
    let that = this;
    app.sendRequest({
      url: 'api.php?s=Goods/getHotSaleGoods',
      data: {},
      success: function (res) {
        // console.log(res)
        let code = res.code;
        if (code == 0) {
          let data = res.data;

          // console.log(data);
          let new_pro = data.list_hot.map(item => {
            let tmp = item.sku_list.sort((a,b) => a.promote_price - b.promote_price)[0];
            item.market_price = tmp.market_price;
            item.price = tmp.price;
            item.promote_price = tmp.promote_price;
            return item;
          });
          var adv_index = data.adv_hot;
          let adv_list = adv_index.adv_list;
          if (adv_index.is_use != 0) {
            for (let index in adv_list) {
              let img = adv_list[index].adv_image;
              adv_list[index].adv_image = app.IMG(img);
            }
          } else {
            adv_list = [];
          }

          that.setData({
            goodsList: new_pro, //新品推荐
            imgUrls: adv_list,
            swiperHeight: adv_index.ap_height,
            unregistered: app.globalData.unregistered
          });
        }
      }
    })
  },
  /**没登录*/
  Crossdetails: function () {
    let _that = this;
    let Tel = _that.data.tel;
    if (app.globalData.unregistered == 1 || Tel == '') {
      wx.navigateTo({
        url: '/pages/member/resgin/resgin',
      })
    }
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

  swiperChange: function (e) {
    // console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
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