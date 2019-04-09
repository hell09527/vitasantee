const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    defaultImg: app.globalData.defaultImg,
    category_id: 0,
    goods_list: {}, //商品列表
    search_text: '', //搜索内容
    titleList: [{
      name: '综合排序',
      select: 1,
    },
    {
      name: '品牌类型',
      select: 1,
    },
    {
      name: '功效筛选',
      select: 1,
    },
    ],
    category_list: [],  //分类列表
    currentTab: 0, //预设当前项的值
    page: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let url = '';
    let category_id = options.id;
    let first_id = options.first_index;
    var page = that.data.page;
    console.log(category_id, first_id);
    category_id = undefined ? '' : category_id;

    app.sendRequest({
      url: 'api.php?s=goods/goodsList',
      data: {
        category_id: category_id,
        page: page
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let goods_list = data.goods_list;
          let next_page = that.data.next_page++;
          let goodsCategoryList = data.goodsCategoryList;
          var category_list = [];

          for (let index in goodsCategoryList) {
            if (goodsCategoryList[index].category_id == first_id) {
              category_list = goodsCategoryList[index].child_list
              for (let key in category_list) {
                category_list[key].select = 1;
                if (category_list[key].category_id == category_id) {
                  category_list[key].select = 2
                }
              }
            }
          }
          //图片处理
          for (let index in goods_list) {
            let img = goods_list[index].pic_cover_small;
            goods_list[index].pic_cover_small = app.IMG(img);
          }

          let screen = 0;
          if (goods_list != undefined) {
            page++;
            if (goods_list[0] != undefined && category_id != 0 && category_id != '' && category_id != undefined) {
              screen = 1;
            }
          }

          that.setData({
            goods_list: goods_list,
            goodsCategoryList: goodsCategoryList,
            category_list,
            category_id,
            category_brands: data.category_brands,
            category_price_grades: data.category_price_grades,
            next_page: next_page,
            screen: screen,
            page: page,
          })
          console.log(res);

        }
      },
    })
  },

  // 商品标题点击
  selectCheck: function (e) {
    let that = this
    var id = e.currentTarget.dataset.id;
    console.log(id);
    var category_list = this.data.category_list;
    if (id == 0) {
      var cur = 0;
    } else {
      var cur = e.target.dataset.current;
    }
    for (var i = 0; i < category_list.length; i++) {
      category_list[i].select = 1;
    }
    category_list[cur].select = 2;

    this.setData({
      category_list: category_list,
      page: 1,
      goods_list: [],
    })
    this.toGoods(id, 1)
  },

  // 分类点击获取列表

  toGoods: function (id, page) {
    var that = this;
    var category_goods = that.data.category_goods;

    app.sendRequest({
      url: 'api.php?s=goods/goodsList',
      data: {
        category_id: id,
        page: page
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let goods_list = data.goods_list;
          let next_page = that.data.next_page++;
          let goodsCategoryList = data.goodsCategoryList;
          var category_list = [];

          if (goods_list[0] != undefined) {

            //图片处理
            for (let index in goods_list) {
              let img = goods_list[index].pic_cover_small;
              goods_list[index].pic_cover_small = app.IMG(img);
            }

            let screen = 0;
            if (goods_list != undefined) {
              page++;
              if (goods_list[0] != undefined && id != 0 && id != '' && id != undefined) {
                screen = 1;
              }
            }

            that.setData({
              goods_list: goods_list,
              next_page: next_page,
              screen: screen,
              page: page,
              isNoGoods: false,
            })
          } else {
            that.setData({
              isNoGoods: true,
            })
          }
        }
      },
    })
  },


  toGood: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + id,
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
    app.restStatus(that, 'listClickFlag');
    app.restStatus(that, 'searchFlag');
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
   * 图片加载失败
   */
  errorImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let goods_list = that.data.goods_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = goods_list[index].pic_cover_small;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "goods_list[" + index + "].pic_cover_small";

        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 页面跳转
   */
  listClick: function (event) {
    let that = this;
    let url = event.currentTarget.dataset.url;
    let listClickFlag = that.data.listClickFlag;

    if (listClickFlag == 1) {
      return false;
    }
    app.clicked(that, 'listClickFlag');

    wx.navigateTo({
      url: '/pages' + url,
    })
  },

  /**
   * 输入框绑定事件
   */
  searchInput: function (event) {
    let search_text = event.detail.value;
    this.setData({
      search_text: search_text
    })
  },

  // 跳转搜索页
  toSearch: function () {
    if (this.data.searchVal != '') {
      wx.navigateTo({
        url: '/pages/goods/goodssearchlist/goodssearchlist?search_text=' + this.data.searchVal,
      })
    }
  },

  // 搜索
  searchInput: function (e) {
    var val = e.detail.value;
    console.log(e.detail.value);
    this.setData({
      searchVal: val
    })
  },

})