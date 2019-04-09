// pages/order/amendAdder/amendAdder.js
const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    originalAddress:{},   //原地址
    member_address:{},   //地址选择
    order_no: '',    //订单编号
    prompt: '',  //提示语
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var address = JSON.parse(options.address);
    var order_no=options.order_no;
    this.setData({
      originalAddress: address,
      order_no,
    })
  },

  // 跳转修改地址页面
  amendAddress: function () {
    wx.navigateTo({
      url: '/pages/member/memberaddress/memberaddress',
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
  },

  //提交修改
  toSubmit:function(){
    var that=this;
    var order_no = this.data.order_no;
    app.sendRequest({
      url: 'api.php?s=order/modifyOrderAddress',
      data: {
        order_no: order_no
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          that.setData({
            prompt: '修改成功'
          })
          setTimeout(function () {
            that.setData({
              prompt: ''
            })
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }else{
          that.setData({
            prompt: '商品已出库，不能修改地址'
          })
          setTimeout(function () {
            that.setData({
              prompt: ''
            })
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }
      }
    })
  },

  // 返回
  toBack:function(){
    wx.navigateBack({
      delta: 1
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})