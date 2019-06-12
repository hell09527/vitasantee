const app = new getApp();
var time = require("../../../utils/dataTime.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loaded: false,
    prompt: '',
    Base: '', //库路径
    defaultImg: {},
    //遮罩层
    maskShow: 0,
    animation: '',
    edit: 0, //修改状态
    cart_list: {}, //购物车商品列表
    check_all: 1, //全部选中carts_1_info
    is_checked: 1, //是否存在选中
    total_price: 0.00, //总价
    numAdjustFlag: 0,
    goodsDetailFlag: 0,
    settlementFlag: 0,
    is_vip: 0,
    uid: 0,    //获取会员的uid
    showModal: false, // 显示弹框的 cust
    // isTouchMove: false,
    //carts_list:'',    // 需要发出去的ids
    carts_1_info: {    // 大贸 当订单同时包含跨境商品和大贸商品时
      total_price: 0,
      total_num: 0
    },
    carts_2_info: {   // 跨境 当订单同时包含跨境商品和大贸商品时
      total_price: 0,
      total_num: 0
    },
    carts_3_info: {   // 内购跨境 当订单同时包含内购跨境商品和内购大贸商品时
      total_price: 0,
      total_num: 0
    },
    carts_4_info: {   // 内购普通 当订单同时包内购含跨境商品和内购大贸商品时
      total_price: 0,
      total_num: 0
    },
    check_1_carts: [],  // 选中的大贸商品列表
    check_2_carts: [],  // 选中的跨境商品列表
    check_3_carts: [],  // 选中的内购跨境商品列表
    check_4_carts: [],  // 选中的内购普通商品列表
    send_type: 2,    // 多类型订单时 选择发送类型 1 大贸 2跨境
    // 选中列表
    unselected_list: [],
    isHide: 0,    //客服按钮是否影藏
    // unregistered:1, //是否注册(1, 0)
    region: [
      { id: 3104, name: '焦阳阳' },
      { id: '', name: '未指定' },
    ],
    personnel: '',
    Carrier: '' ,   // 分销者ID
    showStatus:0,   // 原价的展示
    showTitle: 0,//是否提示普通惠选师修改价格
    showEide: 0,
    isFoll: true
  },
  // 测试数据
  last: function () {
    let that = this;
    let cart_list = that.data.cart_list
    let share_li = '';
    let tag = "";
    let uid = app.globalData.uid;
    let store = app.globalData.store_id
    for (let index in cart_list) {
      for (let key in cart_list[index]) {
        if (cart_list[index][key].status == 1) {
          let sku_id = cart_list[index][key].sku_id;
          let num = cart_list[index][key].num;
          let price = cart_list[index][key].promotion_price;
          let share_list = sku_id + ':' + num + ':' + price;

          if (share_li == '') {
            share_li = share_list
          } else {
            share_li += ',' + share_list
          }
        }
      }
    }
    wx.navigateTo({
      url: '/pages/goods/shareRepertoire/shareRepertoire?share_li=' + share_li + '&tag=2' + '&store=' + store + '&uid=' + uid + '&breakpoint=1',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(that.data.personnel)
    let defaultImg = app.globalData.defaultImg;
    var times = time.formatTime(new Date());
    console.log(times)
    that.setData({
      defaultImg: defaultImg,
      times
    });


    //   let timestamp = Date.parse(new Date);
    //   if (app.globalData.identifying!=0){
    //     let overtime = timestamp + 43200000;
    //     console.log(timestamp)
    //     let uid = app.globalData.identifying;
    //     let breakpoint = app.globalData.breakpoint
    //     wx.setStorageSync('breakpoint', breakpoint);
    //     wx.setStorageSync('uid', uid)
    //     wx.setStorageSync('overtime', overtime);
    //  }

    //   if (app.globalData.distributor_type != 0){
    //     let breakpoints = wx.getStorageSync('breakpoint');
    //     console.log(breakpoints, 'breakpoints')
    //     let uids = wx.getStorageSync('uid')
    //     console.log(uids, 'uids')
    //     let overtimes = wx.getStorageSync('overtime');
    //     if (timestamp < overtimes) {
    //       console.log(211111)
    //       app.globalData.identifying = uids;

    //       app.globalData.breakpoint = breakpoints;
    //     } else {
    //       console.log(333333)
    //     }
    //   }else{

    //   }

  },


  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {

  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false,
      insideModal: true
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.setData({
      showModal: false,
      insideModal: false
    });
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    var slist = [];
    console.log(this.data.send_type)
    var goods_type = 1;
    var is_inside = 0;   //是否为内购商品
    if (this.data.send_type == 1) {
      slist = this.data.check_1_carts;
      goods_type = 1;
      is_inside = 0;
    } else if (this.data.send_type == 2) {
      slist = this.data.check_2_carts;
      goods_type = 2;
      is_inside = 0;
    } else if (this.data.send_type == 3) {
      slist = this.data.check_3_carts;
      goods_type = 2;
      is_inside = 1;
    } else if (this.data.send_type == 4) {
      slist = this.data.check_4_carts;
      goods_type = 1;
      is_inside = 1;
    }

    var carts_list = '';
    slist.forEach((v) => {
      "use strict";
      if (carts_list == '') {
        // console.log(v.cart_id)
        carts_list = v.cart_id;
      } else {
        carts_list += ',' + v.cart_id;
      }
    });
    console.log(slist, carts_list, goods_type, is_inside)
    wx.navigateTo({
      url: '/pages/order/paymentorder/paymentorder?cart_list=' + carts_list + '&tag=2' + '&type=' + goods_type + '&is_inside=' + is_inside
    })

    this.hideModal();
  },
  // custom end

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    let siteBaseUrl = app.globalData.siteBaseUrl;
    wx.showShareMenu({
      withShareTicket: true
    });
  },

  GWC_reuse: function () {
    let that = this;
    let siteBaseUrl = app.globalData.siteBaseUrl;
    app.sendRequest({
      url: 'api.php?s=goods/cart',
      data: {},
      success: function (res) {
        let code = res.code;
        let total_price = 0.00;
        let inside_price=0.00;
        if (code == 0) {
          let data = res.data;
          console.log(data)
          for (let index in data) {
            for (let key in data[index]) {
              data[index][key].isTouchMove = false //默认全隐藏删除

              data[index][key].isInput = 1;
              // 测试代码
              // data[index][key].Move=0;

              if (that.in_array(data[index][key].cart_id, that.data.unselected_list)) {
                data[index][key].status = 0;
                that.setData({
                  check_all: 0,
                });
              } else {
                data[index][key].status = 1;
              }
              // console.log(data)
              
              let num = parseInt(data[index][key].num);
              if (data[index][key].status == 1) {
                let promotion_price;
                if (data[index][key].is_inside == 0) {
                  promotion_price = parseFloat(data[index][key].promotion_price);
                } else {
                  promotion_price = parseFloat(data[index][key].interior_price);
                  inside_price = parseFloat(inside_price) + parseFloat(data[index][key].interior_price * num)
                }
                total_price = parseFloat(total_price) + parseFloat(promotion_price * num);
              }

              //图片处理
              if (data[index][key].picture_info != undefined && data[index][key].picture_info != null) {
                let img = data[index][key].picture_info.pic_cover_small;
                data[index][key].picture_info.pic_cover_small = app.IMG(img);
              } else {
                data[index][key].picture_info = {};
                data[index][key].picture_info.pic_cover_small = '';
              }

            }
          }


          // console.log(data[0])
          // console.log(data)
          that.setData({
            Base: siteBaseUrl,
            cart_list: data,
            total_price: total_price.toFixed(2),
            inside_price: inside_price.toFixed(2),
            //check_all: 1,
            edit: 0,
            is_checked: 1,
            loaded: true
          });

          wx.stopPullDownRefresh()
        }
        // console.log(res);
      }
    })


    app.sendRequest({
      url: "api.php?s=member/getMemberDetail",
      success: function (res) {
        let data = res.data;
        console.log(res);
        if (res.code == 0) {
          let is_vip = data.is_vip;
          app.globalData.is_vip = data.is_vip;
          app.globalData.distributor_type = data.distributor_type;
          let distributor_type = data.distributor_type;
          app.globalData.uid = data.uid;
          app.globalData.vip_gift = data.vip_gift;
          app.globalData.vip_goods = data.vip_goods;
          app.globalData.vip_overdue_time = data.vip_overdue_time;
          let tel = data.user_info.user_tel;
          console.log(tel)
          that.setData({
            is_vip: is_vip,
            tel: tel,
            distributor_type
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
    let siteBaseUrl = app.globalData.siteBaseUrl;
    //判断是否是付费会员
    let is_vip = app.globalData.is_vip;
    let distributor_type = app.globalData.distributor_type;
    let uid = app.globalData.uid;
    let updata = app.globalData.unregistered;
    console.log(updata)
    console.log(distributor_type, uid)
    that.setData({
      is_vip,
      unregistered: updata,
      showStatus:0,
      distributor_type,
      uid
    })

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


    that.setData({
      carts_1_info: {    // 大贸 当订单同时包含跨境商品和大贸商品时
        total_price: 0,
        total_num: 0
      },
      carts_2_info: {   // 跨境 当订单同时包含跨境商品和大贸商品时
        total_price: 0,
        total_num: 0
      },
      carts_3_info: {   // 跨境 当订单同时包含跨境商品和大贸商品时
        total_price: 0,
        total_num: 0
      },
      carts_4_info: {   // 跨境 当订单同时包含跨境商品和大贸商品时
        total_price: 0,
        total_num: 0
      },
      check_1_carts: [],  // 选中的大贸商品列表
      check_2_carts: [],   // 选中的跨境商品列表
      check_3_carts: [],   //内购跨境商品列表
      check_4_carts: [],   //内购普通商品列表
      send_type: 2,    // 多类型订单时 选择发送类型 1 大贸 2跨境
    });

    app.restStatus(that, 'settlementFlag');
    app.restStatus(that, 'goodsDetailFlag');

    if (app.globalData.token && app.globalData.token != '') {
      //判断是否是付费会员的接口

      that.GWC_reuse()



    } else {

      app.employIdCallback = employId => {
        if (employId != '') {
          //判断是否是付费会员的接口
          that.GWC_reuse()

        }

      }
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.GWC_reuse()//数据请求

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  inputChange(e) {
    "use strict";
    this.setData({
      send_type: e.detail.value
    })
  },
  /**
   * 图片加载失败
   */
  errorImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let key = e.currentTarget.dataset.key;
    let cart_list = that.data.cart_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = cart_list[index][key].picture_info.pic_cover_small;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "cart_list." + index + "[" + key + "].picture_info.pic_cover_small";

        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },


  /**
   * 购物车修改
   */
  cartEdit: function (event) {
    let that = this;
    let edit = event.currentTarget.dataset.edit;
    let cart_list = that.data.cart_list;
    let total_price = 0.00;
    let status = edit == 1 ? 0 : 1;
    let showStatus;

    // 状态
    if( (that.data.distributor_type==0) || edit==0){
      showStatus=0;
    }else if(that.data.distributor_type!=0 && edit==1 ){
      showStatus=1;
    }
    
    // for (let index in cart_list) {
    //     for (let key in cart_list[index]) {
    //         cart_list[index][key].status = status;
    //         if (status == 1) {
    //             let promotion_price = parseFloat(cart_list[index][key].promotion_price);
    //             let num = parseInt(cart_list[index][key].num);
    //             total_price = parseFloat(total_price) + parseFloat(promotion_price * num);
    //         }
    //     }
    // }

    that.setData({
      edit: edit,
      showStatus
      // choose:status,
      // check_all: status,
      // is_checked: status,
      // cart_list: cart_list,
      // total_price: total_price.toFixed(2),
    })
  },

  /**
   * 选中商品
   */
  selectCart: function (event) {
    let that = this;
    let i = event.currentTarget.dataset.index;
    let k = event.currentTarget.dataset.key;
    let status = event.currentTarget.dataset.status;
    let cart_list = that.data.cart_list;
    let total_price = that.data.total_price;
    let is_checked = 0;
    let check_all = 1;
    let promotion_price = parseFloat(cart_list[i][k].promotion_price);
    let num = parseInt(cart_list[i][k].num);

    if (status == 0) {
      status = 1;
      total_price = parseFloat(total_price) + parseFloat(promotion_price * num);
    } else {
      status = 0;
      total_price = parseFloat(total_price) - parseFloat(promotion_price * num);
    }

    cart_list[i][k].status = status;

    for (let index in cart_list) {
      for (let key in cart_list[index]) {
        if (cart_list[index][key].status == 1) {
          is_checked = 1;
        }
        if (cart_list[index][key].status == 0) {
          check_all = 0;
        }
      }
    }

    that.setData({
      cart_list: cart_list,
      is_checked: is_checked,
      check_all: check_all,
      total_price: total_price.toFixed(2),
    })

    this.keep_unselected();
  },

  keep_unselected() {
    "use strict";
    var new_unselected_list = [];

    for (let i in this.data.cart_list) {
      this.data.cart_list[i].forEach(v => {
        if (v.status == 0) {
          new_unselected_list.push(v.cart_id);
        }
      })
    }
    console.log(new_unselected_list)
    //this.data.cart_list.forEach();
    this.setData({
      unselected_list: new_unselected_list,
    })
  },

  /**
   * 全选
   */
  checkAll: function (event) {
    let that = this;
    let check_all = that.data.check_all;
    let cart_list = that.data.cart_list;
    let total_price = 0.00;
    let status = 0;

    if (check_all == 1) {
      check_all = 0;
      status = 0;
    } else {
      check_all = 1;
      status = 1;
    }
    // console.log(check_all)
    for (let index in cart_list) {
      for (let key in cart_list[index]) {
        cart_list[index][key].status = status;
        if (status == 1) {
          let promotion_price = parseFloat(cart_list[index][key].promotion_price);
          let num = parseInt(cart_list[index][key].num);
          total_price = parseFloat(total_price) + parseFloat(promotion_price * num);
        }
      }
    }

    that.setData({
      check_all: check_all,
      cart_list: cart_list,
      is_checked: check_all,
      total_price: total_price.toFixed(2),
    })
    this.keep_unselected();
  },
  /**
   * 数量调节
   */
  numAdjust: function (event) {
    let that = this;
    let adjust_type = event.currentTarget.dataset.type;
    let i = event.currentTarget.dataset.index;
    let k = event.currentTarget.dataset.key;
    let id = event.currentTarget.dataset.id;
    let numAdjustFlag = that.data.numAdjustFlag;
    let cart_list = that.data.cart_list;
    let num = cart_list[i][k].num;
    let total_price = that.data.total_price;

    if (numAdjustFlag == 1) {
      return false;
    }

    app.clicked(that, 'numAdjustFlag');
    app.sendRequest({
      url: 'api.php?s=goods/cart',
      data: {},
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let new_cart_list = res.data;
          let stock = new_cart_list[i][k].stock;
          let max_buy = new_cart_list[i][k].max_buy
          let min_buy = new_cart_list[i][k].min_buy;
          //加
          if (adjust_type == 'add') {
            if (num < stock) {
              if (max_buy > 0 && num >= max_buy) {
                app.showBox(that, '该商品最多购买' + max_buy + '件');
                app.restStatus(that, 'numAdjustFlag');
                return false;
              }
            } else {
              app.showBox(that, '已达到最大库存');
              app.restStatus(that, 'numAdjustFlag');
              return false;
            }
            num++;
          }

          //减
          if (adjust_type == 'minus') {
            if (num > 0) {
              if (num == min_buy && min_buy > 0) {
                app.showBox(that, '该商品最少购买' + min_buy + '件');
                app.restStatus(that, 'numAdjustFlag');
                return false;
              }
              if (num == 1) {
                app.showBox(that, '该商品最少购买' + 1 + '件');
                app.restStatus(that, 'numAdjustFlag');
                return false;
              }
              num--;
            }
          }

          new_cart_list[i][k].num = num;
          //新数组添加选中状态
          total_price = 0.00;
          let inside_price=0.00;
          for (let index in cart_list) {
            for (let key in cart_list[index]) {
              new_cart_list[index][key].status = cart_list[index][key].status;
              new_cart_list[index][key].promotion_price = cart_list[index][key].promotion_price
              let promotion_price = parseFloat(new_cart_list[index][key].promotion_price);
              let num = parseInt(new_cart_list[index][key].num);

              if (new_cart_list[index][key].status) {
                let promotion_price;
                let num = parseInt(new_cart_list[index][key].num);
                if (new_cart_list[index][key].is_inside == 0) {
                  promotion_price = parseFloat(new_cart_list[index][key].promotion_price);
                } else {
                  promotion_price = parseFloat(new_cart_list[index][key].interior_price);
                  inside_price = parseFloat(inside_price) + parseFloat(new_cart_list[index][key].interior_price * num)
                }
                total_price = parseFloat(total_price) + parseFloat(promotion_price * num);

              }

            }
          }
          //执行
          app.sendRequest({
            url: 'api.php?s=goods/cartAdjustNum',
            data: {
              cartid: id,
              num: num,
            },
            success: function (res) {
              let code = res.data;
              for (let index in new_cart_list) {
                for (let key in new_cart_list[index]) {
                  new_cart_list[index][key].isInput = 1
                }
              }
              if (code > 0) {
                that.setData({
                  cart_list: new_cart_list,
                  total_price: total_price.toFixed(2),
                  inside_price: inside_price.toFixed(2),
                })
                app.restStatus(that, 'numAdjustFlag');
              } else {
                app.showBox(that, '操作失败');
                app.restStatus(that, 'numAdjustFlag');
              }
            }
          })
        }
      }
    })
  },

  /**
   * 输入数量调节
   */
  inputAdjust: function (event) {
    let that = this;
    let i = event.currentTarget.dataset.index;
    let k = event.currentTarget.dataset.key;
    let id = event.currentTarget.dataset.id;
    let cart_list = that.data.cart_list;
    let num = event.detail.value;
    let total_price = that.data.total_price;
    console.log('000000',num);

    app.sendRequest({
      url: 'api.php?s=goods/cart',
      data: {},
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let new_cart_list = res.data;
          let stock = new_cart_list[i][k].stock;
          let max_buy = new_cart_list[i][k].max_buy
          let min_buy = new_cart_list[i][k].min_buy;

          if (max_buy > 0) {
            if (num >= max_buy) {
              app.showBox(that, '该商品最多购买' + max_buy + '件');
              num = max_buy;
            }
          } else {
            if (num >= stock) {
              app.showBox(that, '已达到最大库存');
              num = stock;
            }
          }

          if (min_buy > 0) {
            if (num <= min_buy) {
              app.showBox(that, '该商品最少购买' + min_buy + '件');
              num = min_buy;
            }
          } else {
            if (num <= 0) {
              app.showBox(that, '该商品最少购买' + 1 + '件');
              num = 1;
            }
          }

          new_cart_list[i][k].num = num;
          // console.log(num)
          //新数组添加选中状态
          total_price = 0;
          let inside_price = 0.00;
          for (let index in cart_list) {
            for (let key in cart_list[index]) {
              new_cart_list[index][key].status = cart_list[index][key].status;

              let promotion_price;
              let num = parseInt(new_cart_list[index][key].num);
              if (new_cart_list[index][key].is_inside == 0) {
                promotion_price = parseFloat(new_cart_list[index][key].promotion_price);
              } else {
                promotion_price = parseFloat(new_cart_list[index][key].interior_price);
                inside_price = parseFloat(inside_price) + parseFloat(new_cart_list[index][key].interior_price * num)
              }
              total_price = parseFloat(total_price) + parseFloat(promotion_price * num);
            }
          }
          // console.log(num)
          //执行
          app.sendRequest({
            url: 'api.php?s=goods/cartAdjustNum',
            data: {
              cartid: id,
              num: num,
            },
            success: function (res) {
              let code = res.data;
              for (let index in new_cart_list) {
                for (let key in new_cart_list[index]) {
                  new_cart_list[index][key].isInput = 1
                }
              }
              // var isInput = 'cart_list[' + index + ']['+k+'].isInput';
              if (code > 0) {
                that.setData({
                  cart_list: new_cart_list,
                  total_price: total_price.toFixed(2),
                  inside_price:inside_price.toFixed(2),
                })
              } else {
                app.showBox(that, '操作失败');
              }
            }
          })


        }
      }
    })
  },

  /**
   * 删除商品
   */
  deleteCart: function (event) {
    let that = this;
    let cart_list = that.data.cart_list;
    let del_id = '';
    // console.log(cart_list)
    for (let index in cart_list) {
      for (let key in cart_list[index]) {
        if (cart_list[index][key].status == 1) {
          if (del_id == '') {
            del_id += cart_list[index][key].cart_id;
          } else {
            del_id += ',' + cart_list[index][key].cart_id;
          }
        }
      }
    }
    // console.log(del_id)
    app.sendRequest({
      url: 'api.php?s=goods/cartDelete',
      data: {
        del_id: del_id,
      },
      success: function (res) {
        let code = res.data;
        if (code > 0) {
          app.sendRequest({
            url: 'api.php?s=goods/cart',
            data: {},
            success: function (res) {
              let code = res.code;
              if (code == 0) {
                cart_list = res.data;
                //新数组添加选中状态
                let total_price = 0.00;
                let inside_price = 0.00

                for (let index in cart_list) {
                  for (let key in cart_list[index]) {
                    cart_list[index][key].status = 0;
                    cart_list[index][key].isInput = 1;
                    let promotion_price;
                    let num = parseInt(cart_list[index][key].num);
                    if (cart_list[index][key].is_inside == 0) {
                      promotion_price = parseFloat(cart_list[index][key].promotion_price);
                    } else {
                      promotion_price = parseFloat(cart_list[index][key].interior_price);
                      inside_price = parseFloat(inside_price) + parseFloat(cart_list[index][key].interior_price * num)
                    }
                    total_price = parseFloat(total_price) + parseFloat(promotion_price * num);
                  }
                }

                that.setData({
                  cart_list: cart_list,
                  inside_price: inside_price.toFixed(2),
                  total_price: total_price.toFixed(2),
                })

                app.showBox(that, '操作成功');
              }
            }
          });
        } else {
          app.showBox(that, '操作失败');
        }
      }
    })
  },

  /**
   * 首页跳转
   */
  toIndex: function (event) {
    let url = event.currentTarget.dataset.url;
    // console.log(url)
    wx.switchTab({
      url: url,
    })
  },

  // 跳转登录页
  toResgin: function (event) {
    let url = event.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },

  // 
  tonavigate:function(){
    wx.navigateToMiniProgram({
      appId: 'wx56c8f077de74b07c',
      path: '/open/function-introduction/function-introduction',
      envVersion: 'trial',
      success(res) {
        // 打开成功
      }
    })
  },


  /**
   * 结算
   */
  settlement: function (event) {
    let that = this;
    let cart_list = that.data.cart_list;
    // console.log(cart_list)
    let type = 1;
    let settlementFlag = that.data.settlementFlag;
    let carts_list = '';

    let cart_1 = [];   //普通商品列表
    let cart_2 = [];   //跨境商品列表
    let cart_3 = [];   //内购跨境商品列表
    let cart_4 = [];   //内购普通商品列表
    let carts_1 = ''; // 大贸购物车id字符串
    let carts_2 = ''; // 跨境购物车id字符串
    let carts_3 = ''; // 内购跨境购物车id字符串
    let carts_4 = ''; // 内购普通购物车id字符串

    if (settlementFlag == 1) {
      return false;
    }

    var total_price_1 = 0;
    var total_price_2 = 0;
    var total_price_3 = 0;
    var total_price_4 = 0;
    var total_num_1 = 0;
    var total_num_2 = 0;
    var total_num_3 = 0;
    var total_num_4 = 0;
    var p = 0;
    var is_inside = 0;   //是否为内购商品
    // console.log(p)
    for (let index in cart_list) {
      for (let key in cart_list[index]) {
        let cart_id = cart_list[index][key].cart_id;
        if (cart_list[index][key].status == 1) {
          // 大贸普通商品
          if (cart_list[index][key].source_type == 1 && cart_list[index][key].is_inside == 0) {
            p++;
            if (carts_1 == '') {
              carts_1 = cart_id;
            } else {
              carts_1 += ',' + cart_id;
            }
            total_price_1 += parseFloat(cart_list[index][key].num) * parseFloat(cart_list[index][key].price)
            total_num_1 += cart_list[index][key].num
            cart_1.push(cart_list[index][key]);
          } else if (cart_list[index][key].source_type == 2 && cart_list[index][key].is_inside == 0) {
            // 跨境普通商品
            p++;
            if (carts_2 == '') {
              carts_2 = cart_id;
            } else {
              carts_2 += ',' + cart_id;
            }
            total_price_2 += parseFloat(cart_list[index][key].num) * parseFloat(cart_list[index][key].price)
            total_num_2 += cart_list[index][key].num
            cart_2.push(cart_list[index][key]);
          } else if (cart_list[index][key].source_type == 2 && cart_list[index][key].is_inside == 1) {
            // 跨境内购商品
            p++;
            is_inside = 1;
            if (carts_3 == '') {
              carts_3 = cart_id;
            } else {
              carts_3 += ',' + cart_id;
            }
            total_price_3 += parseFloat(cart_list[index][key].num) * parseFloat(cart_list[index][key].interior_price)
            total_num_3 += cart_list[index][key].num
            cart_3.push(cart_list[index][key]);
          } else if (cart_list[index][key].source_type == 1 && cart_list[index][key].is_inside == 1) {

            //大贸内购商品
            p++;
            is_inside = 1;
            if (carts_4 == '') {
              carts_4 = cart_id;
            } else {
              carts_4 += ',' + cart_id;
            }
            total_price_4 += parseFloat(cart_list[index][key].num) * parseFloat(cart_list[index][key].interior_price)
            total_num_4 += cart_list[index][key].num
            cart_4.push(cart_list[index][key]);
          }

          if (carts_list == '') {
            carts_list = cart_id;
          } else {
            carts_list += ',' + cart_id;
          }
        }
      }
    }
    // console.log(carts_list);


    //判断商品类型包含几种 
    var arr = [];
    if (cart_1.length > 0) {
      arr.push(cart_1);
    }
    if (cart_2.length > 0) {
      arr.push(cart_2);
    }
    if (cart_3.length > 0) {
      arr.push(cart_3);
    }
    if (cart_4.length > 0) {
      arr.push(cart_4);
    }
    console.log(arr);
    if (arr.length >= 2) {
      this.setData({
        check_1_carts: cart_1,
        check_2_carts: cart_2,
        check_3_carts: cart_3,
        check_4_carts: cart_4,
        carts_1_info: {
          total_price: total_price_1,
          total_num: total_num_1,
        },
        carts_2_info: {
          total_price: total_price_2,
          total_num: total_num_2,
        },
        carts_3_info: {
          total_price: total_price_3,
          total_num: total_num_3,
        },
        carts_4_info: {
          total_price: total_price_4,
          total_num: total_num_4,
        },
        is_inside,
      });
      this.showDialogBtn();
      return;
    }

    app.clicked(that, 'settlementFlag');
    var goods_type = 1;
    if (cart_2 != '') {
      goods_type = 2;
      is_inside = 0;
    } else if (cart_3 != '') {
      goods_type = 2;
      is_inside = 1;
    } else if (cart_4 != '') {
      goods_type = 1;
      is_inside = 1;
    }
    let checkout = that.data.check_all
    // console.log(checkout)
    if (cart_2 == '' && cart_1 == '' && cart_3 == '' && cart_4 == '') {
      wx.showToast({
        title: '未选择商品',
        icon: 'loading',
        duration: 2000
      })
      that.setData({
        settlementFlag: 0
      })
    } else {
      console.log(carts_list);
      wx.navigateTo({
        url: '/pages/order/paymentorder/paymentorder?cart_list=' + carts_list + '&tag=2' + '&type=' + goods_type + '&order_type=0' + '&is_inside=' + is_inside,
      })

    }
  },
  /**
   * 商品 分类结算
   */
  crossBorder: function (event) {

    let type = event.currentTarget.dataset.type;
    let status = 0;
    let animation = wx.createAnimation({
      duration: 3000,
      timingFunction: 'ease-in',
      transformOrigin: "50% 50% 0",
      delay: 0
    })

    animation.opacity(1).translateX(-100).step();
    this.animation = animation;
    this.setData({
      sBuy: 1,
      maskShow: 1,
      buyButtonStatus: status,
      animation: this.animation.export()
    })

  },
  /**
   * 关闭弹框
   */
  popupClose: function (event) {
    this.setData({
      sBuy: 0,
      popupShow: 0,
      serviceShow: 0,
      maskShow: 0,
      ladderPreferentialShow: 0,
    })
  },

  show_test(e) {
    wx.showActionSheet({
      itemList: ['A', 'B', 'C'],
      success: function (res) {
        // console.log(res.tapIndex)
      },
      fail: function (res) {
        // console.log(res.errMsg)
      }
    })
  },
  /**
   * 商品详情
   */
  goodsDetail: function (e) {
    let that = this;
    let goods_id = e.currentTarget.dataset.id;
    let goods_name = e.currentTarget.dataset.name;
    let goodsDetailFlag = that.data.goodsDetailFlag;

    if (goodsDetailFlag == 1) {
      return false;
    }
    app.clicked(that, 'goodsDetailFlag');
    wx.navigateTo({
      url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + goods_id + '&&goods_name=' + goods_name,
    })
    
  },

  // 热卖商品跳转商品详情页

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

  verification: function (e) {
    let that = this;
    let cart_list = that.data.cart_list;
    // console.log("hehe", that.data.cart_list)
    let carts_list = JSON.stringify(cart_list);
    // console.log(carts_list)
    wx.navigateTo({
      url: '/pages/goods/verification/verification?cart_list=' + carts_list,
    })
  },

  in_array(obj, arr) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) {
        return true;
      }
    }
    return false;
  },
  //   /**
  // * 用户点击右上角分享
  // */
  onShareAppMessage: function () {
    let that = this;
    let cart_list = that.data.cart_list
    let uid = app.globalData.uid;

    let share_li = '';
    let tag = "";
    let store = app.globalData.store_id
    for (let index in cart_list) {
      for (let key in cart_list[index]) {
        if (cart_list[index][key].status == 1) {
          let sku_id = cart_list[index][key].sku_id;
          let num = cart_list[index][key].num;
          let price = cart_list[index][key].promotion_price;
          let share_list = sku_id + ':' + num + ':' + price;
          if (share_li == '') {
            share_li = share_list
          } else {
            share_li += ',' + share_list
          }
        }
      }
    }


    let GWC_share_url = '/pages/goods/shareRepertoire/shareRepertoire?share_li=' + share_li + '&tag=2' + '&store=' + store + '&distributor_type=' + that.data.distributor_type;

    if (that.data.distributor_type == 0) {
      return {
        imageUrl: 'https://static.bonnieclyde.cn/hui.jpg',
        title: ' 分享给你的购物清单',
        path: GWC_share_url,
        // imageUrl: imgUrl,
        success: function (res) {
          app.showBox(that, '分享成功');

        },
        fail: function (res) {
          app.showBox(that, '分享失败');
        }
      }
    } else if (that.data.Carrier != '') {

      let carrier = that.data.Carrier;

      return {
        imageUrl: 'https://static.bonnieclyde.cn/hui.jpg',
        title: ' 分享给你的购物清单',
        path: GWC_share_url + '&uid=' + carrier,
        // imageUrl: imgUrl,
        success: function (res) {
          app.showBox(that, '分享成功');

        },
        fail: function (res) {
          app.showBox(that, '分享失败');
        }
      }

    } else {
      return {
        imageUrl: 'https://static.bonnieclyde.cn/hui.jpg',
        title: ' 分享给你的购物清单',
        path: GWC_share_url + '&uid=' + uid,
        // imageUrl: imgUrl,
        success: function (res) {
          app.showBox(that, '分享成功');

        },
        fail: function (res) {
          app.showBox(that, '分享失败');
        }
      }
    }


  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    var data = this.data.cart_list;
    let isFoll = true;
    for (let index in data) {
      for (let key in data[index]) {
        data[index][key].isTouchMove = false
      }
    }
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      cart_list: data,
      isFoll
    })

  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });

    // console.log(e.detail,touchMoveX, touchMoveY)
    var data = this.data.cart_list;
    let isFoll;
    for (let i in data) {
      for (let key in data[i]) {
        // console.log(index,key)
        // console.log(data[i][key].isTouchMove)
        //滑动超过30度角 return
        if (Math.abs(angle) > 30) return;
        if (key == index) {
          // console.log(touchMoveX > startX);
          if (touchMoveX > startX) //右滑
            data[i][key].isTouchMove = false
          else //左滑
            data[i][key].isTouchMove = true;


          if (data[i][key].isTouchMove == true) {
            isFoll = false;
            //   that.setData({
            //    isFoll
            //  })

          } else {
            isFoll = true;
            that.setData({
              isFoll
            })
          }
        }
      }
    }
    // that.data.cart_list.forEach(function (v, i) {
    //   v.isTouchMove = false
    //   //滑动超过30度角 return
    //   if (Math.abs(angle) > 30) return;
    //   if (i == index) {
    //     if (touchMoveX > startX) //右滑
    //       v.isTouchMove = false
    //     else //左滑
    //       v.isTouchMove = true
    //   }
    // })
    //更新数据
    that.setData({
      cart_list: data, 
      isFoll
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    let that = this;
    let cart_list = that.data.cart_list;
    var index = e.currentTarget.dataset.index;//当前索引
    let del_id = '';
    for (let i in cart_list) {
      del_id += cart_list[i][index].cart_id;
      cart_list[i][index].isTouchMove =true;
    }
    console.log(del_id)
    app.sendRequest({
      url: 'api.php?s=goods/cartDelete',
      data: {
        del_id: del_id,
      },
      success: function (res) {
        let code = res.data;
        console.log(code)
        if (code > 0) {
          app.sendRequest({
            url: 'api.php?s=goods/cart',
            data: {},
            success: function (res) {
              let code = res.code;
              if (code == 0) {
                cart_list = res.data;
                //新数组添加选中状态
                let total_price = 0.00;
                let inside_price = 0.00;
                for (let index in cart_list) {
                  for (let key in cart_list[index]) {
                    cart_list[index][key].status = 1;
                    cart_list[index][key].isInput =1;
                    let promotion_price;
                    let num = parseInt(cart_list[index][key].num);
                    if (cart_list[index][key].is_inside == 0) {
                      promotion_price = parseFloat(cart_list[index][key].promotion_price);
                    } else {
                      promotion_price = parseFloat(cart_list[index][key].interior_price);
                      inside_price = parseFloat(inside_price) + parseFloat(cart_list[index][key].interior_price * num)
                    }
                    total_price = parseFloat(total_price) + parseFloat(promotion_price * num);
                  }
                }
           

                    console.log(cart_list)
                that.setData({
                  cart_list: cart_list,
                  check_all: 1,
                  is_checked: 1,
                  total_price: total_price.toFixed(2),
                  inside_price: inside_price.toFixed(2),
                  isFoll: true
                })
                app.showBox(that, '操作成功');
          
        } else {
          app.showBox(that, '操作失败');
        }
      }
    })
  }
}
})
 } ,
  bindRegionChange: function (res) {
    let that = this;
    console.log(res);
    console.log(res.detail.value);
    let personnel = that.data.region[res.detail.value];
    personnel = personnel.name
    let Carrier = that.data.region[res.detail.value].id;
    console.log(Carrier)
    that.setData({
      Carrier,
      personnel
    })

  },
  //输入事件完成
  EiditPrice:function(){
    var that = this;
    var i = this.i ;
    var id = this.id;
    var cart_list = that.data.cart_list;
    var price = this.price;
    var total_price = 0;  
   
    for (let index in cart_list) {
      for (let key in cart_list[index]) {
        if (cart_list[index][key].cart_id == id) {
          if(that.data.distributor_type !=1){
            let  shop_id= cart_list[index][key].goods_id
              if(price<cart_list[index][key].min_change_price){
                this.setData({
                  showTitle:1,
                  shop_id,
                })
                cart_list[index][key].promotion_price = cart_list[index][key].min_change_price;
              }else{
                this.setData({
                  showTitle:0,
                })
                cart_list[index][key].promotion_price = price ;
              }
        
          }else{
            cart_list[index][key].promotion_price = price 
          }
        }
        if (cart_list[index][key].status == 1) {
          total_price = total_price + parseFloat(cart_list[index][key].promotion_price * cart_list[index][key].num);
        }
      }
    }

  
        this.setData({
          total_price: total_price.toFixed(2),
          cart_list,
        })
  },
  // 价格输入变化
  inputPrice:function (event) {
    this.i = event.currentTarget.dataset.index;
    this.id = event.currentTarget.dataset.id;
    this.price = event.detail.value;

  },
  // 超级vip价格输入变化
  ECTPrice:function(event){
    var that = this;
    var i = event.currentTarget.dataset.index;
    var id = event.currentTarget.dataset.id;
    var cart_list = that.data.cart_list;
    var price = event.detail.value;
    var total_price = 0;
    for (let index in cart_list) {
      for (let key in cart_list[index]) {
        if (cart_list[index][key].cart_id == id) {
          cart_list[index][key].promotion_price = price;
        }
        if (cart_list[index][key].status == 1) {
          total_price = total_price + parseFloat(cart_list[index][key].promotion_price * cart_list[index][key].num);
        }
      }
    }
    this.setData({
      total_price: total_price.toFixed(2),
      cart_list,
    })

  },


  toInput: function (e) {
    var that = this;
    var cart_list = this.data.cart_list;
    var index = e.currentTarget.dataset.index;
    var k = e.currentTarget.dataset.key;
    var cart = e.currentTarget.dataset.list;
    for (let index in cart_list) {
      for (let key in cart_list[index]) {
        if(key==k){
          cart_list[index][k].isInput=0
        }
      }
    }
    // var isInput = 'cart_list[' + index + ']['+k+'].isInput';
    this.setData({
      cart_list,
    })
  },


  // 修改19-06-03(列表组件化-收藏)
  /**
   * 收藏
   */
  collect(e){
    console.log(e.detail)
    let { index, is_fav, state, message } = e.detail;
    let goodsList = this.data.goodsList;
    app.showBox(this, message);
    if(state){
      goodsList[index].is_member_fav_goods = is_fav;
      this.setData({ goodsList });
    }
  },
})
  
