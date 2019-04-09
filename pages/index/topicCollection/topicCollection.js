const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '',
    defaultImg: {},
    brand_adv: {},
    goods_brand_list: {},
    brand_id: 0,
    // brand_select_index: 0,
    goods_list: {},
    img_height: '156px',
    page: 1,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
    indicatorColor: '#AAA',
    indicatorActiveColor: '#FFF',
    swiperHeight: 153,
    aClickFlag: 0,
    brind_id: '',
    brind_image: '',    //品牌顶部图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    app.sendRequest({
      url: 'api.php?s=index/top10Detail',
      data: {},
      success: function (res) {
        console.log(res.data);
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let goods_list = data.data;
          let brand_name = data.brand_name
          let brand_pic = data.icon
          wx.setNavigationBarTitle({
            title: brand_name
          })

          that.setData({
            goods_list: goods_list,
            brand_name: brand_name,
            brand_pic
          })
        }
        // console.log(res);
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.selectBrind();

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // wx.showShareMenu({
    //   withShareTicket: true
    // })
    let that = this;
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
            app.globalData.vip_overdue_time = data.vip_overdue_time
            // console.log(app.globalData.is_vip)
            that.setData({
              is_vip: is_vip,
              distributor_type
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
                app.globalData.vip_overdue_time = data.vip_overdue_time
                //  console.log(app.globalData.is_vip)
                that.setData({
                  is_vip: is_vip,
                  distributor_type
                })
              }
            }
          })
        }



      }
    }
    app.restStatus(that, 'aClickFlag');
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
    let that = this;
    let brand_name = that.data.brand_name
    let id = that.data.brind_id
    console.log(brand_name)
    console.log(id)

    // let data = {
    //   id: this.data.brind_id,
    //   pic: this.data.brind_image,
    //   title: this.data.title
    // }
    let uid = app.globalData.uid;
    if (app.globalData.distributor_type == 0) {
      return {
        title: brand_name,
        path: '/pages/goods/brandlist/brandlist?id=' + id,
        // imageUrl: imgUrl,
        success: function (res) {
          app.showBox(that, '分享成功');

        },
        fail: function (res) {
          app.showBox(that, '分享失败');
        }
      }
    } else if (app.globalData.distributor_type == 1) {
      return {
        title: brand_name,
        path: '/pages/goods/brandlist/brandlist?id=' + id + '&uid=' + uid + '&breakpoint=1',
        // imageUrl: imgUrl,
        success: function (res) {
          app.showBox(that, '分享成功');

        },
        fail: function (res) {
          app.showBox(that, '分享失败');
        }
      }
    } else if (app.globalData.distributor_type == 2) {
      return {
        title: brand_name,
        path: '/pages/goods/brandlist/brandlist?id=' + id + '&uid=' + uid + '&breakpoint=2',
        // imageUrl: imgUrl,
        success: function (res) {
          app.showBox(that, '分享成功');

        },
        fail: function (res) {
          app.showBox(that, '分享失败');
        }
      }
    } else if (app.globalData.distributor_type == 3) {
      return {
        title: brand_name,
        path: '/pages/goods/brandlist/brandlist?id=' + id + '&uid=' + uid + '&breakpoint=3',
        // imageUrl: imgUrl,
        success: function (res) {
          app.showBox(that, '分享成功');

        },
        fail: function (res) {
          app.showBox(that, '分享失败');
        }
      }
    }




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
  },

  /**
   * 选择品牌
   */
  // selectBrind: function(event) {
  //   let that = this;
  //   // console.log(that.brind_id )

  //   let brind_id = event.currentTarget.dataset.id;

  //   let index = event.currentTarget.dataset.index;

  //   that.setData({
  //     page: 1,
  //     brind_id: brind_id,
  //     brand_select_index: index
  //   })

  //   that.getBrandGoodsList(that, brind_id);
  // },

  /**
   * 图片加载获取高度
   */
  imgLoad: function (e) {
    let res = wx.getSystemInfoSync();
    let height = e.detail.height;
    let width = e.detail.width;
    let rate = width / height;
    let swiper_height = res.windowWidth / rate;

    this.setData({
      swiperHeight: swiper_height
    })
  },

  /**
   * 图片加载失败
   */
  goodsImgError: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let goods_list = that.data.goods_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = goods_list[index].pic_cover_small;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "goods_list[" + index + "].pic_cover_small";

        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 商品详情
   */
  aClick: function (event) {
    let that = this;
    let url = event.currentTarget.dataset.url;
    let aClickFlag = that.data.aClickFlag;
    let title = event.currentTarget.dataset.title;
    let types = event.currentTarget.dataset.types == 1 ? '大贸' : '跨境';
    let code = event.currentTarget.dataset.code;

    if (aClickFlag == 1) {
      return false;
    }
    app.clicked(that, 'aClickFlag');

    app.aldstat.sendEvent('品牌专区 ' + title + '(' + types + '-' + code + ')');
    wx.navigateTo({
      url: '/pages' + url,
    })
  }
})