// pages/index/brand/brand.js
const SERVERS = require('../../../utils/servers.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_category_list: {}, //商品分类列表
    goodsList:'',  //分类商品列表
    classifyLogo:'',    //分类logo
    firstIndex: 0,   //大类id
    listClickFlag: 0,
    brandList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let base = app.globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;

    that.setData({
      Base: base,
      defaultImg: defaultImg
    })
    SERVERS.GOODS.goodsClassificationList.post().then(res => {
      let code = res.code;
        let data = res.data;
        if (code == 0) {
          let goods_category_list = data.goods_category_list;
          let show_type = data.show_type;

          that.setData({
            show_type: show_type
          })

          for (let index in goods_category_list) {
            goods_category_list[index].isSelect = false;
            //一级分类图片处理
            let first_img = goods_category_list[index].category_pic;
            goods_category_list[index].category_pic = app.IMG(first_img);

            //二级分类图片处理
            let second_list = goods_category_list[index].child_list;
            for (let key in second_list) {
              let second_img = second_list[key].category_pic;
              second_list[key].category_pic = app.IMG(second_img);

              //三级分类图片处理
              let third_list = second_list[key].child_list;
              for (let parm in third_list) {
                let third_img = third_list[parm].category_pic;
                third_list[parm].category_pic = app.IMG(third_img);
              }
              second_list[key].child_list = third_list;
            }

            let brand_list = goods_category_list[index].brand;
            for (let key in brand_list) {
              let brand_img = brand_list[key].brand_ads;
              brand_list[key].brand_ads = app.IMG(brand_img);
            }
            
            goods_category_list[index].child_list = second_list;

            let num = goods_category_list[index].num;
            if (num > 0) {
              let i = goods_category_list[index].child_list.length;
              for (i; i < num; i++) {
                goods_category_list[index].child_list[i] = {};
              }
            }
          }
          goods_category_list[0].isSelect = true;
          if (goods_category_list[0].child_list.length>0){
            that.setData({
              isNoGoods: false,
            })
          } else {
            that.setData({
              isNoGoods: true,
            })
          }
          that.setData({
            goods_category_list: goods_category_list,
            is_load: 1,
            goodsList: goods_category_list[0].child_list,
            brandList: goods_category_list[0].brand,
            firstIndex: goods_category_list[0].category_id,
          })
          wx.stopPullDownRefresh();
        }
    }).catch(e => console.log(e));
  },

  // 跳转搜索页
  toSearch: function () {
    var that=this;
    let listClickFlag = that.data.listClickFlag;
    if (listClickFlag == 1) {
      //防止多次点击
      return false;
    } else if (this.data.searchVal != '') {
      wx.navigateTo({
        url: '/pages/goods/goodssearchlist/goodssearchlist?search_text=' + this.data.searchVal,
      })
    }

    app.clicked(that, 'listClickFlag');
  },

  // 搜索
  searchInput: function (e) {
    var val = e.detail.value;
    // console.log(e.detail.value);
    this.setData({
      searchVal: val
    })
  },

  // 每个分类标题点击
  toSelect:function(e){
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    let list = this.data.goods_category_list;
    var goodsList = this.data.goodsList;
    var brandList = this.data.brandList;
    for(let i=0;i<list.length;i++){
      list[i].isSelect=false;
    }
    list[index].isSelect = true;
    goodsList = list[index].child_list;
    brandList = list[index].brand;
    if (goodsList.length>0){
      this.setData({
        isNoGoods: false,
      })
    } else {
      this.setData({
        isNoGoods: true,
      })
    }
    this.setData({
      goods_category_list:list,
      goodsList,
      brandList,
      firstIndex:id,
    })
  },

  // 分类详情
  toGood: function (event) {
    let that = this;
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/goodslist/goodslist?id=' + id + '&first_index=' + that.data.firstIndex,
    })
  },

  toBrand:function(e){
    let id = e.currentTarget.dataset.id
    let title = e.currentTarget.dataset.title;
    
    app.aldstat.sendEvent('品牌点击事件', {
      "品牌名称": title
    });
    wx.navigateTo({
      url: '/pages/goods/brandlist/brandlist?id=' + id,   //+'&store_id=1'
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
    var that = this;
    this.setData({
      search_text: '',
      isInput: 1,
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
    this.onLoad();
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
    let uid = app.globalData.uid;
    if (app.globalData.distributor_type == 0) {
      return {
        title: '品牌专区',
        path: '/pages/index/brand/brand',
        // imageUrl: imgUrl,
        success: function (res) {
          app.showBox(that, '分享成功');
        },
        fail: function (res) {
          app.showBox(that, '分享失败');
        }
      }
    } else {
      return {
        title: '品牌专区',
        path: '/pages/index/brand/brand?uid=' + uid ,
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


  // 页面滚动监听事件
  onPageScroll: function (event) {
  
  },

})