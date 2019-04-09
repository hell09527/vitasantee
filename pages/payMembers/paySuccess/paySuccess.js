const app = new getApp();
// pages/payMembers/paySuccess/paySuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',  //等待标识
    addList: 1,     //地址信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //
    wx.setNavigationBarTitle({
      title: "领取会员礼包",
    })
  },
  // 所有单选事件
  checkAll: function (e) {
    if (e.currentTarget.dataset.i) {
      // 选中的礼物的下标
      // let selected = 'giftList[' + index + '].selected';
      let index = e.currentTarget.dataset.i;
      console.log(index)
      // 先改变全部礼物都为不选中
      let giftList = this.data.giftList;
      for (let i = 0; i < giftList.length; i++) {
        // let selected = 'giftList[' + i + '].selected';
        giftList[0].selected = true;
        if (giftList[i].goods_id == index) {
          giftList[i].selected = true;
        } else {
          giftList[i].selected = false;
        }
        // this.setData({
        //   [selected]: false
        // })
      }
      // 改变选中的礼物
      this.setData({
        giftList: giftList,
        index 
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
  let that=this
  //赠送商品的列表
  app.sendRequest({
    url: 'api.php?s=goods/getVipGoodsList',
    data:{
      type:2,
    },
    success: function (res) {
      let code = res.code;
      let data = res.data;
      if (code == 0) {

        let giftList = data.vipGoodsList
        let img2=data.img2


        for (let i = 0; i < giftList.length; i++){
          giftList[i].selected=false
        }
        console.log(giftList)
        that.setData({
          giftList: giftList,
          img2
        })
      }
    }
  })

  app.sendRequest({
    url: 'api.php?s=order/getDefaultExpressAddress',
    success: function (res) {
      let code = res.code;
      let data = res.data;
      if (code == 0) {
       
        let Info = res.data
       
        
        that.setData({
          Info
        })
    
      }
    }
  })
  
  },
  /**
   * 收货地址
   */
  myAddress: function (event) {
    let that = this;
    let myAddressFlag = that.data.myAddressFlag;

    // if (myAddressFlag == 1) {
    //   return false;
    // }
    // app.clicked(that, 'myAddressFlag');

    wx.navigateTo({
      url: '/pages/member/memberaddress/memberaddress?info=2'
    })
  },
  Backindex: function () {
    wx.switchTab({
      url: "/pages/index/index",
    })
  },
  //确认领取
  verifyDraw:function(){
    let that=this
    console.log(app.globalData.store_id)
   let goods_id=that.data.index
   let Info = that.data.Info;

   if (goods_id == undefined){
     app.showBox(that, '您还没有选择商品');
      return false;
   }


   if (Info == '' || Info == null || Info == undefined) {
      app.showBox(that, '请先选择收货地址');
      app.restStatus(that, 'commitOrderFlag');
      return false;
    }

    app.sendRequest({
      url: 'api.php?s=order/vipGetGoodsOrder',
      data:{
        goods_id: goods_id,
        store_id: app.globalData.store_id
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
         
          wx.reLaunch({
            url: '/pages/payMembers/getSuccess/getSuccess'
          })

        }
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})