const app = getApp()
Page({
  data: {
    prompt: '',
    Base: '', //库路径
    defaultImg: {},
    index_notice: {}, //公告ist.goods_list
    goods_platform_list: {}, //标签板块
    block_list: {}, //楼层板块
    top10_list:{}, //top10
    coupon_list: {}, //优惠券
    discount_list: {}, //限时折扣
    current_time: 0, //当前时间
    timer_array: {}, //限时折扣计时
    search_text: '', //搜索内容
    mei_alls:'',
    userInfo: {},
    imageList:{},
    hasUserInfo: false,
    webSiteInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //轮播图属性
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
    indicatorColor: '#AAA',
    indicatorActiveColor: '#FFF',
    swiperHeight: 153,
    copyRight: {
      is_load: 1,
      default_logo: '/images/index/logo_copy.png',
      technical_support: '',
    },
    is_login: 1,
    maskStatus: 0,
      listClickFlag: 0,
      goBackIndexFlag: 0,
    noticeContentFlag: 0,
    exponent:''
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
    let that = this;
    let category_alias = "";
    wx.setNavigationBarTitle({
      title: category_alias,
    })
    that.webSiteInfo();
  },

  onShow: function(){
    let that = this;
    app.restStatus(that, 'listClickFlag');
    app.restStatus(that, 'noticeContentFlag');
    app.restStatus(that, 'goBackIndexFlag');
    app.sendRequest({
      url: "index.php?s=/api/index/getExtraImgList",
     data: {},
     success: function (res) {
       console.log(res)
       that.setData({
         database:res
       })
      
     }
    });
   
  },

    goBackIndex(){

        let that = this;
        let goBackIndexFlag = that.data.goBackIndexFlag;

        if (goBackIndexFlag == 1){
            return false;
        }
        app.clicked(that, 'goBackIndexFlag');
        wx.switchTab({
            //url: '/pages/index/coverindex/index',
            url: '/pages/index/index',
        });
    },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // let webSiteInfo = app.globalData.webSiteInfo;
    // console.log(webSiteInfo)
    return {
      title: 'BonnieClyde',
      path: 'pages/index/coverindex/coverindex',
      imageUrl: 'https://static.bonnieclyde.cn/750-607.jpg',
      success: function (res) {
        app.showBox(that, '分享成功');
      },
      fail: function (res) {
        app.showBox(that, '分享失败');
      }
    }



  },

  /**
   * 商品楼层图片加载失败
   */
  errorBlockImg: function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let key = e.currentTarget.dataset.key;
    console.log(key)
    let block_list = that.data.block_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = block_list[index].goods_list[key].pic_cover_big;

    if (defaultImg.is_use == 1){
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1){
        let parm_key = "block_list[" + index + "].goods_list[" + key + "].pic_cover_small";

        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 限时折扣图片加载失败
   */
  errorDiscountImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let discount_list = that.data.discount_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = discount_list[index].picture.pic_cover_small;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "discount_list[" + index + "].picture.pic_cover_small";
        
        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 页面跳转
   */
  listClick: function(event) {
    let that = this;
    console.log(111111)
    let url = event.currentTarget.dataset.url;
    let x = event.currentTarget.dataset.x;
    let hasTarget = event.currentTarget.dataset.has;
    let isBack = event.currentTarget.dataset.back;
    let listClickFlag = that.data.listClickFlag;

    console.log(hasTarget)
    if (isBack == 1) {
      that.tabBar()
    }


    if (hasTarget==0){
      return false;
}
    if (listClickFlag == 1){
      return false;
    }
    app.clicked(that, 'listClickFlag');

    wx.navigateTo({
      url: '/pages'+url,
    })
  },

  tabBar: function(event) {
  
   wx.switchTab({
     url: '/pages/index/index'
   })
  },

  /**
   * 输入框绑定事件
   */
  searchInput: function(event){
    let search_text = event.detail.value;
    this.setData({
      search_text: search_text
    })
  },

  /**
   * 领取优惠券
   */
  toReceivePopup: function (e) {
    let that = this;
    let coupon_type_id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let flag = true;
    let status = 1;


    if (flag) {
      app.sendRequest({
        url: 'api.php?s=goods/receiveGoodsCoupon',
        data: {
          coupon_type_id: coupon_type_id
        },
        success: function (res) {
          console.log(res)
          let code = res.code;
          let data = res.data;

          if (code == 0) {
            if (data > 0) {
              app.showBox(that, '领取成功');
            } else if (data == -2011) {
              app.showBox(that, '来迟了，已经领完了');
              status = 0;
            } else if (data == -2019) {
              app.showBox(that, '领取已达到上限');
              status = 0;
            } else {
              app.showBox(that, '未获取到优惠券信息');
              status = 0;
            }
            let d = {};
            let key = "coupon_list[" + index + "].status";
            d[key] = 0;

            that.setData(d);
          }
        }
      });
    }

    if (!flag) {
      let d = {};
      let key = "coupon_list[" + index + "].status";
      d[key] = 0;

      that.setData(d);
    }
  },

  /**
   * 计时
   */
  timing: function (that, timer_array, index) {
    let current_time = that.data.current_time;
    let count_second = (timer_array[index].end_time * 1000 - current_time) / 1000;
    //首次加载
    if (count_second > 0) {
      count_second--;
      //时间计算
      let day = Math.floor((count_second / 3600) / 24);
      let hour = Math.floor((count_second / 3600) % 24);
      let minute = Math.floor((count_second / 60) % 60);
      let second = Math.floor(count_second % 60);
      //赋值
      timer_array[index].day = day;
      timer_array[index].hour = hour;
      timer_array[index].minute = minute;
      timer_array[index].second = second;
      timer_array[index].end = 0;

      that.setData({
        timer_array: timer_array
      })
    } else {
      timer_array[index].end = 1;

      that.setData({
        timer_array: timer_array
      })
    }
    //开始计时
    let timer = setInterval(function () {
      if (count_second > 0) {
        count_second--;
        //时间计算
        let day = Math.floor((count_second / 3600) / 24);
        let hour = Math.floor((count_second / 3600) % 24);
        let minute = Math.floor((count_second / 60) % 60);
        let second = Math.floor(count_second % 60);
        //赋值
        timer_array[index].day = day;
        timer_array[index].hour = parseInt(hour) < 10 ? 0 + '' + hour : hour ;
        timer_array[index].minute = parseInt(minute) < 10 ? 0 + '' + minute : minute;;
        timer_array[index].second = parseInt(second) < 10 ? 0 + '' + second : second;;
        timer_array[index].end = 0;

        that.setData({
          timer_array: timer_array
        })
      } else {
        timer_array[index].end = 1;

        that.setData({
          timer_array: timer_array
        })
        
        clearInterval(timer);
      }
    }, 1000)
  },

  /**
   * 首页初始化
   */
  indexInit: function(that){
    let base = app.globalData.siteBaseUrl;
    let timeArray = {};

    app.sendRequest({
      url: 'api.php?s=index/getIndexData',
      data: {},
      success: function (res) {
        console.log(res)
        let code = res.code;
        let indicatorDots = true;
        if (code == 0) {
          let data = res.data;
          //当前时间初始化
          let current_time = data.current_time;
          that.setData({
            current_time: current_time
          })

          //广告轮播初始化
          if (data.adv_list != undefined && data.adv_list.adv_index != undefined && data.adv_list.adv_index.adv_list != undefined){
            let adv_index = data.adv_list.adv_index;
            let adv_list = adv_index.adv_list;

            if (adv_list.length == 1) {
              indicatorDots = false;
            }

            if (adv_index.is_use != 0){
              for (let index in adv_list){
                let img = adv_list[index].adv_image;
                adv_list[index].adv_image = that.IMG(img);
              }
            } else {
              adv_list = [];
            }

            that.setData({
              imgUrls: adv_list,
              swiperHeight: adv_index.ap_height
            })
          }else{
            that.setData({
              imgUrls: [],
            })
          }

          //优惠券初始化
          for (let index in data.coupon_list) {
            data.coupon_list[index].status = 1;
          }

          //限时折扣初始化
          let discount_list = data.discount_list.data;
          for (let index in discount_list) {
            let img = discount_list[index].picture.pic_cover_small;
            discount_list[index].picture.pic_cover_small = that.IMG(img);
            
            timeArray[index] = {};
            timeArray[index].end = 0;
            timeArray[index].end_time = discount_list[index].end_time;
            that.timing(that, timeArray, index);
          }

          //商品楼层图片处理
          console.log(data);
          let four_list = data.four_list;

          let block_list = data.block_list;
         
          let top_list = data.top_list;
          let small_sample_list = data.small_sample_list; 
          let  exponent=""



          for (let index in small_sample_list) {
            let img = small_sample_list[index].pic_cover_big;
            small_sample_list[index].pic_cover_small = that.IMG(img);
            small_sample_list[index].exponent = exponent
          }

          for (let index in top_list) {
            let img = top_list[index].pic_cover_big;
            exponent = (parseInt(top_list[index].material_black) + parseInt(top_list[index].material_black) + parseInt(top_list[index].effect_black))/3
            top_list[index].pic_cover_small = that.IMG(img);
            top_list[index].exponent = exponent
            that.setData({
              exponent: exponent
            })
          }

      
          for (let index in block_list) {
            for (let key in block_list[index].goods_list) {
              let img = block_list[index].goods_list[key].pic_cover_small;
              block_list[index].goods_list[key].pic_cover_small = that.IMG(img);
            }
          }
          let sqk_alls = data.block_list[0]
          let mei_alls = data.block_list[2].goods_list;
          console.log(mei_alls)
          that.setData({
            Base: base,
            indicatorDots: indicatorDots,
            index_notice: data.notice.data,
            goods_platform_list: data.goods_platform_list,
            sqk_alls:'',
            block_list: block_list,
            mei_alls: mei_alls,
            top_list: top_list,
            coupon_list: data.coupon_list,
            discount_list: discount_list,
            small_sample_list: small_sample_list,
            four_list: four_list ,
          });
        }
        console.log(res);
      }
    })
  },

  /**
   * 底部加载
   */
  copyRightIsLoad: function (e) {
    let that = this;

    app.sendRequest({
      url: "api.php?s=task/copyRightIsLoad",
      data: {},
      success: function (res) {
        console.log(res)
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let copyRight = data;
          copyRight.technical_support = '技术支持';
          copyRight.default_logo = '/images/index/logo_copy.png';

          if (copyRight.is_load == 0) {
            let img = copyRight.bottom_info.copyright_logo;
            copyRight.default_logo = that.IMG(img);
            copyRight.technical_support = copyRight.bottom_info.copyright_companyname;
          }
          
          that.setData({
            copyRight: copyRight
          })
        }
        console.log(res);
      }
    })
  },

  /**
   * 公告内容
   */
  noticeContent: function(e) {
    let that = this;
    let noticeContentFlag = that.data.noticeContentFlag;
    let id = e.currentTarget.dataset.id;

    if (noticeContentFlag == 1){
      return false;
    }
    app.clicked(that, 'noticeContentFlag');

    if (!id > 0){
      return false;
    }

    wx.navigateTo({
      url: '/pages/index/noticecontent/noticecontent?id=' + id,
    })
  },

  /**
   * 图片路径处理
   */
  IMG: function (img) {
    let base = app.globalData.siteBaseUrl;
    img = img == undefined ? '' : img;
    img = img == 0 ? '' : img;
    if (img.indexOf('http://') == -1 && img.indexOf('https://') == -1 && img != '') {
      img = base + img;
    }
    return img;
  },

  /**
   * 基础配置
   */
  webSiteInfo: function () {
    let that = this;

    app.sendRequest({
      url: "api.php?s=login/getWebSiteInfo",
      data: {},
      success: function (res) {
        console.log(res)
        let code = res.code;
        let data = res.data;
        if (code == 0) {

          that.setData({
            webSiteInfo: data
          })

          if (data.title != '' && data.title != undefined) {
            wx.setNavigationBarTitle({
              title: data.title,
            })
          }
        }
        console.log(res);
      }
    })
  },
})
