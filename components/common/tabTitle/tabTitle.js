// components/common/tabTitle/tabTitle.js
/**
 * @description 默认自定义barTitle
 * 使用fixed定位, zIndex999, 会影响下拉刷新和部分层级冲突!!!
 *  */
Component({
  options: {
    multipleSlots: true
  },
  properties: {
    // 标题
    title:{
      type: String,
      value: ''
    }
  },
  data: {
    statusBarHeight: 20,
    barHeight: 64,
    isAndroid: false,
    stackOne: false
  },
  lifetimes: {
    attached: function () {
      let that = this;
      wx.getSystemInfo({
        success: res => {
          let data = {
            statusBarHeight: res.statusBarHeight,
            barHeight: that.getBarHeightFromPlaform(res.platform) + res.statusBarHeight,
            isAndroid: res.platform == 'android'
          };
          that.setData(data);
        }
      });
      that.setData({ stackOne: getCurrentPages().length == 1 });
    }
  },
  methods: {
    // 标题栏高度(实际需要加上状态栏高度)
    getBarHeightFromPlaform(platform){
      if(platform.indexOf('iPhone X') != -1){
        return 68;
      }else if(platform.indexOf('android') != -1){
        return 48;
      }else{
        return 44;
      }
    },
    // navigateTap
    navigateTap(){
      this.triggerEvent('navigateTap',this.data.stackOne);
    }
  }
})
