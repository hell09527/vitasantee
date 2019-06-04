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
    list:'',
    isShow:0,
    is_employee:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
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
    let that = this;

    //是否授权数据更新
    let updata = that.data.unregistered
    updata = app.globalData.unregistered;
    console.log(updata)

    that.setData({
      unregistered: updata,
    })

    console.log(app.globalData.token)
    let faceType = ['','小程序','门店','全渠道'];
    app.sendRequest({
      url: "api.php?s=/member/memberIsEmployee",
      data: {},
      method: 'POST',
      success: function (res) {
        console.log(res);
        var list = res.data.data;
        for (let index in list) {
          list[index].face_type_show = faceType[list[index].face_type || 3];
          list[index].money = parseInt(list[index].money);
          list[index].start_time = that.getDate(list[index].start_time);
          list[index].end_time = that.getDate(list[index].end_time);
        }
        that.setData({
          list,
          detail: res.data.envelope,
          to_route_type: res.data.to_route_type
        })
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
              distributor_type,
              is_employee: data.is_employee,
              uid: data.uid
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
                  distributor_type,
                  is_employee: data.is_employee,
                  uid: data.uid
                })
              }
            }
          })
        }
      }
    }
  },

  // 转换时间
  getDate:function(str){
    var oDate = new Date(str*1000),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate(),
      oHour = oDate.getHours(),
      oMin = oDate.getMinutes(),
      oSec = oDate.getSeconds(),
      oTime = oYear + '年' + this.getzf(oMonth) + '月' + this.getzf(oDay) + '日';//最后拼接时间
    return oTime;
  },

  //补0操作  
  getzf: function(num){
    if(parseInt(num) < 10){
      num = '0' + num;
    }
    return num;  
  },

  // 领取优惠券
  toReceive:function(){
    var that=this;
    var unregistered = this.data.unregistered;
    var tel = this.data.tel;
    var list = this.data.list;
    var to_route_type = this.data.to_route_type;
    var is_employee = that.data.is_employee;
    if (tel == '' || unregistered==1){
      wx.navigateTo({
        url: '/pages/member/resgin/resgin',
      })
    } else if (to_route_type==1){
      if (list=='首页'){
        wx.switchTab({
          url: '/pages/index/index',
        })
      }else{
        wx.navigateTo({
          url: '/' + list,
        });
      }
    } else if (is_employee==1){
      app.sendRequest({
        url: "api.php?s=/member/getRedEnvelope",
        data: {},
        method: 'POST',
        success: function (res) {
          console.log(res.data)
          if (res.code == 1) {
            that.setData({
              isEnvelope: 1
            })
          } else if (res.code == '-50') {
            that.setData({
              prompt: '仅限内部员工领取！'
            })
          } else if (res.code == '-20') {
            that.setData({
              prompt: '已过领取时段或暂无红包活动！'
            })
          } else if (res.code == '-30') {
            that.setData({
              prompt: '红包已经被领取完！'
            })
          } else if (res.code == '-10') {
            that.setData({
              prompt: '你已经领取过！'
            })
          }  else {
            that.setData({
              prompt: '领取失败'
            })
          }
          setTimeout(function () {
            that.setData({
              prompt: ''
            })
          }, 1500)
        }
      });
    }else{
      app.sendRequest({
        url: "api.php?s=/member/getReceiveCouponNew",
        data: {},
        method: 'POST',
        success: function (res) {
          console.log(res.data)
          if (res.code == 1) {
            that.setData({
              isShow: 1
            })
          } else {
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
    }
    // 优惠券列表获取
    
  },
  //取消
  toCancle:function(){
    this.setData({
      isShow: 0
    })
  },
  //回到首页
  toIndex:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  // 分享
  onShareAppMessage(){
    return {
      title: this.data.detail.title,
      path: '/pages/index/couponReceive/couponReceive',
      imageUrl: this.data.detail.img
    }
  }
})