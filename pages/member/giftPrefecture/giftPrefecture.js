const app = new getApp();

Page({
  data: {
    isHint: 0,  //提示信息标识
    showModal: false, // 显示弹框的 cust
    isHide: 0,    //客服按钮是否影藏
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    //回调解决执行的先后顺序的问题
    if (app.globalData.token && app.globalData.token != '') {
      //判断是否是付费会员的接口
      app.sendRequest({
        url: "api.php?s=member/getMemberDetail",
        success: function (res) {
          let data = res.data
          if (res.code == 0) {
            let is_vip = data.is_vip
            let vip_gift = data.vip_gift
            let vip_goods = data.vip_goods;
            console.log(vip_goods)
            if (is_vip == 1) {
              if (vip_gift == 0) {
                that.showDialogBtn()
              } else {
                that.hideModal()
              }
            }
          }
        }
      });


    } else {

      app.employIdCallback = employId => {
        if (employId != '') {
          //判断是否是付费会员的接口

          app.sendRequest({
            url: "api.php?s=member/getMemberDetail",
            success: function (res) {
              let data = res.data
              if (res.code == 0) {
                let is_vip = data.is_vip
                let vip_gift = data.vip_gift
                let vip_goods = data.vip_goods;
                console.log(vip_goods)
                if (is_vip == 1) {
                  if (vip_gift == 0) {
                    that.showDialogBtn()
                  } else {
                    that.hideModal()
                  }
                }
              }
            }
          });
        }



      }
    }
    app.sendRequest({
      url: "/api.php?s=goods/getGiftList",
      data: {},
      success: function (res) {
        console.log(res)
        let shop = res.data.giftList
        let img1 = res.data.img1
        let img2 = res.data.img2
        let img3 = res.data.img4
        that.setData({
          img1: img1,
          img2: img2,
          img3: img3,
          shop
        })
        // console.log(that.data.shop)
      }
    })
  },

  /**
 * 页面跳转
 */
  listClick: function (event) {
    let that = this;
    let url = event.currentTarget.dataset.url;
    let listClickFlag = that.data.listClickFlag;
    let title = event.currentTarget.dataset.title;
    let types = event.currentTarget.dataset.types == 1 ? '大贸' : '跨境';
    let code = event.currentTarget.dataset.code;
    console.log('礼物专区 ' + title + '(' + types + ':' + code + ')')
    app.aldstat.sendEvent('礼物专区 ' + title + '(' + types + ':' + code + ')');
   
    // if (listClickFlag == 1) {
    //   return false;
    // }
    // app.clicked(that, 'listClickFlag');

    wx.navigateTo({
      url: '/pages' + url,
    })
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    let that=this
  },
  Back_to:function(){
    wx.switchTab({
       url: '/pages/index/index',
     })
  },
  Record: function () {
    wx.navigateTo({
      url: "/pages/member/givingRecords/givingRecords",
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let webSiteInfo = app.globalData.webSiteInfo;
    let title = '礼物专区';
    if (webSiteInfo.title != '' && webSiteInfo.title != undefined) {
      title = webSiteInfo.title;
    }
    wx.showShareMenu({
      title: title
    })
  },

  // 跳转专题活动详情页
  toProject: function () {
    let projectData = {
      id: 51,
      title: "礼物专区操作指南",
    }
    wx.navigateTo({
      url: '/pages/index/projectIndex/projectIndex?data=' + JSON.stringify(projectData),
    })
  },

  /**
     * 显示模态对话框
     */
  showDialogBtn: function () {
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
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {

    wx.navigateTo({
      url: '/pages/payMembers/goGivingGift/goGivingGift'
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
    this.setData({
      isHide: 0
    })
  },
})