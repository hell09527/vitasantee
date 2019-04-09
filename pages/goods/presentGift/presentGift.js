const app = new getApp();

Page({
  data:{
    is_share: 0, 
    order_no:"",
    order_id:"",
  },
    onLoad: function (options) {
      let that = this;
      let order_no  = options.order_no;
      // let is_vip = app.globalData.is_vip
     that.setData({
       order_no,
     })
    },
    onShow: function () {
      let that = this;
      app.sendRequest({
        url: "api.php?s=member/getMemberDetail",
        success: function (res) {
          let data = res.data
          if (res.code == 0) {
            let is_vip = data.is_vip;
              that.setData({
                is_vip
              })
          }
        }
      });
      
      app.sendRequest({
        url: '/api.php?s=order/giftOrderDetail',
        data: {
          order_no: that.data.order_no 
        },
        success: function (res) {
     if(res.code==0){
     let  GiftList=res.data.order_goods;
     let order_id = res.data.order_id;
     let img03 = res.data.img03;
     let out_trade_no = res.data.out_trade_no;

    //  console.log(GiftList)
     that.setData({
       GiftList: GiftList,
       img03: img03,
       out_trade_no: out_trade_no,
       order_id
     })

     }
        }
      });
     
    },
  Backgift:function(){
    let that = this
    let x = that.data.order_id
    console.log(x)
    // wx.navigateTo({
    //   url: "/pages/backPage/fetchGift/fetchGift?order_id=" + x,
    // })
   
    wx.navigateTo({
      url: "/pages/member/giftPrefecture/giftPrefecture"
    })
  },
  BackMember: function () {
    let that = this
    let x = that.data.order_id
    // console.log(x)
    // wx.navigateTo({
    //   url: "/pages/backPage/fetchGift/fetchGift?order_id=" + x,
    // })


    wx.navigateTo({
      url: "/pages/payMembers/memberZone/memberZone"
    })
  },
  songGift: function (event) {
    let that=this
    let out_trade_no = that.data.out_trade_no
    app.sendRequest({
      url: "api.php?s=order/giftGive",
      data: {
        order_id: that.data.order_id
      },
      success: function (res) {
        if (res.code == 0) {
          let Info = res.data

          app.sendRequest({
            url: 'api.php?s=order/getGiftTemplate',
            data: {
              openid: app.globalData.openid,
              formid: event.detail.formId,
              out_trade_no: out_trade_no,
              warn_type: 5,
            },
            success(res) {
            
            }
          })



        }

      }
    });
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {

        let that = this;
        let imgUrl = that.data.img03;
      
        // console.log(imgUrl)
        if (res.from === 'button') {
          // 来自页面内转发按钮
          // console.log(res.target)
        }
        let x = that.data.order_id;
        // console.log(x,111111111)
        let goods_info = that.data.goods_info;
     
        return {
            title:"您的好友赠予你一份礼物",
            path: '/pages/backPage/fetchGift/fetchGift?order_id='+x,
            imageUrl: imgUrl,
            success: function(res){
                app.showBox(that, '分享成功');
                wx.navigateTo({
                  url: "/pages/backPage/backPage",
                })

            },
            fail: function(res){
                app.showBox(that, '分享失败');
            }
        }

        let is_share = 0;

        that.setData({
            is_share: is_share
        })
    },
    /**
     * 分享
     */
    share: function(){
        let that = this;
        let is_share = 1;
        that.setData({
            is_share: is_share
        })
    },

    /**
     * 取消分享
     */
    cancleShare: function(){
        let that = this;
        let is_share = 0;

        that.setData({
            is_share: is_share
        })
    },
})