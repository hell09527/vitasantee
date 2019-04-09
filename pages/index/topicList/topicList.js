// pages/index/topicList/topicList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topicList:[
      {
        headImgUrl:'https://static.vitasantee.com/2A8BD77F-ADB4-4F6F-A55D-D405F17464BA@2x.png',
        name:'wennie',
        info:'内服美白产品推荐',
        title:'女人多用它洗脸，60岁都没皱纹，皮肤紧致白嫩，无惧岁月侵蚀，一直美～',
        imgUrl:'https://static.vitasantee.com/E9120CA3-DD5F-4667-9F55-E2B1633698E8@2x.png',
        isActive:true,
        data:'2019/1/4',
      },
      {
        headImgUrl: 'https://static.vitasantee.com/2A8BD77F-ADB4-4F6F-A55D-D405F17464BA@2x.png',
        name: 'wennie',
        info: '内服美白产品推荐',
        title: '女人多用它洗脸，60岁都没皱纹，皮肤紧致白嫩，无惧岁月侵蚀，一直美～',
        imgUrl: 'https://static.vitasantee.com/E9120CA3-DD5F-4667-9F55-E2B1633698E8@2x.png',
        isActive: false,
        data:'2019/1/5',
      },
      {
        headImgUrl: 'https://static.vitasantee.com/2A8BD77F-ADB4-4F6F-A55D-D405F17464BA@2x.png',
        name: 'wennie',
        info: '内服美白产品推荐',
        title: '女人多用它洗脸，60岁都没皱纹，皮肤紧致白嫩，无惧岁月侵蚀，一直美～',
        imgUrl: 'https://static.vitasantee.com/E9120CA3-DD5F-4667-9F55-E2B1633698E8@2x.png',
        isActive: false,
        data:'2019/1/6',
      },
    ],    //活动列表
    isNav:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;

    //  获取活动列表
    // app.sendRequest({
    //   url: "api.php?s=/Activity/activityList",
    //   data: {},
    //   method: 'GET',
    //   success: function (res) {
    //     for (let index in res.data) {
    //       let img = res.data[index].pic;
    //       res.data[index].pic = app.IMG(img);
    //     }

    //     that.setData({
    //       activities: res.data
    //     })
    //   }
    // });
  },

  // 跳转活动详情页
  toDetail: function (event) {
    wx.navigateTo({
      url: '/pages/index/projectIndex/projectIndex',
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

  // 收藏
  toCollect:function(e){
    var that = this;
    var active = this.data.topicList;
    var index = e.currentTarget.dataset.index;
    var isActive = 'topicList[' + index + '].isActive';
    console.log(!active[index].isActive, isActive)
    this.setData({
      [isActive]: !active[index].isActive
    })
  },

  // 导航点击
  navCheck:function(e){
    var that = this;
    var isNav = this.data.isNav;
    var index = e.currentTarget.dataset.index;
    this.setData({
      isNav:index,
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
    let that = this;
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
    let that = this;
    let data = this.data.data;
    let uid = app.globalData.uid;
    let projectData = that.data.projectData;
    let TWO_share_url = '/pages/index/topicList/topicList?data=' +JSON.stringify(projectData)
    console.log(data);
    if (that.data.distributor_type == 0) {
      return {
        title: 'BonnieClyde',	
        path: TWO_share_url,
        success: function (res) {
          app.showBox(that, '分享成功');
        },
        fail: function (res) {
          app.showBox(that, '分享失败');
        }
      }
    }
    else {
      return {
        title: 'BonnieClyde',
        path: TWO_share_url + '&uid=' + uid,
        success: function (res) {
          app.showBox(that, '分享成功');
        },
        fail: function (res) {
          app.showBox(that, '分享失败');
        }
      }
    }





  },
})