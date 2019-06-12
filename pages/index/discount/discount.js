const app = new getApp();
const SERVERS = require('../../../utils/servers.js');
const utils = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    seckillActive: 0, //已开启活动的id
    activeId: 0, //当前活动的id
    isActive: false, //当前活动是否开启
    discountList:[], //顶部秒杀列表
    discountGoods:[], //对应秒杀商品列表
    page: 1, //商品分页
    activityStatus: ['即将开始','抢购中','已关闭','已结束','明天开始','\n'],
    prompt: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.type || 1;
    wx.setNavigationBarTitle({
      title: type == 1?'限时折扣':'每日秒杀'
    });
      
    this.initTimeList();
  },
  // 提醒我
  remendMe(e){
    let seckill_goods_id = e.currentTarget.dataset.id;
    if(!app.globalData.token){
      return this.toResgin();
    }
    SERVERS.SECKILL.creatSeckillTemplate.post({
        open_id: app.globalData.openid,
        form_id: e.detail.formId,
        seckill_goods_id
    }).then(res => {
      if(res.code == 0){
        app.showBox(this, '预约提醒成功');
      }
    }).catch(e => console.log(e));
  },
  // 去登陆
  toResgin(){
    wx.navigateTo({
      url: '/pages/member/resgin/resgin'
    })
  },
  // 返回首页
  toHome:function(){
    wx.reLaunch({
      url: "/pages/index/index",
    })
  },
  //点击导航
  toCheck:function(e){
    let { id,index } = e.currentTarget.dataset;
    let page = 1;
    if(!id || id == this.data.activeId)return;
    let discountList = this.data.discountList;
    discountList = discountList.map((item,i) => {
      item.active = i == index;
      return item;
    });
    let isActive = discountList[index].status == 1;
    this.setData({ activeId:id ,discountList, isActive , page});
    this.initGoodsList(id);
  }, 
  //秒杀时间列表
  initTimeList(){
    let that = this;
    let limit = 1;
    app.asynRequest('promotion/seckillList').then(res => {
      if(res.code == 0){
        //数据处理(开始时间、开始时间排序、默认首个active)
        let active = 0;
        let isActive = false;
        let tmp = [];
        if(res.data.length > 0){
          res.data.forEach(item => {
            let temp = item.list.map((i,index) => {
              i.endTimeShow = i.time_slot_name.split('-')[0];
              i.active = i.status;
              if(i.status == 1)active = i.seckill_id;
              i = that.detailStateShow(i);
              return i;
            })
            tmp = tmp.concat(temp);
          });
          console.log(tmp);
          tmp.sort((a,b) => a.end_time - b.end_time);
          if(active == 0){
            tmp[0].active = 1;
            active = tmp[0].seckill_id;
          }else{
            isActive = true;
          }
          // if(tmp.length < limit){
          //   let lastTime = tmp.slice(-1)[0].start_time;
          //   for(var i = tmp.length;i<limit;i++){
          //     tmp.push({
          //       active: 0,
          //       status: 0,
          //       start_time: lastTime + i*60*60*2
          //     });
          //   }
          // }
        }
        that.setData({
          activeId: active,
          seckillActive: active,
          isActive: isActive,
          discountList: tmp
        });
        if(!tmp[0])return;
        // 初始化对应秒杀列表
        that.initGoodsList(tmp[0].seckill_id);
      }
    }).catch(e => console.log(e));
  },
  // 秒杀显示自定义
  detailStateShow(item){
    let now = parseInt(new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1).getTime()/1000);
    let dayAfter = now + 60*60*24;
    if(item.start_time > now){
      if(item.start_time < dayAfter){
        item.statusShow = '明天开始';
      }else{
        item.statusShow = utils.formatTime(item.start_time,'M-D');
      }
    }
    return item;
  },
  // 秒杀商品列表
  initGoodsList(seckill_id){
    let that = this;
    let params = {
      url: 'api.php?s=promotion/seckillGoodsList',
      data: {
        page_index: that.data.page,
        page_size: 10,
        seckill_id: seckill_id
      }
    }
    app.asynRequest(params).then(res => {
      if(res.code == 0){
        let discountGoods = that.data.discountGoods;
        let tmp = res.data.data.map(i => {
          // i.seckill_price = parseFloat(i.seckill_price);
          return i;
        });
        if(that.data.page > 1){
          discountGoods = discountGoods.concat(tmp);
        }else{
          discountGoods = tmp;
        }
        that.setData({ discountGoods });
      }
      wx.stopPullDownRefresh();
    }).catch(e => console.log(e));
  },
  //商品详情
  toDetail(e){
    let { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + id,
    });
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      page: 1
    });
    this.initGoodsList(this.data.activeId);
  },
  //上拉加载
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    });
    this.initGoodsList(this.data.activeId);
  },
  // 默认不执行时间冒泡拦截
  t:()=>{}
})