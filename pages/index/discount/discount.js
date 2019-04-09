const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    discountList:[
      {
        active:1,
      },
      {
        active: 0,
      },
      {
        active: 0,
      },
      {
        active: 0,
      },
      {
        active: 0,
      },
      {
        active: 0,
      }
    ],
    discountGoods:[
      {
        isHav:0,
      },
      {
        isHav: 1,
      },
      {
        isHav: 1,
      },
      {
        isHav: 1,
      },
      {
        isHav: 0,
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  //点击导航
  toCheck:function(e){
    var index = e.currentTarget.dataset.index
    var discountList = this.data.discountList;
    for (var i = 0; i < discountList.length; i++) {
      discountList[i].active = 0;
    }
    discountList[index].active = 1;
    this.setData({
      discountList,
    })
  }, 

  // 返回首页
  toHome:function(){
    wx.reLaunch({
      url: "/pages/index/index",
    })
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

})