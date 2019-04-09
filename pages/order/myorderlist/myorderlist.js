const app = new getApp();
var time = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '',
    defaultImg: {},
    _no: '0',
    status: 'all',
    page: 1,
    order_list: [],
    logisticsFlag: 0,
    getdeliveryFlag: 0,
    refundFlag: 0,
    evaluationFlag: 0,
    evaluationAgainFlag: 0,
    aClickFlag: 0,
    payFlag: 0,
    address:[],   //收货地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let base = app.globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;

    if (options.status){
      that.setData({
        Base: base,
        defaultImg: defaultImg,
        _no: options.status,
        status: options.status-1
      })
    }else{
      that.setData({
        Base: base,
        defaultImg: defaultImg,
      })
    }
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
    let status = that.data.status;
    let order_list = that.data.order_list;

    app.restStatus(that, 'logisticsFlag');
    app.restStatus(that, 'getdeliveryFlag');
    app.restStatus(that, 'refundFlag');
    app.restStatus(that, 'evaluationFlag');
    app.restStatus(that, 'evaluationAgainFlag');
    app.restStatus(that, 'aClickFlag');
    app.restStatus(that, 'payFlag');

    app.sendRequest({
      url: 'api.php?s=order/getOrderList',
      data: {
        status: status
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let order_list = res.data.data;

          for (let index in order_list){
            order_list[index].create_time = time.formatTime(order_list[index].create_time,'Y-M-D h:m:s');
            //图片处理
            for (let key in order_list[index].order_item_list) {
              let img = order_list[index].order_item_list[key].picture.pic_cover_small;
              order_list[index].order_item_list[key].picture.pic_cover_small = app.IMG(img);
            }
          }
          let page = order_list.length > 0 ? 2 : 1;
          that.setData({
            order_list: order_list,
            page: page
          })
          // for (var i = 0; i < order_list.length;i++){
          //   order_list[i].
          // }
        }
        console.log(res)
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
    let that = this;
    let page = that.data.page;
    let status = that.data.status;
    let order_list = that.data.order_list;

    app.sendRequest({
      url: 'api.php?s=order/getOrderList',
      data: {
        status: status,
        page: page
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let new_order_list = res.data.data;
          let d = {};
          page = new_order_list.length > 0 ? page+1 : page;

          for (let index in new_order_list) {
            new_order_list[index].create_time = time.formatTime(new_order_list[index].create_time, 'Y-M-D h:m:s');
            new_order_list[index].operation = {}; //去除无用数组
            //图片处理
            for (let key in new_order_list[index].order_item_list) {
              let img = new_order_list[index].order_item_list[key].picture.pic_cover_small;
              new_order_list[index].order_item_list[key].picture.pic_cover_small = app.IMG(img);
            }
            //优化数据传入
            let key = "order_list[" + (parseInt(order_list.length) + parseInt(index)) + "]";
            d[key] = new_order_list[index];
          }
          //更新加入数据
          that.setData(d);
          that.setData({
            page: page
          })
        }
      }
    });
  },
  /**
   * 图片加载失败
   */
  errorImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let key = e.currentTarget.dataset.key;
    let order_list = that.data.order_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = order_list[index].order_item_list[key].picture.pic_cover_small;
    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "order_list[" + index + "].order_item_list[" + key + "].picture.pic_cover_small";
        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 顶部导航选中
   */
  topNav: function (event) {
    let that = this;
    let status = event.currentTarget.dataset.id;
    let order_status = status == 0 ? 'all' : status-1;

    app.sendRequest({
      url: 'api.php?s=order/getOrderList',
      data: {
        status: order_status
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let order_list = res.data.data;
          for (let index in order_list) {
            order_list[index].create_time = time.formatTime(order_list[index].create_time, 'Y-M-D h:m:s')
            //图片处理
            for (let key in order_list[index].order_item_list){
              let img = order_list[index].order_item_list[key].picture.pic_cover_small;
              order_list[index].order_item_list[key].picture.pic_cover_small = app.IMG(img);
            }
          }

          that.setData({
            order_list: order_list,
            _no: status,
            status: order_status,
            page: 2
          })
        }
        console.log(res)
      }
    })
  },

  /**
   * 随便逛逛
   */
  aIndex: function(event){
    let url = event.currentTarget.dataset.url;
    wx.switchTab({
      url: url,
    })
  },
  
  /**
   * 点击操作
   */
  aClick: function(event){
    let that = this;
    let aClickFlag = that.data.aClickFlag;
    let url = event.currentTarget.dataset.url;
    console.log(url)

    if (aClickFlag == 1){
      return false;
    }
    app.clicked(that, 'aClickFlag');

    wx.navigateTo({
      url: '/pages/'+url,
    })
  },
  To_back:function(){
    wx.switchTab({
        url: '/pages/index/index',
     })

    //  wx.navigateTo({
    //    url: '/pages/goods/goodslist/goodslist',
    //  })
  },
  
  /**
   * 去支付
   */
  pay: function(event){
    let that = this;
    let payFlag = that.data.payFlag;
    let out_trade_no = event.currentTarget.dataset.no;
    let url = '/pages/pay/getpayvalue/getpayvalue?out_trade_no=' + out_trade_no;

    if (payFlag == 1){
      return false;
    }
    app.clicked(that, 'payFlag');

    wx.navigateTo({
      url: url,
    })
  },

  /**
   * 关闭订单
   */
  close: function(event){
    let that = this;
    let order_id = event.currentTarget.dataset.id;
    let order_status = that.data.status;

    app.sendRequest({
      url: 'api.php?s=order/orderClose',
      data: {
        order_id: order_id
      },
      success: function (res) {
        let code = res.data;
        if (code > 0){
          app.showBox(that, '操作成功');

          app.sendRequest({
            url: 'api.php?s=order/getOrderList',
            data: {
              status: order_status,
            },
            success: function (res) {
              let code = res.code;
              let order_list = res.data.data;
              if (code == 0) {
                for (let index in order_list) {
                  order_list[index].create_time = time.formatTime(order_list[index].create_time, 'Y-M-D h:m:s')
                  //图片处理
                  for (let key in order_list[index].order_item_list) {
                    let img = order_list[index].order_item_list[key].picture.pic_cover_small;
                    order_list[index].order_item_list[key].picture.pic_cover_small = app.IMG(img);
                  }
                }
                that.setData({
                  order_list: order_list,
                  page: 2
                })
              }
            }
          })
        }
      }
    })
  },

  /**
   * 删除订单
   */
  delete_order: function(event){
    let that = this;
    let order_id = event.currentTarget.dataset.id;
    let order_status = that.data.status;

    app.sendRequest({
      url: 'api.php?s=order/deleteOrder',
      data: {
        order_id: order_id
      },
      success: function (res) {
        let code = res.data;
        if (code > 0) {
          app.showBox(that, '操作成功');

          app.sendRequest({
            url: 'api.php?s=order/getOrderList',
            data: {
              status: order_status,
              page: 1
            },
            success: function (res) {
              let code = res.code;
              let order_list = res.data.data;
              if (code == 0) {
                for (let index in order_list) {
                  order_list[index].create_time = time.formatTime(order_list[index].create_time, 'Y-M-D h:m:s')
                  //图片处理
                  for (let key in order_list[index].order_item_list) {
                    let img = order_list[index].order_item_list[key].picture.pic_cover_small;
                    order_list[index].order_item_list[key].picture.pic_cover_small = app.IMG(img);
                  }
                }
                that.setData({
                  order_list: order_list,
                  page: 2
                })
              }
            }
          });
        }else{
          app.showBox(that, '操作失败');
        }
      }
    });
  },

  /**
   * 查看物流
   */
  logistics: function(event){
    let that = this;
    let order_id = event.currentTarget.dataset.id;
    let logisticsFlag = that.data.logisticsFlag;

    if (logisticsFlag == 1){
      return false;
    }
    app.clicked(that, 'logisticsFlag');

    wx.navigateTo({
      url: '/pages/order/orderexpress/orderexpress?id='+order_id,
    })
  },

  /**
   * 确认收货
   */
  getdelivery: function(event){
    let that = this;
    let getdeliveryFlag = that.data.getdeliveryFlag;
    let order_id = event.currentTarget.dataset.id;
    let order_status = that.data.status;

    if (getdeliveryFlag == 1){
      return false;
    }
    app.clicked(that, 'getdeliveryFlag');

    app.sendRequest({
      url: 'api.php?s=order/orderTakeDelivery',
      data: {
        order_id: order_id,
      },
      success: function (res) {
        let code = res.data;
        if (code > 0) {
          app.showBox(that, '操作成功');

          app.sendRequest({
            url: 'api.php?s=order/getOrderList',
            data: {
              status: order_status
            },
            success: function (res) {
              let code = res.code;
              let order_list = res.data.data;
              if (code == 0) {
                for (let index in order_list) {
                  order_list[index].create_time = time.formatTime(order_list[index].create_time, 'Y-M-D h:m:s')
                  //图片处理
                  for (let key in order_list[index].order_item_list) {
                    let img = order_list[index].order_item_list[key].picture.pic_cover_small;
                    order_list[index].order_item_list[key].picture.pic_cover_small = app.IMG(img);
                  }
                }
                that.setData({
                  order_list: order_list,
                  page: 2
                })
                app.restStatus(that, 'getdeliveryFlag');
              }
            }
          });
        }else{
          app.showBox(that, '操作失败');
          app.restStatus(that, 'getdeliveryFlag');
        }
      }
    });
  },

  /**
   * 退款/退货
   */
  refund: function(event){
    let that = this;
    let refundFlag = that.data.refundFlag;
    // let status = that.data.status;
    let order_goods_id = event.currentTarget.dataset.id;
    let name= event.currentTarget.dataset.name;
   let ship=event.currentTarget.dataset.ship;
      let status=event.currentTarget.dataset.status

    if (refundFlag == 1){
      return false;
    }
    app.clicked(that, 'refundFlag');
    wx.navigateTo({
      url: '/pages/order/refunddetail/refunddetail?id=' + order_goods_id + '&status=' + status + '&name=' + name+ '&ship=' + ship,
    })
  },

  /**
   * 评价
   */
  evaluation: function (e){
    let that = this;
    let evaluationFlag = that.data.evaluationFlag;
    let order_id = e.currentTarget.dataset.id;

    if (evaluationFlag == 1){
      return false;
    }
    app.clicked(that, 'evaluationFlag');

    wx.navigateTo({
      url: '/pages/order/reviewcommodity/reviewcommodity?id=' + order_id,
    })
  },

  /**
   * 追加评价
   */
  evaluationAgain: function (e) {
    let that = this;
    let evaluationAgainFlag = that.data.evaluationAgainFlag;
    let order_id = e.currentTarget.dataset.id;

    if (evaluationAgainFlag == 1){
      return false;
    }
    app.clicked(that, 'evaluationAgainFlag');

    wx.navigateTo({
      url: '/pages/order/reviewagain/reviewagain?id=' + order_id,
    })
  },

  // 跳转修改地址页面
  amendAddress:function(e){
    var order_no = e.currentTarget.dataset.no;
    var index = e.currentTarget.dataset.index;
    var order_list = this.data.order_list;
    var address = {};
    address.address = order_list[index].receiver_address;
    address.city = order_list[index].receiver_city;
    address.city_name = order_list[index].receiver_city_name;
    address.district = order_list[index].receiver_district;
    address.district_name = order_list[index].receiver_district_name;
    address.mobile = order_list[index].receiver_mobile;
    address.name = order_list[index].receiver_name;
    address.province = order_list[index].receiver_province;
    address.province_name = order_list[index].receiver_province_name;
    address.zip = order_list[index].receiver_zip;
    wx.navigateTo({
      url: '/pages/order/amendAdder/amendAdder?order_no=' + order_no+'&address='+JSON.stringify(address),
    })
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
    console.log(event, 222222)
    this.setData({
      isHide: 0
    })
  },
  
})