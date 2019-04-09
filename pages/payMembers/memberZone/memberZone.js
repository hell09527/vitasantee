const app = new getApp();

Page({

  data: {
    vip_goods: 0, //是否领取会员赠送的商品
    showModal: false, // 显示弹框的 cust
    isHide: 0,    //客服按钮是否影藏
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    let that = this

    app.sendRequest({
      url: "api.php?s=member/getMemberDetail",
      success: function (res) {
        let data = res.data
        if (res.code == 0) {
          let is_vip = data.is_vip
          let vip_gift = data.vip_gift
          let vip_goods = data.vip_goods;
          // console.log(vip_goods)
          if (vip_goods == 0) {
            that.showDialogBtn()
          } else {
            that.hideModal()
          }
        }
      }
    });

    app.sendRequest({
      url: "api.php?s=goods/getVipGoodsList",
      data: {},
      success: function (res) {
        // console.log(res)
        let shop = res.data.vipGoodsList
        let img1 = res.data.img1
        that.setData({
          img1: img1,
          shop
        })
        // console.log(that.data.shop)

      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that=this
    //是否领取会员赠送的商品

  },
  /**
 * 页面跳转
 */
  listClick: function (event) {
    let that = this;
    let url = event.currentTarget.dataset.url;
    let listClickFlag = that.data.listClickFlag;

    // if (listClickFlag == 1) {
    //   return false;
    // }
    // app.clicked(that, 'listClickFlag');

    wx.navigateTo({
      url: '/pages' + url,
    })
  },
// custom start
    showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
    Back_to: function () {
      wx.switchTab({
        url: '/pages/index/index',
      })
    },
    Record: function () {
      wx.navigateTo({
        url: "/pages/member/giftPrefecture/giftPrefecture",
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
     * 弹出框蒙层截断touchmove事件
     */
    preventTouchMove: function () {

    },
    /**
     * 对话框取消按钮点击事件
     */
    onCancel: function () {
      this.hideModal();
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function () {

      wx.navigateTo({
        url: '/pages/payMembers/paySuccess/paySuccess'
      })
    },

    // 回首页
    toIndex:function(){
      wx.switchTab({
        url: '/pages/index/index'
      })
    },

    // 页面滚动事件//滑动开始事件
    handletouchtart: function (event) {
      this.setData({
        isHide: 1
      })
    },
    // 滑动移动事件
    handletouchmove: function () {
      this.setData({
        isHide: 1
      })
    },
    //滑动结束事件
    handletouchend: function (event) {
      // console.log(event, 222222)
      this.setData({
        isHide: 0
      })
    },
})