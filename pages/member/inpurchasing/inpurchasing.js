const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    insideList:'',   //内购商品列表
    prompt:'',   //提示语
    page: 2,   //页数
    aClickFlag: 0,    //防止多次点击
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.hideShareMenu();
    app.sendRequest({
      url: "api.php?s=/goods/getInsideGoodsList",
      data: {
        page_index:1,
        page_size:10,
      },
      method: "POST",
      success: function (res) {
        let code = res.code;
        let data = res.data.data;
        console.log(code,data);
        if (code == 0) {
          let insideList=data;
          if (insideList.length==0){
            that.setData({
              prompt:'没有商品！',
            })
          } else {
            for (let index in insideList) {
              let img = insideList[index].pic_cover_small;
              insideList[index].pic_cover_small = app.IMG(img);
            }
            that.setData({
              insideList,
              page: 2,
            })
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.selectBrind();
  },

  // 点击事件
  aClick: function (event){
    let that = this;
    let url = event.currentTarget.dataset.url;
    let aClickFlag = that.data.aClickFlag;
    let code = event.currentTarget.dataset.code;

    wx.navigateTo({
      url: '/pages' + url,
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
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {

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
    let that = this;
    let insideList = that.data.insideList;
    let page = that.data.page;
    app.sendRequest({
      url: "api.php?s=/goods/getInsideGoodsList",
      data: {
        page_index: page,
        page_size: 10,
      },
      method: "POST",
      success: function (res) {
        let code = res.code;
        let data = res.data.data;
        console.log(code, data);
        if (data.length > 0) {
          page++;
          for (let index in data) {
            let img = data[index].pic_cover_small;
            data[index].pic_cover_small = app.IMG(img);
          }
          insideList = insideList.concat(data);
          that.setData({
            insideList,
            page,
          });
        }else{
          app.showBox(that, '没有商品了')
        }
      }
    })
  },
})