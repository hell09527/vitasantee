const app = new getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: "", //图片链接
    codeUrl: '', // 二维码内容用于生成二维码
    ts: 0, //变换合成图片
    saveImg: '', //合成图片
    lucency: false, //模态框
    category_list: [], //分类
    category_goods: [], //分类商品
    page: 1,
    tempFiles: '',
    isActive: 1,   //商品品牌按钮点击
    convert: '', //转换
    gooSid: '', //是否已选择二维码指向
    windUp: false,
    category_id: '',
    WXcode: '',
    name: '',
    category: 1,//商品或品牌类别
    bRands: { category_id: "X", category_name: "综合", },//拟定数据
    grabble: { category_id: 0, category_name: "精选", },//拟定数据
    synthesize_list: [],//综合类别数据
    // search_list:[],//搜索列表
    searchFlag: 0,//避免重复点击
    beTitle: '返回列表',
    Fixtitle: 1 , //固定页面状态显示
    maKestep: 1,//制作步骤
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getSystemInfo({
      success(res) {
        let windowWidth = res.windowWidth;//当前手机屏幕的宽度
        let windowHeight = res.windowHeight - 50;
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
  },
  //绘画
  Drawing: function () {
    let that = this;
    console.log(that.data.imgUrl)
    // 获取图片信息
    wx.getImageInfo({
      src: that.data.imgUrl,
      success: function (res) {
        console.log(res);
        const ctx = wx.createCanvasContext('shareCanvas');
       
        let setfixW = that.data.windowWidth; //当前手机屏幕的宽度
        let imgUrlW = setfixW / res.width;   //等比例计算
        let imgUrlH = res.height * imgUrlW;
        console.log(imgUrlW)

        let W = setfixW - 20 - setfixW / 4;
        let H = imgUrlH - 20 - setfixW / 4;
        let codeH = H + ((setfixW / 5) / 2) + 12;
        // console.log(W)
        // console.log(H)
        // console.log(setfixW / 5)
        // console.log(imgUrlH);

        that.setData({
          setfixW: setfixW,
          imgUrlH
        })
        ctx.drawImage(res.path, 0, 0, setfixW, imgUrlH)
        // 作者名称
        ctx.setTextAlign('center') // 文字居中
        ctx.setFillStyle('#000') // 文字颜色：白色
        ctx.setFontSize(12) // 文字字号：12px
        // ctx.fillText("作者:薛定谔了猫", 50, codeH )
        
      
        let R
        let fsm = wx.getFileSystemManager();
        // wx.removeStorageSync
        // 因wx.getImageInfo获取不到base64的信息 
        //转换base64解码
        let buffer = that.data.codeUrl.replace('data:image/png;base64,', '');
        // +new Date().getTime() 避免安卓缓存问题
        let Yo=wx.env.USER_DATA_PATH + "/" + new Date().getTime() + ".png"
        fsm.writeFile({
          filePath:Yo, 
          data: buffer,
          encoding: 'base64',
          success(res) {
            console.log(res)
            R = wx.env.USER_DATA_PATH + '/test.png';
            // 获取图片信息
            wx.getImageInfo({
              src: Yo,
              success: function (res) {
                let HOS = setfixW / 4;
                console.log(HOS)
                ctx.drawImage(res.path, W, H, HOS, HOS)
                ctx.stroke()
                ctx.draw();
                 console.log('121331')
                wx.showToast({
                  title: '制作中',
                  icon: 'loading',
                  duration: 2000
                });
                setTimeout(function () {
                  wx.canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    width: setfixW,
                    height: imgUrlH,
                    destWidth: setfixW * 2,
                    destHeight: imgUrlH * 2,
                    canvasId: 'shareCanvas',
                    success(res) {
                      console.log(res.tempFilePath, '合成图片成功');
                      let Imgs = res.tempFilePath;
                      that.setData({
                        ts: 2,
                        saveImg: res.tempFilePath
                      })
                      // 将合成图片图片上传到服务器到海报列表
                      that.uplodeHeadImg(that, Imgs);
                    }
                  });
                }, 2000)
              },
              fail() {
                console.log(res)
              },
            });
          }
        })


     


      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  Save: function () {
    let that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
            },
            fail() {
              that.file()
            }
          });
        } else {
          that.file();
          // that.popupClose();
        }
      }
    });
  },
  file: function () {
    console.log(888888)
    let that = this;
    console.log(that.data.saveImg, 'saveImg')
    wx.saveImageToPhotosAlbum({
      filePath: that.data.saveImg,
      success(res) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        });
      },
      fail(res) {
        wx.showToast({
          title: '保存失败',
          icon: 'fail',
          duration: 2000
        });
        wx.openSetting({
          success(res) {
            console.log(res.authSetting)
            res.authSetting = {
              "scope.writePhotosAlbum": true,
            }
          }
        })


      }

    })

  },
  popupClose: function () {
    let that = this;
    that.setData({
      lucency: false,
      windUp: false,
    })

  },
  // 选择商品
  commodity: function () {
    let that = this;
    console.log(that.data.ts)

    if (!that.data.windUp) {
      that.setData({
        lucency: true
      })
    }


  },
  //转换
  beChange: function () {
    let that = this;
    console.log(that.data.ts)
    if (that.data.next != 6) {
      that.countermand()
    } else {
      that.achieve();
      if (that.data.imgUrl != '') {
        that.setData({
          Fixtitle: 2
        })
      } else {
      }
    }

  },
  Jump: function () {
    wx.navigateTo({
      url: "/pages/member/createImage/createImage",
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    this.onLoad();
    wx.clearStorage()
    that.tocomposite(); //商品标题数据
    that.toGoods(0, 0); //商品数据
    // 综合门类的数据
    app.sendRequest({
      url: "api.php?s=Distributor/getDistributorBrandList",
      method: 'POST',
      success: function (res) {
        let synthesize_list = res.data
        that.setData({
          synthesize_list: synthesize_list
        })
      }
    });
  },
  //商品标题 
  tocomposite: function () {
    let that = this;
    //商品标题 
    app.sendRequest({
      url: "api.php?s=/index/categoryLists",
      data: {},
      method: 'POST',
      success: function (res) {
        let category_list = res.data
        // console.log(res.data)
        // unshift
        category_list.push(that.data.bRands);
        category_list.unshift(that.data.grabble);

        for (let index in category_list) {
          category_list[index].select = 1;
        }
        category_list[0].select = 2;
        that.setData({
          category_list: category_list
        })
      }
    });
  },
  // 商品标题点击
  selectCheck: function (e) {
    let category_list = this.data.category_list;
    let id = e.currentTarget.dataset.id;
    // 判断是否商品和品牌类别
    // let le = typeof (id) == "number" ? 1 : 2;
    let le;
    for (var i = 0; i < category_list.length; i++) {
      category_list[i].select = 1;
      if (category_list[i].category_id == id) {
        category_list[i].select = 2;
      }

    }
    if (id == 'Y') {
      le = 3;
    } else if (id == 'X') {
      le = 2;
    } else { le = 1; }
    console.log(id)
    this.setData({
      category_list: category_list,
      category_goods: [],
      category_id: id,
      brand_id: id,
      page: 1,
      category: le
    })
    if (le == 1) this.toGoods(id, 1);

  },
  distinction: function () {
    let id = e.currentTarget.dataset.id;
  },
  toGoods: function (id, page, text) {
    var that = this;
    var category_goods = that.data.category_goods;
    var page = that.data.page;
    console.log(text)

    let reData;
    if (text != undefined) {
      reData = {
        category_id: id,
        search_text: text
      }
    } else {
      reData = {
        category_id: id,
        page_index: page,
      }
    }


    // 获取商品分类标题点击的商品
    app.sendRequest({
      url: "api.php?s=/index/branchPro",
      data: reData,
      method: 'POST',
      success: function (res) {
        let new_category_goods = res.data.pro.data;
        if (new_category_goods[0] != undefined) {
          page++;
        }
        let category_pic = res.data.category_pic;
        category_goods = category_goods.concat(new_category_goods);
        // 判断是文本精确搜索还是更多商品
        category_goods = text == undefined ? category_goods : res.data.pro.data;
        console.log(category_goods)
        that.setData({
          category_goods: category_goods,
          category_pic: category_pic,
          page: page,
        })
      }
    });
  },

  // 选中商品
  Chooseshop: function (e) {
    let category_goods = this.data.category_goods;
    let synthesize_list = this.data.synthesize_list;
    let category=this.data.category;
    let index = e.currentTarget.dataset.i;
    var name = e.currentTarget.dataset.title;
    let beTitle = '下一步'
     if(category==1){
      if (index) {
        // 选中的礼物的下标
        let index = e.currentTarget.dataset.i;
        // 先改变全部礼物都为不选中
        let category_goods = this.data.category_goods;
        console.log(category_goods)
        for (let i = 0; i < category_goods.length; i++) {
          if (category_goods[i].goods_id == index) {
            category_goods[i].selected = true;
          } else {
            category_goods[i].selected = false;
          }
        }
      }
     }else{
     // 先改变全部礼物都为不选中
     for (let i = 0; i < synthesize_list.length; i++) {
      if (synthesize_list[i].brand_id == index) {
        synthesize_list[i].selected = true;
      } else {
        synthesize_list[i].selected = false;
      }
    }
     }
     console.log(index )

    this.setData({
      category_goods: category_goods,
      synthesize_list: synthesize_list,
      gooSid: index,
      name: name,
      next: 6,
      maKestep:3
    })
  },
  // 商品品牌点击
  toCheckActive: function (e) {
    var id = e.currentTarget.dataset.id
    if (id == 1) {
      this.setData({
        isActive: 1
      })
    } else {
      this.setData({
        isActive: 2
      })
    }
  },
  showBox: function (title, icon) {
    if (!icon) {
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.showToast({
        title: title,
        icon: icon,
        duration: 1000
      })
    }


  },
  //取消
  countermand: function () {
    let that = this;
    let TS = that.data.ts
    if (TS == 0 || TS == 2 || TS == 3) {
      wx.navigateTo({
        url: "/pages/member/posterList/posterList",
      })

      that.popupClose();
    } else {
      wx.showModal({
        title: '提示',
        content: '您的作品尚未完成,是否取消？',
        success(res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
            // console.log('用户点击确定')
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
      that.popupClose();
    }
    // //刷新当前页面的数据
    // getCurrentPages()[getCurrentPages().length - 1].data

  },
  Close: function () {
    let that = this;
    that.popupClose();
  },
  //公共
  Commonality: function () {
    let that = this;
    that.Drawing();
    that.popupClose();
    that.setData({
      ts: 3,
      windUp: true
    })
  },
  //完成
  achieve: function () {
    let that = this;
    let id=that.data.gooSid
    console.log(that.data.gooSid);
    if (!that.data.imgUrl) {
      that.showBox('您还没有选择图片')
    } else if (!that.data.gooSid) {
      // that.Commonality();
      that.showBox('您还没有选择')
    } else {

      if (that.data.category == 1 || that.data.category == 3) {
        //小程序码shop图片
        app.sendRequest({
          url: "api.php?s=Distributor/getDistributorGoodsWxCode",
          data: {
            goods_id: that.data.gooSid
          },
          success: function (res) {
            let data = res.data;
            that.setData({
              codeUrl: data,
              Fixtitle: 2,
              ts: 2
            })
            that.Commonality();

          }
        })

      } else {
        //小程序码综合图片
        app.sendRequest({
          url: "api.php?s=Distributor/getDistributorBrandWxCode",
          data: {
            brand_id: that.data.gooSid,
            ts: 2
          },
          success: function (res) {
            let data = res.data;
            that.setData({
              codeUrl: data,
              ts: 2
            })
            that.Commonality();

          }
        })
      }


    }


  },

  // 上传图片
  uploading: function () {

    let that = this;
    that.setData({
      lucency: false
    })
    if (!that.data.windUp) {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: 'compressed',
        // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        // sourceType : 可以指定来源是相册还是相机，默认二者都有
        // sourceType: ['album'], // 此为相册 
        // sourceType: ['camera'], // 此为相机
        success: function (res) {
          let tempFiles = res.tempFilePaths[0];
          let filePath = res.tempFiles[0];
          console.log(tempFiles, '679')
          console.log(tempFiles);
          that.setData({
            imgUrl: tempFiles,
            ts: 1,
            maKestep:2
          })
        },
        fail: function (res) {
          that.showBox('无法获取本地图片');
        }
      })
    }



  },
  /**
  * 上传至服务器
  */
  uplodeHeadImg: function (that, filePath) {
    let name = 'file_upload';
    let img_list = that.data.img_list;
    let base = app.globalData.siteBaseUrl;
    if (filePath == '') {
      wx.navigateBack({
        delta: 1
      })
    }

    wx.uploadFile({
      url: base + 'api.php?s=upload/uploadFile',
      filePath: filePath,
      name: name,
      formData: {
        token: app.globalData.token,
        file_path: 'upload/wxcode/',
      },
      success: function (res) {
        console.log(res);
        let data = res.data;

        if (JSON.parse(data)) {
          data = JSON.parse(data);
        } else {
          app.showBox(that, '上传失败');
        }

        let code = data.code;
        if (code == 0) {
          let img_url = data.data.data;
          console.log(img_url)
          console.log(that.data.name)

          // 创建海报列表
          app.sendRequest({
            url: "api.php?s=Distributor/wxcodeAdd",
            data: {
              name: that.data.name,
              code_pic: img_url,
            },
            success: function (res) {
              console.log(res.data);
              var data = res.data
              if (res.statusCode == 200) {

              }

            }
          })

        } else {
          app.showBox(that, '上传失败');
        }
      },
      fail: function (res) {
        console.log(res);
        app.showBox(that, '上传失败');
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
 * 输入框绑定事件
 */
  searchInput: function (event) {
    let search_text = event.detail.value;
    this.setData({
      search_text: search_text
    })
  },

  /**
   * 搜索商品
   */
  search: function (event) {
    let that = this;

    let search_text = that.data.search_text;
    let ids = that.data.category_id
    console.log(ids)
    ids == '' ? '0' : ids

    that.toGoods(ids, 0, search_text);
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
  // onReachBottom: function () {
  // },
  lower: function () {
    let that = this;
    if (that.data.category == 1) {
      console.log('到底了大哥lower')
      let that = this;
      let category_id = that.data.category_id;
      let category_goods = that.data.category_goods;
      let page = that.data.page;
      this.toGoods(category_id, page);
    }
  },
})
