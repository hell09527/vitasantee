const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    address_list:[],
    aClickFlag: 0,
    info:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    let info = options.info
    that.setData({
      info
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
    app.restStatus(that, 'aClickFlag');
    app.sendRequest({
      url: 'api.php?s=member/getmemberaddresslist',
      data: {},
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let address_list = res.data.data;
          console.log(address_list)
          for (let index in address_list) {
            address_list[index].address_info = address_list[index].address_info.replace(/&nbsp;/g, '　');
          }
          console.log(address_list)
          that.setData({
            address_list: address_list
          });
        }
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
   * 选择收货地址
   */
  selectAddress: function (event) {
    let that = this;

    let key = event.currentTarget.dataset.key;
    let address_id = event.currentTarget.dataset.id;
    let address_list = that.data.address_list;

    app.sendRequest({
      url: 'api.php?s=member/updateAddressDefault',
      data: {
        id: address_id
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          if (res.data > 0) {
            for (let i = 0; i < address_list.length; i++) {
              address_list[i].is_default = 0;
            }
            address_list[key].is_default = 1;
          }
          that.setData({
            address_list: address_list
          });

          var pages = getCurrentPages(); // 获取页面栈
          var prevPage = pages[pages.length - 2]; // 上一个页面
          if (prevPage.data.member_address){
            prevPage.setData({
              member_address: address_list[key]
            })
          }
          wx.navigateBack({
            delta: 1
          })
         
        }
      }
    })
  },

  /**
   * URL跳转
   */
  aClick: function (event) {
    let that = this;
    let url = event.currentTarget.dataset.url;
    let aClickFlag = that.data.aClickFlag;

    if (aClickFlag == 1) {
      return false;
    }
    app.clicked(that, 'aClickFlag');

    wx.navigateTo({
      url: '/pages' + url,
    })
  },
  daoefr: function () {
    let that = this;
    wx.chooseAddress({
      success: function (res) {
        app.sendRequest({
          url: 'api.php?s=member/addmemberlocaladdress',
          data: {
            consigner: res.userName,
            mobile: res.telNumber,
            phone: "",
            province: res.provinceName,
            zip_code: res.postalCode,
            city: res.cityName,
            district: res.countyName,
            address: res.detailInfo
          },
          success: function (res) {
            let code = res.code;
            if (code == 0) {

              app.showBox(that, '添加成功');
              setTimeout(function callBack() {
                wx.navigateBack({
                  delta: 1
                })
              }, 1700);
            }
          }
        })
        console.log(res)
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
      }
    })

  },
  /**
   * 删除地址
   */
  delAddress: function (event) {
    let that = this;

    let key = event.currentTarget.dataset.key;
    let address_id = event.currentTarget.dataset.id;
    let is_default = event.currentTarget.dataset.default;
    let address_list = that.data.address_list;

    if (is_default == 1) {
      app.showBox(that, '默认地址不能删除');
      return false;
    }

    app.sendRequest({
      url: 'api.php?s=member/memberAddressDelete',
      data: {
        id: address_id
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          if (res.data > 0) {
            address_list.splice(key, 1);
            app.showBox(that, '删除成功');
            that.setData({
              address_list: address_list
            });
          }
          if (res.data == -2007) {
            app.showBox(that, '当前用户默认地址不能删除');
          }
        }
      }
    })
  }
})
