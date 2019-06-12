const app = getApp()
const dateTime = require('../../utils/util.js');
const SERVERS = require('../../utils/servers.js');

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
    scrollLeft: 0, //tab标题的滚动条位置
    winHeight: "", //窗口高度
    indicatorDots: true,
    is_login: 0,
    maskStatus: 0,
    exponent: '',
    model: false,
    is_vip: 0, //是否是vip
    tel: '', //手机号码
    swiperIndex: 0, //这里不写第一次启动展示的时候会有问题
    page: 1,
    // category_goods: [], //分类商品
    isCouponMask: true, //优惠券弹框
    isInput: 1,
    isHide: 0,
    new_img: '',
    index_goods_img: '',
    isTop: 0,   //回到顶部
    seckill_timer: {}, //秒杀倒计时
    seckill_timer_obj: null
  },


  onLoad: function (options) {
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
      let store_id = scene.split('&')[1];
      app.globalData.store_id = store_id;
      app.globalData.kol_id = kol_id;
      console.log("********内详情页store_id", store_id);
      console.log("********kol_id", kol_id);
    }

    let times = 0;
    let load_timer = setInterval(function () {
      times++;
      let token = app.globalData.token;
      console.log(token)
      if (token != '') {
        // app.showBox(that, '登陆成功');
        that.setData({
          maskStatus: 0,
        })
        clearInterval(load_timer);
      } else if (times == 15) {
        app.showBox(that, '登录超时...');
        that.setData({
          maskStatus: 0,
        })
        clearInterval(load_timer);
        return;
      }
    }, 1000);

    that.indexInit(that);
  },

  // 商品分类点击
  selectCheck: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let child = e.currentTarget.dataset.child;   //第一个二级分类的id
    let childId = child.child_list[0].category_id;
    // console.log(child.child_list[0].category_id)
    wx.navigateTo({
      url: '/pages/goods/goodslist/goodslist?first_index=' + id,
    })
  },


  // 关闭领取优惠券
  couponReceive: function () {
    this.setData({
      isCouponMask: false,
    })
  },
  closeCouponMask: function () {
    this.setData({
      isCouponMask: false,
    })
  },

  //搜索框点击
  toInput: function () {
    this.setData({
      isInput: 0,
    })
  },

  // 搜索
  searchInput: function (e) {
    var val = e.detail.value;
    // console.log(e.detail.value);
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

  // 跳转热卖推页
  toHotProduct: function () {
    wx.navigateTo({
      url: '/pages/index/hotProduct/hotProduct',
    })
  },

  // 跳转新品推荐页
  toNewProduct: function () {
    wx.navigateTo({
      url: '/pages/index/newProduct/newProduct',
    })
  },

  // 跳转限时抢购
  toDiscount: function () {
    wx.navigateTo({
      url: '/pages/index/discount/discount',
    })
  },

  // 跳转商品详情页

  toGood: function (e) {
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
          is_vip,
          tel: data.user_info.user_tel
        })
      }
    }).catch(e => console.log(e));
  },

  // 跳转话题列表页
  toTopicList: function () {
    wx.navigateTo({
      url: '/pages/index/topicList/topicList',
    })
  },

  // 首页轮播跳转
  toSwiperDetail: function (event) {
    let url = event.currentTarget.dataset.url;
    wx.navigateTo({
      url: '/' + url,
    })
  },

  // 活动点击
  toProjectIndex: function (event) {
    let projectData = {
      id: event.currentTarget.dataset.id,
      title: event.currentTarget.dataset.title,
    }
    // 跳转活动详情页
    app.aldstat.sendEvent('首页活动点击', {
      "活动名称": event.currentTarget.dataset.title
    });
    wx.navigateTo({
      url: '/pages/index/projectIndex/projectIndex?data=' + JSON.stringify(projectData),
    })
  },

  onShow: function () {
    let that = this;

   




    this.setData({
      search_text: '',
      isInput: 1,
    })

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
    // 默认图片
    SERVERS.COMMON.getDefaultImages.post().then(res => {
      let { code, data } = res;
      if (code == 0) that.data.defaultImg = data;
    }).catch(e => console.log(e));
  },

  toClosePrompt: function () {
    this.setData({
      is_login: 0,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let title = '维美善特';
    let uid = app.globalData.uid;
    let path = '/pages/index/index';
    path += app.globalData.distributor_type == 0 ? '' : ('?uid=' + uid);
    return {
      title: '维美善特',
      path: path,
      // imageUrl: imgUrl,
      success: function (res) {
        app.showBox(that, '分享成功');
      },
      fail: function (res) {
        app.showBox(that, '分享失败');
      }
    }
    wx.showShareMenu({
      title: title
    })
  },
  /**
   * 商品楼层图片加载失败
   */
  errorBlockImg: function (e) {
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
  errorDiscountImg: function (e) {
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
  timing: function (that, timer_array) {
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
    let timer = setInterval(function () {
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
  indexInit: function (that) {
    
    // 初始化默认请求接口
    this.initIndexData();

    // 商品分类
    this.initGoodsList();

    // 获取秒杀
    this.initSecKill();

    // 话题
    this.initTopic();

    // 新品
    this.initNewGoods();
     
    // 热卖
    this.initHotGoods();

    // 猜你喜欢
    this.initRecommendGoods();

    // 登录状态
    that.setData({
      is_login: app.globalData.unregistered == 0?0:1,
      unregistered: app.globalData.unregistered
    })
  },
  // 默认首页数据
  initIndexData() {
    let that = this;
    SERVERS.HOME.getIndexData.post().then(res => {
      if (res.code == 0) {
        that.detailIndexData(res);
        wx.stopPullDownRefresh();
      }
    }).catch(e => console.log(e))
  },
  
  //  获取话题
  initTopic() {
    let that = this;
    SERVERS.TOPIC.hotTopic.post({
      limit: 2
    }).then(res => {
      that.setData({
        activities: res.data.data
      });
    }).catch(e => console.log(e));
  },
  //商品分类
  initGoodsList() {
    let that = this;
    SERVERS.GOODS.goodsClassificationList.post().then(res => {
      let { code, data } = res;
      if (code == 0) {
        let category_list = data.goods_category_list.map(item => {
          item.isSelect = false;
          item.category_pic = app.IMG(item.category_pic);
          return item;
        });
        that.setData({ category_list });
      }
    }).catch(e => console.log(e));
  },
  // 获取新品的标题图片
  initNewGoods(){
    let that = this;
    SERVERS.GOODS.getNewGoods.post().then(res => {
      let { code, data } = res;
      if (code == 0) {
        let adv_index = data.adv_new;
        let adv_list = [];
        if (adv_index.is_use != 0) {
          adv_list = adv_index.adv_list.map(item => {
            item.adv_image = app.IMG(item.adv_image);
            return item;
          });
        }
        that.setData({
          new_img: adv_list[0],
        });
      }
    }).catch(e => console.log(e));
  },
  // 热卖
  initHotGoods(){
    let that = this;
    SERVERS.GOODS.getHotSaleGoods.post().then(res => {
      let { code, data } = res;
      if (code == 0) {
        var adv_index = data.adv_hot;
        let adv_list = [];
        if (adv_index.is_use != 0) {
          adv_list = adv_index.adv_list.map(item => {
            item.adv_image = app.IMG(item.adv_image);
            return item;
          });
        }
        that.setData({
          index_goods_img: adv_list[0],
        });
      }
    }).catch(e => console.log(e));
  },
   // 获取品牌推荐(猜你喜欢)
  initRecommendGoods(){
    let that = this;
    let page = that.data.page;
    SERVERS.GOODS.getIndexGoodsList.post({
      page_index: page,
      page_size: 10
    }).then(res => {
      let brand_goods = that.data.brand_goods;
      let tmp = res.data.data.map(i => {
        i.pic_cover_small = app.IMG(i.pic_cover_small);
        return i;
      });
      if(page > 1){
        brand_goods = brand_goods.concat(tmp);
      }else{
        brand_goods = tmp;
      }
      that.setData({
        brand_goods,
        isNoGoods: tmp.length == 0,
        page: page + 1,
      })
    }).catch(e => console.log(e));
  },
  //秒杀数据
  initSecKill() {
    let that = this;
    clearTimeout(this.data.seckill_timer_obj);
    SERVERS.SECKILL.seckillIndex.post().then(res => {
      if (res.code == 0 && res.data) {
        let seckill_timer = {};
        let seckill_list = res.data.goodsList.data;
        seckill_list.map(i => {
          i.picture.pic_cover_small = app.IMG(i.picture.pic_cover_small);
          // i.seckill_price = parseFloat(i.seckill_price);
          return i;
        });
        that.setData({ seckill_list });
        let now = Date.now();
        let start = res.data.start_time*1000;
        let end = res.data.end_time*1000;
        console.log(now)
        if(now < start){
          that.setData({
            seckill_timer:{
              end: 1,
              tips: '活动将于'+ dateTime.formatTime(res.data.start_time,'M月D日 h时') + '开始！'
            }
          })
        }else if(now > end){
          // dateTime.formatTime(res.data.end_time,'Y-M-D h:m:s') + 
          that.setData({
            seckill_timer:{
              end: 1,
              tips: '活动已结束！'
            }
          })
        }else{
          that.setSecKillTimer(res.data.end_time);
          // that.setSecKillTimer(1559633812);
        }
      }
    }).catch(e => console.log(e));
  },
  // 处理首页数据
  detailIndexData(res) {
    let that = this;
    let base = app.globalData.siteBaseUrl;
    let timeArray = {};
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
      if (data.adv_list&& data.adv_list.adv_index&& data.adv_list.adv_index.adv_list) {
        let adv_index = data.adv_list.adv_index;
        let adv_list = adv_index.adv_list;

        if (adv_list.length == 1) {
          indicatorDots = false;
        }
        if (adv_index.is_use != 0) {
          for (let index in adv_list) {
            let img = adv_list[index].adv_image;
            adv_list[index].adv_image = app.IMG(img);
          }
        } else {
          adv_list = [];
        }
        console.log(adv_list);
        
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
        discount_list[index].picture.pic_cover_small = app.IMG(img);
      }

      // console.log(discount_list[0].end_time)
      if (discount_list.length > 0) {
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
        new_pro[key].new_pic = app.IMG(img);
      }
      for (let index in small_sample_list) {
        let img = small_sample_list[index].pic_cover_big;
        small_sample_list[index].pic_cover_small = app.IMG(img);
        small_sample_list[index].exponent = exponent;
      }

      for (let index in top_list) {
        let img = top_list[index].pic_cover_big;
        exponent = (parseInt(top_list[index].material_black) + parseInt(top_list[index].material_black) + parseInt(top_list[index].effect_black)) / 3
        top_list[index].pic_cover_small = app.IMG(img);
        top_list[index].exponent = exponent;
        that.setData({
          exponent: exponent
        })
      }

      for (let index in index_goods_list) {
        let img = index_goods_list[index].pic_cover_big;
        exponent = (parseInt(index_goods_list[index].material_black) + parseInt(index_goods_list[index].material_black) + parseInt(index_goods_list[index].effect_black)) / 3
        index_goods_list[index].pic_cover_small = app.IMG(img);
        index_goods_list[index].exponent = exponent;
        index_goods_list[index].isActive = false;
        that.setData({
          exponent: exponent
        })
      }


      for (let index in block_list) {
        for (let key in block_list[index].goods_list) {
          let img = block_list[index].goods_list[key].pic_cover_small;
          block_list[index].goods_list[key].pic_cover_small = app.IMG(img);
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
  },
  setSecKillTimer(timestamp) {
    let that = this;
    let seckill_timer_obj = null;
    let seckill_timer = dateTime.calcDateTime(timestamp);
    // console.log(seckill_timer);
    if (seckill_timer) {
      seckill_timer.end = 0;
      that.setData({ seckill_timer });
      seckill_timer_obj = setTimeout(() => {
        that.setSecKillTimer(timestamp);
      }, 1000);
      that.setData({ seckill_timer_obj });
    } else {
      that.setData({ seckill_timer, seckill_timer_obj });
      clearTimeout(that.data.seckill_timer_obj);
    }
  },
  toSecKill() {
    wx.navigateTo({
      url: '/pages/index/discount/discount?type=2'
    })
  },
  /**
   * 收藏
   */
  collect(e) {
    console.log(e.detail)
    let { index, is_fav, state, message } = e.detail;
    let brand_goods = this.data.brand_goods;
    app.showBox(this, message);
    if (state) {
      brand_goods[index].is_member_fav_goods = is_fav;
      this.setData({ brand_goods });
    }
  },

  /**触发*/
  Crossroad: function () {
    let _that = this;
    let Tel = _that.data.tel;
    if (app.globalData.unregistered == 1 || Tel == '') {
      wx.navigateTo({
        url: '/pages/member/resgin/resgin',
      })
    }
  },
  // 轮播切换
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  // 新品推送
  songGift: function (event) {
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
      success: function (res) {
        // console.log(res);
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom(){
    this.initRecommendGoods();
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
      // SERVERS.MEMBER.receiveGoodsCoupon.post({
      //   coupon_type_id: coupon_type_id
      // }).then(res => {
      //   let { code, data } = res;

      // }).catch(e => console.log(e));
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

  onPullDownRefresh: function () {
    var that = this;
    // if (this.data.isRefreshing || this.data.isLoadingMoreData) {
    //   return
    // }
    // this.setData({
    //   isRefreshing: true,
    //   hasMoreData: true
    // })
    this.indexInit(that)//数据请求
  },

  onPageScroll: function (e) {
    // console.log(e.scrollTop)
    if (e.scrollTop > 1580) {
      this.setData({
        isTop: 1
      })
    } else {
      this.setData({
        isTop: 0
      })
    }
  },

  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },


  // 页面滚动事件//滑动开始事件
  handletouchtart: function (event) {
    this.setData({
      isHide: 1
    })
  },
  // 滑动移动事件
  handletouchmove: function (event) {
    // console.log(event.changedTouches[0].pageY, 222222)
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
