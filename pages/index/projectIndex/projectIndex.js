// pages/index/projectIndex/projectIndex.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',  //等待标识
    actList:[],  //活动详情列表
    isHide: 0,        //客服按钮是否影藏
    showModal: false, // 显示弹框的 cust
    // is_login:1,
    activities: '',     //往期话题
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var scene = decodeURIComponent(options.scene)
    if (options.uid) {
      app.globalData.identifying = options.uid;
    }
  


    if (options.id){
      var id = options.id;
      var title = "专题活动";
      var data = {
        id:id,
        title: title
      };
    }else if(options.scene){
      var scene = decodeURIComponent(options.scene)
      var id = scene;
      var title = "专题活动";
      var data = {
        id: id,
        title: title
      };
    } else {
      var data = JSON.parse(options.data);
      var id = data.id;
      var title = data.title;
    }
    var that = this;
    let is_vip = app.globalData.is_vip
    // 专题页标题
    wx.setNavigationBarTitle({
      title: title,
    })
    that.setData({
      data: data,
      is_vip,
      title,
    })
    console.log(id)

    let timestamp = Date.parse(new Date);
    console.log(timestamp)
    let expiration = wx.getStorageSync('expiration');
    let ids = wx.getStorageSync('ids');
    console.log(expiration)
    let act_List = wx.getStorageSync('act_List');
    if (act_List && expiration > timestamp && ids == id) {
      console.log(111)
      that.setData({
        actList: act_List,
      });
    } else {
      console.log(222);
    }



    // 获取活动详情
    app.sendRequest({
      url: "api.php?s=/Activity/activityInfo",
      data: { master_id:id },
      success: function (res) {
        var new_actList=[];
        var actList= res.data.data
        for (var i = 0; i < actList.length;i++){
          if (actList[i].goods_info){
            new_actList.push(actList[i]);
          }
        }

        console.log(res);
        let timestamp = Date.parse(new Date);
        let expiration = timestamp + 3000000;
        wx.setStorageSync('act_List', actList);
        wx.setStorageSync('expiration', expiration);
        wx.setStorageSync('ids', id)
        that.setData({
          actList:actList,
          new_actList: new_actList,
          imgUrl: res.data.detail_pic
        })
      }
    });

    //  获取往期话题
    app.sendRequest({
      url: "api.php?s=/activity/hotTopic",
      data: { limit: 3 },
      method: 'POST',
      success: function (res) {
        console.log(res.data.data);

        that.setData({
          activities: res.data.data
        })
      }
    });

  },

  /**
   * 加入购物车
   */
  addCart: function (e) {
    let that = this;
    let goods_info = e.currentTarget.dataset.data;
    // let purchase_num = goods_info.purchase_num;
    let count = 1;

    let stock = parseInt(goods_info.stock);

    if (goods_info.state == 0) {
      app.showBox(that, '该商品已下架');
      return false;
    }

    if (goods_info.state == 10) {
      app.showBox(that, '该商品属于违禁商品，现已下架');
      return false;
    }




    let public_cart = ""
    if (this.data.is_vip == 1) {
      public_cart = goods_info.goods_info.vip_price
      // console.log(public_cart, 1111)
      let cart_detail = {
        shop_id: 0,
        shop_name: 'shopal',
        trueId: goods_info.goods_info.goods_id,
        goods_name: goods_info.goods_info.goods_name,
        count: count,
        select_skuid: that.data.sku_id,
        select_skuName: that.data.sku_info.sku_name,
        price: public_cart,
        cost_price: that.data.sku_info.cost_price,
        picture: goods_info.picture
      };
      cart_detail = JSON.stringify(cart_detail);

      app.sendRequest({
        url: 'api.php?s=goods/addCart',
        data: {
          cart_detail: cart_detail,
        },
        success: function (res) {
          let code = res.code;
          let data = res.data;
          if (code == 0) {
            if (data.code > 0) {
              app.showBox(that, '加入购物车成功')
              purchase_num = parseInt(purchase_num) + parseInt(count);
              let d = {};
              let parm = "goods_info." + purchase_num;
              d[parm] = purchase_num;

              that.setData(d);
              that.popupClose();
            } else {
              app.showBox(that, data.message)
            }
          }
        }
      });
    } else {
      public_cart = goods_info.promotion_price < goods_info.price ? goods_info.promotion_price : goods_info.price
      // public_cart = that.data.member_price
      // console.log(public_cart,2222)
      let cart_detail = {
        shop_id: 0,
        shop_name: 'shopal',
        trueId: that.data.goods_info.goods_id,
        goods_name: that.data.goods_info.goods_name,
        count: count,
        select_skuid: that.data.sku_id,
        select_skuName: that.data.sku_info.sku_name,
        price: public_cart,
        cost_price: that.data.sku_info.cost_price,
        picture: that.data.goods_info.picture
      };
      cart_detail = JSON.stringify(cart_detail);
      app.sendRequest({
        url: 'api.php?s=goods/addCart',
        data: {
          cart_detail: cart_detail,
        },
        success: function (res) {
          let code = res.code;
          let data = res.data;
          if (code == 0) {
            if (data.code > 0) {
              app.showBox(that, '加入购物车成功')
              purchase_num = parseInt(purchase_num) + parseInt(count);
              let d = {};
              let parm = "goods_info." + purchase_num;
              d[parm] = purchase_num;

              that.setData(d);
              that.popupClose();
            } else {
              app.showBox(that, data.message)
            }
          }
        }
      });

    }




  },

  // 跳转链接
  toLink: function (e) {
    let url = e.currentTarget.dataset.url;
    let is_vip = this.data.is_vip;
    let title = e.currentTarget.dataset.title;
    let id = e.currentTarget.dataset.id;
    let info = e.currentTarget.dataset.info;
    console.log(info,url)

    if (url == "全部商品") {
      wx.navigateTo({
        url: "/pages/goods/goodslist/goodslist",
      })
    } else if (url == "主页") {
      wx.switchTab({
        url: "/pages/index/index",
      })
    } else if (url == "礼品专区") {
      wx.navigateTo({
        url: "/pages/member/giftPrefecture/giftPrefecture",
      })
    } else if (url == "会员专区") {
      if (is_vip == 1) {
        wx.navigateTo({
          url: "/pages/payMembers/memberZone/memberZone",
        })
      } else {
        wx.navigateTo({
          url: "/pages/payMembers/payMember/payMember",
        })
      }
    } else if (typeof url == 'number' && url > 0) {
      wx.navigateTo({
        url: "/pages/goods/goodsdetail/goodsdetail?goods_id=" + url,
      })
    }  else if (info != undefined) {
      wx.navigateTo({
        url: "/pages/goods/goodsdetail/goodsdetail?goods_id=" + id + "&&goods_name=" + title,
      })
    } else if (url == "") {
      // console.log(8888)
      return;
    }else {
      wx.navigateTo({
        url: "/" + url,
      })
    }

  },

  // 跳转话题列表页
  toTopicList: function () {
    wx.navigateTo({
      url: '/pages/index/topicList/topicList',
    })
  },

// 跳转往期话题
  listClick: function (event) {
    let that = this;
    let projectData = {
      id: event.currentTarget.dataset.id,
      title: event.currentTarget.dataset.title,
    }
    // 跳转活动详情页
      wx.navigateTo({
        url: '/pages/index/projectIndex/projectIndex?data=' + JSON.stringify(projectData),
      })
  },
  /**
     * 隐藏模态对话框
     */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },

  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {
    let that = this;
    let data = this.data.data;
    let imgUrl = this.data.imgUrl?this.data.imgUrl:"";
    let uid = app.globalData.uid;
    let TWO_share_url = '/pages/index/projectIndex/projectIndex?data=' + JSON.stringify(data);
    console.log(data);
    if (that.data.distributor_type== 0){
      return {
        title: that.data.title,
        path: TWO_share_url,
        imageUrl: imgUrl,
        success: function (res) {
          app.showBox(that, '分享成功');
        },
        fail: function (res) {
          app.showBox(that, '分享失败');
        }
      }
    } 
    else {
      console.log(8888)
      return {
        title: that.data.title,
        path: TWO_share_url + '&uid=' + uid ,
        imageUrl: imgUrl,
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
TWO_reeuse:function(){
  let that = this;
  app.sendRequest({
    url: "api.php?s=member/getMemberDetail",
    success: function (res) {
      let data = res.data
      if (res.code == 0) {
        let is_vip = data.is_vip;
        app.globalData.is_vip = data.is_vip;
        app.globalData.distributor_type = data.distributor_type;
        let distributor_type = data.distributor_type;
        app.globalData.uid = data.uid;
        app.globalData.vip_gift = data.vip_gift;
        app.globalData.vip_goods = data.vip_goods;
        app.globalData.vip_overdue_time = data.vip_overdue_time;
        // console.log(app.globalData.is_vip)
        that.setData({
          is_vip: is_vip,
          distributor_type
        })
      }
    }
  })
},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that=this;
    if (app.globalData.token && app.globalData.token != '') {
      //判断是否是付费会员的接口
      that.TWO_reeuse();
    } else {
      app.employIdCallback = employId => {
        if (employId != '') {
          //判断是否是付费会员的接口
          that.TWO_reeuse();
        }

      }
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
  // 页面滚动事件//滑动开始事件
  handletouchtart: function (event) {
    this.setData({
      isHide: 1
    })
  },
  // 滑动移动事件
  handletouchmove: function () {
    this.setData({
      isHide: 1
    })
  },
  //滑动结束事件
  handletouchend: function (event) {
    // console.log(event, 222222)
    this.setData({
      isHide: 0
    })
  },

// 轮播滑动事件
  swiperChange: function (event){
    console.log(event.detail);
    // 选中的轮播图片的下标
    let index = event.detail.current;
    // 先改变全部轮播图片的isChange
    let imgUrls = this.data.imgUrls;
    for (let i = 0; i < imgUrls.length; i++) {
      if (i == index) {
        imgUrls[i].isChange = 1;
        if (imgUrls[i + 1]) {
          imgUrls[i + 1].isChange = 2;
        }
        if (imgUrls[i - 1]) {
          imgUrls[i - 1].isChange = 0;
        }
      }
    }

    this.setData({
      imgUrls: imgUrls,
    })
  },

})
