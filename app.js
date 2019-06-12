var aldstat = require("./utils/ald-stat.js");
var SERVERS = require('./utils/servers');

App({
  /**
 /a/dsa sadaswqwqewqkhhjhjhqqweqwewqewe  * 全局变量
   */
  globalData: {
    siteBaseUrl: "https://www.vitasantee.com/", //服务器url
    // siteBaseUrl: "https://dev02.vitasantee.com/",
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
    userInfo: null,
    webSiteInfo: {},
    tab_parm: '',
    tab_type: '',
    copyRight: {//页面底部logo
      is_load: 1,
      default_logo: '',
      technical_support: '',
    },
    projectData: {},    //二级页参数
    unregistered: 0,
    recommendUser: '',   //惠选师推荐人
    traffic_acquisition_source: '',     //引流来源
  },
  //app初始化函数
  onLaunch: function () {
    let that = this;

    // 请求初始化(设置开发模式)
    SERVERS.init(false);

    //请求拦截函数
    SERVERS.interceptors.request = function (data) {
      wx.showLoading({
        title: '加载中...'
      });
      data.token = that.globalData.token;
      return data;
    };
    SERVERS.interceptors.response = function (res) {
      wx.hideLoading();
      let { code, message } = res.data;
      if (code == -50) {
        that.showModal({
          content: message,
        })
      } else if (code == -10) {
        that.showModal({
          content: message,
          code: -10,
        })
      }
      return res.data;
    };



    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {

    })

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
    })


    that.unregisteredCallback().then((result) => {
      console.log(result)
      that.globalData.unregistered = result
    })

    that.defaultImg();
    // that.webSiteInfo();
    that.copyRightIsLoad();
    that.loadTask();
  },

  // 判断是否登录
  isLogin: function (unregistered) {
    console.log(unregistered)
  },

  onShow: function (options) {
    let that = this;
    wx.getSystemInfo({
      success: res => {
        let modelmes = res.model;
        if (res.model.indexOf("iPhone X") != -1) {
          that.globalData.isIphoneX = true;
        }
      }
    })
  },



  //app登录
  app_login: function () {
    let that = this;
    wx.login({
      success: function (res) {
        // console.log(res.code)
        that.globalData.code = res.code;
        that.getwechatUserInfo();
      }
    });
  },
  //微信登录(静默授权)
  getwechatUserInfo: function () {
    let that = this;
    // 查看是否授权
    wx.getSetting({
      success: (res) => {
        wx.getUserInfo({
          success: res => {
            // console.log(res)
            // 可以将 res 发送给后台解码出 unionId
            that.setWxInfo(res.rawData);
            that.setEncryptedData(res.encryptedData);
            that.setIv(res.iv);
            //wx.setStorageSync("userInfo", res.rawData);
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(res)
            }
            that.wechatLogin(); //自动登录或注册
          }
        })
      }
    })
  },
  //微信登录(按钮)
  wechatLogin: function () {
    let that = this;
    let code = that.globalData.code;
    let store_id = that.globalData.store_id;
    let wx_info = that.globalData.wx_info;
    let encryptedData = that.globalData.encryptedData;
    let iv = that.globalData.iv;
    if (encryptedData == undefined || iv == undefined) {
      return false;
    }
    // 登录接口
    SERVERS.LOGIN.getWechatEncryptInfo.post({
      code: code,
      encryptedData: encryptedData,   //微信信息
      iv: iv,
      store_id
    }).then(res => {
      let code = res.code;
      if (code == 0 || code == 10) {
        that.setOpenid(res.data.openid);
        that.setToken(res.data.token);
        if (that.employIdCallback) {
          that.employIdCallback(res.data.token)
        } 
      }
    }).catch(e => console.log(e));
  },

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
            wx.hideLoading();
            that.showModal({
              content: '请求失败,请检查网络',
            })
            typeof param.fail == 'function' && param.fail(res.data);
          },

          complete: function (res) {
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

  getSiteBaseUrl: function () {
    return this.globalData.siteBaseUrl;
  },
  employIdCallback: function (employId) {
    if (employId != '') {

    }
  },
  unregisteredCallback: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      wx.getUserInfo({
        success: res => {
          console.log('获取用户信息成功', res);
          let unregistered = 0;
          resolve(unregistered)
          that.app_login();
        },
        fail(res) {
          console.log('获取用户信息失败', res);
          let unregistered = 1;
          resolve(unregistered)
        }
      })
    })
  },
  // setSessionKey:function(session_key){
  //   this.globalData.session_key = session_key;
  // },
  // setUnionid: function (unionid) {
  //   this.globalData.unionid = unionid;
  // },
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
   * 后台计划任务
   */
  loadTask() {
    SERVERS.COMMON.load_task.post().then(res => console.log(res)).catch(e => console.log(e));
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
  }
})
