// pages/order/protocol/protocol.js
const app = getApp();
var time = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_now:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  let that=this;
  let Pro= JSON.parse(options.Pro);
  let carry_datas=JSON.parse(options.data);
  that.setData({
    carry_datas
  })
          console.log(carry_datas);
   let   carry_data=carry_datas[0]
   let   refund_action= carry_data.refund_action;
    //  console.log(refund_action)
    // for (let index in refund_action){
    //   //时间格式转化
    //   refund_action[index].action_time  = time.formatTime(refund_action[index].action_time , 'Y-M-D h:m:s');
    // }
   
    //倒叙
    // refund_action.reverse();
 

 


  console.log(Pro);
 
  console.log(carry_data.refund_action)

  that.setData({
    Pro,
    carry_data:carry_data,
    refund_action:carry_data.refund_action,
  })

  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
    /**
   * 查看详情按钮
   */
 
  upspring:function(event){
   let  that=this;
   let  index= event.currentTarget.dataset.index;
   let Refund_type=that.data.carry_datas[index].refund_type;
   let  Refund_require_money=that.data.carry_datas[index].refund_require_money;
  
   let  Refund_shipping_company=that.data.carry_datas[index].refund_shipping_company;
   let  Refund_shipping_code=that.data.carry_datas[index].refund_shipping_code;
    let   Carry=that.data.carry_datas[index].refund_action;
    console.log(Refund_shipping_company)
  console.log(Carry)
  for (let index in Carry){
    //时间格式转化
    Carry[index].action_time  = time.formatTime(Carry[index].action_time , 'Y-M-D h:m:s');
  }

  console.log(Carry)
   that.setData({
    is_now:2,
    Carry,
    Refund_type,
    Refund_shipping_company,
    Refund_shipping_code,
    Refund_require_money

   })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})