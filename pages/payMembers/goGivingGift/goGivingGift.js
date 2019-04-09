const app = new getApp();
// pages/payMembers/paySuccess/paySuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',  //等待标识
    addList: 1,     //地址信息
    showModal: false, // 显示弹框的 cust
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //
    wx.setNavigationBarTitle({
      title: "赠送礼物",
    })
  },
  // 所有单选事件
  checkAll: function (e) {
    if (e.currentTarget.dataset.i) {
      // 选中的礼物的下标
      let index = e.currentTarget.dataset.i;
      // 先改变全部礼物都为不选中
      let giftList = this.data.giftList;
      for (let i = 0; i < giftList.length; i++) {
        if (giftList[i].goods_id == index) {
          giftList[i].selected = true;
        } else {
          giftList[i].selected = false;
        }
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


  // custom start
  showDialogBtn: function () {
    let that = this
    let goods_id = that.data.index

    if (goods_id == undefined) {
      app.showBox(that, '您还没有选择商品');
      return false;
    }

    this.setData({
      showModal: true
    })
  },
  /**
     * 隐藏模态对话框
     */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    app.sendRequest({
      url: 'api.php?s=goods/getGiftList',
      data:{
      type:2,
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let giftList = data.giftList
          let img3=data.img3

          for (let i = 0; i < giftList.length; i++) {
            giftList[i].selected = false
          }
          console.log(giftList)
          that.setData({
            giftList: giftList,
            img3
           
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
  // 领取礼物
  toGift: function () {
    let that = this
    let goods_id = that.data.index

    app.sendRequest({
      url: 'api.php?s=order/vipGetGiftOrder',
      data: {
        goods_id: goods_id,
        store_id: app.globalData.store_id
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let order_no = res.data.order_no
          console.log(order_no)
          wx.reLaunch({
            url: '/pages/goods/presentGift/presentGift?order_no=' + order_no
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