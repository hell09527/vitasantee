// components/common/goodsList/goodsList.js
let app = getApp();
Component({
  properties: {
    brandGoods: {
      type: Array,
      value: []
    },
    unregistered: {
      type: Number,
      value: 0
    },
    tel: {
      type: String,
      value: ''
    },
    msg: {
      type: String,
      value: '暂时没有更多商品了'
    },
    isNoGoods: {
      type: Boolean,
      value: true
    }
  },
  data: {

  },
  methods: {
    // 商品详情
    toGood(e) {
      let that = this;
      var id = e.currentTarget.dataset.id;
      var url = e.currentTarget.dataset.url;
      if (url) {
        wx.navigateTo({
          url: '/' + url,
        })
      } else {
        wx.navigateTo({
          url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + id,
        })
      }
    },
    // 未登录后登陆
    Crossroad(e) {
      let _that = this;
      let Tel = _that.data.tel;
      if (app.globalData.unregistered == 1 || Tel == '') {
        wx.navigateTo({
          url: '/pages/member/resgin/resgin',
        })
      }
    },
    //收藏
    toCollect(e) {
      let that = this;
      let goodsList = that.data.brandGoods;
      let { id, name, index } = e.currentTarget.dataset;
      let is_fav = goodsList[index].is_member_fav_goods;
      let method = is_fav == 0 ? 'FavoritesGoodsorshop' : 'cancelFavorites';
      let message = is_fav == 0 ? '收藏' : '取消收藏';
      is_fav = is_fav == 0 ? 1 : 0;
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
            let state = data > 0;
            message += state ? '成功' : '失败';
            that.triggerEvent('collect', { index, is_fav, state, message });
          }
        }
      })
    }
  }
})
