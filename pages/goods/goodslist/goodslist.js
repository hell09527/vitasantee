const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    defaultImg: app.globalData.defaultImg,
    category_id: 0,
    category_goods: {}, //商品列表
    search_text: '', //搜索内容
    category_list: [],  //分类列表
    currentTab: 0, //预设当前项的值
    page: 1,
    goodsSelect: false,   //全部商品状态
    recommendSelect: false,   //推荐状态
    brandSelect: false,    //品牌选择状态
    brandId: [],    //选择品牌的id数组
    brandName: '',   //选择品牌的name字符串
    brandNameArr: [],  //选择品牌的name数组
    source_type: 0,   //0：全部商品，1：大贸，2：跨境
    sort: 0,   //0：推荐，1：新品，2：价格升序，3：价格降序
    isInput: 1,
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
      url: 'api.php?s=goods/categoryGoodsList',
      data: {
        category_id: category_id,
        page_index: page,
        source_type:0,
        sort:0,
        brand_id:[],
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let goods_list = data.goods_list;
          let goodsCategoryList = data.goodsCategoryList;
          var category_list = [];
          let brand = data.category_brands;
          for (let index in brand) {
            brand[index].select = 0;
          }
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
          }

          that.setData({
            category_goods: goods_list,
            goodsCategoryList: goodsCategoryList,
            category_list,
            category_id,
            brand,
          })
          console.log(res);

        }
      },
    })
  },

  //搜索框点击
  toInput: function () {
    this.setData({
      isInput: 0,
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
    app.sendRequest({
      url: 'api.php?s=goods/categoryGoodsList',
      data: {
        category_id: id,
        page_index: 1,
        source_type: 0,
        sort: 0,
        brand_id: [],
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let brand = data.category_brands;
          for (let index in brand) {
            brand[index].select = 0;
          }
          that.setData({
            brand,
          })
        }
      },
    })
    this.setData({
      category_list: category_list,
      page: 1,
      category_id: id,
      category_goods: [],
      brandSelect: false,
      goodsSelect: false,
      recommendSelect: false,
      brandName: '',
      brandNameArr: [],
      source_type: 0,
      sort: 0,
    })
    this.toGoods(id, 1, 0, 0, [])
  },

  // 分类点击获取列表

  toGoods: function (id, page, type, sort, brandId) {
    var that = this;
    var category_goods = that.data.category_goods;
    // 获取商品分类标题点击的商品
    app.sendRequest({
      url: "api.php?s=goods/categoryGoodsList",
      data: {
        category_id: id,
        page_index: page,
        source_type: type,
        sort: sort,
        brand_id: brandId,
      },
      method: 'POST',
      success: function (res) {
        let new_category_goods = res.data.goods_list;
        if (new_category_goods[0] != undefined) {
          page++;
          category_goods = category_goods.concat(new_category_goods)
          // console.log(category_goods)

          for (let key in category_goods) {
            let img = category_goods[key].pic_cover_small;
            category_goods[key].pic_cover_small = app.IMG(img);
          }
          that.setData({
            category_goods: category_goods,
            page: page,
            isNoGoods: false,
          })
        } else {
          that.setData({
            isNoGoods: true,
          })
        }
      }
    });
  },


  // 全部商品导航点击
  toGoodsCheck: function () {
    var that = this;
    var goodsSelect = this.data.goodsSelect;
    var brand = this.data.brand;
    var brandNameArr = this.data.brandNameArr;
    for (let key in brand) {
      brand[key].select = 0
    }
    if (brandNameArr.length > 0) {
      for (let key in brand) {
        for (let index in brandNameArr) {
          if (brand[key].brand_name == brandNameArr[index]) {
            console.log(brand[key].brand_name, brandNameArr[index])
            brand[key].select = 1
          }
        }
      }
    }
    this.setData({
      goodsSelect: !goodsSelect,
      recommendSelect: false,
      brandSelect: false,
      brand,
    })
  },
  // 推荐导航点击
  recommendCheck: function () {
    var that = this;
    var recommendSelect = this.data.recommendSelect;
    var brandNameArr = this.data.brandNameArr;
    var brand = this.data.brand;
    for (let key in brand) {
      brand[key].select = 0
    }
    if (brandNameArr.length > 0) {
      for (let key in brand) {
        for (let index in brandNameArr) {
          if (brand[key].brand_name == brandNameArr[index]) {
            brand[key].select = 1
          }
        }
      }
    }
    this.setData({
      recommendSelect: !recommendSelect,
      goodsSelect: false,
      brandSelect: false,
      brand,
    })
  },
  // 品牌导航点击
  toBrandCheck: function () {
    var that = this;
    var brandSelect = this.data.brandSelect;
    var brandNameArr = this.data.brandNameArr;
    var brand = this.data.brand;
    for (let key in brand) {
      brand[key].select = 0
    }
    if (brandNameArr.length > 0) {
      for (let key in brand) {
        for (let index in brandNameArr) {
          if (brand[key].brand_name == brandNameArr[index]) {
            brand[key].select = 1
          }
        }
      }
    }
    this.setData({
      brandSelect: !brandSelect,
      goodsSelect: false,
      recommendSelect: false,
      brand,
    })
  },
  // 点击遮罩层
  toCancelMask: function () {
    var brand = this.data.brand;
    var brandNameArr = this.data.brandNameArr;
    for (let key in brand) {
      brand[key].select = 0
    }

    if (brandNameArr.length > 0) {
      for (let key in brand) {
        for (let index in brandNameArr) {
          if (brand[key].brand_name == brandNameArr[index]) {
            brand[key].select = 1
          }
        }
      }
    }
    this.setData({
      brandSelect: false,
      goodsSelect: false,
      recommendSelect: false,
      brand,
    })
  },

  // 选择品牌
  toCheckBrand: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var brand = this.data.brand;
    if (brand[index].select == 1) {
      brand[index].select = 0;
    } else {
      brand[index].select = 1;
    }
    // console.log(name,brandId, brandNameArr);
    this.setData({
      brand: brand,
    })
  },

  // 点击筛选
  toScreen: function (e) {
    var that = this;
    var source_type = this.data.source_type;
    var sort = this.data.sort;
    var brandId = [];
    let category_id = that.data.category_id;
    var brandName = this.data.brandName;
    var brand = this.data.brand;
    var brandNameArr = [];
    if (e.currentTarget.dataset.type) {
      var new_source_type = e.currentTarget.dataset.type;
      source_type = new_source_type;
      that.setData({
        source_type,
      })
    } else if (e.currentTarget.dataset.sort) {
      var new_sort = e.currentTarget.dataset.sort;
      sort = new_sort;
      that.setData({
        sort,
      })
    }
    for (let key in brand) {
      if (brand[key].select == 1) {
        brandId.push(brand[key].brand_id);
        brandNameArr.push(brand[key].brand_name);
      }
    }

    console.log(brandNameArr, brandId)
    brandName = brandNameArr.join(',');
    that.setData({
      category_goods: [],
      brandSelect: false,
      goodsSelect: false,
      recommendSelect: false,
      brandNameArr,
      brandName,
      brandId,
    })
    // console.log(category_id, source_type, sort, brandId)
    this.toGoods(category_id, 1, source_type, sort, brandId)
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
    let that = this;
    let category_id = that.data.category_id;
    let page = that.data.page;
    var source_type = this.data.source_type;
    var sort = this.data.sort;
    var brandId = this.data.brandId;
    this.toGoods(category_id, page, source_type, sort, brandId);
  },

  /**
   * 图片加载失败
   */
  errorImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let category_goods = that.data.category_goods;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = category_goods[index].pic_cover_small;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "category_goods[" + index + "].pic_cover_small";

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