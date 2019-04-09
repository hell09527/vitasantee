// pages/index/skinCare/skinCare.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexCheck: 1,
    classCheck: 0,
    cartCheck: 0,
    userCheck: 0,
    //限时抢购
    category_list: [
      {
        text: '精选',
        select: 1,
        category_id: 1,
      },
      {
        text: '护肤',
        select: 2,
        category_id: 2,
      },
    ], 
    active: [
      {
        isActive: false,
      },
      {
        isActive: false,
      },
      {
        isActive: false,
      },
      {
        isActive: true,
      },
      {
        isActive: false,
      },
    ],     //商品列表
    titleList:[
      {
        name:'综合排序',
        select:1,
      },
      {
        name: '品牌类型',
        select: 1,
      },
      {
        name: '功效筛选',
        select: 1,
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  // 标题导航点击
  titleCheck: function (e) {
    var that = this;
    var list = this.data.titleList;
    var index = e.currentTarget.dataset.id;
    for (var i = 0; i < list.length; i++) {
      list[i].select = 1;
    }
    list[index].select = 2;
    this.setData({
      titleList: list
    })
  },

  // 点击收藏
  toCollect: function (e) {
    var that = this;
    var active = this.data.active;
    var index = e.currentTarget.dataset.index;
    var isActive = 'active[' + index + '].isActive';
    console.log(!active[index].isActive, isActive)
    this.setData({
      [isActive]: !active[index].isActive
    })
  },

  // 跳转搜索页
  toSearch: function () {
    if (this.data.searchVal != '') {
      wx.navigateTo({
        url: '/pages/goods/goodssearchlist/goodssearchlist?search_text=' + this.data.searchVal,
      })
    }
  },

  // 搜索
  searchInput: function (e) {
    var val = e.detail.value;
    console.log(e.detail.value);
    this.setData({
      searchVal: val
    })
  },

  // 商品标题点击
  selectCheck: function (e) {
    var id = e.currentTarget.dataset.id
    var category_list = this.data.category_list;
    for (var i = 0; i < category_list.length; i++) {
      category_list[i].select = 1;
      if (category_list[i].category_id == id) {
        category_list[i].select = 2;
      }
    }
    if (id == '精选') {
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }
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