// pages/pay/paycallback/paycallback.js
const app = getApp();
const core = require('../../../utils/core.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pt_startup_id: '',
    status: -1,
    order_no: '',
    type: 0,
    i: 0  //控制页面定时器
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let status = options.status
    let type = options.type;
    console.log(type)
    if (type == 1) {
      that.setData({
        i: 1,
        type
      })
    }
    let out_trade_no = options.out_trade_no;

    app.sendRequest({
      url: 'api.php?s=pay/getOrderNoByOutTradeNo',
      data: {
        out_trade_no: out_trade_no,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let tmpData = {
            status: status,
            order_no: data.order_no,
          }
          if(options.pt_startup_id&&options.pt_startup_id != 'undefined'){
            tmpData.pt_startup_id = options.pt_startup_id;
          }
          that.setData(tmpData);
        }
      }
    })
    if (this.data.i == 1 || this.data.type == 0) {
      this.task();
    } else {
      clearTimeout(that.task);
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
    // this.task();
    // this.setData({
    //   i:1,
    // })
  },

  task: function () {
    let that = this
    if (that.data.i == 1) {
      setTimeout(function () {
        let x = that.data.order_no
        wx.navigateTo({
          url: '/pages/goods/presentGift/presentGift?order_no=' + x
        })
      }, 800)
    } else {
      // setTimeout(function () {
      //   wx.switchTab({
      //     url: '/pages/member/member/member'
      //   })
      // }, 800)

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

  /**
   * 会员中心
   */
  toMemberHome: function () {
    if(this.data.pt_startup_id){
      wx.navigateTo({
        url: '/pages/index/assembleInvite/assembleInvite?pt_startup_id=' + this.data.pt_startup_id
      });
    }else{
      wx.switchTab({
        url: '/pages/member/member/member'
      });
    }
  },
  toPrefecture: function () {
    wx.switchTab({
      url: '/pages/member/member/member'
    })
    // wx.navigateTo({
    //   url: '/pages/goods/presentGift/presentGift?order_no=' + x
    // })
  },
  toMemberGift: function () {
    let that = this;
    let x = that.data.order_no
    wx.navigateTo({
      url: '/pages/goods/presentGift/presentGift?order_no=' + x
    })
    that.setData({
      i: 2
    })
  }
})