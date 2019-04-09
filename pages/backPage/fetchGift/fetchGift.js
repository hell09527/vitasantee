const app = new getApp();


Page({
  data:{
    order_id:"",
    order_no:"",
    unregistered: 1,
    tel: '',
    Choice: false,
    layout: false,
  },
  onLoad: function (option) {
    let that=this
    let order_id = parseInt(option.order_id);
    that.setData({
      order_id
    })
  },
  triumph:function(){
    let that=this

    let order_no = that.data.order_no
    wx.navigateTo({
      url: "/pages/backPage/giveSend/giveSend?order_no=" + order_no,
    })
  } ,
  onShow:function(){
    let that=this;
    let order_id = this.data.order_id;

    //是否授权数据更新
    let updata = that.data.unregistered
    updata = app.globalData.unregistered;
    console.log(updata)

    that.setData({
      unregistered: updata,
    })

    let order_status =11;
    that.setData({
      order_status: order_status,
    })
    app.sendRequest({
      url: "api.php?s=order/giftGetDetail",
      data: {
        order_id
      },
      success: function (res) {
        if (res.code == 0) {
          //是否授权数据更新
          console.log(app.globalData.unregistered)
          //是否授权数据更新
          let updata = that.data.unregistered
          updata = app.globalData.unregistered;
          console.log(updata)

          that.setData({
            unregistered: updata,
          })
          let goodsInfo = res.data
          let img = goodsInfo.user_headimg;
          let order_status = goodsInfo.order_status;
          console.log(order_status,'order_status')

          goodsInfo.user_headimg = app.IMG(img); //图片路径处理
          let order_no = res.data.order_no
          let imgUrls = res.data.img03
          that.setData({
            order_status: order_status,
            order_no: order_no,
            imgUrls: imgUrls,
            goodsInfo
          })
        }
      }
    });
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
  Backindex:function(){
    // wx.switchTab({
    //   url: "/pages/index/index",
    // })
    wx.navigateTo({
      url: "/pages/member/giftPrefecture/giftPrefecture"
    })
  },
  hideModal: function () {
    this.setData({
      showModal: false,
      Choice: false,
      layout: false,
    })},
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
      if (that.data.unregistered == 0) {
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

    } else {

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
})