const app = new getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
      name:'',//身份证姓名
      Idcard:'',//身份证号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let that=this;
    if (options.info){
        let Info = JSON.parse(options.info);
        console.log(Info.name)
        console.log(Info.issue)
        that.setData({
          name: Info.name,
          Idcard: that.plusXing(Info.issue, 1, 4),
        })
      }
   
    app.sendRequest({
      url: "api.php?s=distributor/outIdCardInfo",
      success: function (res) {
        let data = res.data;
        console.log(data);
        that.setData({
          name:data.real_name,
          Idcard: that.plusXing(data.idCard, 1, 4), 
        })
      
      }
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
  //再次验证
  againVerify:function(e){
    let In = e.currentTarget.dataset.in;
    if(In!="go"){
        wx.navigateTo({
            url: '/pages/member/verifierID/verifierID'
          })
      }else{
        wx.navigateTo({
            url: '/pages/member/withdrawal/withdrawal',
          })
    }
   
  },
 
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  plusXing (str, frontLen, endLen) {
    //console.log(str);
    var len = str.length - frontLen - endLen;
    var xing = '';
    for (var i = 0; i < len; i++) {
        xing += '*';
    }
    return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
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
