const app = new getApp();

const SERVERS = require('../../../utils/servers.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        prompt: '',
        out_trade_no: '',
        pay_money: 0.00,
        nick_name: '',
        payOrderFlag: 0,
        present: 0,  //判断支付来源  0：正常商品 1：礼物商品 
        pt_startup_id: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let ty = options.Ty
        let isIphoneX = app.globalData.isIphoneX;
        this.setData({
            isIphoneX: isIphoneX
        })
        console.log(ty)
        if (ty == 8) {
            that.setData({
                ty
            })
        }
        let out_trade_no = options.out_trade_no;
        console.log(out_trade_no)
        let present = options.present;
        console.log(present)
        that.setData({
            present
        })

        if (out_trade_no == undefined || out_trade_no == '') {
            wx.switchTab({
                url: '/pages/index/index'
            });
            return;
        }

        wx.request({
            url: app.globalData.siteBaseUrl + 'api.php?s=pay/getPayValue',
            method: "POST",
            data: {
                token: app.globalData.token,
                out_trade_no: out_trade_no
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                let code = res.data.code;
                let data = res.data.data;
                if (code == 0) {
                    var pay_money = data.pay_value.pay_money;
                    var nick_name = data.nick_name;
                    that.setData({
                        out_trade_no: out_trade_no,
                        pay_money: pay_money,
                        nick_name: nick_name,
                        pt_startup_id: options.pt_startup_id
                    })
                } else {
                    wx.switchTab({
                        url: '/pages/index/index'
                    });
                    //wx.navigateTo({
                    //    url: '/pages/order/myorderlist/myorderlist'
                    //});
                }
            }
        })

        let pages = getCurrentPages();
        //console.log(pages);
        let prevPage = pages[pages.length - 2];  //上一个页面

        prevPage.setData({
            cancle_pay: 1
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
        console.log(app.globalData.openid, '97')
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
     * 确认支付
     */
    payOrder: function (event) {
        let that = this;
        let pay_money = that.data.pay_money
        let out_trade_no = that.data.out_trade_no;
        let openid = app.globalData.openid;
        console.log(openid, '135')
        let payOrderFlag = that.data.payOrderFlag;
        console.log(that.data.ty)

        if (payOrderFlag == 1) {
            return false;
        }
        app.clicked(that, 'payOrderFlag');

        // SERVERS.CART.appletWechatPay.post({
        //     out_trade_no: out_trade_no,
        //     openid: openid
        // }).then(res => console.log(res)).catch(e => console.log(e));

        app.sendRequest({
            url: 'api.php?s=pay/appletWechatPay',
            data: {
                out_trade_no: out_trade_no,
                openid: openid
            },
            success: function (res) {
                let data = res.data;
                if (data.return_code == 'FAIL') {
                    app.showBox(that, '支付失败');
                    app.restStatus(that, 'payOrderFlag');
                    return false;
                }
                let out_trade_no = that.data.out_trade_no;
                console.log(res, "iuhygtfrewdewc", that.data.ty)
                wx.requestPayment({
                    timeStamp: data.timestamp.toString(),
                    nonceStr: data.nonce_str,
                    'package': 'prepay_id=' + data.prepay_id,
                    signType: 'MD5',
                    paySign: data.PaySign,
                    success: function (res) {
                        console.log(res, 'UId');
                        //  优惠卷
                        app.sendRequest({
                            url: 'api.php?s=Order/giveFullOfGifts',
                            data: {
                                out_trade_no: out_trade_no,
                            },
                            success(res) {

                            }
                        })

                        app.sendRequest({
                            url: 'api.php?s=order/orderPayTemplateCreate',
                            data: {
                                out_trade_no: out_trade_no,
                                open_id: app.globalData.openid,
                                form_id: event.detail.formId,
                                warn_type: 1,
                                send_type: that.data.ty,
                                price: pay_money
                            },
                            success(c) {
                                "use strict";
                                console.log(that.data.present)
                                that.data.present
                                if (that.data.present == 1) {
                                    // console.log(1111)
                                    app.aldstat.sendEvent('礼物商品支付成功');
                                    wx.navigateTo({
                                        url: '/pages/pay/paycallback/paycallback?type=1&&status=1&&out_trade_no=' + out_trade_no + '&pt_startup_id=' + that.data.pt_startup_id,
                                    })
                                } else if (that.data.present == 2) {
                                    // app.aldstat.sendEvent('支付成功');
                                    // console.log(222)
                                    wx.reLaunch({
                                        url: '/package/payMembers/paySuccess/paySuccess',
                                    })
                                } else {
                                    // console.log(333)
                                    app.aldstat.sendEvent('普通商品支付成功');

                                    wx.navigateTo({
                                        url: '/pages/pay/paycallback/paycallback?status=1&out_trade_no=' + out_trade_no + '&pt_startup_id=' + that.data.pt_startup_id,
                                    })
                                }

                            }
                        });

                        // wx.navigateTo({
                        //    url: '/pages/pay/paycallback/paycallback?status=1&out_trade_no=' + out_trade_no,
                        // })
                    },
                    fail: function (res) {
                        console.log(res);
                        //取消支付
                        if (res.errMsg == 'requestPayment:fail cancel') {
                            app.showBox(that, '取消支付');
                            if(!that.data.pt_startup_id){
                                wx.navigateTo({
                                    url: '/pages/pay/paycallback/paycallback?status=-1&out_trade_no=' + out_trade_no + '&pt_startup_id=' + that.data.pt_startup_id,
                                });
                            }else{
                                wx.navigateBack({
                                    delta: 2
                                });
                            }
                        }
                    },
                    complete: function (res) {
                        // wx.reLaunch({
                        //   url: '/pages/pay/paycallback/paycallback',
                        // })
                    }
                })
            }
        })
    }
})