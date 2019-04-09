// pages/pay/paycallback/paycallback.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kolText:'',    //文本
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

    app.sendRequest({
      url: 'api.php?s=distributor/checkApply',
      data: {},
      success: function (res) {
        console.log(res);
        if (res.code == 2) {
          that.setData({
            kolText:'你已经是极选师',
          })
        } else if (res.code == 3) {
          that.setData({
            kolText: '资料正在审核中 请耐心等待',
          })
        }
      }
    })
  },

  toIndex:function(){
    wx.switchTab({
      url: '/pages/index/index',
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
})