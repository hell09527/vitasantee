const app = new getApp();
// pages/payMembers/perfectInfo/perfectInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',  //等待标识
    check_man: true,  //性别单选按钮
    agreement:true,   //是否同意协议
    date:"",       //选择日期
    info_name:"",
    datetime: "",
    info_call: "",
    // tmp_mobile:'', //嫁接
    check:"1",
    second: 0, //计时
    sendCodeFlag: 0,
    notice_code:'' ,
    mobile_code:'',
    user_tel :'',
    datetime :0
  
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let goods_id = options.goods_id
    console.log(goods_id)
    let that=this
    // 完善资料
    wx.setNavigationBarTitle({
      title: "完善资料",
    })

    let member_money = options.member_money
      that.setData({
        goods_id: goods_id,
       member_money
       })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    app.sendRequest({
      url: "api.php?s=member/getMemberDetail",
      success: function (res) {
        let code = res.code;
        let data = res.data;
        let user_tel = data.user_info.user_tel
        console.log(user_tel)
        that.setData({
          user_tel
        })


      }
    })
  },

  // 所有单选事件
  checkAll:function(e){
    if (e.currentTarget.dataset.diff=="man"){
      let check=e.currentTarget.dataset.check
      console.log(check)
      this.setData({
        check
      })
      if (e.currentTarget.dataset.check == "1") {
        this.setData({
          check_man: true
        })
      } else {
        this.setData({
          check_man: false
        })
      }
    }

// 协议
    if (e.currentTarget.dataset.diff == "agreement") {
      this.setData({
        agreement: !this.data.agreement
      })
    }
  },

  // 日期选择

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      datetime: e.detail.value
    })
  },
  /**
 * 姓名
 */
  compellation(e) {
    "use strict";
    var temp = e.detail.value;
    this.setData({
      info_name: temp
    });
  },
  /**
* 手机号
*/
  cellPhone(e) {
    "use strict";
    var temp = e.detail.value;
    console.log(temp)
    this.setData({
      info_call: temp
    });
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

  // 协议
  toAgreement: function () {
    wx.navigateTo({
      url: '/pages/payMembers/argeement/argeement',
    })
  },
  /**
   * 发送验证码
   */
  sendCode: function (e) {
    let that = this;
    let tmp_mobile=''
    // 手机号
    let info_call = that.data.info_call
    
    // let new_mobile = that.data.new_mobile;
    let verification_code = that.data.notice_code;
    let key = app.globalData.key;
    let sendCodeFlag = that.data.sendCodeFlag;
    let user_tel = that.data.user_tel

    // if (info_call != '') {
    //   info_call = new_mobile == mobile ? mobile : new_mobile;
    // } else {
    //   info_call = new_mobile;
    // }
    if (user_tel ==""){
      if (info_call == '') {
        app.showBox(that, '手机号不可为空');
        app.restStatus(that, 'saveMobileFlag');
        return false;
      }
      let myreg = /^1(3|4|5|7|8)\d{9}$/;
      if (!myreg.test(info_call)) {
        app.showBox(that, '手机号式不正确');
        return false;
      }
      // info_call =tmp_mobile
      }else{

      if (info_call == '') {
        console.log(88888)
        info_call = user_tel
      }else{

        if (info_call == user_tel){
          info_call = user_tel
        }else{
          if (info_call == '') {
            app.showBox(that, '手机号不可为空');
            app.restStatus(that, 'saveMobileFlag');
            return false;
          }
          let myreg = /^1(3|4|5|7|8)\d{9}$/;
          if (!myreg.test(info_call)) {
            app.showBox(that, '手机号式不正确');
            return false;
          }
        }
        }
     
      
    }
  

    if (sendCodeFlag == 1) {
      return false;
    }
    app.clicked(that, 'sendCodeFlag');



    app.sendRequest({
      url: "api.php?s=member/sendBindCode",
      data: {
        mobile: info_call,
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
  // 测试  跳转会员支付成功页
  toPay: function () {
  let  that =this
  let goods_id = that.data.goods_id
  // 生日日期
  let datetime = that.data.datetime  

  let Time = datetime.valueOf();
  console.log(Time)
  // 手机号
  let info_call = that.data.info_call
  // 姓名
  let info_name = that.data.info_name
   //协议
  let agreement = that.data.agreement 
  //性别
  let check = that.data.check 

  //短信验证码
  let notice_code = that.data.notice_code

  let mobile_code = that.data.mobile_code

  let user_tel = that.data.user_tel
 
  if (info_name == '' || info_name.length < 1) {
    wx.showToast({
      title: '姓名必填',
      icon: 'none',
      image: '/images/pintuan/mask_layer_spelling_close.png',
      duration: 1200
    })
    return;
  }


  if (user_tel == "") {
    if (info_call == '') {
      app.showBox(that, '手机号不可为空');
      app.restStatus(that, 'saveMobileFlag');
      return false;
    }
    let myreg = /^1(3|4|5|7|8)\d{9}$/;
    if (!myreg.test(info_call)) {
      app.showBox(that, '手机号式不正确');
      return false;
    }
    // info_call =tmp_mobile
  } else {

    if (info_call == '') {
      console.log(88888)
      info_call = user_tel
    } else {

      if (info_call == user_tel) {
        info_call = user_tel
      } else {
        if (info_call == '') {
          app.showBox(that, '手机号不可为空');
          app.restStatus(that, 'saveMobileFlag');
          return false;
        }
        let myreg = /^1(3|4|5|7|8)\d{9}$/;
        if (!myreg.test(info_call)) {
          app.showBox(that, '手机号式不正确');
          return false;
        }
      }
    }


  }

   if (notice_code != mobile_code || mobile_code == '') {
      app.showBox(that, '短信验证码错误');
      app.restStatus(that, 'saveMobileFlag');
      return false;
    }
  // if (datetime == ''){
  //   app.showBox(that, '请选择生日日期');
  //   app.restStatus(that, 'saveAddressFlag');
  //   return;
  // }
  if (!agreement){
    app.showBox(that, '须同意协议');
    app.restStatus(that, 'saveAddressFlag');
    return;
   } 
  
  app.sendRequest({
    url: "api.php?s=order/vipOrderCreate",
    data:{
      goods_id: goods_id,
      user_tel:info_call,
      card_name: info_name,
      // user_tel: '18201710262',
      // card_name: "杨慧明",
      sex: check,
      birthday: Time,
      store_id:app.globalData.store_id,
      
    },
    success: function (res) {
      let code = res.code;
      let data = res.data;
      let out_trade_no = data.out_trade_no
      console.log(out_trade_no)
     //支付
      wx.navigateTo({
        url: '/pages/pay/getpayvalue/getpayvalue?present=2&&Ty=8&&out_trade_no=' + out_trade_no
      })


      // wx.navigateTo({
      //   url: '/pages/payMembers/paySuccess/paySuccess' 
      // })

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
  
  },
  

})