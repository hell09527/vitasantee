// pages/member/kolApply/kolApply.js
const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isKol:1,
    listData:{
    },    //全数据
    recommend:'',   //推荐人
    shop:[
     "https://static.bonnieclyde.cn/%E6%9E%81%E9%80%89%E5%B8%88-%E5%9B%BE0403-1.png",
      "https://static.bonnieclyde.cn/%E6%9E%81%E9%80%89%E5%B8%88-%E5%9B%BE0403-2.png",
      "https://static.bonnieclyde.cn/%E6%9E%81%E9%80%89%E5%B8%88-%E5%9B%BE0403-3.png",
    ],
    swiperHeight:688,
    swiperIndex: 0 ,//这里不写第一次启动展示的时候会有问题
    tel:'',
    kolText: '',    //文本
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this;
    var listData = this.data.listData;
   
    // console.log(app.globalData.token)
    console.log(options.scene, options.uid);
    let updata = app.globalData.unregistered;
    var date = new Date;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var God= date.getDate();
    console.log(God.toString());
    console.log(month.toString());
    month = (month < 10 ? "0" + month : month);
    God = (month < 10 ? "0" + God : God);
    var mydate = (year.toString() + '-' + month.toString()+'-' + God);
    that.setData({
      unregistered:updata 
    })


      // 扫码进入
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      let uid= scene.split('&')[0]; //推荐人
      let invitation= scene.split('&')[1];//邀请人
       let Uid;
       if(uid==0){
        app.globalData.recommendUser = invitation; 
        app.globalData.is_recommend=2;
        listData.is_recommend=2; 
        app.globalData.showTitle='邀请人';
        Uid=invitation; 
        that.setData({
          showTitle:'邀请人'
        })
       }else if(invitation==0){
        app.globalData.recommendUser = uid; 
        app.globalData.is_recommend=1;
        listData.is_recommend=1; 
        app.globalData.showTitle='推荐人';
        Uid=uid;  
        that.setData({
          showTitle:'推荐人'
        })
       }
       console.log(Uid,'uid')
       if(Uid){
         console.log('进来了')
        app.sendRequest({
          url: 'api.php?s=Distributor/applyUserName',
          data: { uid: Uid},
          success: function (res) {
            console.log(res);
            listData.recommend_user = Uid;

            if (res.code == 1) {
                var recommend_user = res.data;
                that.setData({
                  recommend: recommend_user,
                  listData,
                })
            }
          }
        })
       }

      console.log(uid)
 

    } else if (options.uid){
      var uid = options.uid;  
      listData.uid  = uid;
      console.log(uid)
      that.setData({
        listData,
      })

     
    } else if(this.data.uid) {
      var uid = this.data.uid; 
      console.log(uid)
      app.sendRequest({
        url: 'api.php?s=Distributor/applyUserName',
        data: { uid: uid },
        success: function (res) {
          console.log(res);
          listData.recommend_user = uid;
          listData.is_recommend=app.globalData.is_recommend;
          let showTitle=app.globalData.showTitle;
          if (res.code == 1) {
            if (uid) {
              var recommend_user = res.data;
              that.setData({
                recommend: recommend_user,
                listData,
                showTitle
              })
            }
          }
        }
      })
    }

    // app.unregisteredCallback = unregistered => {
    //   console.log(app.globalData.unregistered);
    //   app.isLogin(app.globalData.unregistered);
    // }




  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
 
   XXS_reuse:function(){
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
          let tel = data.user_info.user_tel;
          if (tel !== null || tel !== undefined || tel  !== '') {
            console.log(111)
          } else if (tel==''){
            console.log(223)
          } 

          let updata = that.data.unregistered;
          updata = app.globalData.unregistered;
          console.log(updata, 'updata', '134', data.is_employee);
          // console.log(app.globalData.is_vip)
          that.setData({
            is_vip: is_vip,
            tel: tel,
            distributor_type,
            unregistered: updata,
            is_employee: data.is_employee,
          })
         
          
   
        }
      }
    })
  },

  // 申请极选师
  toApply: function (event) {
    var that = this;
    var listData = this.data.listData;
    // var experience=listData.work_experience;
     
      app.sendRequest({
        url: 'api.php?s=Distributor/applyDistributor',
        data: listData,
        success: function (res) {
          console.log(res)
          if(res.code==1){
            wx.navigateTo({
              url: "/pages/member/kol/kol",
            })
         

          }
       
        }
      })
    
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
    console.log(app.globalData.unregistered);

  
    

    wx.getSystemInfo({
      success(res) {
        let windowWidth = (res.windowWidth/1.4);//当前手机屏幕的宽度

        let windowHeight = res.windowHeight;
        let screenWidth = res.windowWidth;
        let screenHeight = res.windowHeight;
        console.log(windowWidth)
        console.log(windowHeight)
        that.setData({
          windowWidth: windowWidth,
          windowHeight,
          screenWidth,
        })
      }

    })

    if (app.globalData.token && app.globalData.token != '') {
      //判断是否是付费会员的接口
      that.XXS_reuse();
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
              that.setData({
                listData,
              })
            }
          }
        }
      })
    } else {
      app.employIdCallback = employId => {
        if (employId != '') {
          //判断是否是付费会员的接口
          that.XXS_reuse();
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

    
  
    app.sendRequest({
      url: "api.php?s=distributor/kolImg",
      success: function (res) {
        let data = res.data
        console.log(data)
        if (res.code == 0) {
          let  img_data_1= data.img_data_1;
          let  img_data_2= data.img_data_2;
          let  img_data_3= data.img_data_3;
          console.log(img_data_1)
          that.setData({
            img_data_1,
            img_data_2,
            img_data_3,
          })
         

         
        }
      }
    })





  
  },
  bindchange(e) {
    console.log(e.detail.current)
    this.setData({
         swiperIndex: e.detail.current
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

  },
      /**触发*/
      Crossdetails:function(){
        let _that=this;
        let Tel=_that.data.tel;
        console.log(213)
        let suffix=_that.data.goods_id;
        if (app.globalData.unregistered == 1 || Tel=='') {
          wx.navigateTo({
            url: '/pages/member/resgin/resgin',
          })
          }
     },
     toIndex: function () {
      wx.switchTab({
        url: '/pages/index/index',
      })
    },
  
})
