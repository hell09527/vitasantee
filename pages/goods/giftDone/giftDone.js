const app = new getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        prompt: '',
        Base: '', //库路径
        defaultImg: {},
        //遮罩层
        maskShow: 0,
        animation: '',
        edit: 0, //修改状态
        box_list: {}, //礼物盒商品列表
        check_all: 1, //全部选中
        is_checked: 1, //是否存在选中
        total_price: 0.00, //总价
        numAdjustFlag: 0,
        goodsDetailFlag: 0,
        settlementFlag: 0,
        showModal: false, // 显示弹框的 cust
        //carts_list:'',    // 需要发出去的ids
        carts_1_info:{    // 大贸 当订单同时包含跨境商品和大贸商品时
            total_price:0,
            total_num: 0
        },
        carts_2_info:{   // 跨境 当订单同时包含跨境商品和大贸商品时
            total_price:0,
            total_num: 0
        },
        check_1_carts:[],  // 选中的大贸商品列表
        check_2_carts:[],  // 选中的跨境商品列表
        send_type:2,    // 多类型订单时 选择发送类型 1 大贸 2跨境
        // 选中列表
        unselected_list:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let defaultImg = app.globalData.defaultImg;

        that.setData({
            defaultImg: defaultImg
        })
    },

    // custom start
    showDialogBtn: function() {
        this.setData({
            showModal: true
        })
    },
    /**
     * 弹出框蒙层截断touchmove事件
     */
    preventTouchMove: function () {

    },
    /**
     * 隐藏模态对话框
     */
    hideModal: function () {
        this.setData({
            showModal: false
        });
    },
    /**
     * 对话框取消按钮点击事件
     */
    onCancel: function () {
        this.hideModal();
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function () {
        var slist = [];
        if(this.data.send_type == 1){
            slist = this.data.check_1_carts;
        }else if(this.data.send_type == 2){
            slist = this.data.check_2_carts;
        }

        var boxs_list = '';
        slist.forEach((v)=>{
            "use strict";
            if (boxs_list == '') {
              // console.log(v.box_id)
              boxs_list = v.box_id;
            } else {
              boxs_list += ',' + v.box_id;
            }
        });
        // console.log(boxs_list)
      
      
        wx.navigateTo({
          url: '/pages/order/farewell/farewell?boxs_list=' + boxs_list + '&tag=2' + '&type='+this.data.send_type,
        })

        this.hideModal();
    },
    // custom end

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        //let that = this;
        //let siteBaseUrl = app.globalData.siteBaseUrl;

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this;
        let siteBaseUrl = app.globalData.siteBaseUrl;


        //判断是否是付费会员
        let is_vip = app.globalData.is_vip;
        // console.log(is_vip)

        that.setData({
            is_vip
        })

        that.setData({
            carts_1_info:{    // 大贸 当订单同时包含跨境商品和大贸商品时
                total_price:0,
                total_num: 0
            },
            carts_2_info:{   // 跨境 当订单同时包含跨境商品和大贸商品时
                total_price:0,
                total_num: 0
            },
            check_1_carts:[],  // 选中的大贸商品列表
            check_2_carts:[],   // 选中的跨境商品列表
            send_type:2,    // 多类型订单时 选择发送类型 1 大贸 2跨境
        });

        app.restStatus(that, 'settlementFlag');
        app.restStatus(that, 'goodsDetailFlag');

        app.sendRequest({
          url: 'api.php?s=goods/box',
            data: {},
            success: function (res) {
                let code = res.code;
                let total_price = 0.00;
                if (code == 0) {
                    let data = res.data;
                    // console.log(data)
                    for (let index in data) {
                        for (let key in data[index]) {
                          if (that.in_array(data[index][key].box_id, that.data.unselected_list)){
                                data[index][key].status = 0;
                                that.setData({
                                    check_all:0,
                                });
                            }else{
                                data[index][key].status = 1;
                            }

                            let promotion_price = parseFloat(data[index][key].promotion_price);
                            // console.log(promotion_price)
                            let num = parseInt(data[index][key].num);
                            if(data[index][key].status == 1){
                                total_price = parseFloat(total_price) + parseFloat(promotion_price * num);
                            }


                            //图片处理
                            if (data[index][key].picture_info != undefined && data[index][key].picture_info != null) {
                                let img = data[index][key].picture_info.pic_cover_small;
                                data[index][key].picture_info.pic_cover_small = app.IMG(img);
                            } else {
                                data[index][key].picture_info = {};
                                data[index][key].picture_info.pic_cover_small = '';
                            }
                        }
                    }
                    that.setData({
                        Base: siteBaseUrl,
                        box_list: data,
                        total_price: total_price.toFixed(2),
                        //check_all: 1,
                        edit: 0,
                        is_checked: 1
                    });
                }
                // console.log(res);
            }
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
    inputChange(e){
        "use strict";
        this.setData({
            send_type:e.detail.value
        })
    },
    /**
     * 图片加载失败
     */
    errorImg: function (e) {
        let that = this;
        let index = e.currentTarget.dataset.index;
        let key = e.currentTarget.dataset.key;
        let box_list = that.data.box_list;
        let defaultImg = that.data.defaultImg;
        let base = that.data.Base;
        let parm = {};
        let img = box_list[index][key].picture_info.pic_cover_small;

        if (defaultImg.is_use == 1) {
            let default_img = defaultImg.value.default_goods_img;
            if (img.indexOf(default_img) == -1) {
              let parm_key = "box_list." + index + "[" + key + "].picture_info.pic_cover_small";

                parm[parm_key] = default_img;
                that.setData(parm);
            }
        }
    },

    /**
     * 购物车修改
     */
    cartEdit: function (event) {
        let that = this;
        let edit = event.currentTarget.dataset.edit;
        let box_list = that.data.box_list;
        let total_price = 0.00;
        let status = edit == 1 ? 0 : 1;

        for (let index in box_list) {
          for (let key in box_list[index]) {
            box_list[index][key].status = status;
                if (status == 1) {
                  let promotion_price = parseFloat(box_list[index][key].promotion_price);
                  let num = parseInt(box_list[index][key].num);
                    total_price = parseFloat(total_price) + parseFloat(promotion_price * num);
                }
            }
        }

        that.setData({
            edit: edit,
            check_all: status,
            is_checked: status,
            box_list: box_list,
            total_price: total_price.toFixed(2),
        })
    },

    /**
     * 选中商品
     */
    selectCart: function (event) {
        let that = this;
        let i = event.currentTarget.dataset.index;
        let k = event.currentTarget.dataset.key;
        let status = event.currentTarget.dataset.status;
        let box_list = that.data.box_list;
        let total_price = that.data.total_price;
        let is_checked = 0;
        let check_all = 1;
        let promotion_price = parseFloat(box_list[i][k].promotion_price);
        let num = parseInt(box_list[i][k].num);

        if (status == 0) {
            status = 1;
            total_price = parseFloat(total_price) + parseFloat(promotion_price * num);
        } else {
            status = 0;
            total_price = parseFloat(total_price) - parseFloat(promotion_price * num);
        }

        box_list[i][k].status = status;

        for (let index in box_list) {
            for (let key in box_list[index]) {
                if (box_list[index][key].status == 1) {
                    is_checked = 1;
                }
                if (box_list[index][key].status == 0) {
                    check_all = 0;
                }
            }
        }

        that.setData({
            box_list: box_list,
            is_checked: is_checked,
            check_all: check_all,
            total_price: total_price.toFixed(2),
        })

        this.keep_unselected();
    },

    keep_unselected(){
        "use strict";
        var new_unselected_list = [];

        for(let i in this.data.box_list){
            this.data.box_list[i].forEach(v=>{
                if(v.status == 0){
                  new_unselected_list.push(v.box_id);
                }
            })
        }

        //this.data.cart_list.forEach();
        this.setData({
            unselected_list:new_unselected_list,
        })
    },

    /**
     * 全选
     */
    checkAll: function (event) {
        let that = this;
        let check_all = that.data.check_all;
        let box_list = that.data.box_list;
        let total_price = 0.00;
        let status = 0;

        if (check_all == 1) {
            check_all = 0;
            status = 0;
        } else {
            check_all = 1;
            status = 1;
        }
        // console.log(check_all)
        for (let index in box_list) {
            for (let key in box_list[index]) {
                box_list[index][key].status = status;
                if (status == 1) {
                    let promotion_price = parseFloat(box_list[index][key].promotion_price);
                    let num = parseInt(box_list[index][key].num);
                    total_price = parseFloat(total_price) + parseFloat(promotion_price * num);
                }
            }
        }

        that.setData({
            check_all: check_all,
            box_list: box_list,
            is_checked: check_all,
            total_price: total_price.toFixed(2),
        })

        this.keep_unselected();
    },

    /**
     * 数量调节
     */
    numAdjust: function (event) {
        let that = this;
        let adjust_type = event.currentTarget.dataset.type;
        let i = event.currentTarget.dataset.index;
        let k = event.currentTarget.dataset.key;
        let id = event.currentTarget.dataset.id;
        let numAdjustFlag = that.data.numAdjustFlag;
        let box_list = that.data.box_list;
        let num = box_list[i][k].num;
        // console.log(num)
        let total_price = that.data.total_price;

        if (numAdjustFlag == 1) {
            return false;
        }

        app.clicked(that, 'numAdjustFlag');

        app.sendRequest({
            url: 'api.php?s=goods/box',
            data: {},
            success: function (res) {
                let code = res.code;
                if (code == 0) {
                    let new_cart_list = res.data;
                    let stock = new_cart_list[i][k].stock;
                    let max_buy = new_cart_list[i][k].max_buy
                    let min_buy = new_cart_list[i][k].min_buy;
                    //加
                    if (adjust_type == 'add') {
                        if (num < stock) {
                            if (max_buy > 0 && num >= max_buy) {
                                app.showBox(that, '该商品最多购买' + max_buy + '件');
                                app.restStatus(that, 'numAdjustFlag');
                                return false;
                            }
                        } else {
                            app.showBox(that, '已达到最大库存');
                            app.restStatus(that, 'numAdjustFlag');
                            return false;
                        }
                        num++;
                    }
                    //减
                    if (adjust_type == 'minus') {
                        if (num > 0) {
                            if (num == min_buy && min_buy > 0) {
                                app.showBox(that, '该商品最少购买' + min_buy + '件');
                                app.restStatus(that, 'numAdjustFlag');
                                return false;
                            }
                            if (num == 1) {
                                app.showBox(that, '该商品最少购买' + 1 + '件');
                                app.restStatus(that, 'numAdjustFlag');
                                return false;
                            }
                            num--;
                        }
                    }

                    new_cart_list[i][k].num = num;
                    //新数组添加选中状态
                    total_price = 0.00;
                    for (let index in box_list) {
                        for (let key in box_list[index]) {
                            new_cart_list[index][key].status = box_list[index][key].status;
                            let promotion_price = parseFloat(new_cart_list[index][key].promotion_price);
                            let num = parseInt(new_cart_list[index][key].num);

                            if(new_cart_list[index][key].status){
                                total_price = parseFloat(total_price) + parseFloat(promotion_price * num);

                            }

                        }
                    }
                    //执行
                    app.sendRequest({
                        url: 'api.php?s=goods/boxAdjustNum',
                        data: {
                            box_id: id,
                            num: num,
                        },
                        success: function (res) {
                            let code = res.data;
                            if (code > 0) {
                                that.setData({
                                    box_list: new_cart_list,
                                    total_price: total_price.toFixed(2),
                                })
                                app.restStatus(that, 'numAdjustFlag');
                            } else {
                                app.showBox(that, '操作失败');
                                app.restStatus(that, 'numAdjustFlag');
                            }
                        }
                    })
                }
            }
        })
    },

    /**
     * 输入数量调节
     */
    inputAdjust: function (event) {
        let that = this;
        let i = event.currentTarget.dataset.index;
        let k = event.currentTarget.dataset.key;
        let id = event.currentTarget.dataset.id;
        let box_list = that.data.box_list;
        let num = event.detail.value;
        let total_price = that.data.total_price;

        app.sendRequest({
            url: 'api.php?s=goods/box',
            data: {},
            success: function (res) {
                let code = res.code;
                if (code == 0) {
                    let new_cart_list = res.data;
                    let stock = new_cart_list[i][k].stock;
                    let max_buy = new_cart_list[i][k].max_buy
                    let min_buy = new_cart_list[i][k].min_buy;

                    if (max_buy > 0) {
                        if (num >= max_buy) {
                            app.showBox(that, '该商品最多购买' + max_buy + '件');
                            num = max_buy;
                        }
                    } else {
                        if (num >= stock) {
                            app.showBox(that, '已达到最大库存');
                            num = stock;
                        }
                    }

                    if (min_buy > 0) {
                        if (num <= min_buy) {
                            app.showBox(that, '该商品最少购买' + min_buy + '件');
                            num = min_buy;
                        }
                    } else {
                        if (num <= 0) {
                            app.showBox(that, '该商品最少购买' + 1 + '件');
                            num = 1;
                        }
                    }

                    new_cart_list[i][k].num = num;
                    // console.log(num)
                    //新数组添加选中状态
                    total_price = 0;
                    for (let index in box_list) {
                        for (let key in box_list[index]) {
                            new_cart_list[index][key].status = box_list[index][key].status;
                            let promotion_price = parseFloat(new_cart_list[index][key].promotion_price);
                            let num = parseInt(new_cart_list[index][key].num);
                            total_price = parseFloat(total_price) + parseFloat(promotion_price * num);
                        }
                    }
                    // console.log(num)
                    // console.log(id)
                    //执行
                    app.sendRequest({
                        url: 'api.php?s=goods/boxAdjustNum',
                        data: {
                            box_id: id,
                            num: num,
                        },
                        success: function (res) {
                            let code = res.data;
                            if (code > 0) {
                                that.setData({
                                    box_list: new_cart_list,
                                    total_price: total_price.toFixed(2),
                                })
                            } else {
                                app.showBox(that, '操作失败');
                            }
                        }
                    })
                }
            }
        })
    },

    /**
     * 删除商品
     */
    deleteCart: function (event) {
        let that = this;
        let box_list = that.data.box_list;
        // console.log(box_list )
        let del_id = '';

        for (let index in box_list) {
            for (let key in box_list[index]) {
                if (box_list[index][key].status == 1) {
                    if (del_id == '') {
                        del_id += box_list[index][key].box_id;
                    } else {
                      del_id += ',' + box_list[index][key].box_id;
                    }
                }
            }
        }
        // console.log(del_id)
        app.sendRequest({
            url: 'api.php?s=goods/boxDelete',
            data: {
                del_id: del_id,
            },
            success: function (res) {
                let code = res.data;
                if (code > 0) {
                    app.sendRequest({
                        url: 'api.php?s=goods/box',
                        data: {},
                        success: function (res) {
                            let code = res.code;
                            if (code == 0) {
                                box_list= res.data;
                                //新数组添加选中状态
                                let total_price = 0.00;

                                for (let index in box_list) {
                                    for (let key in box_list[index]) {
                                        box_list[index][key].status = 0;
                                        let promotion_price = parseFloat(box_list[index][key].promotion_price);
                                        let num = parseInt(box_list[index][key].num);
                                        total_price = parseFloat(total_price) + parseFloat(promotion_price * num);
                                    }
                                }

                                that.setData({
                                    box_list: box_list,
                                    total_price: total_price.toFixed(2),
                                })

                                app.showBox(that, '操作成功');
                            }
                        }
                    });
                } else {
                    app.showBox(that, '操作失败');
                }
            }
        })
    },

    /**
     * 首页跳转
     */
    aIndex: function (event) {
        let url = event.currentTarget.dataset.url;
        wx.navigateTo({
          url:  url,
        })
    },


    /**
     * 结算
     */
    settlement: function (event) {
        let that = this;
        let box_list = that.data.box_list;
        let type = 1;
        let settlementFlag = that.data.settlementFlag;
        let boxs_list = '';

        let cart_1 = [];
        let cart_2 = [];
        let carts_1 = ''; // 大贸
        let carts_2 = ''; // 跨境

        if (settlementFlag == 1) {
            return false;
        }

        var total_price_1 = 0;
        var total_price_2 = 0;
        var total_num_1 = 0;
        var total_num_2 = 0;
        for (let index in box_list) {
            for (let key in box_list[index]) {
              let box_id = box_list[index][key].box_id;

                if(box_list[index][key].status == 1){
                    // 大贸
                    if(box_list[index][key].source_type == 1){
                        if(carts_1 == ''){
                          carts_1 = box_id;
                        }else{
                          carts_1 += ',' + box_id;
                        }
                        total_price_1 += box_list[index][key].num * box_list[index][key].promotion_price
                        total_num_1  += box_list[index][key].num
                        cart_1.push(box_list[index][key]);
                        // 跨境
                    } else if(box_list[index][key].source_type == 2){
                        if(carts_2 == ''){
                          carts_2 = box_id;
                        }else{
                          carts_2 += ',' + box_id;
                        }
                        total_price_2 += box_list[index][key].num * box_list[index][key].promotion_price
                        total_num_2  += box_list[index][key].num
                        cart_2.push(box_list[index][key]);
                    }

                    if (boxs_list == '') {
                        boxs_list = box_id;
                    } else {
                        boxs_list += ',' + box_id;
                    }
                }
            }
        }

        if(carts_1 != '' && carts_2 != ''){
            this.setData({
                check_1_carts:cart_1,
                check_2_carts:cart_2,
                carts_1_info:{
                  total_price: total_price_1.toFixed(2),
                  total_num: total_num_1.toFixed(2),
                },
                carts_2_info:{
                  total_price: total_price_2.toFixed(2),
                  total_num: total_num_2.toFixed(2),
                },
            });
            this.showDialogBtn();
            return ;
        }

        app.clicked(that, 'settlementFlag');
        var goods_type = 1;
        if(cart_2 != '') goods_type = 2;
        let checkout = that.data.check_all
        // console.log(checkout)
        if (cart_2 == '' && cart_1 == '') {
            wx.showToast({
                title: '未选择商品',
                icon: 'loading',
                duration: 2000
            })
            that.setData({
                settlementFlag:0
            })
        }else{
 
            wx.navigateTo({
              url: '/pages/order/farewell/farewell?boxs_list=' + boxs_list + '&tag=2' + '&type=' + goods_type,
            })
        }



    },
    /**
     * 商品 分类结算
     */
    crossBorder: function (event) {
        let type = event.currentTarget.dataset.type;
        let status = 0;
        let animation = wx.createAnimation({
            duration: 3000,
            timingFunction: 'ease-in',
            transformOrigin: "50% 50% 0",
            delay: 0
        })

        animation.opacity(1).translateX(-100).step();
        this.animation = animation;
        this.setData({
            sBuy: 1,
            maskShow: 1,
            buyButtonStatus: status,
            animation: this.animation.export()
        })

    },
    /**
     * 关闭弹框
     */
    popupClose: function (event) {
        this.setData({
            sBuy: 0,
            popupShow: 0,
            serviceShow: 0,
            maskShow: 0,
            ladderPreferentialShow: 0,
        })
    },

    show_test(e){
        wx.showActionSheet({
            itemList: ['A', 'B', 'C'],
            success: function(res) {
                // console.log(res.tapIndex)
            },
            fail: function(res) {
                // console.log(res.errMsg)
            }
        })
    },
    /**
     * 商品详情
     */
    goodsDetail: function (e) {
        let that = this;
        let goods_id = e.currentTarget.dataset.id;
        let goods_name = e.currentTarget.dataset.name;
        let goodsDetailFlag = that.data.goodsDetailFlag;

        if (goodsDetailFlag == 1) {
            return false;
        }
        app.clicked(that, 'goodsDetailFlag');

        wx.navigateTo({
            url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + goods_id + '&&goods_name=' + goods_name,
        })
    },

    verification: function (e) {
        let that = this;
        let box_list = that.data.box_list;
        // console.log("hehe", that.data.box_list)
        let carts_list = JSON.stringify(box_list);
        // console.log(carts_list)
        wx.navigateTo({
            url: '/pages/goods/verification/verification?box_list=' + box_list,
        })
    },

    in_array(obj, arr) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    },
})

