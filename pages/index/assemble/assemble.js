// pages/index/assemble/assemble.js
const app = getApp();
const data = require('../../../utils/tmp.js');
const SERVERS = require('../../../utils/servers.js');
const core = require('../../../utils/core.js');
const { calcDateTime, formatNumber } = require('../../../utils/util.js');
let timer = null;
Page({
  data: {
    title: '拼团',
    barIndex: '',//tabbar-index 底部tabbar列表
    bottomBarList: [{
      name: '拼团商品',
      title: '拼团'
    }, {
      name: '我的拼团'
    }], //顶部tab
    shopBarIndex: 0,
    shopBarList: [{
      title: '邀新团',
      btn: '一起团'
    }, {
      title: '普通团',
      btn: '拼团'
    }],
    shopList: [],//拼团商品列表
    mineList: [], //我的拼团列表
    tel: '',
    unregistered: '',
    assembeTypeState: '拼团',
    assembleStatusColor: ['', '', 'blue', 'gray'],
    assembleStatusList: ['待付款', '正在拼团', '拼团完成', '拼团失败'],
    assembleTypeList: ['', '普通团', '邀新团'],
    assembleBtnList: ['去付款', '邀请好友拼团', '查看我的订单', '已退款'],
    page: 1,
    // 其他
    isIphoneX: false,
    redirect: false
  },
  onLoad: function (options) {
    let that = this;
    that.setData({
      unregistered: app.globalData.unregistered,
      tel: app.globalData.user_tel || '',
      isIphoneX: app.globalData.isIphoneX
    });
    switch(options.show_status){
      case '1':
          that.tabbarChange(0);
          that.shopBarChange(1);
        break;
      case '2':
          that.shopBarChange(0);
          core.checkAuthorize('scope.userInfo').then(res => {
            wx.showLoading({
              title: '加载中...',
              mask: true
            });
            that.setData({ redirect: true });
            //首次不会执行token拿不到
            that.checkUserLoginState();
          }).catch(e => {
            that.tabbarChange(1);
          });
        break;
      case '0':
      default:
          that.tabbarChange(0);
          that.shopBarChange(0);
    }
  },
  onShow(){
    this.checkUserLoginState();
  },
  onUnload() {
    clearInterval(timer);
  },
  navigateTap(e) {
    if (e.detail) {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }else {
      wx.navigateBack();
    }
  },
  // 拼团商品tab切换
  shopBarChange(e) {
    let index;
    if(e instanceof Object){
      index = e.currentTarget.dataset.index;
    }else{
      index = e;
    }
    this.setData({
      shopBarIndex: index
    });
    // 初始化数据
    this.initData( 2 - index);
  },
  // 主页底部tabbar切换
  tabChangeClick(e) {
    let barIndex = e.currentTarget.dataset.index;
    this.tabbarChange(barIndex);
  },
  //tab切换
  tabbarChange(barIndex) {
    if((barIndex == 1)&&((this.data.unregistered == 1) || (this.data.tel == ''))){
      return wx.navigateTo({
        url: '/pages/member/resgin/resgin'
      });
    }
    let nextBar = this.data.bottomBarList[barIndex];
    this.setData({ barIndex, shopBarIndex: 0, page: 1 });
    switch(barIndex){
      case 0:
          
        break;
      case 1:
          this.initMineAssemble(); //初始化我的拼团
          this.initData(2); //初始化邀新团
        break;
    }
    this.setData({
      title: nextBar.title || nextBar.name
    })
  },
  // 初始化列表数据
  initData(type) {
    let that = this;
    if (timer) clearTimeout(timer);
    SERVERS.GOODS.pintuanGoodsList.post({
      page_index: that.data.page,
      page_size: 10,
      type
    }).then(res => {
      if (res.code == 0) {
        let shopList = that.data.shopList;
        let list = res.data.data.map(item => {
          item.pic_cover_small = item.picture.pic_cover_small;
          item.promote_price = Number(item.price*item.discount/10).toFixed(2);
          return item;
        });
        let page = that.data.page;
        if (that.data.page == 1) {
          shopList = list;
        } else {
          page++;
          shopList = shopList.concat(list);
        }
        that.setData({ shopList, page });
      }
      wx.stopPullDownRefresh();
    }).catch(e => console.log(e));
  },
  // 初始化我的拼团
  initMineAssemble(){
    let that = this;
    if(app.globalData.unregistered !== 0)return;
    clearInterval(timer);
    SERVERS.MEMBER.myPintuanList.post().then(res => {
      let { code, data } = res;
      if(code == 0){
        let mineList = data.map(i => {
          i.pic_cover_small = i.goods_picture.pic_cover_small;
          i.promote_price = i.price;
          i.sku_list = [{ sku_name: i.sku_name }];
          return i;
        });
        that.setData({ mineList });
        that.updateListTimer();
        wx.stopPullDownRefresh();
      }
    }).catch(e => console.log(e));
  },
  // 列表倒计时
  updateListTimer() {
    let list = this.data.mineList;
    this.setItemTimer(list);
    timer = setInterval(function () {
      this.setItemTimer(list);
    }.bind(this), 1000);
  },
  // 设置时间
  setItemTimer(list) {
    let mineList = list.map(item => {
      if (item.status == 1) {
        let tmp = calcDateTime(item.end_time);
        if(tmp){
          item.assemble_time_show = formatNumber(tmp.hour) + ':' + formatNumber(tmp.minute) + ':' + formatNumber(tmp.second);
        }else{
          item.assemble_time_show = '00:00:00';
        }
      }
      return item;
    });
    // 所有都结束后关闭定时器
    let isAllClose = mineList.every(i => i.assemble_time_show == '00:00:00');
    this.setData({ mineList });
    if(isAllClose)return clearInterval(timer);
  },
  // 按钮操作
  operate(e) {
    let { status, oid } = e.currentTarget.dataset;
    if (status != 2) return;
    wx.navigateTo({
      url: '/pages/order/orderdetail/orderdetail?id=' + oid
    });
  },
  // 拼团详情
  toGood(e) {
    let { id, ptid, suid } = e.currentTarget.dataset;
    let url = this.data.barIndex == 0 ? '/pages/goods/goodsdetail/goodsdetail' : '/pages/index/assembleInvite/assembleInvite';
    url += '?isAssemble=true';
    //从拼购进入
    if(id)url += '&goods_id=' + id; //商品id
    if(ptid)url += '&pt_goods_id=' + ptid; //拼团商品id
    if(suid)url += '&pt_startup_id=' + suid; //拼团记录id
    wx.navigateTo({ url });
  },
  // 开始团购
  assembeTap(e) {
    let  { id, ptid } = e.currentTarget.dataset;
    wx.navigateTo({ 
      url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + id + '&isAssemble=true&pt_goods_id='+ ptid
    }); //从拼购进入
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({ page: 1 });
    switch(this.data.barIndex){
      case 0:
          this.initData(2 - this.data.shopBarIndex);
        break;
      case 1:
        this.initMineAssemble();
        break;
    }
  },
  // 上啦加载
  onReachBottom: function () {
    this.setData({ page: this.data.page + 1 });
    switch(this.data.barIndex){
      case 0:
          this.initData(2 - this.data.shopBarIndex);
        break;
      case 1:
        // this.initMineAssemble();
        break;
    }
  },
  // 分享
  onShareAppMessage: function (e) {
    if(e.from != 'button'){
      return {};
    }else{
      return {
        title: '发现超值好物，邀请你一起拼团',
        path: '/pages/index/assembleInvite/assembleInvite?show_type=1&pt_startup_id=' + e.target.dataset.ptid,
        imageUrl: e.target.dataset.img
      }
    }
  },
  // 用户登录验证
  checkUserLoginState() {
    let that = this;
    if (app.globalData.token && app.globalData.token != '') {
      this.getUserInfo();
    } else {
      app.employIdCallback = employId => {
        if (employId != '') {
          this.getUserInfo();
        }
      }
    }
  },
  // 获取用户信息
  getUserInfo() {
    let that = this;
    console.log('getUserInfo');
    SERVERS.MEMBER.getMemberDetail.post().then(res => {
      let { code, data } = res;
      if (code == 0) {
        let tel = data.user_info.user_tel;
        app.globalData.is_vip = data.is_vip;
        app.globalData.distributor_type = data.distributor_type;
        app.globalData.uid = data.uid;
        app.globalData.vip_gift = data.vip_gift;
        app.globalData.vip_goods = data.vip_goods;
        that.setData({
          tel: tel,
          distributor_type: data.distributor_type,
          unregistered: app.globalData.unregistered,
          is_employee: data.is_employee
        });
        if (tel == '') {
          wx.navigateTo({
            url: '/pages/member/resgin/resgin',
          })
        }else{
          console.log('redirect:' + that.data.redirect);
          // 跳转到我的拼团
          if(that.data.redirect){
            that.tabbarChange(1);
            that.setData({ redirect: false });
          }
        }
      }
    }).catch(e => console.log(e));
  }
})