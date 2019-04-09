const app = new getApp();
Page({
data:{

},
onShow: function (){
  let that=this
  app.sendRequest({
    url: "api.php?s=member/getMemberDetail",
    success: function (res) {
      let data = res.data
      if (res.code == 0) {
        let is_vip = data.is_vip
          that.setData({
            is_vip
          })
      }
    }
  });
},
  backIndex: function () {
    let that = this
    if (that.data.is_vip == 1) {
      wx.navigateTo({
        url: "/pages/payMembers/memberZone/memberZone",
      })
    } else if (that.data.is_vip == 0){
      wx.switchTab({
        url: "/pages/index/index",
      })
    }
  
  },
  backGfit:function(){
    wx.navigateTo({
      url: "/pages/member/giftPrefecture/giftPrefecture",
    })
  },

})