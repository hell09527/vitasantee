var aldstat = require("./utils/ald-stat.js");
var SERVERS = require('./utils/servers');
var core = require('./utils/core.js');

App({
  /**
 /a/dsa sadaswqwqewqkhhjhjhqqweqwewqewe  * 全局变量
   */
  globalData: {
    siteBaseUrl: "", //服务器url
    wx_info: null,
    encryptedData: '',
    iv: '',
    store_id: '0', //线下店铺id
    tokens: 0,
    max: 0,
    vip_overdue_time: '',//会员失效日期
    is_vip: 0,    //是否是付费会员
    breakpoint: 0,//判断分销来源(分享 0 1 2 3)
    distributor_type: 0,//判断是否是超级会员（0：默认；1：vip改价清单分享；2：KOL；3：店员）
    vip_goods: 0, //是否领取会员增送的礼品
    vip_gift: 0,  //是否领取会员赠送的商品
    uid: 0,    //获取会员的uid
    identifying: 0,//转发唯一标识 (// 这个字段是转发过后承载uid     identifying)
    kol_id: '0',//判断分销来源(扫码)
    scanCode: 0,//判断分销来源(扫码   // 这个字段是转发过后承载distributor_type )
    // session_key: '',
    // unionid:'',
    tab: "",
    openid: '',
    token: '',
    discount: '121',
    defaultImg: {
      is_use: 0
    },
    isIphoneX: false,
    netWorkType: 'none',
    userInfo: null,
    webSiteInfo: {
      title: '维美善特'
    },
    tab_parm: '',
    tab_type: '',
    copyRight: {//页面底部logo
      is_load: 1,
      default_logo: '',
      technical_support: '',
    },
    projectData: {},    //二级页参数
    unregistered: 0, //登录状态(已登录0,未登录1)
    recommendUser: '',   //惠选师推荐人
    traffic_acquisition_source: '',     //引流来源
    isGetUsering: false
  },
  //app初始化函数
  onLaunch: function () {
    let that = this,DEV = false, title = {
      dev: '卞如测试',
      pro: '维美善特'
    };
    // 请求初始化(默认开发模式)
    SERVERS.init(DEV);

    // 小程序名称
    that.globalData.webSiteInfo.title = title[DEV?'dev':'pro'];

    that.globalData.siteBaseUrl = SERVERS.getBase();
    //请求拦截函数
    SERVERS.interceptors.request = function (data) {
      wx.showLoading({
        title: '加载中...'
      });
      // token添加
      data.token = that.globalData.token;
      return data;
    };
    SERVERS.interceptors.response = function (res) {
      // 请求部分报错统一处理
      let { code, message } = res.data;
      if (code == -50) {
        if (message != '手机号已存在') {
          that.showModal({
            content: message,
          });
        }
      } else if (code == -10) {
        that.showModal({
          content: message,
          code: -10,
        });
      }
      return res.data;
    };
    // 请求完成(无论请求成功还是失败都将执行)
    SERVERS.interceptors.finally = function () {
      wx.hideLoading();
    }
    // 本地存储检测
    that.localStorageCheck();
    // 用户设备检测(统计)
    that.userDeviceDetect();
    // 请求数据
    core.wxApi('getNetworkType').then(res => {
      that.globalData.netWorkType = res.networkType;
      if(res.networkType != 'none'){
        that.loadData();
      }
    }).catch(e => console.log(e));
    
  },
  onShow: function () {
    let that = this;
    // 全局iphone X判断
    core.wxApi('getSystemInfo').then(res => {
      if (res.model.match("iPhone X")) {
        that.globalData.isIphoneX = true;
      }
    }).catch(e => console.log(e));
    // 开启网络监测
    that.netListener();
  },
  //loadData
  loadData() {
    let that = this;
    // 更新检查
    this.updateCheck();
    // 默认数据
    this.defaultImg();
    // that.webSiteInfo();//被注释原因未知
    this.copyRightIsLoad();
    this.loadTask();
    // 自动登录(如果已授权)
    return this.getwechatUserInfo();
  },
  // 用户网络监测
  netListener() {
    let that = this;
    wx.onNetworkStatusChange((res) => {
      console.log(res);
      // 断网提示
      if (!res.isConnected) {
        wx.showToast({
          icon: 'none',
          title: '网络连接已断开'
        });
      }
      // 之前断网并且现在已联网
      if (that.globalData.netWorkType == 'none' && res.isConnected) {
        let pages = getCurrentPages();
        console.log(pages.map(p => p.route))
        let stackTop = pages[pages.length - 1];
        // 防止首页多次请求getUserInfo导致解码失败(切的太快，，不需要重新获取，，直接刷新首页吧)
        if(that.globalData.isGetUsering)return reload(stackTop);
        // 网络重连后
        debounce(() => {
          that.loadData().then(res => {
            reload(stackTop)
          }).catch(() => reload(stackTop));
        },2000)();
        // 重载页面
        function reload(stackTop) {
          stackTop.onLoad(stackTop.options);
          stackTop.onShow();
        }
      }
      that.globalData.netWorkType = res.networkType;
    });
  },
  // 用户设备检测(统计用户调研)、、备用
  userDeviceDetect() {
    core.wxApi('getSystemInfo').then(res => {
      for (let key in core.systemInfo) {
        console.log(`${core.systemInfo[key]}: ${res[key]}`);
      }
    }).catch(e => console.log(e));
  },
  //登录检测(用户是否已授权(或者授权未过期) -> wx.login获取code -> wx.getUserInfo获取用户信息)
  getwechatUserInfo: function () {
    let that = this;
    return new Promise((resolve, reject) => {
      that.globalData.isGetUsering = true;
      core.checkAuthorize('scope.userInfo').then(core.wxApi).then(res => {
        that.globalData.code = res.code;
        return core.wxApi('getUserInfo');
      }).then(res => {
        that.globalData.isGetUsering = false;
        console.log('getUserInfo');
        console.log(res);
        that.setWxInfo(res.rawData);
        that.setEncryptedData(res.encryptedData);
        that.setIv(res.iv);
        return that.wechatLogin(); //自动登录或注册
      }).then(res => {
        resolve(res)
      }).catch(e => {
        that.globalData.unregistered = 1;
        that.globalData.isGetUsering = false;
        console.log(e);
        reject(e);
      });
    });

  },
  //微信登录(按钮)
  wechatLogin: function () {
    let that = this;
    let { code, store_id, encryptedData, iv } = that.globalData;
    return new Promise((resolve, reject) => {
      if (encryptedData == undefined || iv == undefined) {
        return reject(null);
      }
      // 登录接口
      SERVERS.LOGIN.getWechatEncryptInfo.post({
        code: code,
        encryptedData: encryptedData,
        iv: iv,
        store_id
      }).then(res => {
        let code = res.code;
        if (code == 0 || code == 10) {
          that.globalData.unregistered = 0;
          that.setOpenid(res.data.openid);
          that.setToken(res.data.token);
          if (that.employIdCallback) {
            that.employIdCallback(res.data.token)
          }
          resolve(res.data);
        } else {
          that.globalData.unregistered = 1;
          reject(1);
        }
      }).catch(e => reject(e));
    });
  },
  // 本地文件存储检测
  localStorageCheck() {
    let fs = wx.getFileSystemManager();
    fs.stat({
      path: wx.env.USER_DATA_PATH,
      recursive: true,
      success: res => {
        let size = 0;
        let fileList = [];
        if (Object.prototype.toString.call(res.stats) == '[object Array]') {
          for (let i = 0, len = res.stats.length; i < len; i++) {
            if (res.stats[i].path.match(/(.png)$/)) {
              fileList.push(wx.env.USER_DATA_PATH + '/' + res.stats[i].path);
            }
            size += res.stats[i].stats.size;
          }
        } else {
          size = res.stats.size;
        }
        size = size / 1024 / 1024;
        console.log('图片文件列表：', fileList);
        console.log('当前内存已使用：' + size.toFixed(2) + 'M');
        if (size >= 9) { //最大10M(预清空)
          Promise.all(fileList.map(f => rmFile(fs, f))).then(res => {
            console.log('内存已满自动清空');
          }).catch(e => console.log(e));
        }
      }
    });
    // 删除文件
    function rmFile(fs, path) {
      return new Promise((resolve, reject) => {
        fs.unlink({
          filePath: path,
          success: res => resolve(res),
          fail: e => reject(e)
        });
      });
    }
  },
  /**
   * 界面弹框
   */
  showBox: function (that, content, time = 1500) {
    setTimeout(function callBack() {
      that.setData({
        prompt: content
      });
    }, 200)
    setTimeout(function callBack() {
      that.setData({
        prompt: ''
      });
    }, time + 200)
  },
  /**
   * 商品、用户头像默认图
   */
  defaultImg: function () {
    let that = this;
    SERVERS.COMMON.getDefaultImages.post().then(res => {
      let { code, data } = res;
      if (code == 0) {
        that.globalData.defaultImg = data;
        that.globalData.defaultImg.value.default_goods_img = that.IMG(that.globalData.defaultImg.value.default_goods_img); //默认商品图处理
        that.globalData.defaultImg.value.default_headimg = that.IMG(that.globalData.defaultImg.value.default_headimg); //默认用户头像处理
      }
    }).catch(e => console.log(e));
  },

  /**
   * 基础配置
   */
  webSiteInfo: function () {
    let that = this;
    SERVERS.COMMON.getWebSiteInfo.post().then(res => {
      let { code, data } = res;
      if (code == 0) {
        that.globalData.webSiteInfo = data;
        console.log(data);
        if (data.title != '' && data.title != undefined) {
          wx.setNavigationBarTitle({
            title: data.title,
          })
        }
      }
    }).catch(e => console.log(e));
  },

  /**
   * 图片路径处理
   */
  IMG: function (img) {
    let base = this.globalData.siteBaseUrl;
    img = img == undefined ? '' : img;
    img = img == 0 ? '' : img;
    if (img.indexOf('http://') == -1 && img.indexOf('https://') == -1 && img != '') {
      img = base + img;
    }
    return img;
  },

  /**
   * 底部加载
   */
  copyRightIsLoad: function (e) {
    let that = this;
    SERVERS.COMMON.copyRightIsLoad.post().then(res => {
      let { code, data } = res.code;
      if (code == 0) {
        let copyRight = data;
        copyRight.technical_support = 'shopal技术团队;';
        copyRight.default_logo = '';
        if (copyRight.is_load == 0) {
          let img = copyRight.bottom_info.copyright_logo;
          copyRight.default_logo = that.IMG(img);
          copyRight.technical_support = copyRight.bottom_info.copyright_companyname;
        }
        that.setCopyRight(copyRight);
      }
    }).catch(e => console.log(e));
  },
  /**
   * 后台计划任务
   */
  loadTask() {
    SERVERS.COMMON.load_task.post().then(res => { }).catch(e => console.log(e));
  },
  // 更新检查
  updateCheck() {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(res => { });
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    });
  },


  /**
   * 待修改 
   */

  /**
   * 封装请求函数
   */
  sendRequest: function (param, customSiteUrl) {
    let that = this;

    let data = param.data || {};
    let header = param.header;
    let requestUrl;
    data.token = that.globalData.token;
    // console.log(data.token)
    if (param.method == '' || param.method == undefined) {
      param.method = 'POST';
    }
    if (customSiteUrl) {
      requestUrl = customSiteUrl + param.url;
    } else {
      requestUrl = this.globalData.siteBaseUrl + param.url;
    }

    if (param.method) {
      if (param.method.toLowerCase() == 'post') {
        header = header || {
          'content-type': 'application/x-www-form-urlencoded;'
        }
      } else {
        data = this._modifyPostParam(data);
      }
      param.method = param.method.toUpperCase();
    }

    if (!param.hideLoading) {
      // this.showToast({
      //   title: '请求中...',
      //   icon: 'loading'
      // });
    }

    wx.showLoading({
      title: '加载中',
      success: function () {
        wx.request({
          url: requestUrl,
          data: data,
          method: param.method || 'GET',
          header: header || {
            'content-type': 'application/json'
          },
          success: function (res) {
            wx.hideLoading()
            //请求失败
            if (res.statusCode && res.statusCode != 200) {
              that.hideToast();
              /*that.showModal({
                content: '' + res.errMsg
              });*/
              typeof param.successStatusAbnormal == 'function' && param.successStatusAbnormal(res.data);
              return;
            }
            typeof param.success == 'function' && param.success(res.data);
            let code = res.data.code;
            let message = res.data.message;
            if (code == -50) {
              that.showModal({
                content: message,
                // url: '/pages/member/resgin/resgin'
              })
            } else if (code == -10) {
              that.showModal({
                content: message,
                code: -10,
              })
            }
            //console.log(res);
          },
          fail: function (res) {
            that.hideToast();
            // that.showModal({
            //   content: '请求失败,请检查网络',
            // })
            debounce(function () {
              wx.showToast({
                title: '网络连接失败',
                icon: 'none',
                mask: false
              });
            }, 2000)();
            typeof param.fail == 'function' && param.fail(res.data);
          },

          complete: function (res) {
            wx.hideLoading();
            wx.stopPullDownRefresh();
            param.hideLoading || that.hideToast();
            typeof param.complete == 'function' && param.complete(res.data);
          }
        });
      }
    })
  },

  //微信提示 函数
  showToast: function (param) {
    wx.showToast({
      title: param.title,
      icon: param.icon,
      duration: param.duration || 1500,
      success: function (res) {
        typeof param.success == 'function' && param.success(res);
      },
      fail: function (res) {
        typeof param.fail == 'function' && param.fail(res);
      },
      complete: function (res) {
        typeof param.complete == 'function' && param.complete(res);
      }
    })
  },
  //隐藏加载提示
  hideToast: function () {
    wx.hideToast();
  },
  //模态框提示
  showModal: function (param) {
    wx.showModal({
      title: param.title || '提示',
      content: param.content,
      showCancel: param.showCancel || false,
      cancelText: param.cancelText || '取消',
      cancelColor: param.cancelColor || '#000000',
      confirmText: param.confirmText || '确定',
      confirmColor: param.confirmColor || '#3CC51F',
      success: function (res) {
        if (res.confirm) {
          typeof param.confirm == 'function' && param.confirm(res);
          let pages = getCurrentPages();
          if (param.url != '' && param.url != undefined && pages.length < 2) {
            wx.navigateTo({
              url: param.url,
            })
          } else if (param.code == -10) {
            wx.navigateBack({
              delta: 1
            })
          }
        } else {
          typeof param.cancel == 'function' && param.cancel(res);
        }
      },
      fail: function (res) {
        typeof param.fail == 'function' && param.fail(res);
      },
      complete: function (res) {
        typeof param.complete == 'function' && param.complete(res);
      }
    })
  },

  _modifyPostParam: function (obj) {
    let query = '';
    let name, value, fullSubName, subName, subValue, innerObj, i;

    for (name in obj) {
      value = obj[name];

      if (value instanceof Array) {
        for (i = 0; i < value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += this._modifyPostParam(innerObj) + '&';
        }
      } else if (value instanceof Object) {
        for (subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += this._modifyPostParam(innerObj) + '&';
        }
      } else if (value !== undefined && value !== null) {
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
      }
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  },
  employIdCallback: function (employId) {
    if (employId != '') {

    }
  },
  setOpenid: function (openid) {
    this.globalData.openid = openid;
  },
  setWxInfo: function (wx_info) {
    this.globalData.wx_info = wx_info;
  },
  setEncryptedData: function (encryptedData) {
    this.globalData.encryptedData = encryptedData;
  },
  setIv: function (iv) {
    this.globalData.iv = iv;
  },
  setToken: function (token) {
    this.globalData.token = token;
  },
  setTabParm: function (tab_parm) {
    this.globalData.tab_parm = tab_parm;
  },
  setTabType: function (tab_type) {
    this.globalData.tab_type = tab_type;
  },
  setCopyRight: function (copyRight) {
    this.globalData.copyRight = copyRight;
  },
  setRegister: function (unregistered) {
    this.globalData.unregistered = unregistered;
  },
  /**
   * 已点击
   */
  clicked: function (that, parm) {
    let d = {};
    d[parm] = 1;
    that.setData(d);
  },

  /**
   * 状态重置
   */
  restStatus: function (that, parm) {
    let d = {};
    d[parm] = 0;
    that.setData(d);
  },
  /**
   * 随机生成验证码
   */
  verificationCode: function (that) {
    let key = this.globalData.openid;
    console.log(key)
    this.sendRequest({
      url: 'api.php?s=index/getVertification',
      data: {
        key: key
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let str_array = data;
          let size_array = [12, 13, 14, 15, 16, 17, 18]; //字体大小
          let code = []; //验证码数组
          let count = 4; //长度
          let str = '';

          for (let i = 0; i < 4; i++) {

            let r = Math.round(Math.random() * 200); //R
            let g = Math.round(Math.random() * 200); //G
            let b = Math.round(Math.random() * 200); //B
            let a = ((Math.random() * 5 + 5) / 10).toFixed(2); //透明度
            let sign = Math.round(Math.random()); //正负号
            sign = sign == 1 ? '' : '-';
            let rotate = Math.round(Math.random() * 60); //旋转角度

            let size = size_array[Math.round(Math.random() * 6)];
            let weight = Math.round(Math.random() * 900);
            let color = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ');';
            let transform = 'rotateZ(' + sign + rotate + 'deg);';

            code[i] = {};
            code[i].str = str_array[i];
            code[i].style = '';
            code[i].style += 'font-size:' + size + ';';
            code[i].style += 'font-weight:' + weight + ';';
            code[i].style += 'color:' + color + ';';
            code[i].style += '-webkit-transform:' + transform + ';';
            code[i].style += 'left:' + (i * 30) + 'px;';
            str += code[i].str;
          }
          code[0].code = str;

          that.setData({
            code: code
          })
        }
      }
    });
  },
  // 解决异步请求封装函数
  asynRequest: function (params) {
    let that = this;
    return new Promise(function (resolve, reject) {
      //添加默认无参数请求
      if (typeof (params) == 'string') params = { url: 'api.php?s=' + params };
      params.method = params.method || 'POST';
      params.success = res => resolve(res);
      params.fail = res => reject(res);
      that.sendRequest(params);
    })
  },
})


// 防抖
function debounce(fn, wait) {    
  var timeout = null;    
  return function() {        
      if(timeout !== null) return;
      fn&&fn();       
      timeout = setTimeout(() => {
        clearTimeout(timeout)
      }, wait);    
  }
}