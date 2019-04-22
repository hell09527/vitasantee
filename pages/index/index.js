const app = getApp()
Page({
  data: {
    prompt: '',
    Base: '', //库路径
    current_time: 0, //当前时间
    timer_array: {}, //限时折扣计时
    search_text: '', //搜索内容
    discount_list: {}, //限时折扣
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    TimelimitGoods: [{
        isHav: 1,
      },
      {
        isHav: 0,
      },
      {
        isHav: 1,
      },
      {
        isHav: 1,
      },
    ], //限时抢购
    //商品列表
    titleList: [{
        name: '活动',
        select: 1,
      },
      {
        name: '排序',
        select: 1,
      },
      {
        name: '品牌',
        select: 1,
      },
    ],
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    winHeight: "", //窗口高度
    indicatorDots: true,
    is_login: 0,
    maskStatus: 0,
    exponent: '',
    model: false,
    is_vip: 0, //是否是vip
    user_tel: '', //手机号码
    swiperIndex: 0, //这里不写第一次启动展示的时候会有问题
    page: 1,
    // category_goods: [], //分类商品
    isCouponMask: true, //优惠券弹框
    swiperCurrent:0,
    goodsSelect:false,   //全部商品状态
    recommendSelect: false,   //推荐状态
    brandSelect: false,    //品牌选择状态
    brandName: '',   //选择品牌的name字符串
    brandNameArr:[],   //选中品牌的名称数组
    source_type:0,   //0：全部商品，1：大贸，2：跨境
    sort:0,   //0：推荐，1：新品，2：价格升序，3：价格降序
    isInput:1,
    isHide:0,
    // hasMoreData: true,
    // isRefreshing: false,
    // isLoadingMoreData: false
  },


  onLoad: function(options) {
    let that = this;
    // 极选师分润
    if (options.uid) {
      // 这个字段是转发过后承载uid     identifying
      app.globalData.identifying = options.uid;
      app.globalData.breakpoint = options.breakpoint;
      console.log('ui', options.breakpoint);
      console.log('u', options.uid);
    }
    if (options.scene) {
      // 扫码进入
      var scene = decodeURIComponent(options.scene);
      console.log("scene ", scene);
      let kol_id = scene.split('&')[0];
      app.globalData.kol_id = kol_id;
      console.log("********kol_id", kol_id);
    }

    let times = 0;
    let load_timer = setInterval(function() {
      times++;
      let token = app.globalData.token;
      if (token != '') {
        // app.showBox(that, '登陆成功');
        that.setData({
          maskStatus: 0,
        })
        clearInterval(load_timer);
      } else if (times==15){
        app.showBox(that, '登录超时...');
        that.setData({
          maskStatus: 0,
        })
        clearInterval(load_timer);
        return;
      }
    }, 1000);


   
    if (app.globalData.token && app.globalData.token != '') {
      //判断是否是付费会员的接口
      that.SY_reuse(); 
    } else {
      app.employIdCallback = employId => {
        if (employId != '') {
          //判断是否是付费会员的接口
          that.SY_reuse();
        }
      }
    }

    app.sendRequest({
      url: "api.php?s=goods/getDefaultImages",
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          that.data.defaultImg = data;
          that.indexInit(that);
        }
      }
    });
  },

  // 商品标题点击
  selectCheck: function(e) {
    let that = this
    var id = e.currentTarget.dataset.id;
    var category_list = this.data.category_list;
    // console.log(id, category_list)
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
      url: "api.php?s=/index/branchPro",
      data: {
        category_id: id,
        page_index: 1,
        source_type: 0,
        sort: 0,
        brand_id: [],
      },
      method: 'POST',
      success: function (res) {
        let brand = res.data.category_brands;
        for (let index in brand) {
          brand[index].select = 0;
        }
        that.setData({
          brand,
        })
      }
    });
    this.setData({
      category_list: category_list,
      category_id: id,
      page: 1,
      category_goods: [],
      brandSelect: false,
      goodsSelect: false,
      recommendSelect: false,
      brandName: '',
      brandNameArr: [],
      source_type:0,
      sort: 0,
    })
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
    this.toGoods(id, 1, 0, 0, [])
  },

  // 分类点击获取列表

  toGoods: function (id, page, type,sort,brandId) {
    var that = this;
    var category_goods = that.data.category_goods;
    // 获取商品分类标题点击的商品
    app.sendRequest({
      url: "api.php?s=/index/branchPro",
      data: {
        category_id: id,
        page_index: page,
        source_type:type,
        sort:sort,
        brand_id: brandId,
      },
      method: 'POST',
      success: function(res) {
        let new_category_goods = res.data.pro.data;
        if (new_category_goods[0] != undefined) {
          page++;
          let category_pic = res.data.category_pic;
          category_goods = category_goods.concat(new_category_goods)
          // console.log(category_goods)

          for (let key in category_goods) {
            let img = category_goods[key].pic_cover_small;
            category_goods[key].pic_cover_small = that.IMG(img);
          }
          that.setData({
            category_goods: category_goods,
            category_pic: category_pic,
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

  // 关闭领取优惠券
  couponReceive: function() {
    this.setData({
      isCouponMask: false,
    })
  },
  closeCouponMask: function() {
    this.setData({
      isCouponMask: false,
    })
  },

//搜索框点击
  toInput:function(){
    this.setData({
      isInput: 0,
    })
  },

  // 搜索
  searchInput: function(e) {
    var val = e.detail.value;
    console.log(e.detail.value);
    this.setData({
      searchVal: val
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

  // 全部商品导航点击
  toGoodsCheck: function() {
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
      recommendSelect:false,
      brandSelect:false,
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
    if (brand[index].select == 1){
      brand[index].select = 0;
    } else {
      brand[index].select = 1;
    }
    // console.log(name,brandId, brandNameArr);
    this.setData({
      brand:brand,
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
      if(brand[key].select==1){
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

  // 跳转热卖推页
  toHotProduct: function() {
    wx.navigateTo({
      url: '/pages/index/hotProduct/hotProduct',
    })
  },

  // 跳转新品推荐页
  toNewProduct: function() {
    wx.navigateTo({
      url: '/pages/index/newProduct/newProduct',
    })
  },

  // 跳转限时抢购
  toDiscount: function() {
    // wx.navigateTo({
    //   url: '/pages/index/discount/discount',
    // })
  },

  // 跳转商品详情页

  toGood: function(e) {
    var that = this;
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

  // 点击收藏
  toCollect: function(e) {
    var that = this;
    var active = this.data.brand_goods;
    var index = e.currentTarget.dataset.index;
    var isActive = 'brand_goods[' + index + '].isActive';
    // console.log(!active[index].isActive, isActive)
    this.setData({
      [isActive]: !active[index].isActive
    })
  },

  //获取会员所有信息
  SY_reuse: function() {
    let that = this;
    app.sendRequest({
      url: "api.php?s=member/getMemberDetail",
      success: function(res) {
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
            is_vip
          })
        }
      }
    })
  },

  // 跳转话题列表页
  toTopicList: function() {
    wx.navigateTo({
      url: '/pages/index/topicList/topicList',
    })
  },

  // 首页轮播跳转
  toSwiperDetail: function(event) {
    let url = event.currentTarget.dataset.url;
    wx.navigateTo({
      url: '/' + url,
    })
  },

  onShow: function() {
    let that = this;
    this.setData({
      search_text:'',
    })
  },

  toClosePrompt:function(){
    this.setData({
      is_login: 0,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let title = '维美善特';
    let uid = app.globalData.uid;
    if (app.globalData.distributor_type == 0) {
      return {
        title: '维美善特',
        path: '/pages/index/index',
        // imageUrl: imgUrl,
        success: function(res) {
          app.showBox(that, '分享成功');
        },
        fail: function(res) {
          app.showBox(that, '分享失败');
        }
      }
      wx.showShareMenu({
        title: title
      })
    } else {
      return {
        title: '维美善特',
        path: '/pages/index/index?uid=' + uid,
        // imageUrl: imgUrl,
        success: function(res) {
          app.showBox(that, '分享成功');

        },
        fail: function(res) {
          app.showBox(that, '分享失败');
        }
      }
      wx.showShareMenu({
        title: title
      })
    }

  },
  /**
   * 商品楼层图片加载失败
   */
  errorBlockImg: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let key = e.currentTarget.dataset.key;
    // console.log(key)
    let block_list = that.data.block_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = block_list[index].goods_list[key].pic_cover_big;
    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "block_list[" + index + "].goods_list[" + key + "].pic_cover_small";
        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },
  /**
   * 限时折扣图片加载失败
   */
  errorDiscountImg: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let discount_list = that.data.discount_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = discount_list[index].picture.pic_cover_small;
    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "discount_list[" + index + "].picture.pic_cover_small";
        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 计时
   */
  timing: function(that, timer_array) {
    let current_time = that.data.current_time;   //当前时间
    let count_second = (timer_array.end_time * 1000 - current_time) / 1000;
    //首次加载
    if (count_second > 0) {
      count_second--;
      //时间计算
      let day = Math.floor((count_second / 3600) / 24);
      let hour = Math.floor((count_second / 3600) % 24);
      let minute = Math.floor((count_second / 60) % 60);
      let second = Math.floor(count_second % 60);
      //赋值
      timer_array.day = day;
      timer_array.hour = hour;
      timer_array.minute = minute;
      timer_array.second = second;
      timer_array.end = 0;

      that.setData({
        timer_array: timer_array
      })
    } else {
      timer_array.end = 1;

      that.setData({
        timer_array: timer_array
      })
    }
    //开始计时
    let timer = setInterval(function() {
      if (count_second > 0) {
        count_second--;
        //时间计算
        let day = Math.floor((count_second / 3600) / 24);
        let hour = Math.floor((count_second / 3600) % 24);
        let minute = Math.floor((count_second / 60) % 60);
        let second = Math.floor(count_second % 60);
        //赋值
        timer_array.day = day;
        timer_array.hour = parseInt(hour) < 10 ? 0 + '' + hour : hour;
        timer_array.minute = parseInt(minute) < 10 ? 0 + '' + minute : minute;;
        timer_array.second = parseInt(second) < 10 ? 0 + '' + second : second;;
        timer_array.end = 0;

        that.setData({
          timer_array: timer_array
        })
      } else {
        timer_array.end = 1;

        that.setData({
          timer_array: timer_array
        })
        clearInterval(timer);
      }
    }, 1000)
  },

  /**
   * 首页初始化
   */
  indexInit: function(that) {
    let base = app.globalData.siteBaseUrl;
    let timeArray = {};
    this.setData({
      currentTab: 0,
    })

    app.sendRequest({
      url: 'api.php?s=index/getIndexData',
      data: {},
      success: function(res) {
        // console.log(res)
        let code = res.code;
        let indicatorDots = true;
        if (code == 0) {
          let data = res.data;
          //当前时间初始化
          let current_time = data.current_time;
          that.setData({
            current_time: current_time
          })

          //广告轮播初始化
          if (data.adv_list != undefined && data.adv_list.adv_index != undefined && data.adv_list.adv_index.adv_list != undefined) {
            let adv_index = data.adv_list.adv_index;
            let adv_list = adv_index.adv_list;

            if (adv_list.length == 1) {
              indicatorDots = false;
            }
            if (adv_index.is_use != 0) {
              for (let index in adv_list) {
                let img = adv_list[index].adv_image;
                adv_list[index].adv_image = that.IMG(img);
              }
            } else {
              adv_list = [];
            }
            that.setData({
              imgUrls: adv_list,
              swiperHeight: adv_index.ap_height
            })
          } else {
            that.setData({
              imgUrls: [],
            })
          }
          //优惠券初始化
          for (let index in data.coupon_list) {
            data.coupon_list[index].status = 1;
          }
          //限时折扣初始化
          let discount_list = data.discount_list.data;
          for (let index in discount_list) {
            let img = discount_list[index].picture.pic_cover_small;
            discount_list[index].picture.pic_cover_small = that.IMG(img);
          }

          // console.log(discount_list[0].end_time)
          if (discount_list.length>0){
            timeArray = {};
            timeArray.end = 0;
            timeArray.end_time = discount_list[0].end_time;
            that.timing(that, timeArray);
          }
          //商品楼层图片处理
          // console.log(data);
          let four_list = data.four_list;
          let block_list = data.block_list;
          let top_list = data.top_goods_list;
          let index_goods_list = data.index_goods_list;
          let new_pro = data.new_pro;
          let small_sample_list = data.small_sample_list;
          let exponent = "";

          for (let key in new_pro) {
            let img = new_pro[key].new_pic;
            new_pro[key].new_pic = that.IMG(img);
          }
          for (let index in small_sample_list) {
            let img = small_sample_list[index].pic_cover_big;
            small_sample_list[index].pic_cover_small = that.IMG(img);
            small_sample_list[index].exponent = exponent;
          }

          for (let index in top_list) {
            let img = top_list[index].pic_cover_big;
            exponent = (parseInt(top_list[index].material_black) + parseInt(top_list[index].material_black) + parseInt(top_list[index].effect_black)) / 3
            top_list[index].pic_cover_small = that.IMG(img);
            top_list[index].exponent = exponent;
            that.setData({
              exponent: exponent
            })
          }

          for (let index in index_goods_list) {
            let img = index_goods_list[index].pic_cover_big;
            exponent = (parseInt(index_goods_list[index].material_black) + parseInt(index_goods_list[index].material_black) + parseInt(index_goods_list[index].effect_black)) / 3
            index_goods_list[index].pic_cover_small = that.IMG(img);
            index_goods_list[index].exponent = exponent;
            index_goods_list[index].isActive = false;
            that.setData({
              exponent: exponent
            })
          }


          for (let index in block_list) {
            for (let key in block_list[index].goods_list) {
              let img = block_list[index].goods_list[key].pic_cover_small;
              block_list[index].goods_list[key].pic_cover_small = that.IMG(img);
            }
          }
          let sqk_alls = data.block_list[0];




          that.setData({
            Base: base,
            indicatorDots: indicatorDots,
            index_notice: data.notice.data,
            goods_platform_list: data.goods_platform_list,
            sqk_alls: '',
            block_list: block_list,
            top_list: top_list, //Top10
            index_goods_list: index_goods_list, //商品列表
            new_pro: new_pro, //新品推荐
            topShopsIcon: data.icon,
            coupon_list: data.coupon_list,
            discount_list: discount_list,
            small_sample_list: small_sample_list,
            four_list: four_list,
          });
        }
        // console.log(res);
      }
    })

    //  获取最新话题
    app.sendRequest({
      url: "api.php?s=/activity/hotTopic",
      data: {
        limit: 1
      },
      method: 'POST',
      success: function(res) {
        // console.log(res.data);
        // 获取最新话题下面商品
        // app.sendRequest({
        //   url: "api.php?s=/Activity/activityInfo",
        //   data: { master_id: res.data.data.id },
        //   success: function (res) {

        //     var new_actList = [];
        //     var actList = res.data.data
        //     for (var i = 0; i < actList.length; i++) {
        //       if (actList[i].goods_info) {
        //         new_actList.push(actList[i]);
        //       }
        //     }
        //     console.log(res)
        //     that.setData({
        //       activities_list: new_actList,
        //     })

        //   }
        // });
        that.setData({
          lastOne: res.data.data,
        })

      }
    });

    //  获取往期话题
    app.sendRequest({
      url: "api.php?s=/activity/hotTopic",
      data: {
        limit: 3
      },
      method: 'POST',
      success: function(res) {
        // console.log(res.data.data);

        that.setData({
          activities: res.data.data
        })
      }
    });

    // 商品列表
    app.sendRequest({
      url: "index.php?s=/api/index/getindeximglist",
      data: {},
      success: function(res) {
        var shop = res;
        for (let index in shop) {
          let img = shop[index].imgUrl;
          shop[index].imgUrl = app.IMG(img);
        }
        that.setData({
          shop: shop
        })
      }
    });


    //商品标题 
    app.sendRequest({
      url: "api.php?s=/index/categoryLists",
      data: {},
      method: 'POST',
      success: function(res) {
        let category_list = res.data
        // console.log(res.data)

        category_list.unshift({
          category_id: 0,
          category_name: '精选',
        })
        for (let index in category_list) {
          category_list[index].select = 1;
        }
        category_list[0].select = 2;
        that.setData({
          category_list: category_list
        })
      }
    });

    // 获取品牌推荐
    app.sendRequest({
      url: "api.php?s=/goods/getPublicGoods",
      data: {},
      method: 'POST',
      success: function (res) {
        // console.log(res);

        that.setData({
          brand_goods: res.data
        })
      }
    });

    console.log(app.globalData.unregistered)
    if (app.globalData.unregistered==0){
      that.setData({
        is_login: 0,
      })
    } else {
      that.setData({
        is_login: 1,
      })
    }

    
    wx.stopPullDownRefresh()
  },
  

  swiperChange: function (e) {
    // console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  /**
   * 图片路径处理
   */
  IMG: function(img) {
    let base = app.globalData.siteBaseUrl;
    img = img == undefined ? '' : img;
    img = img == 0 ? '' : img;
    if (img.indexOf('http://') == -1 && img.indexOf('https://') == -1 && img != '') {
      img = base + img;
    }
    return img;
  },

  // 新品推送
  songGift: function(event) {
    let that = this
    // let out_trade_no = that.data.out_trade_no
    wx.request({
      url: app.globalData.siteBaseUrl + 'api.php?s=order/getTrialGoodsTemplate',
      data: {
        openid: app.globalData.openid,
        formid: event.detail.formId,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;'
      },
      success: function(res) {
        // console.log(res);
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.currentTab >0) {
      let that = this;
      let category_id = that.data.category_id;
      let category_list = that.data.category_list;
      let page = that.data.page;
      var source_type = this.data.source_type;
      var sort = this.data.sort;
      var brandId = this.data.brandId;
      this.toGoods(category_id, page, source_type, sort, brandId);
    }
  },

  /**
   * 领取优惠券
   */
  toReceivePopup: function (e) {
    let that = this;
    let coupon_type_id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let flag = true;
    let status = 1;
    if (flag) {
      app.sendRequest({
        url: 'api.php?s=goods/receiveGoodsCoupon',
        data: {
          coupon_type_id: coupon_type_id
        },
        success: function (res) {
          // console.log(res)
          let code = res.code;
          let data = res.data;
          if (code == 0) {
            if (data > 0) {
              app.showBox(that, '领取成功');
            } else if (data == -2011) {
              app.showBox(that, '来迟了，已经领完了');
              status = 0;
            } else if (data == -2019) {
              app.showBox(that, '领取已达到上限');
              status = 0;
            } else {
              app.showBox(that, '未获取到优惠券信息');
              status = 0;
            }
            let d = {};
            let key = "coupon_list[" + index + "].status";
            d[key] = 0;
            that.setData(d);
          }
        }
      });
    }
    if (!flag) {
      let d = {};
      let key = "coupon_list[" + index + "].status";
      d[key] = 0;
      that.setData(d);
    }
  },

  onPullDownRefresh:function(){
    var that=this;
    // if (this.data.isRefreshing || this.data.isLoadingMoreData) {
    //   return
    // }
    // this.setData({
    //   isRefreshing: true,
    //   hasMoreData: true
    // })
    this.indexInit(that)//数据请求
  },


  // 页面滚动事件//滑动开始事件
  handletouchtart: function (event) {
    this.setData({
      isHide: 1
    })
  },
  // 滑动移动事件
  handletouchmove: function () {
    this.setData({
      isHide: 1
    })
  },
  //滑动结束事件
  handletouchend: function (event) {
    // console.log(event, 222222)
    this.setData({
      isHide: 0
    })
  },

})