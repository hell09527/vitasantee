const app = new getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
 
  },
  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {
    let that = this;
    let elment = app.globalData.discount

    that.setData({
      elment 
    })
  },

  listClick: function (event) {
    let that = this;
    let url= event.currentTarget.dataset.url;
    let car_id = event.currentTarget.dataset.cardid;
    let token = event.currentTarget.dataset.token;
    let price = event.currentTarget.dataset.price;
    let usefo = 1;

   
  

    wx.setStorage({
      key: 'key',
      data: {
        car_id: car_id,
        token: token,
        price: price,
        usefo: 1,
      },
    })  
  
    wx.navigateBack({
      delta: 1
    })
    // wx.navigateTo({
    //   url: '/pages' + url,
    // })
  },

  tabBar: function (event) {
    let url = event.currentTarget.dataset.url;
    wx.navigateTo({
      url: '/pages' + url,
    })
  },
})