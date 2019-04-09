// pages/member/kolApply/kolApply.js
const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datetime:'',   //出生日期
    navList:[
      {
        name:'基本信息',
        select:true,
      },
      {
        name: '经历爱好',
        select: false,
      },
      {
        name: '结算信息',
        select: false,
      },
      {
        name: '自我介绍',
        select: false,
      },
    ],
    sexList:[
      {
        name:'男',
        checked:false,
      }, {
        name: '女',
        checked: false,
      },
    ],     //性别
    provinceArray:
      [
        {
          'province_id': 0,
          'province_name': '请选择省'
        },
      ],
    cityArray:
      [
        {
          'city_id': 0,
          'city_name': '请选择市'
        },
      ],
    districtArray:
      [
        {
          'district_id': 0,
          'district_name': '请选择区县'
        },
      ],        //地址选择数组
    provinceIndex: 0,
    cityIndex: 0,
    districtIndex: 0,
    isShow:1,    //显示模块
    paths:'',   //此时是正面还是反面
    FilePaths:'',  //正面
    recitePaths:'',   //反面
    isModel:false,   //模态框
    prompt:'',  //提示语
    infoList:'',   //基本资料详情
    bankCard:'',    //银行卡
    listData:{
      estimate_money:20000,
    },    //全数据
    isKol: 0,    //是否是极选师
    kolText: '',    //文本
    recommend_user:'',   //推荐人
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var listData = this.data.listData;
    // console.log(app.globalData.token)
    console.log(options.scene, options.uid);
      // 扫码进入
    if (options.scene) {
      var uid = decodeURIComponent(options.scene);
      app.globalData.recommendUser = uid;
    } else if (options.uid){
      var uid =options.uid
    } else if(this.data.uid) {
      var uid = this.data.uid;
    }

    console.log(uid)
    app.sendRequest({
      url: 'api.php?s=Distributor/applyUserName',
      data: { uid: uid },
      success: function (res) {
        console.log(res);
        listData.recommend_user = uid;
        if (res.code == 1) {
          if (uid) {
            var recommend_user = res.data;
            that.setData({
              recommend_user,
              listData,
            })
          }
        }
      }
    })


    app.unregisteredCallback = unregistered => {
      console.log(app.globalData.unregistered);
      app.isLogin(app.globalData.unregistered);
    }


    app.sendRequest({
      url: 'api.php?s=index/getProvince',
      data: {},
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let provinceArray = res.data;
          let province_array = [{
            area_id: 0,
            province_id: 0,
            province_name: '请选择省',
            sort: 0
          }];
          for (let i = 0; i < provinceArray.length; i++) {
            province_array[i + 1] = provinceArray[i];
          }
          that.setData({
            provinceArray: province_array
          })
          //console.log(that.data.provinceArray);
        }
      }
    })

    
  },
  

  // 日期选择器
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var listData = this.data.listData;
    listData.birthday = e.detail.value
    this.setData({
      listData
    })
  },

  // 判断输入的文字是否有表情
  isEmojiCharacter: function (substring) {
    for (var i = 0; i < substring.length; i++) {
      var hs = substring.charCodeAt(i);
      if (0xd800 <= hs && hs <= 0xdbff) {
        if (substring.length > 1) {
          var ls = substring.charCodeAt(i + 1);
          var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
          if (0x1d000 <= uc && uc <= 0x1f77f) {
            return true;
          }
        }
      } else if (substring.length > 1) {
        var ls = substring.charCodeAt(i + 1);
        if (ls == 0x20e3) {
          return true;
        }
      } else {
        if (0x2100 <= hs && hs <= 0x27ff) {
          return true;
        } else if (0x2B05 <= hs && hs <= 0x2b07) {
          return true;
        } else if (0x2934 <= hs && hs <= 0x2935) {
          return true;
        } else if (0x3297 <= hs && hs <= 0x3299) {
          return true;
        } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
          || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
          || hs == 0x2b50) {
          return true;
        }
      }
    }
  },

  // 跳转经历爱好
  tohobby:function(){
    var that=this;
    var navList = this.data.navList;
    var listData = this.data.listData;
    var provinceArray = this.data.provinceArray;
    var cityArray = this.data.cityArray;
    var districtArray = this.data.districtArray;
    var provinceIndex = this.data.provinceIndex;
    var cityIndex = this.data.cityIndex;
    var districtIndex = this.data.districtIndex;
    listData.province = provinceArray[provinceIndex].province_name;
    listData.city = cityArray[cityIndex].city_name;
    listData.district = districtArray[districtIndex].district_name;
    var myreg = /^1(3|4|5|7|8)\d{9}$/;
    var reg = /[~#^$@%&!?%*]/gi;
    if (!listData.id_face_cons){
      app.showBox(that, '请上传身份证反面');
    } else if (!listData.address) {
      app.showBox(that, '请填写详细地址');
    } else if (this.isEmojiCharacter(listData.address)) {
      app.showBox(that, '详细地址不能含有表情');
    } else if (reg.test(listData.address)) {
      app.showBox(that, '详细地址不能含有特殊字符');
    } else if (!myreg.test(listData.tel)) {
      app.showBox(that, '请填写正确手机号码');
    } else if (provinceIndex==0) {
      app.showBox(that, '请选择省');
    } else if (cityIndex == 0) {
      app.showBox(that, '请选择市');
    } else if (districtIndex== 0) {
      app.showBox(that, '请选择区');
    } else if (!listData.name) {
      app.showBox(that, '请填写姓名');
    } else if (this.isEmojiCharacter(listData.name)) {
      app.showBox(that, '姓名不能含有表情');
    } else if (reg.test(listData.name)) {
      app.showBox(that, '姓名不能含有特殊字符');
    } else if (!listData.nation) {
      app.showBox(that, '请填写民族');
    } else if (this.isEmojiCharacter(listData.nation)) {
      app.showBox(that, '民族不能含有表情');
    } else if (reg.test(listData.nation)) {
      app.showBox(that, '民族不能含有特殊字符');
    }else{
      navList[1].select = true;
      this.setData({
        navList: navList,
        isShow: 2,
      })
    }
    console.log(listData);
  },

  // 跳转结算信息
  torealname:function(){
    var that = this;
    var navList = this.data.navList;
    var listData = this.data.listData;
    var reg = /[~#^$@%&!?%*]/gi;
    if (!listData.educational_experience) {
      app.showBox(that, '请填写教育经历');
    } else if (this.isEmojiCharacter(listData.educational_experience)) {
      app.showBox(that, '教育经历不能含有表情');
    } else if (reg.test(listData.educational_experience)) {
      app.showBox(that, '教育经历不能含有特殊字符');
    }else if(listData.educational_experience.length<10) {
      app.showBox(that, '教育经历字数不够');
    } else if (listData.work_experience.length < 10) {
      app.showBox(that, '工作经历字数不够');
    } else if (!listData.work_experience) {
      app.showBox(that, '请填写工作经历');
    } else if (this.isEmojiCharacter(listData.work_experience)) {
      app.showBox(that, '工作经历不能含有表情');
    } else if (reg.test(listData.work_experience)) {
      app.showBox(that, '工作经历不能含有特殊字符');
    } else if (listData.hobbies.length < 10) {
      app.showBox(that, '爱好特长字数不够');
    } else if (this.isEmojiCharacter(listData.hobbies)) {
      app.showBox(that, '爱好特长不能含有表情');
    } else if (reg.test(listData.hobbies)) {
      app.showBox(that, '爱好特长不能含有特殊字符');
    } else if (!listData.hobbies) {
      app.showBox(that, '请填写爱好特长');
    } else {
      navList[2].select = true;
      this.setData({
        navList: navList,
        isShow: 3,
      })
    }
  },

  // 跳转自我介绍
  toIntro:function(){
    var that = this;
    var navList = this.data.navList;
    var listData = this.data.listData;
    var reg = /[~#^$@%&!?%*]/gi;
    if (!listData.bank_account_number) {
      app.showBox(that, '请填写银行账号');
    } else if (!listData.bank_name) {
      app.showBox(that, '请填写银行名称');
    } else if (this.isEmojiCharacter(listData.bank_name)) {
      app.showBox(that, '银行名称不能含有表情');
    } else if (reg.test(listData.bank_name)) {
      app.showBox(that, '银行名称不能含有特殊字符');
    } else if (!listData.bank_open_name) {
      app.showBox(that, '请填写银行开户行');
    } else if (this.isEmojiCharacter(listData.bank_open_name)) {
      app.showBox(that, '银行开户行不能含有表情');
    } else if (reg.test(listData.bank_open_name)) {
      app.showBox(that, '银行开户行不能含有特殊字符');
    }else{
      navList[3].select = true;
      this.setData({
        navList: navList,
        isShow: 4,
      })
    }
  },

  // 放回上一步
  topreo:function(e){
    var index = e.currentTarget.dataset.index;
    var navList = this.data.navList;
    for(let i=0;i<navList.length;i++){
      navList[i].select=false;
    }
    for(let i=0;i<index;i++){
      navList[i].select=true;
    }
    this.setData({
      navList: navList,
      isShow: index,
    })
  },

  // 身份证正面上传
  frontimage: function () {
    var FilePaths = this.data.FilePaths;
    // 判断此时上传的身份证是正面还是反面
    this.identityCard('front');
  },

  // 反面上传
  reciteimage: function () {
    var recitePaths = this.data.recitePaths;
    // 判断此时上传的身份证是正面还是反面
    this.identityCard('recite');
  },

  // 上传图片到服务器
  uplodeHeadImg: function (tempFilePaths, paths, listData) {
    var name = 'file_upload';
    var that = this;
    var base = app.globalData.siteBaseUrl;
    var token = app.globalData.token;
    // console.log(tempFilePaths)
    wx.uploadFile({
      url: base + 'api.php?s=upload/uploadFile',
      filePath: tempFilePaths,
      name: name,
      formData: {
        token: token,
        file_path: 'upload/comment/',
      },
      success: function (res) {
        var result = res.data
        // console.log(result);
        var data = JSON.parse(result)
        // console.log(data);
        if (data.code == 0) {
          data = data.data;
          var code = data.code;
          var message = data.message;
          var img_url = data.data;
          img_url = app.IMG(img_url);
          if (code > 0) {
            if (paths=='face'){
              listData.id_face_pros = img_url;
              that.setData({
                FilePaths: tempFilePaths,
                listData,
              })
              // that.identityFace(tempFilePaths, listData);
            } else if (paths == 'back') {
              listData.id_face_cons = img_url;
              that.setData({
                recitePaths: tempFilePaths,
                listData,
              })
              // that.identityBack(tempFilePaths, listData);
            } else if (paths == 'bankCard') {
              listData.bank_card_pic = img_url;
              that.setData({
                bankCardImage: tempFilePaths,
                listData,
              })
              // that.bankCard(tempFilePaths, listData);
            }
          }else{
            wx.hideLoading();
            app.showBox(that, data.message);
          }
        } else {
          wx.hideLoading();
          app.showBox(that, data.message);
        }
      },
      fail: function (res) {
        wx.hideLoading();
        app.showBox(that, '上传失败');
      }
    })
  },

  // 银行卡上传
  cardimage:function(){
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9 
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function (result) {
        // 判断图片是否过大
        var tempFiles = result.tempFiles[0];
        if (tempFiles.size > 1024 * 1024 * 8) {
          app.showBox(_this, '上传图片过大');
          return;
        }
        wx.showLoading({
          title: '加载中',
          success: function () {
            _this.bankCard(result.tempFilePaths[0])
            // _this.uplodeHeadImg(result.tempFilePaths[0], 'bankCard');
          }
        })
      },
      fail: function (res) {
        app.showBox(_this, '无法获取本地图片');
        console.log(res);
      }
    })
  },

  // 银行卡识别
  bankCard: function (tempFilePaths) {
    var _this = this;
    var listData = this.data.listData;
    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    wx.getFileSystemManager().readFile({
      filePath: tempFilePaths, //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: list => { //成功的回调
        var base64 = 'data:image/jpeg;base64,' + list.data;
        // console.log(base64);
            wx.request({
              url: 'https://bankocr.market.alicloudapi.com/cardbank',
              data: {
                img: base64,
              },
              method: 'POST',
              header: {
                // "Host": "bankocr.market.alicloudapi.com",
                // "X-Ca-Timestamp": "1540802691176", 
                "gateway_channel": "https",
                "X-Ca-Request-Mode": "debug",
                "X-Ca-Key": "24906978",
                "X-Ca-Stage": "RELEASE",
                'content-type': "application/x-www-form-urlencoded;charset=utf-8",
                'Authorization': 'APPCODE 2b19f336b34e4b50a7e14ad8c8765932'
              },
              success: function (res) {
                wx.hideLoading();
                // console.log(res)
                if (res.data.msg == '识别成功') {
                  let data = res.data.result;
                  if (data.bank_card_type == 0) {
                    _this.setData({
                      prompt: '不能识别有效银行卡'
                    })
                  } else if(data.bank_card_type == 2) {
                    _this.setData({
                      prompt: '请上传借记卡或储蓄卡'
                    })
                  } else {
                    wx.showToast({
                      title: '上传成功',
                      icon: 'success',
                      duration: 2000
                    })
                    listData.bank_account_number = data.bank_card_number;
                    listData.bank_name = data.bank_name; 
                    _this.uplodeHeadImg(tempFilePaths, 'bankCard', listData)
                  }
                } else {
                  _this.setData({
                    prompt: res.data.msg || '查询失败'
                  })
                }
                setTimeout(function () {
                  _this.setData({
                    prompt: ''
                  })
                }, 2000)
              },
              fail:function(res){
                wx.hideLoading();
                console.log(res)
                app.showBox(_this, '上传失败')
              }
            })
      },
      fail: function (res) {
        wx.hideLoading();
        console.log(res)
        app.showBox(_this, '上传失败')
      }
    })
  },

  // 身份证上传
  identityCard: function (paths) {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9 
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function (result) {
        // 判断图片是否过大
        var tempFiles = result.tempFiles[0];
        if (tempFiles.size > 1024 * 1024 * 8) {
          app.showBox(_this, '上传图片过大');
          return;
        }
        if (paths =='recite'){
          wx.showLoading({
            title: '加载中',
            success: function () {
              _this.identityBack(result.tempFilePaths[0]);
              // _this.uplodeHeadImg(result.tempFilePaths[0], 'back');
            }
          })
        }else{
          wx.showLoading({
            title: '加载中',
            success: function () {
              _this.identityFace(result.tempFilePaths[0]);
              // _this.uplodeHeadImg(result.tempFilePaths[0], 'face');
            }
          })
        }
      },
      fail: function (res) {
        app.showBox(_this, '无法获取本地图片');
        console.log(res);
      }
    })
  },

  // 身份证正面识别
  identityFace: function (tempFilePaths) {
    var _this = this;
    var listData = this.data.listData;
    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    wx.getFileSystemManager().readFile({
      filePath: tempFilePaths, //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: res => { //成功的回调
        let base64 = 'data:image/jpeg;base64,' +res.data;
          // console.log(base64);
            wx.request({
              url: 'https://ocr2idcard.market.alicloudapi.com/OcridCard',
              data: {
                "image": base64
              },
              method: 'POST',
              header: {
                // "Host": "ocr2idcard.market.alicloudapi.com", 
                // "X-Ca-Timestamp": "1541043385872",
                "gateway_channel": "https",
                "X-Ca-Request-Mode": "debug",
                "X-Ca-Key": "24906978",
                "X-Ca-Stage": "RELEASE",
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
                "Authorization": "APPCODE 2b19f336b34e4b50a7e14ad8c8765932"
              },
              success: function (res) {
                wx.hideLoading();
                console.log(res)
                var data = res.data
                if (data.msg =='实名认证通过！') {
                  var list = data.cert;
                  var sexList = _this.data.sexList;
                  for (let i = 0; i < sexList.length; i++) {
                    sexList[i].checked = false;
                    if (list.sex == '女' && sexList[i].name == '女') {
                      sexList[i].checked = true;
                      listData.sex = '女';
                    } else if (list.sex == '男' && sexList[i].name == '男') {
                      sexList[i].checked = true;
                      listData.sex = '男';
                    }
                  }

                  // 赋值
                  listData.name = list.name;
                  listData.birthday = list.birthday;
                  listData.nation = data.ocr.nation;
                  _this.uplodeHeadImg(tempFilePaths, 'face', listData)
                  _this.setData({
                    sexList,
                  })
                  wx.showToast({
                    title: '上传成功',
                    icon: 'success',
                    duration: 2000
                  })
                } else if (data.msg == '实名认证不通过！') {
                  _this.setData({
                    prompt: '实名认证不通过'
                  })
                }else{
                  _this.setData({
                    prompt: '请上传身份证人像面'
                  })
                }
                setTimeout(function () {
                  _this.setData({
                    prompt: ''
                  })
                }, 2000)
              },
              fail: function (res) {
                wx.hideLoading();
                console.log(res)
                app.showBox(_this, '上传失败')
              }
            });
      },
      fail: function (res) {
        wx.hideLoading();
        console.log(res)
        app.showBox(_this, '上传失败')
      }
    })
  },

  // 身份证反面识别
  identityBack: function (tempFilePaths) {
    var _this = this;
    var listData = this.data.listData;
    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    wx.getFileSystemManager().readFile({
      filePath: tempFilePaths, //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: res => { //成功的回调
        let base64 = res.data;
        // console.log(base64);
        wx.request({
          url: 'https://dm-51.data.aliyun.com/rest/160601/ocr/ocr_idcard.json',
          data: {
            "image": base64,
            "configure": "{\"side\":\"back\"}"
          },
          method: 'POST',
          header: {
            // "Host": "ocr2idcard.market.alicloudapi.com", 
            // "X-Ca-Timestamp": "1541043385872",
            "gateway_channel": "https",
            "X-Ca-Request-Mode": "debug",
            "X-Ca-Key": "24906978",
            "X-Ca-Stage": "RELEASE",
            "Content-Type": "application/octet-stream; charset=utf-8",
            "Authorization": "APPCODE 2b19f336b34e4b50a7e14ad8c8765932"
          },
          success: function (res) {
            wx.hideLoading();
            console.log(res)
            var data = res.data
            if (data.success==true) {
              var end_date = data.end_date;
              //获取当前时间
              var date = new Date();
              var year = date.getFullYear();
              var month = date.getMonth() + 1;
              var day = date.getDate();
              if (month < 10) {
                month = "0" + month;
              }
              if (day < 10) {
                day = "0" + day;
              }
              var nowDate = year.toString() + month.toString() + day.toString();
              // console.log(parseInt(end_date) - parseInt(nowDate));
              if (parseInt(end_date) - parseInt(nowDate)>=0){
                _this.uplodeHeadImg(tempFilePaths, 'back', listData)
                wx.showToast({
                  title: '上传成功',
                  icon: 'success',
                  duration: 2000
                })
              }else{
                _this.setData({
                  prompt: '请上传有效身份证'
                })
              }
            } else {
              _this.setData({
                prompt: '请上传身份证国徽面'
              })
            }
            setTimeout(function () {
              _this.setData({
                prompt: ''
              })
            }, 2000)
          },
          fail: function (res) {
            wx.hideLoading();
            console.log(res)
            app.showBox(_this, '上传失败')
          }
        });
      },
      fail: function (res) {
        wx.hideLoading();
        console.log(res)
        app.showBox(_this, '上传失败')
      }
    })
  },

  /**
   * 图片预览
   */
  preivewImg: function (e) {
    let imgUrls = e.currentTarget.dataset.img;
    let urls = [];

    urls.push(imgUrls);
    wx.previewImage({
      current: urls[0],
      urls: urls,
    })
  },

  // 删除图片
  toDelImg: function (e) {
    let img = e.currentTarget.dataset.img;
    // console.log(img);
    if(img=='face'){
      this.setData({
        FilePaths:''
      })
    } else if (img == 'back') {
      this.setData({
        recitePaths: ''
      })
    } else if (img == 'bankCard') {
      this.setData({
        bankCardImage: ''
      })
    }
  },

  /**
   * 省选择器
   */
  bindProvincChange: function (e) {
    let that = this;
    let index = e.detail.value;
    let provinceArray = that.data.provinceArray;
    let province_id = provinceArray[index].province_id;
    app.clicked(that, 'listClickFlag');
    that.setData({
      provinceIndex: index,
      province: province_id,
      cityIndex: 0,
      districtIndex: 0
    })
    if (province_id == 0) {
      return;
    }
    app.sendRequest({
      url: 'api.php?s=index/getCity',
      data: {
        province_id: province_id
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let cityArray = res.data;
          let city_array = [{
            area_id: 0,
            city_id: 0,
            city_name: '请选择市',
            sort: 0
          }];
          for (let i = 0; i < cityArray.length; i++) {
            city_array[i + 1] = cityArray[i];
          }
          that.setData({
            cityArray: city_array
          })
        }
      }
    })
  },
  /**
   * 市选择器
   */
  bindCityChange: function (e) {
    let that = this;
    let index = e.detail.value;
    let cityArray = that.data.cityArray;
    let city_id = cityArray[index].city_id;
    that.setData({
      cityIndex: index,
      city: city_id,
      districtIndex: 0
    })
    if (city_id == 0) {
      return;
    }
    app.sendRequest({
      url: 'api.php?s=index/getDistrict',
      data: {
        city_id: city_id
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let districtArray = res.data;
          let district_array = [{
            area_id: 0,
            district_id: 0,
            district_name: '请选择区县',
            sort: 0
          }];
          for (let i = 0; i < districtArray.length; i++) {
            district_array[i + 1] = districtArray[i];
          }
          that.setData({
            districtArray: district_array
          })
        }

      }
    })
  },
  /**
   * 区选择器
   */
  bindDistrictChange: function (e) {
    let that = this;
    let index = e.detail.value;
    let districtArray = that.data.districtArray;
    let district_id = districtArray[index].district_id;
    that.setData({
      districtIndex: index,
      district: district_id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  // 姓名修改
  nameValue:function(e){
    var name = e.detail.value;
    var listData=this.data.listData;
    if (name != listData.name){
      listData.name=name;
      this.setData({
        listData,
      })
    }else{
      return;
    }
  },

  // 性别修改
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var sex = e.detail.value;
    var listData = this.data.listData;
    listData.sex = sex;
    this.setData({
      listData,
    })
  },

  // 民族修改
  nationValue: function (e) {
    var nation = e.detail.value;
    var listData = this.data.listData;
    if (nation != listData.nation) {
      listData.nation = nation;
      this.setData({
        listData,
      })
    } else {
      return;
    }
  },

  // 详细地址修改
  addressValue: function (e) {
    var address = e.detail.value;
    var listData = this.data.listData;
    listData.address = address;
    this.setData({
      listData,
    })
  },

  // 手机号码修改
  phoneValue: function (e) {
    var tel = e.detail.value;
    var listData = this.data.listData;
    listData.tel = tel;
    this.setData({
      listData,
    })
  },

  // EMAIL修改
  emailValue: function (e) {
    var email = e.detail.value;
    var listData = this.data.listData;
    listData.email = email;
    this.setData({
      listData,
    })
  },

  // 教育经历修改
  educationValue: function (e) {
    var educational_experience = e.detail.value;
    var listData = this.data.listData;
    listData.educational_experience = educational_experience;
    this.setData({
      listData,
    })
  },

  // 工作经历修改
  joinValue: function (e) {
    var work_experience = e.detail.value;
    var listData = this.data.listData;
    listData.work_experience = work_experience;
    this.setData({
      listData,
    })
  },

  // 爱好特长修改
  hobbyValue: function (e) {
    var hobbies = e.detail.value;
    var listData = this.data.listData;
    listData.hobbies = hobbies;
    this.setData({
      listData,
    })
  },

  // 银行账号修改
  bankNumValue: function (e) {
    var bank_account_number = e.detail.value;
    var listData = this.data.listData;
    listData.bank_account_number = bank_account_number;
    this.setData({
      listData,
    })
  },

  // 银行名称修改
  bankNameValue: function (e) {
    var bank_name = e.detail.value;
    var listData = this.data.listData;
    listData.bank_name = bank_name;
    this.setData({
      listData,
    })
  },

  // 银行名称修改
  banKDetailValue: function (e) {
    var bank_open_name = e.detail.value;
    var listData = this.data.listData;
    listData.bank_open_name = bank_open_name;
    this.setData({
      listData,
    })
  },

  // 流动入口及销售方向修改
  describe1Value: function (e) {
    var describe1 = e.detail.value;
    var listData = this.data.listData;
    listData.describe1 = describe1;
    this.setData({
      listData,
    })
  },

  // 你眼中的BC修改
  describe2Value: function (e) {
    var describe2 = e.detail.value;
    var listData = this.data.listData;
    listData.describe2 = describe2;
    this.setData({
      listData,
    })
  },

  // 为何选择极选师修改
  describe3Value: function (e) {
    var describe3 = e.detail.value;
    var listData = this.data.listData;
    listData.describe3 = describe3;
    this.setData({
      listData,
    })
  },

  // 未来三个月预估销售额修改
  moneyValue: function (e) {
    var estimate_money = e.detail.value;
    var listData = this.data.listData;
    listData.estimate_money = estimate_money;
    this.setData({
      listData,
    })
  },

  // 申请极选师
  toApply: function (event) {
    var that = this;
    var listData = this.data.listData;
    var sexList = this.data.sexList;
    var reg = /[~#^$@%&!?%*]/gi;
    if (!listData.describe1) {
      app.showBox(that, '请填写流量入口');
    } else if (this.isEmojiCharacter(listData.describe1)) {
      app.showBox(that, '流量入口不能含有表情');
    } else if (reg.test(listData.describe1)) {
      app.showBox(that, '流量入口不能含有特殊字符');
    }else if (listData.describe1.length < 10) {
      app.showBox(that, '流量入口字数不够');
    } else if (listData.describe2.length < 10) {
      app.showBox(that, '你眼中的BC字数不够');
    } else if (this.isEmojiCharacter(listData.describe2)) {
      app.showBox(that, '你眼中的BC不能含有表情');
    } else if (reg.test(listData.describe2)) {
      app.showBox(that, '你眼中的BC不能含有特殊字符');
    } else if (!listData.describe2) {
      app.showBox(that, '请填写你眼中的BC');
    } else if (listData.describe3.length < 10) {
      app.showBox(that, '为何选择做极选师字数不够');
    } else if (this.isEmojiCharacter(listData.describe3)) {
      app.showBox(that, '为何选择做极选师不能含有表情');
    } else if (reg.test(listData.describe3)) {
      app.showBox(that, '为何选择做极选师不能含有特殊字符');
    } else if (!listData.describe3) {
      app.showBox(that, '请填写为何选择做极选师');
    } else {
      console.log(listData)
      // 提交表格
      app.sendRequest({
        url: 'api.php?s=Distributor/applyDistributor',
        data: listData,
        success: function (res) {
          console.log(res, app.globalData.openid, event.detail.formId)
          app.sendRequest({
            url: 'api.php?s=distributor/sendKolTemplateCreated',
            data: {
              openid: app.globalData.openid,
              formid: event.detail.formId,
            },
            success: function (result) {
              console.log(res)
              if(res.code==1){
                setTimeout(function () {
                  wx.showToast({
                    title: res.message,
                    icon: 'success',
                    duration: 800,
                    success: function () {
                      setTimeout(function () {
                        wx.switchTab({
                          url: '/pages/index/index',
                        })
                      }, 1000)
                    }
                  })
                }, 800)
              }
            }
          })
        }
      })
    }
  },

  toIndex: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var listData = this.data.listData;
    wx.hideShareMenu();
    console.log(app.globalData.unregistered)
    if (app.globalData.unregistered == 1) {
      wx.navigateTo({
        url: '/pages/member/resgin/resgin',
      })
    }

    if (app.globalData.token && app.globalData.token != '') {
      //判断是否是付费会员的接口
      app.sendRequest({
        url: "api.php?s=member/getMemberDetail",
        success: function (res) {
          let data = res.data
          if (res.code == 0) {
            let tel = data.user_info.user_tel;
            let uid = data.user_info.uid;

            if (tel == '') {
              wx.navigateTo({
                url: '/pages/member/resgin/resgin',
              })
            } else {

              // 判断是否是极选师
              app.sendRequest({
                url: 'api.php?s=distributor/checkApply',
                data: {
                  uid: uid
                },
                success: function (res) {
                  console.log(res);
                  if (res.code == 2) {
                    that.setData({
                      isKol: 2,
                      kolText: '你已经是极选师',
                    })
                  } else if (res.code == 3) {
                    that.setData({
                      isKol: 2,
                      kolText: '资料正在审核中 请耐心等待',
                    })
                  } else {
                    that.setData({
                      isKol: 1,
                    })
                  }
                }
              })
              console.log(tel, uid)
              listData.tel = tel;
              that.setData({
                listData,
              })
            }
          }
        }
      })
    } else {
      app.employIdCallback = employId => {
        console.log(employId)
        if (employId != '') {
          app.sendRequest({
            url: "api.php?s=member/getMemberDetail",
            success: function (res) {
              let data = res.data
              if (res.code == 0) {
                let tel = data.user_info.user_tel;
                let uid = data.user_info.uid;
                if (tel == '') {
                  wx.navigateTo({
                    url: '/pages/member/resgin/resgin',
                  })
                } else {
                  // 判断是否是极选师
                  app.sendRequest({
                    url: 'api.php?s=distributor/checkApply',
                    data: {
                      uid: uid
                    },
                    success: function (res) {
                      console.log(res);
                      if (res.code == 2) {
                        that.setData({
                          isKol: 2,
                          kolText: '你已经是极选师',
                        })
                      } else if (res.code == 3) {
                        that.setData({
                          isKol: 2,
                          kolText: '资料正在审核中 请耐心等待',
                        })
                      } else {
                        that.setData({
                          isKol: 1,
                        })
                      }
                    }
                  })
                  console.log(tel, uid)
                  listData.tel = tel;
                  that.setData({
                    listData,
                  })
                }
              }
            }
          })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})