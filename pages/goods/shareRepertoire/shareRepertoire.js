const app = new getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '', //库路径
    defaultImg: {},
    //遮罩层
    maskShow: 0,
    animation: '',
    edit: 0, //修改状态
    cart_list: {}, //购物车商品列表
    check_all: 1, //全部选中
    is_checked: 1, //是否存在选中
    total_price: 0.00, //总价
    numAdjustFlag: 0,     //防止多次提交
    goodsDetailFlag: 0,
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
    check_1_carts: [],  // 选中的大贸商品列表
    check_2_carts: [],  // 选中的跨境商品列表
    send_type: 2,    // 多类型订单时 选择发送类型 1 大贸 2跨境
    // 选中列表
    unselected_list: [],
    isHide: 0,    //客服按钮是否影藏
    // unregistered: 0,
    tel:'',
    Choice: false,
    layout: false,
    distributorType:'',    //会员类型

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let share_sku_list = options.share_li;
    // let uid = options.uid;
    let store_id = options.store;
    let distributorType = options.distributor_type;
      if (options.uid) {
          app.globalData.identifying = options.uid;
        // console.log(app.globalData.identifying,'app.globalData.identifying')
        app.globalData.breakpoint = options.breakpoint;
      }
      // else{
      //     if (app.globalData.token && app.globalData.token != '') {
      //         //判断是否是付费会员的接口
      //         app.sendRequest({
      //             url: "api.php?s=member/getMemberDetail",
      //             success: function (res) {
      //                 let data = res.data
      //                 if (res.code == 0) {
      //                     let is_vip = data.is_vip
      //                     app.globalData.is_vip = data.is_vip
      //                     app.globalData.member_level = data.member_level
      //                     let member_level = data.member_level
      //                     app.globalData.uid = data.uid
      //                     app.globalData.vip_gift = data.vip_gift
      //                     app.globalData.vip_goods = data.vip_goods
      //                     app.globalData.vip_overdue_time = data.vip_overdue_time
      //                     // console.log(app.globalData.is_vip)
      //                     that.setData({
      //                         is_vip: is_vip,
      //                         member_level
      //                     })
      //                 }
      //             }
      //         })
      //
      //
      //
      //     } else {
      //
      //         app.employIdCallback = employId => {
      //             if (employId != '') {
      //                 //判断是否是付费会员的接口
      //
      //                 app.sendRequest({
      //                     url: "api.php?s=member/getMemberDetail",
      //                     success: function (res) {
      //                         let data = res.data
      //                         if (res.code == 0) {
      //                             let is_vip = data.is_vip
      //                             app.globalData.is_vip = data.is_vip
      //                             app.globalData.member_level = data.member_level
      //                             let member_level = data.member_level
      //                             app.globalData.uid = data.uid
      //                             app.globalData.vip_gift = data.vip_gift
      //                             app.globalData.vip_goods = data.vip_goods
      //                             app.globalData.vip_overdue_time = data.vip_overdue_time
      //                             //  console.log(app.globalData.is_vip)
      //                             that.setData({
      //                                 is_vip: is_vip,
      //                                 member_level
      //                             })
      //                         }
      //                     }
      //                 })
      //             }
      //
      //
      //
      //         }
      //     }
      // }





    if (options.store) {
      // console.log('分享后携带', options.store);
      app.globalData.store_id = options.store;
    }

    console.log('shu', share_sku_list);
    let defaultImg = app.globalData.defaultImg;

    that.setData({
      defaultImg: defaultImg,
      share_sku_list,
      distributorType,
    })
  },

  // custom start
  showDialogBtn: function () {
    this.setData({
      show: true
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
  showhideModal: function () {
    this.setData({
      show: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.showhideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConf: function () {
    var slist = [];
    if (this.data.send_type == 1) {
      slist = this.data.check_1_carts;
    } else if (this.data.send_type == 2) {
      slist = this.data.check_2_carts;
    }

    var share_last = '';

    slist.forEach((v) => {
      "use strict";
      if (share_last == '') {
        share_last = v.sku_id + ':' + v.num + ':' + v.price;

      } else {
        share_last += ',' + v.sku_id + ':' + v.num + ':' + v.price;
      }
    });

    console.log(share_last, this.data.uid)
    wx.navigateTo({
      url: '/pages/order/paymentorder/paymentorder?share_last=' + share_last + '&type=' + this.data.send_type + '&tag=5' + '&order_type=1',
    })


    this.showhideModal();
  },
  // custom end

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //let that = this;
    //let siteBaseUrl = app.globalData.siteBaseUrl;

  },
  QD_reuse:function(){
   let that = this;
    let siteBaseUrl = app.globalData.siteBaseUrl;
    let share_sku_list = that.data.share_sku_list;
    app.sendRequest({
      url: "api.php?s=member/getMemberDetail",
      success: function (res) {
        let data = res.data;
        if (res.code == 0) {
          let is_vip = data.is_vip
          app.globalData.is_vip = data.is_vip
          app.globalData.distributor_type = data.distributor_type
          let distributor_type = data.distributor_type
          app.globalData.uid = data.uid
          app.globalData.vip_gift = data.vip_gift
          app.globalData.vip_goods = data.vip_goods
          app.globalData.vip_overdue_time = data.vip_overdue_time;
          let tel = data.user_info.user_tel;
          // console.log(tel)
          // console.log(app.globalData.is_vip)
          that.setData({
            is_vip: is_vip,
            tel: tel,
            distributor_type
          })
        }
      }
    })



    app.sendRequest({
      url: 'api.php?s=order/share',
      data: {
        share_sku_list
      },
      success: function (res) {
        let code = res.code;
        let total_price = 0.00;
        if (code == 0) {
          // console.log(res)
          let data = res.data;
          // console.log('yyyy', data)
          // for (let index in data) {
          for (let index in data) {
            data[index].isTouchMove = false //默认全隐藏删除
            // console.log(data[index]);
            if (that.in_array(data[index].sku_id, that.data.unselected_list)) {
              data[index].status = 0;
              that.setData({
                check_all: 0,
              });
            } else {
              data[index].status = 1;
            }

            let price = parseFloat(data[index].price);
            let num = parseInt(data[index].num);
            if (data[index].status == 1) {
              total_price = parseFloat(total_price) + parseFloat(price * num);
            }


            //图片处理
            if (data[index].picture_info != undefined && data[index].picture_info != null) {
              let img = data[index].picture_info.pic_cover_small;
              data[index].picture_info.pic_cover_small = app.IMG(img);
            } else {
              data[index].picture_info = {};
              data[index].picture_info.pic_cover_small = '';
            }
          }
          // }

          // console.log(data[0])

          // console.log(data, '422')
          that.setData({
            Base: siteBaseUrl,
            cart_list: data,
            total_price: total_price.toFixed(2),
            //check_all: 1,
            edit: 0,
            is_checked: 1
          });
        }
        // console.log(res);
      }

    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    let siteBaseUrl = app.globalData.siteBaseUrl;
    let share_sku_list = that.data.share_sku_list;
    console.log(share_sku_list)
    //判断是否是付费会员
    let is_vip = app.globalData.is_vip;
  
    //是否授权数据更新
    let updata = that.data.unregistered
    updata = app.globalData.unregistered;
    // console.log(updata)
    
    that.setData({
      unregistered: updata,
      is_vip
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
      check_1_carts: [],  // 选中的大贸商品列表
      check_2_carts: [],   // 选中的跨境商品列表
      send_type: 2,    // 多类型订单时 选择发送类型 1 大贸 2跨境
    });

    app.restStatus(that, 'settlementFlag');
    app.restStatus(that, 'goodsDetailFlag');
  

    app.sendRequest({
      url: 'api.php?s=order/share',
      data: {
        share_sku_list
      },
      success: function (res) {
        let code = res.code;
        let total_price = 0.00;
        if (code == 0) {

          //是否授权数据更新
          let updata = that.data.unregistered
          updata = app.globalData.unregistered;
          // console.log(updata)

          that.setData({
            unregistered: updata,
          })


          // console.log(res)
          let data = res.data;
          // console.log('yyyy', data)
          // for (let index in data) {
          for (let index in data) {
            data[index].isTouchMove = false //默认全隐藏删除
            // console.log(data[index])
            if (that.in_array(data[index].sku_id, that.data.unselected_list)) {
              data[index].status = 0;
              that.setData({
                check_all: 0,
              });
            } else {
              data[index].status = 1;
            }

            let price = parseFloat(data[index].price);
            let num = parseInt(data[index].num);
            if (data[index].status == 1) {
              total_price = parseFloat(total_price) + parseFloat(price * num);
            }


            //图片处理
            if (data[index].picture_info != undefined && data[index].picture_info != null) {
              let img = data[index].picture_info.pic_cover_small;
              data[index].picture_info.pic_cover_small = app.IMG(img);
            } else {
              data[index].picture_info = {};
              data[index].picture_info.pic_cover_small = '';
            }
          }
          // }

          // console.log(data[0])

          // console.log(data, '333')
          that.setData({
            Base: siteBaseUrl,
            cart_list: data,
            total_price: total_price.toFixed(2),
            //check_all: 1,
            edit: 0,
            is_checked: 1
          });
        }
        // console.log(res);
      }

    })


    if (app.globalData.token && app.globalData.token != '') {
      that.QD_reuse();
    } else {
      app.employIdCallback = employId => {
        if (employId != '') {
          // console.log(2, app.globalData.unionid)
          that.QD_reuse();
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  hideModal: function () {
    this.setData({
      showModal: false,
      Choice: false,
      layout: false,
    })},
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
  Crossroad: function () {
    let _that = this;
    _that.setData({
      Choice: true
    })
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
      edit: edit,
      check_all: status,
      is_checked: status,
      cart_list: cart_list,
      total_price: total_price.toFixed(2),
    })
  },

  /**
   * 选中商品
   */
  selectCart: function (event) {
    let that = this;
    let i = event.currentTarget.dataset.index;
    let status = event.currentTarget.dataset.status;
    let cart_list = that.data.cart_list;
    let total_price = that.data.total_price;
    let is_checked = 0;
    let check_all = 1;
    let price = parseFloat(cart_list[i].price);
    console.log(price)
    let num = parseInt(cart_list[i].num);

    if (status == 0) {
      status = 1;
      total_price = parseFloat(total_price) + parseFloat(price * num);
    } else {
      status = 0;
      total_price = parseFloat(total_price) - parseFloat(price * num);
    }

    cart_list[i].status = status;


    for (let index in cart_list) {
      if (cart_list[index].status == 1) {
        is_checked = 1;
      }
      if (cart_list[index].status == 0) {
        check_all = 0;
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
      this.data.cart_list.forEach(v => {
        if (v.status == 0) {
          new_unselected_list.push(v.sku_id);
        }
      })
    }

    // this.data.cart_list.forEach();
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

    for (let index in cart_list) {
      cart_list[index].status = status;
      if (status == 1) {
        let price = parseFloat(cart_list[index].price);
        let num = parseInt(cart_list[index].num);
        total_price = parseFloat(total_price) + parseFloat(price * num);
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
    let adjust_type = event.currentTarget.dataset.type;  //判断加减
    let i = event.currentTarget.dataset.index;     //当前列表的下标
    let cart_list = that.data.cart_list;     //列表数据
    let total_price = 0.00;

    if (adjust_type == 'minus') {
      if (cart_list[i].num==1){
        app.showBox(that, '宝贝不能再减了');
      }else{
        cart_list[i].num--;
      }
    } else if (adjust_type == 'add') {
      if (cart_list[i].num >= cart_list[i].stock) {
        app.showBox(that, '宝贝库存' + cart_list[i].stock + '件');
      } else if (cart_list[i].max_buy != 0 && cart_list[i].num >= cart_list[i].max_buy) {
        app.showBox(that, '宝贝限购' + cart_list[i].stock + '件');
      } else {
        cart_list[i].num++;
      }
    }

    for(let i=0;i<cart_list.length;i++){
      if (cart_list[i].status) {
        total_price = parseFloat(total_price) + parseFloat(cart_list[i].num * cart_list[i].price);
      }
    }
    that.setData({
      cart_list,
      total_price: total_price.toFixed(2),
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

                for (let index in cart_list) {
                  for (let key in cart_list[index]) {
                    cart_list[index][key].status = 0;
                    let price = parseFloat(cart_list[index][key].price);
                    let num = parseInt(cart_list[index][key].num);
                    total_price = parseFloat(total_price) + parseFloat(price * num);
                  }
                }

                that.setData({
                  cart_list: cart_list,
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
  aIndex: function (event) {
    let url = event.currentTarget.dataset.url;
    wx.switchTab({
      url: url,
    })
  },

  /**
   * 结算
   */
  settlemenT: function (event) {
    let that = this;

      let cart_list = that.data.cart_list;
      let type = 1;
      let settlementFlag = that.data.settlementFlag;
      let share_last = '';

      let cart_1 = [];
      let cart_2 = [];
      let carts_1 = ''; // 大贸
      let carts_2 = ''; // 跨境

      if (settlementFlag == 1) {
        return false;
      }
      var total_price_1 = 0;
      var total_price_2 = 0;
      var total_num_1 = 0;
      var total_num_2 = 0;

      for (let index in cart_list) {
        if (cart_list[index].status == 1) {
          let sku_id = cart_list[index].sku_id;
          let num = cart_list[index].num;
          let price = cart_list[index].price;
          let share_list = sku_id + ':' + num + ':' + price;
          // 大贸
          if (cart_list[index].source_type == 1) {

            if (carts_1 == '') {
              carts_1 = share_list;
            } else {
              carts_1 += ',' + share_list;
            }
            total_price_1 += parseFloat(cart_list[index].num) * parseFloat(cart_list[index].price)

            total_num_1 += parseInt(cart_list[index].num);
            console.log(total_num_1)
            cart_1.push(cart_list[index]);
            // 跨境
          } else if (cart_list[index].source_type == 2) {
            // let sku_id = cart_list[index].sku_id;
            // let num = cart_list[index].num;
            // let share_list = sku_id + ':' + num;
            if (carts_2 == '') {
              carts_2 = share_list;
            } else {
              carts_2 += ',' + share_list;
            }
            total_price_2 += parseFloat(cart_list[index].num) * parseFloat(cart_list[index].price)
            total_num_2 += parseInt(cart_list[index].num);
            console.log(total_num_2)
            cart_2.push(cart_list[index]);
          }

          if (share_last == '') {
            share_last = share_list;
          } else {
            share_last += ',' + share_list;
          }
        }
      }
      console.log(share_last)
      console.log(carts_1)
      console.log(carts_2)

      if (carts_1 != '' && carts_2 != '') {
        this.setData({
          check_1_carts: cart_1,
          check_2_carts: cart_2,
          carts_1_info: {
            total_price: total_price_1,
            total_num: total_num_1,
          },
          carts_2_info: {
            total_price: total_price_2,
            total_num: total_num_2,
          },
        });
        this.showDialogBtn();
        return;
      }

      app.clicked(that, 'settlementFlag');
      var goods_type = 1;
      if (cart_2 != '') goods_type = 2;
      let checkout = that.data.check_all
      // console.log(checkout)
      if (cart_2 == '' && cart_1 == '') {
        wx.showToast({
          title: '未选择商品',
          icon: 'loading',
          duration: 500
        })
        that.setData({
          settlementFlag: 0
        })
      } else {

        console.log(share_last, this.data.uid)
        wx.navigateTo({
          url: '/pages/order/paymentorder/paymentorder?share_last=' + share_last + '&tag=5' + '&type=' + goods_type + '&order_type=1',
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
  //   /**
  // * 用户点击右上角分享
  // */
  // onShareAppMessage: function () {
  //   let that = this;
  //   let cart_list = that.data.cart_list
  //   let share_li = '';
  //   let tag = "";
  //   for (let index in cart_list) {
  //     for (let key in cart_list[index]) {
  //       if (cart_list[index][key].status == 1) {
  //         let sku_id = cart_list[index][key].sku_id;
  //         let num = cart_list[index][key].num;

  //         let share_list = sku_id + ':' + num;
  //         if (share_li == '') {
  //           share_li = share_list
  //         } else {
  //           share_li += ',' + share_list
  //         }
  //       }
  //     }

  //   }

  //   return {
  //     title: ' 分享给你的购物清单',
  //     path: '/pages/order/paymentorder/paymentorder?share_li=' + share_li + '&tag=2' + '&sharp=6',
  //     // imageUrl: imgUrl,
  //     success: function (res) {
  //       app.showBox(that, '分享成功');

  //     },
  //     fail: function (res) {
  //       app.showBox(that, '分享失败');
  //     }
  //   }
  // },
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
 
  //获取微信手机号
  getPhoneNumber: function (e) {
    let that = this;
    //判断是否容许获取微信手机号码
    if (e.detail.iv) {
      let setIv = e.detail.iv;
      let setEncryptedData = e.detail.encryptedData;
      that.setData({
        setIv: setIv,
        setEncryptedData
      })
      console.log(that.data.unregistered)
      //判断是否继续弹出获取个人信息弹窗
      if (app.globalData.unregistered== 0) {
        wx.login({
          success: function (res) {
            let coco = res.code;
            app.sendRequest({
              url: 'api.php?s=Login/getWechatMobile',
              data: {
                code: coco,
                mobileEncryptedData: e.detail.encryptedData,
                mobileIv: e.detail.iv
              },
              success: function (res) {
                if (res.code == 0) {
                  that.setData({
                    tel: res.data.user_tel,
                    Choice: false
                  })
                }
              }
            });
          }
        })
      } else {
        that.setData({
          showModal: true,
          Choice: false
        })
      }
    } else {
    }
  },
  //获取头像
  bindgetuserinfo: function (res) {
    let that = this;
    if (res.detail.iv) {
      let iv = res.detail.iv;
      let encryptedData = res.detail.encryptedData;
      app.globalData.iv = res.detail.iv;
      app.globalData.encryptedData = res.detail.encryptedData;
      app.globalData.unregistered = 0;
      console.log(res.detail.iv
      )
      console.log(res.detail.userInfo.avatarUrl)
      console.log(res.detail.userInfo.nickName)
      let heder_img = res.detail.userInfo.avatarUrl
      let wx_name = res.detail.userInfo.nickName
      let branch = res.currentTarget.dataset.status;
      this.setData({
        showModal: false,
        Choice: false
      })
      console.log(branch, 'branch ')
      if (branch == "mobile") {
        this.setData({
          layout: true,
        })

        wx.login({
          success: function (res) {
            let coco = res.code;
            app.sendRequest({
              url: 'api.php?s=Login/getWechatEncryptInfo',
              data: {
                code: coco,
                encryptedData: encryptedData,
                iv: iv
              },
              success: function (res) {
                if (res.code == 0) {
                  let lpl = res.data.token;
                  app.globalData.openid = res.data.openid;
                  app.globalData.token = res.data.token;
                  that.setData({
                    unregistered: 0,
                    wx_name: wx_name,
                    heder_img
                  })

                 

                }

              }
            });
          }
        })





      } else {
        wx.login({
          success: function (res) {
            let coco = res.code;
            app.sendRequest({
              url: 'api.php?s=Login/getWechatEncryptInfo',
              data: {
                code: coco,
                encryptedData: encryptedData,
                iv: iv
              },
              success: function (res) {
                if (res.code == 0) {
                  let lpl = res.data.token;
                  app.globalData.openid = res.data.openid;
                  app.globalData.token = res.data.token;
                  that.setData({
                    unregistered: 0,
                    wx_name: wx_name,
                    heder_img
                  })
                  wx.login({
                    success: function (res) {
                      let coco = res.code;
                      app.sendRequest({
                        url: 'api.php?s=Login/getWechatMobile',
                        data: {
                          code: coco,
                          mobileEncryptedData: that.data.setEncryptedData,
                          mobileIv: that.data.setIv,
                          token: lpl
                        },
                        success: function (res) {

                         
                          if (res.code == 0) {
                            that.setData({
                              unregistered: 0,
                              wx_name: wx_name,
                              tel: res.data.user_tel,
                              heder_img
                            })

                          }
                        }
                      });
                    }
                  })



                }

              }
            });
          }
        })
      }






    } else {
      this.setData({
        showModal: false,
      })
    }





  },
  
})

