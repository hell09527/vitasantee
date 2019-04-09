const app = new getApp();


Page({
  data:{
    Info:1
  }
,
  onLoad: function (option){
   let that=this

   let order_no = option.order_no
   console.log(order_no)
   app.sendRequest({
     url: "api.php?s=order/giftOrderDetail",
     data: {
       order_no
     },
     success: function (res) {
       if (res.code == 0) {
         let goodsInfo = res.data.order_goods
         let out_trade_no = res.data.out_trade_no
         let img = goodsInfo.user_headimg;
         let order_id = res.data.order_id
         let imgUrl = res.data.img03
         console.log(imgUrl)
         that.setData({
           order_id: order_id,
           out_trade_no: out_trade_no,
           imgUrl:imgUrl,
           goodsInfo
         })
       }

     }
   });
   
  },
  onShow: function (option){
    let that = this



    app.sendRequest({
      url: "api.php?s=order/getDefaultExpressAddress",
      success: function (res) {
        if (res.code == 0) {
          let Info = res.data

          console.log(that.data.addList)
          console.log(Info)
          that.setData({
            Info
          })
        }

      }
    });
  },
  bac: function () {

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
      url: '/pages/member/memberaddress/memberaddress?info=1'
    })
  },
  Backindex: function () {
    wx.switchTab({
      url: "/pages/index/index",
    })
  },
  // 确认保存
  affirmSave: function (event){
    let that = this
    let out_trade_no = that.data.out_trade_no
    let member_address=that.data.Info
    console.log(app.globalData.unionid)
    
    // console.log(member_address.uid)
    if (member_address == '' || member_address == null || member_address == undefined) {
      console.log(1111111)
      wx.showModal({
        content: '请先选择收货地址',
      })
      app.restStatus(that, 'commitOrderFlag');
      return false;
    }
    app.sendRequest({
      url: "api.php?s=order/giftGet",
      data:{
        order_id: that.data.order_id
      },
      success: function (res) {
        if (res.code == 0) {
          let Info = res.data

          app.sendRequest({
            url: 'api.php?s=order/pushGetGiftTemplate',
            data: {
              uid: app.globalData.unionid,
              out_trade_no:out_trade_no,
            },
            success(res){
              wx.navigateTo({
                url: "/pages/backPage/receiveSuccess/receiveSuccess",
              })
            }})
         

        
        }

      }
    });
  }

})