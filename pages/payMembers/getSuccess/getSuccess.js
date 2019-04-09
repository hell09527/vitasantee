// pages/payMembers/getSuccess/getSuccess.js
const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isGift:2    //判断是否领取过礼物
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "领取成功",
    })
  },

  // 去送礼
  toGoGiving: function () {
    if (this.data.isGift == 1) {
      wx.navigateTo({
        url: "/pages/payMembers/goGivingGift/goGivingGift",
      })
    } else if (this.data.isGift == 2) {
      wx.navigateTo({
        url: "/pages/member/giftPrefecture/giftPrefecture",
      })
    }
  },

  // 去首页
  toIndex: function () {
    if (this.data.is_vip == 1) {
      wx.navigateTo({
        url: "/pages/payMembers/memberZone/memberZone",
      })
    } else if (this.data.is_vip == 0) {
      wx.switchTab({
        url: "/pages/index/index",
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

    // let vip_gift = app.globalData.vip_gift
    let that=this;
      app.sendRequest({
        url: "api.php?s=member/getMemberDetail",
        success: function (res) {
          let data = res.data
          if (res.code == 0) {
            let is_vip = data.is_vip
            let vip_gift = data.vip_gift
            if (vip_gift == 0) {
              that.setData({
                isGift: 1,
                is_vip
              })
            } else if (vip_gift == 1){
              that.setData({
                isGift: 2,
                is_vip
              })
            }
          }
        }
      });

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