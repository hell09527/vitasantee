const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '',
    user_info: {},
    mobile: '',
    new_mobile: '',
    code: [], //验证码
    mobile_code: '', //短信验证码
    verification_code: '', //输入验证码
    notice_code: '', //输入短信验证码
    second: 0, //计时
    noticeMobile: 0, //短信通知是否开启
    codeMobile: 0,//验证码是否开启
    saveMobileFlag: 0,
    sendCodeFlag: 0,
    goods_id: '',
    cho: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let base = app.globalData.siteBaseUrl;
    
    if (options.cho) {
      that.setData({
        cho: options.cho,
        suffix: options.suffix,
      })
    }


    if (options.scene){
      var store_id= decodeURIComponent(options.scene);
      let goods_id='' 
      console.log("********内详情页store_id", store_id);
      app.globalData.store_id = store_id;
      that.setData({
         goods_id :1
       })
    }


    that.setData({
      Base: base,
     
    })


    if (app.globalData.token && app.globalData.token != '') {
      app.sendRequest({
        url: "api.php?s=member/getMemberDetail",
        data: {},
        success: function (res) {
          let code = res.code;
          let data = res.data;
          console.log(data, 'data ')
          if (code == 0) {
            that.setData({
              user_info: data.user_info,
              mobile: data.user_info.user_tel,
              new_mobile: data.user_info.user_tel,
            })
            console.log(that.data.goods_id)
            if (data.user_info.user_tel != '' && that.data.goods_id != '') {
              wx.switchTab({
                url: "/pages/member/member/member",
              })
            }

          }
        }
      })
      that.getNoticeConfig(that);
      that.getLoginVerifyCodeConfig(that);



    } else {
      app.employIdCallback = employId => {
        if (employId != '') {
          app.sendRequest({
            url: "api.php?s=member/getMemberDetail",
            data: {},
            success: function (res) {
              let code = res.code;
              let data = res.data;
              console.log(data, 'data ')
              if (code == 0) {
                that.setData({
                  user_info: data.user_info,
                  mobile: data.user_info.user_tel,
                  new_mobile: data.user_info.user_tel,
                })
                console.log(that.data.goods_id)
                if (data.user_info.user_tel != '' && that.data.goods_id != '') {
                  wx.switchTab({
                    url: "/pages/member/member/member",
                  })
                }

              }
            }
          })
          that.getNoticeConfig(that);
          that.getLoginVerifyCodeConfig(that);
        }



      }
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
  Baone:function(){
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 通知开启检测
   */
  getNoticeConfig: function (that) {
    app.sendRequest({
      url: "api.php?s=member/getNoticeConfig",
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(res);
        if (code == 0) {
          that.setData({
            noticeMobile: data.noticeMobile,
          })
        }
      }
    })
  },

  /**
   * 验证码开启检测
   */
  getLoginVerifyCodeConfig: function (that) {
    app.sendRequest({
      url: "api.php?s=member/getLoginVerifyCodeConfig",
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        console.log(res)

        if (code == 0) {
          let codeMobile = data.value.pc;
          if (codeMobile == 1) {
            app.verificationCode(that);
            let code = that.data.code;
            console.log(code);
          }
          
          that.setData({
            codeMobile: data.value.pc,
          })
        }
      }
    })
  },

  /**
   * 
   */

  /**
   * 输入手机号
   */
  inputMobile: function (e) {
    let that = this;
    let mobile = e.detail.value;

    that.setData({
      new_mobile: mobile
    })
  },

  /**
   * 输入验证码
   */
  verification_code: function (e) {
    let verification_code = e.detail.value;
    this.setData({
      verification_code: verification_code
    })
  },

  /**
   * 输入短信验证码
   */
  notice_code: function (e) {
    let notice_code = e.detail.value;
    this.setData({
      notice_code: notice_code
    })
  },

  /**
   * 切换验证码
   */
  switchVerificationCode: function (e) {
    let that = this;
    app.verificationCode(that);
  },

  /**
   * 发送验证码
   */
  sendCode: function (e) {
    let that = this;
    let mobile = that.data.mobile;
    let new_mobile = that.data.new_mobile;
    let verification_code = that.data.verification_code;
    let key = app.globalData.key;
    let sendCodeFlag = that.data.sendCodeFlag;
    if (new_mobile == mobile){
      app.showBox(that, '您没有修改手机号');
      return false;
    }

    if (mobile != '') {
      mobile = new_mobile == mobile ? mobile : new_mobile;
    } else {
      mobile = new_mobile;
    }

    if (mobile == '') {
      app.showBox(that, '手机号不可为空');
      app.restStatus(that, 'saveMobileFlag');
      return false;
    }
    
    let myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if (!myreg.test(mobile)) {
      app.showBox(that, '手机号式不正确');
      return false;
    }

    if (sendCodeFlag == 1) {
      return false;
    }
    app.clicked(that, 'sendCodeFlag');
    
    app.sendRequest({
      url: "api.php?s=member/sendBindCode",
      data: {
        mobile: mobile,
        'type': 'mobile',
        key: app.globalData.openid,
        vertification: verification_code
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;

        if (code == 0) {
          if (data.code == 0) {
            let second = 60;
            let timer = setInterval(function () {
              second--;
              that.setData({
                second: second
              })
              if (second == 0) {
                clearInterval(timer);
              }
            }, 1000)
            that.setData({
              mobile_code: data.params
            })
          }
          app.showBox(that, data.message);

          app.restStatus(that, 'sendCodeFlag');
        } else {
          app.restStatus(that, 'sendCodeFlag');
        }
      }
    })
  },

  /**
   * 保存手机号
   */
  saveMobile: function (e) {
    let that = this;
    let saveMobileFlag = that.data.saveMobileFlag;
    let mobile = that.data.mobile;
    let new_mobile = that.data.new_mobile;
    let codeMobile = that.data.codeMobile;
    let noticeMobile = that.data.noticeMobile;
    let code = that.data.code; //验证码
    let mobile_code = that.data.mobile_code; //短信验证码
    let verification_code = that.data.verification_code; //输入验证码
    let notice_code = that.data.notice_code; //输入短信验证码


    if (saveMobileFlag == 1) {
      return false;
    }
    app.clicked(that, 'saveMobileFlag');

    if (new_mobile == '') {
      app.showBox(that, '手机号不可为空');
      app.restStatus(that, 'saveMobileFlag');
      return false;
    }

    let myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if (!myreg.test(new_mobile)) {
      app.showBox(that, '手机号格式不正确');
      app.restStatus(that, 'saveMobileFlag');
      return false;
    }

    if (codeMobile == 1) {
      if (verification_code != code[0].code) {
        app.showBox(that, '验证码错误');
        app.restStatus(that, 'saveMobileFlag');
        return false;
      }
    }

    if (noticeMobile == 1) {
      if (notice_code != mobile_code || mobile_code == '') {
        app.showBox(that, '短信验证码错误');
        app.restStatus(that, 'saveMobileFlag');
        return false;
      }
    }

    if (new_mobile == mobile) {
      app.showBox(that, '与原手机号一致，无需修改');
      app.restStatus(that, 'saveMobileFlag');
      return false;
    }

    //验证手机号
    app.sendRequest({
      url: "api.php?s=login/mobile",
      data: {
        mobile: new_mobile
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
      
          if (data == true) {
            app.showBox(that, '该手机号已存在');
            app.restStatus(that, 'saveMobileFlag');
            return false;
          } else {

            that.save(that, new_mobile);
       
          }
        }
      }
    });
  },
  Back:function(){
    wx.switchTab({
      url: '/pages/index/index',
      
    })
  // wx.navigateTo({
  //   url: "/pages/member/excessive/excessive",
  // })
  },

  /**
   * 保存
   */
  /**
  * 保存
  */
  save: function (that, mobile) {

    let suffix = that.data.suffix;
    console.log(suffix)
    app.sendRequest({
      url: "api.php?s=member/modifymobile",
      data: {
        mobile: mobile
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if (data > 0) {
            if (that.data.cho == 1) {
              app.showBox(that, '完成页面');

              var pages = getCurrentPages();
              var currPage = pages[pages.length - 1];  //当前页面
              var prevPage = pages[pages.length - 3]; //上上一个页面
              //console.log(currPage, prevPage);

              if (prevPage.route == "pages/member/kolApply/kolApply") {
                //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
                wx.navigateTo({
                  url: "/pages/member/kolApply/kolApply?uid=" + app.globalData.recommendUser,
                })
              } else if (prevPage.route == "pages/goods/goodsdetail/goodsdetail") {
                //  商品详情页面
                wx.navigateTo({
                  url: "/pages/goods/goodsdetail/goodsdetail?goods_id=" + suffix,
                })
              } else if (prevPage.route == "pages/member/member/member") {
                //  个人中心页面
                wx.switchTab({
                  url: "/pages/member/member/member",
                })
              } else if (prevPage.route == "pages/goods/shareRepertoire/shareRepertoire") {
                //  购物清单页面
                wx.navigateTo({
                  url: "/pages/goods/shareRepertoire/shareRepertoire?share_li=" + suffix,
                })
              } else if (prevPage.route == "package/backPage/fetchGift/fetchGift") {
                //  领取礼物页面
                wx.navigateTo({
                  url: "/package/backPage/fetchGift/fetchGift?order_id=" + suffix,
                })
              }



            } else {
              wx.navigateTo({
                url: "/pages/member/excessive/excessive",
              })
            }


          } else {
            app.showBox(that, '操作失败');
            app.restStatus(that, 'saveMobileFlag');
            return false;
          }
        }
      }
    });
  }
})