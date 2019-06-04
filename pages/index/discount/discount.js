const app = new getApp();

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
    activityStatus: ['即将开始','抢购中','已关闭','已结束']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initTimeList();
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
    let discountList = this.data.discountList;
    discountList.map((item,i) => {
      item.active = Number(i == index);
      return item;
    });
    let isActive = id == this.data.seckillActive;
    this.setData({ activeId:id ,discountList, isActive });
    this.initGoodsList(id);
  }, 
  //秒杀时间列表
  initTimeList(){
    let that = this;
    app.asynRequest('promotion/seckillList').then(res => {
      if(res.code == 0){
        //数据处理(开始时间、开始时间排序、默认首个active)
        let active = 0;
        let tmp = res.data[0].list.map((i,index) => {
          i.endTimeShow = i.time_slot_name.split('-')[0];
          i.active = i.status;
          if(i.status == 1)active = i.seckill_id;
          return i;
        }).sort((a,b) => a.end_time - b.end_time);
        that.setData({
          activeId: active,
          seckillActive: active,
          isActive: true,
          discountList: tmp
        });
        // 初始化对应秒杀列表
        that.initGoodsList(tmp[0].seckill_id);
      }
    }).catch(e => console.log(e));
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
        let tmp = res.data.data;
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
  }
})