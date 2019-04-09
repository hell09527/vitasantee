// pages/member/givingRecords/givingRecords.js
const app = new getApp();
var time = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 1,   //导航标识
    page:1,   //页数
    giftList: [],    //送出礼物数组    
    receiveGift: [],    //收到礼物数组    
    isHide: 0,    //客服按钮是否影藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "礼物记录",
    })
  },

  toDetail: function (e) {
    let status = e.currentTarget.dataset.status;
    let id = e.currentTarget.dataset.id;
    if(status==1){
      wx.navigateTo({
        url: "/pages/member/givingDetail/givingDetail?id="+id,
      })
    } else if(status==2){
      wx.navigateTo({
        url: "/pages/member/receiveDetail/receiveDetail?id="+id,
      })
    }
   
  },
  //去支付
  commitrder: function (e) {
    // console.log(1212121212121)
    let out_trade_no = e.currentTarget.dataset.trade;
    wx.navigateTo({
      url: '/pages/pay/getpayvalue/getpayvalue?present=1&&out_trade_no=' + out_trade_no,
    })
  },

  deL:function(e){
    let order_id = e.currentTarget.dataset.id;
    console.log(order_id);
    var that=this;
    app.sendRequest({
      url: 'api.php?s=order/deleteOrder',
      data: {
        order_id: order_id
      },
      success: function (res) {
        let code = res.data;
        if (code > 0) {
          app.showBox(that, '操作成功');
          that.onShow()
        } else {
          app.showBox(that, '操作失败');
        }
      }
    });
  },


  // 确认收货
  getGoods:function(event){

    let that = this;
    let order_id = event.currentTarget.dataset.id;

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
            url: 'api.php?s=order/getGiftOrderGetList',
            data: {
              page: 1
            },
            success: function (res) {
              let code = res.code;

              if (code == 0) {
                let receiveGift = res.data.data;

                for (let index in receiveGift) {
                  receiveGift[index].create_time = time.formatTime(receiveGift[index].create_time, 'Y-M-D h:m:s');
                  //图片处理
                  for (let key in receiveGift[index].order_item_list) {
                    let img = receiveGift[index].order_item_list[key].picture.pic_cover_small;
                    receiveGift[index].order_item_list[key].picture.pic_cover_small = app.IMG(img);
                  }
                }
                let page = receiveGift.length > 0 ? 2 : 1;
                that.setData({
                  receiveGift: receiveGift,
                  page: page
                })
              }
              console.log(res)
            }
          })
        } else {
          app.showBox(that, '操作失败');
          app.restStatus(that, 'getdeliveryFlag');
        }
      }
    });
  },


  //huioqu
  tobtain:function(e){
    let that=this
    let x = e.currentTarget.dataset.order;
    console.log(x)
  
    wx.navigateTo({
      url: '/pages/goods/presentGift/presentGift?order_no=' + x ,
    })
  },
//查看物流
  checkWL:function(e){
    let that = this
    let order_id = e.currentTarget.dataset.id;
    console.log(order_id )
    wx.navigateTo({
      url: '/pages/order/orderexpress/orderexpress?id=' + order_id,
    })
  },

  // 导航点击
  topNav: function (e) {
    let that = this;
    let status=e.currentTarget.dataset.status;
    this.setData({
      status:status,
      page:1,
    })
    if (status == 1) {
      app.sendRequest({
        url: 'api.php?s=order/getGiftOrderList',
        data: {
          page: 1
        },
        success: function (res) {
          let code = res.code;

          if (code == 0) {
            let giftList = res.data.data;

            for (let index in giftList) {
              giftList[index].create_time = time.formatTime(giftList[index].create_time, 'Y-M-D h:m:s');
              //图片处理
              for (let key in giftList[index].order_item_list) {
                let img = giftList[index].order_item_list[key].picture.pic_cover_small;
                giftList[index].order_item_list[key].picture.pic_cover_small = app.IMG(img);
              }
            }
            let page = giftList.length > 0 ? 2 : 1;
            that.setData({
              giftList: giftList,
              page: page
            })
          }
          console.log(res)
        }
      })
    } else if (status == 2) {
      app.sendRequest({
        url: 'api.php?s=order/getGiftOrderGetList',
        data: {
          page: 1
        },
        success: function (res) {
          let code = res.code;

          if (code == 0) {
            let receiveGift = res.data.data;

            for (let index in receiveGift) {
              receiveGift[index].create_time = time.formatTime(receiveGift[index].create_time, 'Y-M-D h:m:s');
              //图片处理
              for (let key in receiveGift[index].order_item_list) {
                let img = receiveGift[index].order_item_list[key].picture.pic_cover_small;
                receiveGift[index].order_item_list[key].picture.pic_cover_small = app.IMG(img);
              }
            }
            let page = receiveGift.length > 0 ? 2 : 1;
            that.setData({
              receiveGift: receiveGift,
              page: page
            })
          }
          console.log(res)
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    let status = that.data.status;

    app.restStatus(that, 'logisticsFlag');
    app.restStatus(that, 'getdeliveryFlag');
    app.restStatus(that, 'refundFlag');
    app.restStatus(that, 'evaluationFlag');
    app.restStatus(that, 'evaluationAgainFlag');
    app.restStatus(that, 'aClickFlag');
    app.restStatus(that, 'payFlag');
    if (status == 1) {
      app.sendRequest({
        url: 'api.php?s=order/getGiftOrderList',
        data: {
          page: 1
        },
        success: function (res) {
          let code = res.code;

          if (code == 0) {
            let giftList = res.data.data;

            for (let index in giftList) {
              giftList[index].create_time = time.formatTime(giftList[index].create_time, 'Y-M-D h:m:s');
              //图片处理
              for (let key in giftList[index].order_item_list) {
                let img = giftList[index].order_item_list[key].picture.pic_cover_small;
                giftList[index].order_item_list[key].picture.pic_cover_small = app.IMG(img);
              }
            }
            let page = giftList.length > 0 ? 2 : 1;
            that.setData({
              giftList: giftList,
              page: page
            })
          }
          console.log(res)
        }
      })
    }else if(status==2){
      app.sendRequest({
        url: 'api.php?s=order/getGiftOrderGetList',
        data: {
          page: 1
        },
        success: function (res) {
          let code = res.code;

          if (code == 0) {
            let receiveGift = res.data.data;

            for (let index in receiveGift) {
              receiveGift[index].create_time = time.formatTime(receiveGift[index].create_time, 'Y-M-D h:m:s');
              //图片处理
              for (let key in receiveGift[index].order_item_list) {
                let img = receiveGift[index].order_item_list[key].picture.pic_cover_small;
                receiveGift[index].order_item_list[key].picture.pic_cover_small = app.IMG(img);
              }
            }
            let page = receiveGift.length > 0 ? 2 : 1;
            that.setData({
              receiveGift: receiveGift,
              page: page
            })
          }
          console.log(res)
        }
      })
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
    let that = this;
    let page = that.data.page;
    let status = that.data.status;
    let giftList = that.data.giftList;
    let receiveGift = that.data.receiveGift;
    if (status == 1) {
      app.sendRequest({
        url: 'api.php?s=order/getGiftOrderList',
        data: {
          page: page
        },
        success: function (res) {
          let code = res.code;
          if (code == 0) {
            let new_goods_list = res.data.data;
            let d = {};
            page = new_goods_list.length > 0 ? page + 1 : page;

            for (let index in new_goods_list) {
              new_goods_list[index].create_time = time.formatTime(new_goods_list[index].create_time, 'Y-M-D h:m:s');
              new_goods_list[index].operation = {}; //去除无用数组
              //图片处理
              for (let key in new_goods_list[index].order_item_list) {
                let img = new_goods_list[index].order_item_list[key].picture.pic_cover_small;
                new_goods_list[index].order_item_list[key].picture.pic_cover_small = app.IMG(img);
              }
              //优化数据传入
              let key = "giftList[" + (parseInt(giftList.length) + parseInt(index)) + "]";
              d[key] = new_goods_list[index];
            }
            //更新加入数据
            that.setData(d);

            that.setData({
              page: page
            })
          }
        }
      });
    } else if (status == 2) {
      app.sendRequest({
        url: 'api.php?s=order/getGiftOrderGetList',
        data: {
          page: page
        },
        success: function (res) {
          let code = res.code;
          if (code == 0) {
            let new_goods_list = res.data.data;
            let d = {};
            page = new_goods_list.length > 0 ? page + 1 : page;

            for (let index in new_goods_list) {
              new_goods_list[index].create_time = time.formatTime(new_goods_list[index].create_time, 'Y-M-D h:m:s');
              new_goods_list[index].operation = {}; //去除无用数组
              //图片处理
              for (let key in new_goods_list[index].order_item_list) {
                let img = new_goods_list[index].order_item_list[key].picture.pic_cover_small;
                new_goods_list[index].order_item_list[key].picture.pic_cover_small = app.IMG(img);
              }
              //优化数据传入
              let key = "receiveGift[" + (parseInt(receiveGift.length) + parseInt(index)) + "]";
              d[key] = new_goods_list[index];
            }
            //更新加入数据
            that.setData(d);

            that.setData({
              page: page
            })
          }
        }
      });
    }
  },

  /**
       * 用户点击右上角分享
       */
  // onShareAppMessage: function (id) {


  //   let that = this;
  //   let x = id
  //   console.log(x)

  //   return {
  //     title: "您的好友赠予你一份礼物",
  //     path: '/pages/backPage/fetchGift/fetchGift?order_id=' + x,
  //     imageUrl: '',
  //     success: function (res) {
  //       app.showBox(that, '分享成功');

  //       wx.navigateTo({
  //         url: "/pages/backPage/backPage",
  //       })

  //     },
  //     fail: function (res) {
  //       app.showBox(that, '分享失败');
  //     }
  //   }

  //   let is_share = 0;

  //   that.setData({
  //     is_share: is_share
  //   })
  // },
  /**
   * 分享
   */
  share: function (e) {
    // let that = this
    // let id = e.currentTarget.dataset.id;
    // console.log(id)
    let is_share = 1;
    console.log(this.data.id)
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
  commitOrder:function(e){
    let out_trade_no = e.currentTarget.dataset.id;
    wx.reLaunch({
      url: '/pages/pay/getpayvalue/getpayvalue?out_trade_no=' + out_trade_no,
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