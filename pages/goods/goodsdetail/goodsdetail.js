var wxParse = require('../../../wxParse/wxParse.js');
var time = require("../../../utils/util.js");
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '', //库路径
    defaultImg: {},
    detail_id: 0, //商品id
    current_time: 0, //现在的时间
    //轮播图属性
    imgUrls: {},
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 300,
    circular: true,
    indicatorColor: '#AAA',
    indicatorActiveColor: '#FFF',
    swiperHeight: 320,
    selectType: 'img',
    //底部导航
    goodsNav: 0,
    goodsChildNav: 0,
    //遮罩层
    maskShow: 0,
    //优惠券弹框
    popupShow: 0,
    //商家服务弹框
    serviceShow: 0,
    //购买、购物车弹框
    sBuy: 0,
    //阶梯优惠弹框
    ladderPreferentialShow: 0,
    animation: '',
    goods_id: 0,
    is_share: 0,
    buyButtonStatus: 0, //购买、购物车确认按钮
    goods_info: {}, //商品详情
    comments_list: {}, //评价列表
    comments_type: 0, //评价类型
    next_page: 1, //下一页页码
    spec_list: {}, //规格列表
    attr_value_items_format: '', //选中规格组
    sku_id: 0, //选中规格
    sku_info: {}, //选中规格信息
    stock: {}, //选中规格库存
    member_price: 0.00, //选中规格价格
    goodsNum: 1, //购买数量
    addCartFlag: 0,
    comboFlag: 0,
    comboPackagesFlag: 0,
    buyNextFlag: 0,
    goodsDetailFlag: 0,
    moreEvaluationFlag: 0,
    confirmSpellFlag: 0,
    flys: 0, //判断是不是礼物专区商品
    is_vip: 0,//判断是否是vip
    // unregistered: 0, //是否注册(1未注册, 0已注册)
    tel: '',//是否绑定手机号
    showModal: false,
    Choice: false,
    is_employee: '',    //是否为员工
    curr_id: '',   //当前打开的视频id
    point: 0,
    layout: false,
    Token: '',
    isInput:1,
  },
  //测试数据
  last: function () {
    let that = this;
    let goods_info = that.data.goods_info;
    let uid = app.globalData.uid;
    wx.navigateTo({
      url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + goods_info.goods_id + '&uid=' + uid + '&distributor_type=2',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let flys = options.fly;
    let isIphoneX = app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX
    })
    if (options.uid) {
      console.log('options.uid', options.uid)
      app.globalData.identifying = options.uid;
      app.globalData.breakpoint = options.breakpoint;
    }
    // 判断用户进页面的方式 
    if (options.goods_id) {
      let goods_id = options.goods_id;
      that.setData({
        goods_id: goods_id,
      })
      if (options.store_id) {
        console.log('@@@@', options.store_id)
        let store_id = options.store_id;
        app.globalData.store_id = store_id;
      }
    }
    else if (options.scene) {
      // 扫码进入
      var scene = decodeURIComponent(options.scene);
      let goods_id = scene.split('&')[0];
      let kol_id = scene.split('&')[1];
      console.log("********详情页id", goods_id);
      console.log("********内详情页kol_id", kol_id);
      app.globalData.kol_id = kol_id;

      that.setData({
        goods_id: goods_id,
      })

    }

    // 是否授权数据更新
    let updata = that.data.unregistered
    updata = app.globalData.unregistered;

    console.log(updata, 'updata')
    that.setData({
      unregistered: app.globalData.unregistered
    });



    if (goods_name) {
      wx.setNavigationBarTitle({
        title: goods_name
      })
    }

    //  极选师扫码12小时内有分销来源
    let timestamp = Date.parse(new Date);
    if (app.globalData.identifying != 0) {
      let overtime = timestamp + 43200000;
      console.log(timestamp)
      let uid = app.globalData.identifying;
      let breakpoint = app.globalData.breakpoint
      wx.setStorageSync('breakpoint', breakpoint);
      wx.setStorageSync('uid', uid)
      wx.setStorageSync('overtime', overtime);
    }

    if (flys == 'fly') {
      that.setData({
        flys: 1
      })
    }


    console.log('token', app.globalData.token)

    let window_width = wx.getSystemInfoSync().windowWidth;
    let siteBaseUrl = app.globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;
    let copyRight = app.globalData.copyRight;
    let goods_name = options.goods_name;




    that.setData({
      Base: siteBaseUrl,
      defaultImg: defaultImg,
      swiperHeight: window_width,
      copyRight: copyRight,
    })
  },

  hideModal: function () {
    this.setData({
      showModal: false,
      Choice: false,
      layout: false,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.VideoContext = wx.createVideoContext('myVideo')
  },
  videoPlay(e) {
    this.setData({
      curr_id: e.currentTarget.dataset.id,
    })
    this.VideoContext.play();
    console.log(this.VideoContext)
    // VideoContext.play()
    console.log(888888888888)
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    let goods_id = that.data.goods_id;
    let detail_id = that.data.detail_id;
    let attr_value_items_format = '';
    let member_price = 0.00;
    let base = that.data.Base;
    let is_employee = that.data.is_employee;
    console.log(is_employee)





    //判断是否是付费会员
    let is_vip = app.globalData.is_vip;
    that.setData({
      is_vip
    })
    if (app.globalData.distributor_type != 0) {

    } else {
      let timestamp = Date.parse(new Date);
      let breakpoints = wx.getStorageSync('breakpoint');
      console.log(breakpoints, 'breakpoints')
      let uids = wx.getStorageSync('uid')
      console.log(uids, 'uids')
      let overtimes = wx.getStorageSync('overtime');
      if (timestamp < overtimes) {
        console.log(211111)
        app.globalData.identifying = uids;
        app.globalData.breakpoint = breakpoints;
      } else {
        console.log(333333)
      }
    }






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





    app.restStatus(that, 'comboFlag');
    app.restStatus(that, 'comboPackagesFlag');
    app.restStatus(that, 'buyNextFlag');
    app.restStatus(that, 'goodsDetailFlag');
    app.restStatus(that, 'moreEvaluationFlag');
    app.restStatus(that, 'confirmSpellFlag');
    app.sendRequest({
      url: 'api.php?s=goods/goodsDetail',
      data: {
        goods_id: goods_id,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let vip_price = data.vip_price;
          let goodsDetailImg = data.goodsDetailImg;
          if (goodsDetailImg) {

          } else {
            goodsDetailImg = 0
          }
          // console.log(vip_price)
          // 判断是否礼物商品
          if (data.goods_type == 2) {
            that.setData({
              flys: 1
            })
          }

          if (data.description != '' && data.description != null && data.description != undefined) {
            detail_id = goods_id;
          }


          // 运费转换
          data.shipping_fee_name = parseInt(data.shipping_fee_name.substring(1)).toFixed(2);


          //购买数量初始化
          let goodsNum = that.data.goodsNum;
          if (parseInt(data.min_buy) > 0) {
            goodsNum = parseInt(data.min_buy);
          }

          //优惠券时间格式转换
          for (let i in data.goods_coupon_list) {
            data.goods_coupon_list[i].start_time = time.formatTime(data.goods_coupon_list[i].start_time, 'Y-M-D');
            data.goods_coupon_list[i].end_time = time.formatTime(data.goods_coupon_list[i].end_time, 'Y-M-D');
            data.goods_coupon_list[i].status = 1;
          }

          //视频路径处理
          data.goods_video_address = data.goods_video_address == undefined ? '' : data.goods_video_address;
          data.goods_video_address = data.goods_video_address == 0 ? '' : data.goods_video_address;
          let video = data.goods_video_address;
          if (video != '' && video.indexOf('https://') == -1 && video.indexOf('http://') >= -1) {
            data.goods_video_address = base + video;
          }
          //商品图片处理
          let imgUrls = data.img_list;
          for (let index in imgUrls) {
            let img = imgUrls[index].pic_cover_mid;
            imgUrls[index].pic_cover_mid = app.IMG(img);
          }
          let goods_info = data;
          // 是否是内购商品
          let is_inside_sell = goods_info.sku_list[0].is_inside_sell;

          console.log(goods_info)

          goods_info.img_list[0].pic_cover_micro = app.IMG(goods_info.img_list[0].pic_cover_micro);
          goods_info.picture_detail.pic_cover_micro = app.IMG(goods_info.picture_detail.pic_cover_micro);
          goods_info.picture_detail.pic_cover_small = app.IMG(goods_info.picture_detail.pic_cover_small);
          //组合商品图片处理
          if (goods_info.comboPackageGoodsArray != undefined && goods_info.comboPackageGoodsArray.goods_array != undefined) {
            for (let index in goods_info.comboPackageGoodsArray.goods_array) {
              let img = goods_info.comboPackageGoodsArray.goods_array[index].pic_cover_micro;
              goods_info.comboPackageGoodsArray.goods_array[index].pic_cover_micro = app.IMG(img);
            }
          }
          //富文本格式转化
          let description = goods_info.description;
          wxParse.wxParse('description', 'html', description, that, 5);

          //原价
          let sum = "";
          if (goods_info.market_price - goods_info.member_price > 0) {
            sum = 1
          } else {
            sum = 2
          }

          let brand_id = data.brand_id
          console.log(brand_id, goods_info.promotion_price, goods_info.inside_price)
          that.setData({
            goods_info: goods_info,
            detail_id: detail_id,
            imgUrls: data.img_list,
            current_time: data.current_time,
            goodsNum: goodsNum,
            brand_id: brand_id,
            sum,
            is_inside_sell,
            goodsDetailImg   //极选师推荐图片
          });

          //限时折扣计时
          if (data.promotion_type == 2 && data.promotion_detail != '') {
            let time_array = {};
            time_array.end = 0;
            time_array.end_time = data.promotion_detail.end_time;
            that.timing(that, time_array);
          }

          let sku_info = that.data.sku_info;//选中规格信息
          let sku_id = that.data.sku_id; //选中规格
          console.log(sku_id);
          let attr_value_items = {}; //规格组
          let stock = 0; //库存
          let mo_imgs = data.img_list[0].pic_cover_micro;
          //规格默认选中
          for (let i = 0; i < data.spec_list.length; i++) {
            for (let l = 0; l < data.spec_list[i].value.length; l++) {
              if (l == 0) {
                data.spec_list[i].value[l]['status'] = 1;

                if (data.spec_list[i].value[l].spec_value_data_src) {
                  mo_imgs = data.spec_list[i].value[l].spec_value_data_src;
                }

                attr_value_items[i] = data.spec_list[i].value[l].spec_id + ':' + data.spec_list[i].value[l].spec_value_id;
                attr_value_items.length = i + 1;
              } else {
                data.spec_list[i].value[l]['status'] = 0;
              }
            }
          }

          //规格组、库存判断
          for (let i = 0; i < data.sku_list.length; i++) {
            let count = 1;
            for (let l = 0; l < attr_value_items.length; l++) {
              if (data.sku_list[i].attr_value_items.indexOf(attr_value_items[l]) == -1) {
                count = 0;
              }
            }
            if (count == 1) {
              attr_value_items_format = data.sku_list[i].attr_value_items_format;
              sku_id = data.sku_list[i].sku_id;
              member_price = data.sku_list[i].member_price;

              stock = data.sku_list[i].stock;
              sku_info = data.sku_list[i];
            }




          }
          console.log(stock, 'stock');
          that.setData({
            spec_list: data.spec_list,
            sku_id: sku_id,
            attr_value_items_format: attr_value_items_format,
            member_price: member_price,
            stock: stock,
            sku_info: sku_info,
            vip_price,
            mo_imgs
          })

          let comment_type = that.data.comments_type;
          that.getComments(comment_type);
        }
        // console.log(res);
      }
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
  /**登录分支点*/
  Branch: function (e) {
    let _that = this;
    let branch = e.currentTarget.dataset.status;
    if (branch == "mobile") {
      _that.setData({
        Choice: false,
        layout: false,
      })
      wx.navigateTo({
        url: '/pages/member/updatemobile/updatemobile?cho=1',
      })
    } else if (branch == "no") {
      _that.setData({
        Choice: false
      })
    }
  },
  /**触发*/
  Crossdetails: function () {
    let _that = this;
    let Tel = _that.data.tel;
    console.log(213)
    let suffix = _that.data.goods_id;
    console.log(suffix )
    if (app.globalData.unregistered == 1 || Tel == '') {
      wx.navigateTo({
        url: '/pages/member/resgin/resgin?suffix=' + suffix,
      })
    }
  },
  plusXing(str, frontLen) {
    //console.log(str);
    var len = str.length - frontLen
    var xing = '';
    for (var i = 0; i < len; i++) {
      xing += '*';
    }
    return str.substring(0, frontLen) + xing
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    let that = this;
    let goods_info = that.data.goods_info;
    let uid = app.globalData.uid;
    let XQ_share_url = '/pages/goods/goodsdetail/goodsdetail?goods_id=' + goods_info.goods_id;

    if (that.data.distributor_type == 0) {
      return {
        title: goods_info.introduction,
        path: XQ_share_url,
        imageUrl: goods_info.picture_detail.pic_cover_small,
        success: function (res) {
          app.showBox(that, '分享成功');
        },
        fail: function (res) {
          app.showBox(that, '分享失败');
        }
      }
    }
    else {
      return {
        title: goods_info.introduction,
        path: XQ_share_url + '&uid=' + uid,
        imageUrl: goods_info.picture_detail.pic_cover_small,
        success: function (res) {
          app.showBox(that, '分享成功');
        },
        fail: function (res) {
          app.showBox(that, '分享失败');
        }
      }
    }


    let is_share = 0;

    that.setData({
      is_share: is_share
    })
  },

  /**
   * 图片加载失败
   */
  errorImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let goods_info = that.data.goods_info;
    let imgUrls = that.data.imgUrls;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = imgUrls[index].pic_cover_mid;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "imgUrls[" + index + "].pic_cover_mid";

        parm[parm_key] = default_img;
        parm_key = "goods_info.img_list[0].pic_cover_micro";
        parm[parm_key] = default_img;
        parm_key = 'goods_info.picture_detail.pic_cover_micro';
        parm[parm_key] = default_img;
        parm_key = 'goods_info.picture_detail.pic_cover_small';
        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 组合套餐图片加载失败
   */
  errorComboImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let goods_info = that.data.goods_info;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = goods_info.comboPackageGoodsArray.goods_array[index].pic_cover_micro;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "goods_info.comboPackageGoodsArray.goods_array[" + index + "].pic_cover_micro";

        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 头像加载失败
   */
  errorHeadImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let comments_list = that.data.comments_list;
    let defaultImg = that.data.defaultImg.value.default_headimg;
    let base = that.data.Base;
    let parm = {};
    let parm_key = "comments_list[" + index + "].user_img";

    if (defaultImg.indexOf('http://') == 1 || defaultImg.indexOf('https://') == 1) {
      parm[parm_key] = defaultImg;
    } else {
      if (comments_list[index].user_img == base + defaultImg) {
        return false;
      }
      parm[parm_key] = base + defaultImg;
    }
    that.setData(parm);
  },

  /**
   * 组合商品详情
   */
  comboGoodsDetail: function (e) {
    let that = this;
    let dataset = e.currentTarget.dataset;
    let goods_id = dataset.id;
    let goods_name = dataset.name;
    let comboFlag = that.data.comboFlag;

    if (comboFlag == 1) {
      return false;
    }
    app.clicked(that, 'comboFlag');

    wx.redirectTo({
      url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + goods_id + '&goods_name=' + goods_name,
    })
  },

  /**
   * 组合套餐
   */
  comboPackages: function (e) {
    let that = this;
    let goods_id = e.currentTarget.dataset.id;
    let comboPackagesFlag = that.data.comboPackagesFlag;

    if (comboPackagesFlag == 1) {
      return false;
    }
    app.restStatus(that, 'comboPackagesFlag');

    wx.navigateTo({
      url: '/pages/goods/combopackagelist/combopackagelist?goods_id=' + goods_id,
    })
  },

  /**
   * 底部一级导航选中
   */
  goodsBottomNav: function (event) {
    let that = this;
    let id = event.currentTarget.dataset.id;

    that.setData({
      goodsNav: id
    });
  },

  /**
   * 底部二级导航选中
   */
  goodsBottomChildNav: function (event) {
    let that = this;
    let id = event.currentTarget.dataset.type;

    that.setData({
      goodsChildNav: id
    });
    that.getComments(id);
  },

  /**
   * 首页跳转
   */
  tapSwitch: function (event) {
    let url = event.currentTarget.dataset.url;
    // console.log(url)
    wx.switchTab({
      url: '/pages' + url,
    })
  },
  giftSwitch: function (event) {
    let url = event.currentTarget.dataset.url;
    wx.navigateTo({
      url: '/pages' + url,
    })

  },
  /**
   * 点赞
   */
  thumbUp: function () {
    let that = this;
    let goods_id = that.data.goods_id;
    let goods_info = that.data.goods_info;

    app.sendRequest({
      url: 'api.php?s=goods/getClickPoint',
      data: {
        goods_id: goods_id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "POST",
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if (data > 0) {
            goods_info.click_detail = {};
            goods_info.click_detail[0] = {
              status: 1
            };
          } else if (data == -1) {
            app.showBox(that, '您今天已经赞过该商品了');
          } else {
            app.showBox(that, '操作失败');
          }
          that.setData({
            goods_info: goods_info
          })
        }
        // console.log(res);
      }
    });
  },

  /**
   * 商品评论
   */
  getComments: function (comment_type) {
    let that = this;
    let comments_type = that.data.comments_type;
    let page = that.data.next_page;
    let goods_id = that.data.goods_id;
    let defaultImg = that.data.defaultImg;

    app.sendRequest({
      url: 'api.php?s=goods/getGoodsComments',
      data: {
        goods_id: goods_id,
        comments_type: comment_type,
        page: page
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          if (res.data.data.length > 0) {
            let comments_list = res.data.data;

            if (comments_list[0].again_image == '') {
              comments_list[0].again_image = {}
            } else {
              comments_list[0].again_image = comments_list[0].again_image.split(',');
              for (let key in comments_list[0].again_image) {
                let img = comments_list[0].again_image[key];
                comments_list[0].again_image[key] = app.IMG(img);
              }
            }
            //时间戳转换
            if (comments_list[0].addtime > 0) {
              comments_list[0].addtime = time.formatTime(comments_list[0].addtime, 'Y-M-D h:m:s');
            }
            if (comments_list[0].again_addtime > 0) {
              comments_list[0].again_addtime = time.formatTime(comments_list[0].again_addtime, 'Y-M-D h:m:s');
            }
            page = comment_type == comments_type ? page + 1 : 1;

            //隐藏评价人的微信名
            for (var i = 0; i < comments_list.length; i++) {
              comments_list[i].user_img = app.IMG(comments_list[i].user_img);
              if (comments_list[i].user_img == '') {
                comments_list[i].user_img = defaultImg.value.default_headimg;
              }
              //图片数组分割
              if (comments_list[i].image == '') {
                comments_list[i].image = {}
              } else {
                comments_list[i].image = comments_list[i].image.split(',');
                for (let key in comments_list[i].image) {
                  let img = comments_list[i].image[key];
                  comments_list[i].image[key] = app.IMG(img);
                }
              }
              // comments_list[i].member_name = that.plusXing(comments_list[i].member_name, 1)
            }
            // var appraiser = comments_list[0].member_name
            // console.log(appraiser )
            // console.log(that.plusXing(appraiser, 1))

            that.setData({
              comments_list: comments_list,
              comments_type: comment_type,
              page: page,
              // appraisers: that.plusXing(appraiser, 1)
            })
          } else {
            let comments_list = {};
            let page = 1;
            that.setData({
              comments_list: comments_list,
              comments_type: comment_type,
              page: page,
            })
          }
        }
        //console.log(res)
      }
    });
  },

  /**
   * 购买弹框(动画效果未实现)
   */
  sBuyShow: function (event) {
    let that = this;
    let popUp = 3
    let type = event.currentTarget.dataset.type;
    let status = 0;


    this.setData({
      point: 1
    })
    const animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })

    this.animation = animation

    animation.translateY(282).step()

    this.setData({
      animation: animation.export()
    })

    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animation: animation.export()
      })
    }.bind(this), 50)

    if (type == 'buy') {
      status = 0;
    } else if (type == 'addCart') {
      status = 1;
    }
    this.setData({
      sBuy: 1,
      maskShow: 1,
      buyButtonStatus: status,
      animation: animation.export(),
      popUp
    })



  },

  /**
 * chakan弹框(动画效果未实现)
 */
  Examine: function (event) {
    let popUp = 1
    let type = event.currentTarget.dataset.type;
    let status = 0;
    
    if (type == 'buy') {
      status = 0;
    } else if (type == 'addCart') {
      status = 1;
    }
    const animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })

    this.animation = animation

    animation.translateY(282).step()

    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animation: animation.export()
      })
    }.bind(this), 50)
    this.setData({
      sBuy: 1,
      maskShow: 1,
      buyButtonStatus: status,
      animation: animation.export(),
      popUp
    })

  },

  /**
   * 关闭弹框
   */
  popupClose: function (event) {
    // const animation = wx.createAnimation({
    //   duration: 500,
    //   timingFunction: 'ease',
    // })

    // this.animation = animation

    // animation.translateY(0)

    // setTimeout(function () {
    //   animation.translateY(-282).step()
    //   this.setData({
    //     animation: animation.export()
    //   })
    // }.bind(this), 50)
    this.setData({
      sBuy: 0,
      popupShow: 0,
      serviceShow: 0,
      maskShow: 0,
      point: 0,
      // animation: animation.export(),
      ladderPreferentialShow: 0,
    })
  },

  /**
   * sku选中
   */
  skuSelect: function (event) {
    let that = this;
    let key = event.currentTarget.dataset.key;
    let k = event.currentTarget.dataset.k;
    let goods_info = that.data.goods_info;
    let arr = that.data.spec_list; //默认规格
    let stock = that.data.stock;
    let sku_id = that.data.sku_id;

    let attr_value_items_format = that.data.attr_value_items_format;
    let member_price = that.data.member_price;
    let attr_value_items = {};
    let sku_info = that.data.sku_info;

    // 通过key知道选择的规格
    for (let i = 0; i < arr[key].value.length; i++) {
      arr[key].value[i].status = 0;
    }

    arr[key].value[k].status = 1;
    let sku_img = arr[key].value[k].spec_value_data_src;
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
        attr_value_items_format = goods_info.sku_list[i].attr_value_items_format;
        member_price = goods_info.sku_list[i].member_price;
        stock = goods_info.sku_list[i].stock;
        sku_info = goods_info.sku_list[i];

      }

      console.log(sku_id);
      console.log(goods_info.sku_list[i].sku_id);

      // 选择规格修改前段页面显示
      if (sku_id == goods_info.sku_list[i].sku_id) {
        //内购时规格价格
        let sku_promote = goods_info.sku_list[i].promote_price;
        let sku_price = goods_info.sku_list[i].price;

        //非内购价格
        let sku_let = goods_info.sku_list[i].inside_price;
        console.log(sku_let)
        let Lei_price = goods_info.sku_list[i].inside_price;
        let is_inside_sell = goods_info.sku_list[i].is_inside_sell;



        that.setData({
          is_inside_sell
        })
        if (sku_img) {
          that.data.mo_imgs = sku_img;
          that.setData({
            mo_imgs: sku_img
          })
        }

        if (is_inside_sell == 0) {
          goods_info.promote_price = sku_promote;
          goods_info.price = sku_price;
        } else {
          goods_info.inside_price = sku_let;
          goods_info.inside_price = Lei_price
        }



      }


    }





    that.setData({
      spec_list: arr,
      sku_id: sku_id,
      attr_value_items_format: attr_value_items_format,
      member_price: member_price,
      stock: stock,
      sku_info: sku_info,
      goods_info
    })
  },

  /**
   * 商品数量调节
   */
  goodsNumAdjust: function (event) {
    let that = this;
    let button_type = event.currentTarget.dataset.type;
    let num = parseInt(that.data.goodsNum);
    let numCount = parseInt(that.data.stock);
    let max_buy = parseInt(that.data.goods_info.max_buy);
    let min_buy = parseInt(that.data.goods_info.min_buy);

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

  /**
   * 数量调节检测
   */
  goodsNumAdjustCheck: function (event) {
    let that = this;
    let num = event.detail.value;
    let numCount = parseInt(that.data.stock);
    let max_buy = parseInt(that.data.goods_info.max_buy);
    // let stock = parseInt(that.data.goods_info.stock);
    let min_buy = parseInt(that.data.goods_info.min_buy);

    if (max_buy > 0 && num > max_buy) {
      app.showBox(that, '此商品限购，您最多购买' + max_buy + '件');
      that.setData({
        goodsNum: max_buy
      })
      return;
    }

    if (min_buy > 0 && num < min_buy) {
      app.showBox(that, '此商品限购，您最少购买' + min_buy + '件');
      that.setData({
        goodsNum: min_buy
      })
      return;
    }

    if (num > numCount) {
      app.showBox(that, '已达到最大库存');
      num = numCount;
    } else if (num < 0) {
      num = 0;
    }
    that.setData({
      goodsNum: num,
      isInput:1,
    })
  },
  /**
   * 到货通知
   */
  message: function (event) {
    let that = this;
    // console.log(122121212211221)
    let goods_id = that.data.goods_id;
    app.sendRequest({
      url: 'api.php?s=order/getUpProTemplate',
      data: {
        openid: app.globalData.openid,
        uid: app.globalData.unionid,
        formid: event.detail.formId,
        goods_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;

        app.showBox(that, '预约商品到货成功');
        app.restStatus(that, 'addCartFlag');
      }
    });


  },

  /**
   * 加入购物车
   */
  addCart: function (event) {
    let that = this;
    let addCartFlag = that.data.addCartFlag;
    let goods_info = that.data.goods_info;
    let is_employee = that.data.is_employee;
    let is_inside_sell = that.data.is_inside_sell;
    let purchase_num = goods_info.purchase_num;
    let count = that.data.goodsNum;
    let max_buy = parseInt(goods_info.max_buy);

    let uc = that.data.stock;

    let stock = parseInt(goods_info.stock);

    if (addCartFlag == 1) {
      return false;
    }
    app.clicked(that, 'addCartFlag');

    if (goods_info.state == 0) {
      app.showBox(that, '该商品已下架');
      app.restStatus(that, 'addCartFlag');
      return false;
    }

    if (parseInt(uc) <= 0) {
      app.showBox(that, '商品已售馨');
      app.restStatus(that, 'buyNextFlag');
      return false;
    }
    if (goods_info.state == 10) {
      app.showBox(that, '该商品属于违禁商品，现已下架');
      app.restStatus(that, 'addCartFlag');
      return false;
    }
   


    // 判断传的价格是什么
    var public_cart = ""
    if (app.globalData.is_vip == 1) {
      public_cart = that.data.vip_price
      // console.log(public_cart, 1111)
    } else if (is_employee == 1 && is_inside_sell == 1) {
      public_cart = goods_info.promotion_price < goods_info.inside_price ? goods_info.promotion_price : goods_info.inside_price
      // public_cart = that.data.member_price
      // console.log(public_cart,2222)
    } else {
      public_cart = goods_info.promotion_price < goods_info.price ? goods_info.promotion_price : goods_info.price
      // public_cart = that.data.member_price
      // console.log(public_cart,2222)
    }


    var cart_detail = {
      shop_id: 0,
      shop_name: 'shopal',
      trueId: that.data.goods_info.goods_id,
      goods_name: that.data.goods_info.goods_name,
      count: count,
      select_skuid: that.data.sku_id,
      select_skuName: that.data.sku_info.sku_name,
      price: public_cart,
      cost_price: that.data.sku_info.cost_price,
      picture: that.data.goods_info.picture
    };
    console.log(cart_detail)
    cart_detail = JSON.stringify(cart_detail);

    app.sendRequest({
      url: 'api.php?s=goods/addCart',
      data: {
        cart_detail: cart_detail,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if (data.code > 0) {
            app.showBox(that, '加入购物车成功')
            purchase_num = parseInt(purchase_num) + parseInt(count);
            let d = {};
            let parm = "goods_info." + purchase_num;
            d[parm] = purchase_num;

            that.setData(d);
            that.popupClose();
            app.restStatus(that, 'addCartFlag');
          } else {
            app.showBox(that, data.message)
            app.restStatus(that, 'addCartFlag');
          }
        }
      }
    });




  },


  /**
   * 加入礼物盒
   */
  addGift: function (event) {
    let that = this;
    let addCartFlag = that.data.addCartFlag;
    let goods_info = that.data.goods_info;
    let purchase_num = goods_info.purchase_num;
    let count = that.data.goodsNum;
    // let max_buy = parseInt(goods_info.max_buy);
    // console.log(max_buy)

    if (addCartFlag == 1) {
      return false;
    }
    app.clicked(that, 'addCartFlag');

    if (goods_info.state == 0) {
      app.showBox(that, '该商品已下架');
      app.restStatus(that, 'addCartFlag');
      return false;
    }

    if (goods_info.state == 10) {
      app.showBox(that, '该商品属于违禁商品，现已下架');
      app.restStatus(that, 'addCartFlag');
      return false;
    }



    let public_boxs = ""
    if (app.globalData.is_vip == 1) {
      public_boxs = that.data.vip_price
      let box_detail = {
        shop_id: 0,
        shop_name: 'shopal',
        trueId: that.data.goods_info.goods_id,
        goods_name: that.data.goods_info.goods_name,
        count: count,
        select_skuid: that.data.sku_id,
        select_skuName: that.data.sku_info.sku_name,
        price: public_boxs,
        cost_price: that.data.sku_info.cost_price,
        picture: that.data.goods_info.picture
      };
      box_detail = JSON.stringify(box_detail);

      app.sendRequest({
        url: '/api.php?s=goods/addBox',
        data: {
          box_detail: box_detail,
        },
        success: function (res) {
          let code = res.code;
          let data = res.data;
          if (code == 0) {
            if (data.code > 0) {
              app.showBox(that, '加入礼物盒成功')
              purchase_num = parseInt(purchase_num) + parseInt(count);
              let d = {};
              let parm = "goods_info." + purchase_num;
              d[parm] = purchase_num;

              that.setData(d);
              that.popupClose();
              app.restStatus(that, 'addCartFlag');
            } else {
              app.showBox(that, data.message)
              app.restStatus(that, 'addCartFlag');
            }
          }
        }
      });
    } else {
      public_boxs = goods_info.promotion_price < goods_info.price ? goods_info.promotion_price : goods_info.price
      let box_detail = {
        shop_id: 0,
        shop_name: 'ushopal',
        trueId: that.data.goods_info.goods_id,
        goods_name: that.data.goods_info.goods_name,
        count: count,
        select_skuid: that.data.sku_id,
        select_skuName: that.data.sku_info.sku_name,
        price: public_boxs,
        cost_price: that.data.sku_info.cost_price,
        picture: that.data.goods_info.picture
      };
      box_detail = JSON.stringify(box_detail);

      app.sendRequest({
        url: '/api.php?s=goods/addBox',
        data: {
          box_detail: box_detail,
        },
        success: function (res) {
          let code = res.code;
          let data = res.data;
          if (code == 0) {
            if (data.code > 0) {
              app.showBox(that, '加入礼物盒成功')
              purchase_num = parseInt(purchase_num) + parseInt(count);
              let d = {};
              let parm = "goods_info." + purchase_num;
              d[parm] = purchase_num;

              that.setData(d);
              that.popupClose();
              app.restStatus(that, 'addCartFlag');
            } else {
              app.showBox(that, data.message)
              app.restStatus(that, 'addCartFlag');
            }
          }
        }
      });
    }


    // wx.navigateTo({
    //   url: "/pages/goods/giftDone/giftDone",
    // })


  },


  /**
   * 购买下一步
   */
  buyNext: function (event) {

    let that = this;
    let sku_id = that.data.sku_id;
    let stock = that.data.stock;
    let goods_num = parseInt(that.data.goodsNum);
    let goods_sku_list = '';
    let goods_info = that.data.goods_info;
    let purchase_num = parseInt(goods_info.purchase_num);
    let max_buy = parseInt(goods_info.max_buy);
    // console.log(max_buy)
    let min_buy = parseInt(goods_info.min_buy);
    let buyNextFlag = that.data.buyNextFlag;

    if (buyNextFlag == 1) {
      return false;
    }
    app.clicked(that, 'buyNextFlag');

    if (goods_info.state == 0) {
      app.showBox(that, '该商品已下架');
      app.restStatus(that, 'buyNextFlag');
      return false;
    }

    if (goods_info.state == 10) {
      app.showBox(that, '该商品属于违禁商品，现已下架');
      app.restStatus(that, 'buyNextFlag');
      return false;
    }

    if (stock <= 0) {
      app.showBox(that, '商品已售馨');
      app.restStatus(that, 'buyNextFlag');
      return false;
    }

    if (goods_num <= 0) {
      app.showBox(that, '最少购买1件商品');
      app.restStatus(that, 'buyNextFlag');
      return false;
    }

    if (max_buy > 0 && (purchase_num + goods_num) > max_buy) {
      app.showBox(that, '此商品限购，您最多购买' + max_buy + '件');
      app.restStatus(that, 'buyNextFlag');
      return false;
    }

    // console.log(max_buy,'@@@')
    // if (max_buy == 0) {
    //   app.showBox(that, '您最多购买' + max_buy + '件');
    //   return false;
    // }

    let tag = "buy_now";
    let sku_list = sku_id + ':' + goods_num;
    let source_type = goods_info.source_type;
    let is_inside = that.data.is_inside_sell;
    let goods_type = goods_info.goods_type;
    console.log(sku_list, goods_type, source_type)

    if (that.data.flys == 0) {
      wx.navigateTo({
        url: '/pages/order/paymentorder/paymentorder?tag=' + 1 + '&sku=' + sku_list + '&goods_type=' + goods_type + '&source_type=' + source_type + '&order_type=0' + '&is_inside=' + is_inside,
      })
    } else {
      wx.navigateTo({
        url: '/pages/order/farewell/farewell?tag=' + 1 + '&sku=' + sku_list + '&goods_type=' + goods_type + '&source_type=' + source_type,
      })
    }

  },

  /**
   * 空库存
   */
  nullStock: function () {
    let that = this;
    app.showBox(that, '商品已售馨');
  },

  /**
   * 分享
   */
  share: function () {
    let that = this;

    let is_share = 1;

    that.setData({
      is_share: is_share
    })
  },

  /**
   * 取消分享
   */
  cancleShare: function () {
    let that = this;
    let is_share = 0;

    that.setData({
      is_share: is_share
    })
  },

  /**
   * 收藏
   */
  collection: function () {
    let that = this;
    let goods_info = that.data.goods_info;
    let is_fav = goods_info.is_member_fav_goods;
    let method = is_fav == 0 ? 'FavoritesGoodsorshop' : 'cancelFavorites';
    let message = is_fav == 0 ? '收藏' : '取消收藏';
    is_fav = is_fav == 0 ? 1 : 0;
    goods_info.is_member_fav_goods = is_fav;

    app.sendRequest({
      url: 'api.php?s=member/' + method,
      data: {
        fav_id: goods_info.goods_id,
        fav_type: 'goods',
        log_msg: goods_info.goods_name
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if (data > 0) {
            app.showBox(that, message + '成功');

            that.setData({
              goods_info: goods_info
            })
          } else {
            app.showBox(that, message + '失败');
          }
        }
      }
    });
  },

  /**
   * 选择评论类型
   */
  evaluationType: function (e) {
    let that = this;
    let goods_id = that.data.goods_id;
    let evaluation_type = e.currentTarget.dataset.type;

    that.getComments(evaluation_type);
  },

  /**
   * 更多评论
   */
  moreEvaluation: function (e) {
    let that = this;
    let goods_id = that.data.goods_id;
    let evaluation_type = e.currentTarget.dataset.type;
    let moreEvaluationFlag = that.data.moreEvaluationFlag;

    if (moreEvaluationFlag == 1) {
      return false;
    }
    app.clicked(that, 'moreEvaluationFlag');

    wx.navigateTo({
      url: '/pages/goods/controlevaluation/controlevaluation?id=' + goods_id + '&type=' + evaluation_type
    })
  },

  /**
   * 显示商家服务
   */
  serviceShow: function (e) {
    let that = this;

    that.setData({
      serviceShow: 1,
      maskShow: 1
    })
  },

  /**
   * 显示阶梯优惠
   */
  ladderPreferentialShow: function () {
    let that = this;
    that.setData({
      ladderPreferentialShow: 1,
      maskShow: 1,
    })
  },

  /**
   * 显示优惠券
   */
  popupShow: function (e) {
    let that = this;

    const animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })

    this.animation = animation

    animation.translateY(282).step()

    this.setData({
      animation: animation.export()
    })

    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animation: animation.export()
      })
    }.bind(this), 50)

    that.setData({
      popupShow: 1,
      animation: animation.export(),
      maskShow: 1
    })
  },

  /**
   * 领取优惠券
   */
  toReceivePopup: function (e) {
    let that = this;
    let coupon_type_id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let max_fetch = parseInt(e.currentTarget.dataset.fetch);
    let receive_quantity = parseInt(e.currentTarget.dataset.received);
    let flag = true;
    let status = 1;

    if (max_fetch > 0 && receive_quantity >= max_fetch) {
      app.showBox(that, '领取已达到上限');
      flag = false;
      status = 0;
    }

    if (flag) {
      app.sendRequest({
        url: 'api.php?s=goods/receiveGoodsCoupon',
        data: {
          coupon_type_id: coupon_type_id
        },
        success: function (res) {
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
            let key = "goods_info.goods_coupon_list[" + index + "].status";
            d[key] = 0;

            that.setData(d);
          }
        }
      });
    }

    if (!flag) {
      let d = {};
      let key = "goods_info.goods_coupon_list[" + index + "].status";
      d[key] = 0;
      that.setData(d);
    }
  },

  /**
   * 限时折扣计时
   */
  timing: function (that, timer_array) {
    let current_time = that.data.current_time;
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

        clearInterval(timer);
      }
    }, 1000)
  },

  /**
   * 图片预览
   */
  preivewImg: function (e) {
    let imgUrls = this.data.imgUrls;
    let index = e.currentTarget.dataset.index;
    let urls = [];
    for (let key in imgUrls) {
      urls.push(imgUrls[key].pic_cover_big);
    }

    wx.previewImage({
      current: urls[index],
      urls: urls,
    })
  },

  /**
   * 选择显示类型
   */
  selectType: function (e) {
    let selectType = e.currentTarget.dataset.type;
    this.setData({
      selectType: selectType
    })
  },

  // 跳转开通会员页
  toOpenMember: function () {
    wx.navigateTo({
      url: "/pages/payMembers/payMember/payMember",
    })
  },

  toInput: function (e) {
    var that = this;
    this.setData({
      isInput:0
    })
  },
})