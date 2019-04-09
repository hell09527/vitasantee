// pages/index/couponReceive/couponReceive.js
const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupon:{},   //优惠券
    tel: '',
    Choice: false,
    layout: false,
    unregistered: 1,
    prompt: '',  //提示语
    lickstick:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var uid =options.uid;
    console.log(11111,options,uid);
    var that = this;
    wx.hideShareMenu();
    
    // 优惠券列表获取
    app.sendRequest({
      url: "api.php?s=/member/getReceiveCouponDetail",
      data: {
        coupon_type_id:id
      },
      method: 'POST',
      success: function (res) {
        console.log(222222,res.data)
        var coupon = res.data;
        that.setData({
          coupon,
          id,
          uid,
        })
      }
    });

    //是否授权数据更新
    let updata = that.data.unregistered
    updata = app.globalData.unregistered;
    console.log(updata)

    that.setData({
      unregistered: updata,
    })


    if (app.globalData.token && app.globalData.token != '') {
      //判断是否是付费会员的接口
      app.sendRequest({
        url: "api.php?s=member/getMemberDetail",
        success: function (res) {
          let data = res.data
          if (res.code == 0) {
            let is_vip = data.is_vip
            app.globalData.is_vip = data.is_vip
            app.globalData.distributor_type = data.distributor_type
            let distributor_type = data.distributor_type
            app.globalData.uid = data.uid
            app.globalData.vip_gift = data.vip_gift
            app.globalData.vip_goods = data.vip_goods
            app.globalData.vip_overdue_time = data.vip_overdue_time;
            let tel = data.user_info.user_tel;
            console.log(tel)
            // console.log(app.globalData.is_vip)
            that.setData({
              is_vip: is_vip,
              tel: tel,
              distributor_type
            })
          }
        }
      })
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
                app.globalData.is_vip = data.is_vip
                app.globalData.distributor_type = data.distributor_type
                let distributor_type = data.distributor_type
                app.globalData.uid = data.uid
                app.globalData.vip_gift = data.vip_gift
                app.globalData.vip_goods = data.vip_goods
                app.globalData.vip_overdue_time = data.vip_overdue_time;
                let tel = data.user_info.user_tel;
                console.log(tel)
                that.setData({
                  is_vip: is_vip,
                  tel: tel,
                  distributor_type
                })
              }
            }
          })
        }
      }
    }
  },

  hideModal: function () {
    this.setData({
      showModal: false,
      Choice: false,
      layout: false,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**登录分支点*/
  Branch: function (e) {
    let _that = this;
    let branch = e.currentTarget.dataset.status;
    if (branch == "mobile") {
      _that.setData({
        layout: false,
        Choice: false
      })
      wx.navigateTo({
        url: '/pages/member/updatemobile/updatemobile?cho=1',
      })
    } else if (branch == "no") {
      _that.setData({
        Choice: false
      })
    }
  },

  /**触发*/
  Crossroad: function () {
    let _that = this;
    _that.setData({
      Choice: true
    })
  },

  //获取微信手机号
  getPhoneNumber: function (e) {
    let that = this;
    //判断是否容许获取微信手机号码
    if (e.detail.iv) {
      let setIv = e.detail.iv;
      let setEncryptedData = e.detail.encryptedData;
      that.setData({
        setIv: setIv,
        setEncryptedData
      })

      //判断是否继续弹出获取个人信息弹窗
      if (app.globalData.unregistered == 0) {
        wx.login({
          success: function (res) {
            let coco = res.code;
            app.sendRequest({
              url: 'api.php?s=Login/getWechatMobile',
              data: {
                code: coco,
                mobileEncryptedData: e.detail.encryptedData,
                mobileIv: e.detail.iv
              },
              success: function (res) {
                if (res.code == 0) {
                  that.setData({
                    tel: res.data.user_tel,
                    Choice: false
                  })
                }
              }
            });
          }
        })
      } else {
        that.setData({
          showModal: true,
          Choice: false
        })
      }
    }
  },

  //获取头像
  bindgetuserinfo: function (res) {
    let that = this;
    if (res.detail.iv) {
      let iv = res.detail.iv;
      let encryptedData = res.detail.encryptedData;
      app.globalData.iv = res.detail.iv;
      app.globalData.encryptedData = res.detail.encryptedData;
      app.globalData.unregistered = 0;
      console.log(res.detail.iv
      )
      console.log(res.detail.userInfo.avatarUrl)
      console.log(res.detail.userInfo.nickName)
      let heder_img = res.detail.userInfo.avatarUrl
      let wx_name = res.detail.userInfo.nickName
      let branch = res.currentTarget.dataset.status;
      this.setData({
        showModal: false,
        Choice: false
      })
      console.log(branch, 'branch ')
      if (branch == "mobile") {
        this.setData({
          layout: true,

        })
        wx.login({
          success: function (res) {
            let coco = res.code;
            app.sendRequest({
              url: 'api.php?s=Login/getWechatEncryptInfo',
              data: {
                code: coco,
                encryptedData: encryptedData,
                iv: iv
              },
              success: function (res) {
                if (res.code == 0) {
                  let lpl = res.data.token;
                  app.globalData.openid = res.data.openid;
                  app.globalData.token = res.data.token;
                  that.setData({
                    unregistered: 0,
                    wx_name: wx_name,
                    heder_img
                  })
                }
              }
            });
          }
        })
      } else {
        wx.login({
          success: function (res) {
            let coco = res.code;
            app.sendRequest({
              url: 'api.php?s=Login/getWechatEncryptInfo',
              data: {
                code: coco,
                encryptedData: encryptedData,
                iv: iv
              },
              success: function (res) {
                if (res.code == 0) {
                  let lpl = res.data.token;
                  app.globalData.openid = res.data.openid;
                  app.globalData.token = res.data.token;
                  that.setData({
                    unregistered: 0,
                    wx_name: wx_name,
                    heder_img
                  })
                  wx.login({
                    success: function (res) {
                      let coco = res.code;
                      app.sendRequest({
                        url: 'api.php?s=Login/getWechatMobile',
                        data: {
                          code: coco,
                          mobileEncryptedData: that.data.setEncryptedData,
                          mobileIv: that.data.setIv,
                          token: lpl
                        },
                        success: function (res) {
                          if (res.code == 0) {
                            that.setData({
                              unregistered: 0,
                              wx_name: wx_name,
                              tel: res.data.user_tel,
                              heder_img
                            })
                          }
                        }
                      });
                    }
                  })
                }
              }
            });
          }
        })
      }
    } else {
      this.setData({
        showModal: false,

      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    
  },

  // 领取优惠券
  toReceive:function(){
    var that=this;
    var id = this.data.id;
    var uid = this.data.uid;
    var coupon = this.data.coupon;
    console.log(coupon.coupon_type_id,uid),
    // 优惠券列表获取
    app.sendRequest({
      url: "api.php?s=/member/getReceiveCoupon",
      data: {
        coupon_type_id: coupon.coupon_type_id,
        uid:uid,
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        if(res.code==1){
          that.setData({
            prompt: '领取成功',
            lickstick: 2,
          })
        } else if (res.code == 0) {
          that.setData({
            prompt: '已到领取上限'
          })
        }else{
          that.setData({
            prompt: '优惠券已被领取完'
          })
        }
        setTimeout(function () {
          that.setData({
            prompt: ''
          })
        }, 1500)
      }
    });
  },

  // 返回首页
  backIndex:function(){
    wx.switchTab({
      url: "/pages/index/brand/brand",
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

})