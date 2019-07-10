const app = getApp();
var time = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    //处理方式
    require_array: [
      {
        id: 1,
        value: '仅退款'
      }
    ],
    //退款原因
    reason_array: [
      {
        id: '买/卖双方协商一致',
        value: '买/卖双方协商一致'
      },
      {
        id: '买错/多买/不想要',
        value: '买错/多买/不想要'
      },
      {
        id: '商品质量问题',
        value: '商品质量问题'
      },
      {
        id: '未收到货品',
        value: '未收到货品'
      },
      {
        id: '其他',
        value: '其他'
      },
    ],
    require_index: 0,
    reason_index: 0,
    refund_money: 0.00, //最多退款金额
    refund_balance: 0.00, //余额退款
    refund_require_money: 0.00, //申请退款金额
    refund_real_money: 0.00, //实际退款金额
    refund_express_company: '', //物流公司
    refund_shipping_no: '', //运单号
    refund_reason: '', //退款理由
    order_id: 0,
    order_goods_id: 0,
    refund_detail: {},
    refund_info: {},
    shop_address: {},
    refundFlag: 0,
    returnsGoodsFlag: 0,
    require_num: '',
    myTime: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    let require_array = that.data.require_array;
    let order_goods_id = options.id;
    let xie_name = options.name;
    let status = options.status;
    let ship = options.ship;
    console.log(ship)
    console.log(status)

    if ((status == 0 || status == -2 || status == -3 || status == 5) && ship == 1) {
      console.log('woaooqo')
      require_array[1] = {
        id: 2,
        value: '我要退款，并且退货'
      };
    }

    app.sendRequest({
      url: 'api.php?s=order/refundDetails',
      data: {
        order_goods_id: order_goods_id
      },
      success: function (res) {
        let code = res.code;
        let ALl_data = res.data.refund_detail;
        let data = res.data;

        if (code == 0) {
          let refund_info = data.refund_detail.refund_account_record;
          //退款记录
          let refund_his = data.refund_detail.refund_account_records;
          let refund_max_num = data.refund_detail.refund_max_num;
          let refund_max_money = data.refund_detail.refund_max_money;
          let require_num = data.refund_detail.refund_max_num;
          let refund_require_money = data.refund_detail.refund_require_money;
          for (let index in refund_his) {
            //时间格式转化
            refund_his[index].askfor_time = time.formatTime(refund_his[index].askfor_time, 'Y-M-D h:m:s');
            console.log(refund_his.askfor_time)
          }



          let actual_price = refund_max_money;
          refund_require_money = actual_price;

          let goods_num = [];
          for (var i = 0; i < refund_max_num; i++) {
            goods_num.push(i + 1)
          }
          console.log(goods_num);

          let refund_Num = data.refund_detail.num;  //原本存在子订单的数量
          let refund_require_num = refund_max_num;
          let shows_status;

          // 判断自订单未完全申请售后的状态栏
          if (refund_Num == refund_require_num || refund_require_num == 0)
            shows_status = 1; else shows_status = 0;

          if (refund_info != undefined && refund_info != '') {
            refund_info.update_time = time.formatTime(refund_info.update_time, 'Y-M-D h:m:s');
          }

          that.setData({
            refund_money: parseFloat(refund_max_money).toFixed(2),
            refund_balance: parseFloat(data.refund_balance).toFixed(2),
            order_id: data.refund_detail.order_id,
            require_array: require_array,
            order_goods_id: order_goods_id,
            refund_info: refund_info,
            refund_detail: data.refund_detail,
            shop_address: data.shop_address,
            refund_real_money: data.refund_detail.refund_real_money,
            goods_num,
            refund_max_money,
            refund_max_num,
            actual_price: actual_price.toFixed(2),
            require_num,
            refund_require_money,
            refund_require_num,
            refund_Num,
            shows_status,
            refund_his,
            xie_name,
            ALl_data
          })

        }
        console.log(res);
      }
    });


    app.sendRequest({
      url: "api.php?s=member/getMemberDetail",
      success: function (res) {
        let data = res.data
        if (res.code == 0) {
          let member_info = data;
          let distributor_type = data.distributor_type;
          console.log(distributor_type)
          let img = member_info.user_info.user_headimg;
          member_info.user_info.user_headimg = app.IMG(img); //图片路径处理
          let tel = data.user_info.user_tel;
          console.log(tel);
          that.setData({
            member_info: res.data,
            tel: tel,
            distributor_type
          })
        }
      }
    })






  },
  onUnload() {
    //  关闭但页面清除单前页面的定时器
    clearInterval(this.data.myTime);
  },
  bindPickerChange: function (e) {
    let _this = this;
    let refund_max_num = _this.data.refund_max_num;
    let refund_max_money = _this.data.refund_max_money;
    let require_num = _this.data.require_num;
    let actual_price = _this.data.actual_price;
    let refund_require_money = _this.data.refund_require_money;

    // 选择数量
    let ch_num = e.detail.value;
    require_num = Number(ch_num) + Number(1);
    actual_price = (refund_max_money / refund_max_num) * require_num;
    refund_require_money = actual_price;

    let refund_require_num = Number(ch_num) + Number(1);

    console.log(actual_price)
    _this.setData({
      require_num,
      actual_price: actual_price.toFixed(2),
      refund_require_money,
      refund_require_num
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
    app.restStatus(that, 'refundFlag');
    app.restStatus(that, 'returnsGoodsFlag');
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
   * 输入物流公司
   */
  inputExpressCompany: function (e) {
    let that = this;
    let refund_express_company = e.detail.value;
    that.setData({
      refund_express_company: refund_express_company
    })
  },
  /**
   * 输入运单号
   */
  inputShippingNo: function (e) {
    let that = this;
    let refund_shipping_no = e.detail.value;
    that.setData({
      refund_shipping_no: refund_shipping_no
    })
  },

  selector: function (event) {
    let that = this;
    let require_index = that.data.require_index;
    let reason_array = that.data.reason_array;
    let reason_index = that.data.reason_index;
    let select_type = event.currentTarget.dataset.type;
    let index = event.detail.value;

    if (select_type == 1) {
      require_index = index;
    } else {
      reason_index = index;
    }

    that.setData({
      require_index: require_index,
      reason_index: reason_index,
    });
  },

  /**
   * 退款金额检测
   */
  refundRequireMoney: function (event) {
    let that = this;
    console.log(event.detail.value)

    let refund_require_money = event.detail.value;
    let refund_money = that.data.refund_money;
    console.log(refund_money)

    if (refund_require_money > refund_money) {
      app.showBox(that, '超出可退金额范围');
    }

    that.setData({
      refund_require_money: refund_require_money
    });
  },
  /**
   * 退款说明检测
   */
  refundReason: function (event) {
    let that = this;

    let refund_reason = event.detail.value;

    that.setData({
      refund_reason: refund_reason
    })
  },

  /**
   * 获取退款信息
   */
  getRefundInfo: function (that, order_goods_id) {

    app.sendRequest({
      url: 'api.php?s=order/refundDetails',
      data: {
        order_goods_id: order_goods_id
      },
      success: function (res) {
        let code = res.code;
        let ALl_data = res.data.refund_detail;
        let data = res.data;

        if (code == 0) {
          let refund_info = data.refund_detail.refund_account_record;
          //退款记录
          let refund_his = data.refund_detail.refund_account_records;

          let refund_max_num = data.refund_detail.refund_max_num;

          let refund_max_money = data.refund_detail.refund_max_money;
          let require_num = data.refund_detail.refund_max_num;
          let refund_require_money = data.refund_detail.refund_require_money;

          for (let index in refund_his) {
            //时间格式转化
            refund_his[index].askfor_time = time.formatTime(refund_his[index].askfor_time, 'Y-M-D h:m:s');
            //   if(refund_his[index].refund_action!=''){
            //     for (let index in refund_his[index].refund_action){
            //       refund_his[index].refund_action[index].action_time=time.formatTime(refund_his[index].refund_action[index].action_time.askfor_time, 'Y-M-D h:m:s');
            //     }
            //    console.log(refund_his.askfor_time )
            //  }
          }
          let actual_price = refund_max_money;
          refund_require_money = actual_price;

          let goods_num = [];
          for (var i = 0; i < refund_max_num; i++) {
            goods_num.push(i + 1)
          }
          console.log(goods_num);

          let refund_Num = data.refund_detail.num;  //原本存在子订单的数量
          let refund_require_num = refund_max_num;
          let shows_status;

          // 判断自订单未完全申请售后的状态栏
          if (refund_Num == refund_require_num || refund_require_num == 0)
            shows_status = 1; else shows_status = 0;

          if (refund_info != undefined && refund_info != '') {
            refund_info.update_time = time.formatTime(refund_info.update_time, 'Y-M-D h:m:s');
          }

          that.setData({
            refund_money: parseFloat(refund_max_money).toFixed(2),
            refund_balance: parseFloat(data.refund_balance).toFixed(2),
            order_id: data.refund_detail.order_id,
            order_goods_id: order_goods_id,
            refund_info: refund_info,
            refund_detail: data.refund_detail,
            shop_address: data.shop_address,
            refund_real_money: data.refund_detail.refund_real_money,
            goods_num,
            refund_max_money,
            refund_max_num,
            actual_price: actual_price.toFixed(2),
            require_num,
            refund_require_money,
            refund_require_num,
            refund_Num,
            shows_status,
            refund_his,
            ALl_data
          })

        }
        console.log(res);
      }
    });




  },

  /**
   * 退款/退货申请
   */
  refund: function (event) {
    let that = this;
    let refundFlag = that.data.refundFlag;
    let order_id = that.data.order_id;
    let order_goods_id = that.data.order_goods_id;
    let refund_require_money = parseFloat(that.data.refund_require_money);
    let refund_require_num = parseFloat(that.data.refund_require_num);
    let refund_balance = parseFloat(that.data.refund_balance);
    let refund_money = that.data.refund_money;
    let require_array = that.data.require_array;
    let reason_array = that.data.reason_array;
    let require_index = that.data.require_index;
    let reason_index = that.data.reason_index;
    let refund_reason = that.data.refund_reason;
    let refund_type = require_array[require_index].id;

    if (refundFlag == 1) {
      return false;
    }
    app.clicked(that, 'refundFlag');

    if (refund_require_money == '' && refund_money > 0) {
      app.showBox(that, '请输入退款金额');
      app.restStatus(that, 'refundFlag');
      return false;
    }

    if (refund_require_money > refund_money) {
      app.showBox(that, '超出可退金额范围');
      app.restStatus(that, 'refundFlag');
      return false;
    }

    if (reason_index != 4) {
      refund_reason = reason_array[reason_index].id;
    } else {
      if (refund_reason == '') {
        app.showBox(that, '请输入退款说明');
        app.restStatus(that, 'refundFlag');
        return false;
      }
    }

    app.sendRequest({
      url: 'api.php?s=order/orderGoodsRefundAskfors',
      data: {
        order_id: order_id,
        order_goods_id: order_goods_id,
        refund_type: refund_type,
        refund_require_money: refund_require_money,
        refund_reason: refund_reason,
        refund_require_num: refund_require_num
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if (data > 0) {
            app.showBox(that, '操作成功');
            that.getRefundInfo(that, order_goods_id);
          } else {
            app.showBox(that, '操作失败');
            app.restStatus(that, 'refundFlag');
          }
        }
      }
    });
  },
  /**
 * 协商历史跳转
 */
  protocol: function () {
    let _biu = this;
    let carry_data = [];
    let refund_his = _biu.data.refund_his;
    let refund_info = _biu.data.refund_info;
    let status = refund_info.refund_status;
    let name = _biu.data.member_info.member_name;
    let askfor_time = time.formatTime(refund_info.askfor_time, 'Y-M-D h:m:s');
    let Pro = {
      status: status,
      time: askfor_time,
      name
    }
    for (let index in refund_his) {
      carry_data.push(refund_his[index]);
    }



    //  carry_data.push(refund_info.refund_status);
    console.log(carry_data);

    wx.navigateTo({
      url: "/pages/order/protocol/protocol?Pro=" + JSON.stringify(Pro) + "&data=" + JSON.stringify(carry_data)
    })

  },
  Yuyue: function () {
    wx.redirectTo({
      url: '/pages/order/myorderlist/myorderlist'
    })
  },
  /**
 * 撤销退货或退款
 */
  revocation: function (e) {
    let that = this;
    let refund_info = that.data.refund_info;
    let refund_records_id = refund_info.id;
    let ALl_data = that.data.ALl_data
    let order_id = ALl_data.order_id;
    let order_goods_id = that.data.ALl_data.order_goods_id;
    console.log(ALl_data);

    console.log(refund_info);
    console.log(refund_records_id);
    console.log(order_id)
    console.log(order_goods_id)


    app.sendRequest({
      url: 'api.php?s=order/orderGoodsCancels',
      data: {
        order_id: order_id,
        order_goods_id: order_goods_id,
        refund_records_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if (data > 0) {
            app.showBox(that, '操作成功');
            that.Yuyue();
            that.getRefundInfo(that, order_goods_id);
          } else {
            app.showBox(that, '操作失败');
            app.restStatus(that, 'refundFlag');
          }
        }
      }
    });



  },

  /**
   * 买家退货
   */
  returnsGoods: function (e) {
    let that = this;
    let order_id = that.data.order_id;
    let order_goods_id = that.data.order_goods_id;
    let refund_express_company = that.data.refund_express_company;
    let refund_shipping_no = that.data.refund_shipping_no;
    let refund_reason = that.data.refund_detail.refund_reason;
    let returnsGoodsFlag = that.data.returnsGoodsFlag;
    let refund_info = that.data.refund_info;
    let refund_records_id = refund_info.id;

    if (returnsGoodsFlag == 1) {
      return false;
    }
    app.clicked(that, 'returnsGoodsFlag');
    if (refund_express_company == '') {
      app.showBox(that, '请输入物流公司');
      app.restStatus(that, 'returnsGoodsFlag');
      return false;
    }

    if (refund_shipping_no == '') {
      app.showBox(that, '请输入运单号');
      app.restStatus(that, 'returnsGoodsFlag');
      return false;
    }

    app.sendRequest({
      url: 'api.php?s=order/orderGoodsRefundExpresses',
      data: {
        order_id: order_id,
        order_goods_id: order_goods_id,
        refund_express_company: refund_express_company,
        refund_shipping_no: refund_shipping_no,
        refund_reason: refund_reason,
        refund_records_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if (data > 0) {
            app.showBox(that, '操作成功');
            that.getRefundInfo(that, order_goods_id);
          } else {
            app.showBox(that, '操作成功失败');
            app.restStatus(that, 'returnsGoodsFlag');
          }
        }
      }
    });
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