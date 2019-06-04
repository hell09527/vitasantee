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
    // goods_list: {},
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
    brind_id:'',
    brind_image:'',    //品牌顶部图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let brind_id = options.id;
    if (options.uid) {
      app.globalData.identifying = options.uid;
      app.globalData.breakpoint = options.breakpoint;
      console.log(options.breakpoint);
    }
 
    let base = app.globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;
    console.log(options.id);
    if (options.id){
          console.log(11111);
      let brind_id = options.id;
      that.setData({
        Base: base,
        defaultImg: defaultImg,
        brind_id: brind_id,
        //  brind_image,
        //  title,
      })
      that.getBrandGoodsList(that, brind_id);
    } else if (options.scene) {
      console.log(2222)
      var scene = decodeURIComponent(options.scene);
      let brind_id = scene.split('&')[0];
      let kol_id= scene.split('&')[1];
      console.log("********品牌id", brind_id);
      console.log("********kol_id", kol_id);
      app.globalData.kol_id = kol_id;
   

      if (app.globalData.token && app.globalData.token != '') {
        //判断是否是付费会员的接口
        that.PP_reuse();
      } else {
        app.employIdCallback = employId => {
          if (employId != '') {
            //判断是否是付费会员的接口
            that.PP_reuse();
          }
        }
        
      }

      that.setData({
        Base: base,
        defaultImg: defaultImg,
        brind_id: brind_id,
        //  brind_image,
        //  title,
      })
      that.getBrandGoodsList(that, brind_id);
    } 

    if (app.globalData.token && app.globalData.token != '') {
      //判断是否是付费会员的接口
      that.PP_reuse();
    } else {
      app.employIdCallback = employId => {
        if (employId != '') {
          //判断是否是付费会员的接口
          that.PP_reuse();
        }
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.selectBrind();
  },
PP_reuse:function(){
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
        let  updata = app.globalData.unregistered;
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
    // wx.showShareMenu({
    //   withShareTicket: true
    // })
    let that = this;
    if (app.globalData.token && app.globalData.token != '') {
      //判断是否是付费会员的接口
      that.PP_reuse();
    } else {
      app.employIdCallback = employId => {
        if (employId != '') {
          //判断是否是付费会员的接口
          that.PP_reuse();
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
    let that=this;
    let brand_name =that.data.brand_name;
    let id = that.data.brind_id;
    console.log(brand_name);
    console.log(id);
    
    // let data = {
    //   id: this.data.brind_id,
    //   pic: this.data.brind_image,
    //   title: this.data.title
    // }
    let uid = app.globalData.uid;
    let PP_share_url = '/pages/goods/brandlist/brandlist?id=' + id;
    if (app.globalData.distributor_type == 0){
      return {
        title: brand_name,
        path: PP_share_url,
        // imageUrl: imgUrl,
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
        title: brand_name,
        path: PP_share_url + '&uid=' + uid,
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
    let brand_id = that.data.brind_id;
    let goods_list = that.data.goods_list;
    let page = that.data.page;
    let new_brand_id = brand_id

    app.sendRequest({
      url: 'api.php?s=goods/getBrandGoodsList',
      data: {
        brand_id: new_brand_id,
        page: page
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let parm = {};
          let parm_key = '';
          let new_goods_list = data.data;

          if (new_goods_list[0] != undefined){
            page++;
            for (let index in new_goods_list){
              let key = parseInt(goods_list.length) + parseInt(index);
              let img = new_goods_list[index].pic_cover_small;
              new_goods_list[index].pic_cover_small = app.IMG(img);
              // parm_key = 'goods_list[' + key + ']';
              // parm[parm_key] = new_goods_list[index];
            }
            goods_list = goods_list.concat(new_goods_list);
            
            that.setData({
              goods_list,
            });
          }

          that.setData({
            page: page,
          })
        }
        console.log(res);
      }
    });
  },
  /**
   * 收藏
   */
  toCollect: function (e) {
    let that = this;
    let goodsList = that.data.goods_list;
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    var index = e.currentTarget.dataset.index;
    let is_fav = goodsList[index].is_member_fav_goods;
    let method = is_fav == 0 ? 'FavoritesGoodsorshop' : 'cancelFavorites';
    let message = is_fav == 0 ? '收藏' : '取消收藏';
    is_fav = is_fav == 0 ? 1 : 0;
    goodsList[index].is_member_fav_goods = is_fav;

    app.sendRequest({
      url: 'api.php?s=member/' + method,
      data: {
        fav_id: id,
        fav_type: 'goods',
        log_msg: name
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if (data > 0) {
            app.showBox(that, message + '成功');

            that.setData({
              goods_list: goodsList
            })
          } else {
            app.showBox(that, message + '失败');
          }
        }
      }
    });
  },

  /**
   * 获取品牌商品
   */
  getBrandGoodsList: function (that, new_brand_id) {
  
    let brand_id = that.data.brind_id;
    console.log(brand_id)
   
    app.sendRequest({
      url: 'api.php?s=goods/getBrandGoodsList',
      data: {
        brand_id: brand_id,
        page: 1
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let goods_list = data.data;
          let brand_name = data.brand_name
          let brand_pic = data.brand_pic
          wx.setNavigationBarTitle({
            title:brand_name
          })


          for(let index in goods_list){
            let img = goods_list[index].pic_cover_small;
            goods_list[index].pic_cover_small = app.IMG(img);
          }

          that.setData({
            page: 2,
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
  goodsImgError: function(e){
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
  // 跳转商品详情页
  toGood: function (event) {
    let that = this;
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + id,
    })
  }
})