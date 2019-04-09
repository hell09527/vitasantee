// pages/backPage/receiveSuccess/receiveSuccess.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "领取成功",
    })
  },
  toNextPage:function(e){
    let i = e.currentTarget.dataset.i;
    if (i == 1) {
      wx.navigateTo({
        url: "/pages/member/giftPrefecture/giftPrefecture",
      })
    } else if (i == 2) {
      if (app.globalData.is_vip == 1) {
        wx.navigateTo({
          url: "/pages/payMembers/memberZone/memberZone",
        })
      } else {
        wx.switchTab({
          url: "/pages/index/index",
        })
      }
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