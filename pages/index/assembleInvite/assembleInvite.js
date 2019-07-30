// pages/index/asembleInvite/assembleInvite.js
var wxParse = require('../../../wxParse/wxParse.js');
const SERVERS = require('../../../utils/servers.js');
const core = require('../../../utils/core.js');
const { calcDateTime, formatNumber } = require('../../../utils/util.js');
const data = require('../../../utils/tmp.js');
var app = getApp();
var timer = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    // 用户信息部分
    unregistered: 1,
    tel: '',
    // 商品信息
    pintTuanData: {},
    spec_list: [],
    pt_startup_id: '', //拼团记录id
    hasMine: true, //是否包含自己
    mineIndex: -1, //自己的索引值
    detail: null, //商品数据
    userList: [],
    recommend: [],
    assemble_time_show: '', //倒计时显示
    show_type: 0, //0邀请，1参与
    orderId: '',//当前用户订单id
    // 规格选择部分
    maskShow: 0,
    animation: null,
    goodsNum: 1,
    sku_id: '',
    is_inside_sell: '',
    assembleStatusShow: ['', '邀请好友拼团', '拼团成功！', '拼团失败'],
    assembleStatusColor: ['#000', '#000', '#e40046', '#666'],
    isIphoneX: false,
    distributor_type: 0
  },
  onLoad: function (options) {
    console.log('options')
    console.log(options)
    let that = this;
    that.setData({
      pt_startup_id: options.pt_startup_id,
      show_type: options.show_type || 0,
      isIphoneX: app.globalData.isIphoneX
    });
    this.setData({
      title: that.getTitle(that.data.show_type)
    });
    // wx.setNavigationBarTitle({
    //   title: that.getTitle(that.data.show_type)
    // });
    if (options.uid) {
      console.log('options.uid', options.uid)
      app.globalData.identifying = options.uid;
      app.globalData.breakpoint = options.breakpoint;
    }
  },
  onShow() {
    let that = this;
    // 初始化
    core.checkAuthorize('scope.userInfo').then(res => {
      wx.showLoading({
        title: '加载中...',
        mask: true
      });
      that.setData({ isInit: true });
      //首次不会执行token拿不到
      that.checkUserLoginState();
    }).catch(e => {
      that.initPinTuanData();
    });
  },
  onUnload: function () {
    clearInterval(timer);
  },
  navigateTap(e) {
    let all = getCurrentPages();
    if (e.detail) {
      wx.switchTab({
        url: '/pages/index/index'
      });
    } else if (all[all.length - 2].route == 'pages/pay/paycallback/paycallback') {
      wx.switchTab({
        url: '/pages/index/index'
      });
      // wx.navigateBack({
      //   delta: 4
      // });
    } else {
      wx.navigateBack();
    }
  },
  // 初始化拼团数据
  initPinTuanData() {
    let that = this;
    SERVERS.GOODS.pintuanStartupDetail.post({
      pt_startup_id: that.data.pt_startup_id
    }).then(res => {
      let { code, data } = res;
      if (code == 0) {
        // 拼团用户列表
        let orderId = '', userList = data.userInfo, mineIndex = -1;
        data.joinedNum = data.userInfo.length; //已参团人数记录
        userList.length = Number(data.people_num); //拓展至拼团总人数
        // 在用户列表中查找当前用户
        userList = userList.map((i, index) => {
          i.user_headimg = app.IMG(i.user_headimg); //替换手动头像上传
          // 获取当前登录用户订单id
          if (that.data.userInfo && (i.uid == that.data.userInfo.uid)) {
            mineIndex = index;
            orderId = i.order_id;
          }
          return i;
        });
        // 是否包含自己
        let hasMine = mineIndex >= 0;
        // console.log('uid:' + that.data.userInfo.uid)
        console.log("hasMine:" + hasMine);
        if (hasMine && that.data.show_type == 1) {
          // 重新设置标题
          that.setData({
            show_type: 0,
            title: that.getTitle(that.data.show_type)
          });
        }
        // 拼团状态
        that.setData({
          pintTuanData: data,
          userList,
          hasMine,
          mineIndex,
          orderId
        });
        that.updateListTimer();
        that.initGoodsDetail(data);
      }
    }).catch(e => console.log(e));
  },
  // 获取商品详情
  initGoodsDetail(pintuan) {
    let that = this;
    let id = pintuan.goods_id;
    SERVERS.GOODS.goodsDetail.post({
      goods_id: id
    }).then(res => {
      let { code, data } = res;
      if (code == 0) {
        data.pic_cover_small = data.picture_detail.pic_cover_small;
        data.promote_price = Number(data.sku_list[0].promote_price * that.data.pintTuanData.discount / 10).toFixed(2);
        if (that.data.hasMine || pintuan.status > 1) {
          that.initRecomendList();
        } else {
          wxParse.wxParse('description', 'html', data.description, that, 5);
        }

        this.setData({
          detail: data
        });
        this.initSkuData(data);
      } else {
        app.showBox(that, '获取数据失败');
      }
      // 结束下拉刷新
      wx.stopPullDownRefresh();
    }).catch(e => console.log(e));
  },
  // 初始化规格数据
  initSkuData(goods_info) {
    let mo_imgs = {
      spec_value_data: goods_info.img_list[0].pic_cover_big,
      spec_value_data_big_src: goods_info.img_list[0].pic_cover_big,
    };
    if (goods_info.spec_list.length > 0) {
      goods_info.spec_list[0].value[0].status = 1;
    }
    let spec_list = goods_info.spec_list;
    let sku_id = goods_info.sku_list[0].sku_id;
    let is_inside_sell = goods_info.sku_list[0].is_inside_sell;
    this.setData({
      mo_imgs,
      spec_list,
      sku_id,
      is_inside_sell
    });
  },
  // 列表倒计时
  updateListTimer() {
    this.setItemTimer();
    timer = setInterval(function () {
      this.setItemTimer();
    }.bind(this), 1000);
  },
  // 设置时间
  setItemTimer() {
    let tmp = calcDateTime(this.data.pintTuanData.end_time);
    let assemble_time_show = '';
    if (tmp) {
      assemble_time_show = formatNumber(tmp.hour) + ':' + formatNumber(tmp.minute) + ':' + formatNumber(tmp.second);
    } else {
      assemble_time_show = '00:00:00';
      clearInterval(timer);
    }
    this.setData({ assemble_time_show });
  },
  // 获取推荐商品
  initRecomendList() {
    let that = this;
    console.log('initRecomendList');
    SERVERS.GOODS.pintuanGoodsList.post().then(res => {
      if (res.code == 0) {
        that.setData({
          recommend: res.data.data.map(i => {
            i.pic_cover_small = i.picture.pic_cover_small;
            i.promote_price = Number(i.price * i.discount / 10).toFixed(2);
            return i;
          })
        })
      }
    }).catch(e => console.log(e));
  },
  // 订单详情
  toOrderDetail() {
    wx.navigateTo({
      url: '/pages/order/orderdetail/orderdetail?id=' + this.data.orderId
    });
  },
  // 拼团规则介绍
  toRuleDetail() {
    wx.navigateTo({
      url: '/pages/common/rule/rule?type=pintuan'
    })
  },
  toGood(e) {
    this.assembeTap(e);
  },
  // 开始团购
  assembeTap(e) {
    let { id, ptid } = e.currentTarget.dataset;
    if (!ptid) return;
    wx.navigateTo({
      url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + id + '&isAssemble=true&pt_goods_id=' + ptid
    }); //从拼购进入
  },
  onPullDownRefresh: function () {
    this.initPinTuanData();
  },
  onReachBottom: function () {

  },
  onShareAppMessage: function (e) {
    let that = this;
    let show_type = this.data.show_type;
    let title = this.getTitle(show_type);
    let uid = app.globalData.uid;
    if (e.from == 'button') {
      show_type = 1;
      title = '邀请好友拼团';
    }
    let url = `/pages/index/assembleInvite/assembleInvite?pt_startup_id=${this.data.pt_startup_id}&show_type=${show_type}`;
    let share = {
      title: '发现超值好物，邀请你一起拼团',
      path: that.data.distributor_type == 0 ? url : (url + '&uid=' + uid),
      imageUrl: this.data.detail.pic_cover_small
    }
    console.log(e);
    console.log(share);
    return share;
  },
  //获取标题
  getTitle(type) {
    return (type == 0 ? "邀请" : "参与") + "好友拼团";
  },
  toAssemblePage() {
    wx.redirectTo({
      url: '/pages/index/assemble/assemble'
    })
  },
  // 参与拼团
  toJoinAssemble() {
    let that = this;
    // wx.navigateTo({
    //   url: '/pages/goods/goodsdetail/goodsdetail?isAssemble=true&goods_id=' + this.data.pintTuanData.goods_id + '&pt_goods_id=' + this.data.pintTuanData.pt_goods_id + '&pt_startup_id=' + this.data.pt_startup_id
    // });

    that.userIsNewCheck().then(() => {
      animate();
    }).catch(e => console.log(e));


    // 开始动画
    function animate() {
      const animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })

      that.animation = animation

      animation.translateY(282).step()

      that.setData({
        maskShow: 1,
        animation: animation.export()
      })

      setTimeout(function () {
        animation.translateY(0).step()
        that.setData({
          animation: animation.export()
        })
      }.bind(that), 50)
    }
  },
  // 新用户检查
  userIsNewCheck() {
    let that = this;
    return new Promise((resolve, reject) => {
      if (that.data.pintTuanData.type == 1) return resolve();
      SERVERS.MEMBER.isNewMember.post().then(res => {
        if (res.code == 0) {
          if (res.data == 1) {
            resolve();
          } else {
            app.showBox(that, '您不是新用户无法参与！');
          }
        }
      }).catch(e => console.log(e));
    });
  },
  /**
   * 商品数量调节
   */
  goodsNumAdjust: function (event) {
    let that = this;
    let button_type = event.currentTarget.dataset.type;
    let num = parseInt(that.data.goodsNum);
    let numCount = parseInt(that.data.detail.stock);
    let max_buy = parseInt(that.data.detail.max_buy);
    let min_buy = parseInt(that.data.detail.min_buy);
    if (button_type == 'add' && numCount > 0) {
      num++;
      if (max_buy > 0 && num > max_buy) {
        app.showBox(that, '此商品限购，您最多购买' + max_buy + '件');
        return false;
      }

      if (num > numCount) {
        app.showBox(that, '已达到最大库存');
        num = numCount;
      }
    } else if (button_type == 'minus' && numCount > 0) {
      num--;
      if (min_buy > 0 && num < min_buy) {
        app.showBox(that, '此商品限购，您最少购买' + min_buy + '件');
        return false;
      }

      if (num <= 0) {
        num = 1;
      }
    } else {
      num = 1;
    }
    that.setData({
      goodsNum: num
    })
  },
  // 规格选择

  /**
   * sku选中
   */
  skuSelect: function (event) {
    let that = this;
    let key = event.currentTarget.dataset.key;
    let k = event.currentTarget.dataset.k;
    let goods_info = that.data.detail;
    let arr = that.data.detail.spec_list; //默认规格
    let stock = that.data.stock;
    let sku_id = that.data.sku_id;

    let attr_value_items = {};
    let sku_info = that.data.sku_info;

    // 通过key知道选择的规格
    for (let i = 0; i < arr[key].value.length; i++) {
      arr[key].value[i].status = 0;
    }

    arr[key].value[k].status = 1;
    let sku_img = {
      spec_value_data: arr[key].value[k].spec_value_data_src,
      spec_value_data_big_src: arr[key].value[k].spec_value_data_big_src
    };
    //拼合规格组
    for (let i = 0; i < arr.length; i++) {

      for (let l = 0; l < arr[i].value.length; l++) {

        if (arr[i].value[l]['status'] == 1) {
          attr_value_items[i] = arr[i].value[l].spec_id + ':' + arr[i].value[l].spec_value_id;
          attr_value_items.length = i + 1;
        }

      }
    }

    //规格组、库存判断
    for (let i = 0; i < goods_info.sku_list.length; i++) {
      let count = 1;
      for (let l = 0; l < attr_value_items.length; l++) {
        if (goods_info.sku_list[i].attr_value_items.indexOf(attr_value_items[l]) == -1) {
          count = 0;
        }
      }

      if (count == 1) {
        sku_id = goods_info.sku_list[i].sku_id;
        stock = goods_info.sku_list[i].stock;
        sku_info = goods_info.sku_list[i];
      }

      // 选择规格修改前段页面显示
      if (sku_id == goods_info.sku_list[i].sku_id) {
        //内购时规格价格
        let sku_promote = goods_info.sku_list[i].promote_price;
        let sku_price = goods_info.sku_list[i].price;

        //非内购价格
        let sku_let = goods_info.sku_list[i].inside_price;
        // console.log(sku_let)
        let Lei_price = goods_info.sku_list[i].inside_price;
        let is_inside_sell = goods_info.sku_list[i].is_inside_sell;
        let market_price = goods_info.sku_list[i].market_price;
        that.setData({
          is_inside_sell
        })
        if (is_inside_sell == 0) {
          goods_info.market_price = market_price;
          goods_info.promote_price = Number(sku_promote * that.data.pintTuanData.discount / 10).toFixed(2);
          goods_info.price = sku_price;
        } else {
          goods_info.inside_price = sku_let;
          goods_info.inside_price = Lei_price
        }
      }
    }
    if (!sku_img.spec_value_data) {
      sku_img = {
        spec_value_data: goods_info.img_list[0].pic_cover_big,
        spec_value_data_big_src: goods_info.img_list[0].pic_cover_big,
      };
    }
    that.setData({
      spec_list: arr,
      sku_id: sku_id,
      stock: stock,
      sku_info: sku_info,
      detail: goods_info,
      mo_imgs: sku_img
    })
  },
  /**
   * 拼团
   */
  pintuanNext() {
    let that = this;
    let sku_id = that.data.sku_id;
    let stock = that.data.detail.stock;
    let goods_num = parseInt(that.data.goodsNum);
    let goods_info = that.data.detail;
    let purchase_num = parseInt(goods_info.purchase_num);
    let max_buy = parseInt(goods_info.max_buy);
    let min_buy = parseInt(goods_info.min_buy);
    if (goods_info.state == 0) {
      app.showBox(that, '该商品已下架');
      return false;
    }
    if (goods_info.state == 10) {
      app.showBox(that, '该商品属于违禁商品，现已下架');
      return false;
    }

    if (stock <= 0) {
      app.showBox(that, '商品已售馨');
      return false;
    }
    if (goods_num <= 0) {
      app.showBox(that, '最少购买1件商品');
      return false;
    }
    if (max_buy > 0 && (purchase_num + goods_num) > max_buy) {
      app.showBox(that, '此商品限购，您最多购买' + max_buy + '件');
      return false;
    }
    let tag = "pintuan";
    let sku_list = sku_id + ':' + goods_num;
    let source_type = goods_info.source_type;
    let is_inside = that.data.is_inside_sell;
    let goods_type = goods_info.goods_type;
    let pt_goods_id = that.data.pintTuanData.pt_goods_id;
    let pt_startup_id = that.data.pt_startup_id;
    wx.navigateTo({
      url: '/pages/order/paymentorder/paymentorder?tag=' + 6 + '&sku=' + sku_list + '&goods_type=' + goods_type + '&source_type=' + source_type + '&order_type=0' + '&is_inside=' + is_inside + '&pt_goods_id=' + pt_goods_id + '&pt_startup_id=' + pt_startup_id
    })
  },
  // 登录
  login() {
    wx.navigateTo({
      url: '/pages/member/resgin/resgin'
    })
  },
  // 用户登录验证
  checkUserLoginState() {
    let that = this;
    if (app.globalData.token && app.globalData.token != '') {
      this.getUserInfo();
    } else {
      app.employIdCallback = employId => {
        if (employId != '') {
          this.getUserInfo();
        }
      }
      fn && fn();
    }

  },
  // 获取用户信息
  getUserInfo() {
    let that = this;
    SERVERS.MEMBER.getMemberDetail.post().then(res => {
      let { code, data } = res;
      if (code == 0) {
        let tel = data.user_info.user_tel;
        app.globalData.is_vip = data.is_vip;
        app.globalData.distributor_type = data.distributor_type;
        app.globalData.uid = data.uid;
        app.globalData.vip_gift = data.vip_gift;
        app.globalData.vip_goods = data.vip_goods;
        that.setData({
          userInfo: data.user_info,
          tel: tel,
          distributor_type: data.distributor_type,
          unregistered: app.globalData.unregistered,
          is_employee: data.is_employee
        });
        if (tel == '') {
          wx.navigateTo({
            url: '/pages/member/resgin/resgin',
          })
        }
      }
      if(that.data.isInit){
        that.initPinTuanData();
        that.setData({ isInit: false });
      }
    }).catch(e => console.log(e));
  },
  // 规格选择部分
  popupClose() {
    this.setData({
      maskShow: 0
    })
  }
})