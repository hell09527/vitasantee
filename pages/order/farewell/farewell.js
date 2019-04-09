 const app = new getApp();
var time = require("../../../utils/util.js");
var md5 = require("../../../utils/encrypt.js")

Page({
    /**
     * 页面的初始数据
     */
    data: {
        prompt: '',
        max: 0,
        Base: '',
        defaultImg: {},
        cancle_pay: 0,
        combo_id: 0,
        combo_buy_num: 1,
        order_top_image: [1, 2, 3, 4, 5],
        order_tag: '',
        order_goods_type: '',
        order_source_type: "",
        order_sku_list: '',
        box_list: '',
        coupon_list: {},
        discount_money: 0.00,
        express_company_list: {},
        goods_list: {},
        member_account: {},
        order_total_money: {},
        pick_up_money: 0.00,
        promotion_full_mail: {},
        goods_sku_list: '',
        pay_money: 0.00, //应付金额
        mask_status: '', //遮罩层
        pay_box_status: 0, //支付方式弹框
        delivery_status: 0, //配送方式弹框
        delivery_type: 1, //配送方式
        coupon_status: 0, //优惠券弹框
        use_coupon: 0, //优惠券
        coupon_money: 0.00, //优惠券金额
        integral: 0, //积分
        user_telephone: '', //手机号
        leavemessage: '', //留言
        // isChange:0,  //判断留言框值是否变化
        balance: 0.00, //使用余额
        pay_type: 0, //支付方式
        order_invoice_money: 0.00, //发票税额
        invoice_status: 0, //发票弹框
        invoice_need: 0, //是否需要发票
        invoice_title: '', //发票抬头
        taxpayer_identification_number: '', //纳税人识别号
        invoice_content_status: 0, //发票内容弹框
        invoice_content: '', //发票内容
        pick_up_status: 0, //自提点弹框
        pick_up: 0, //自提点id,
        pick_up_point: '', //自提点
        //pick_up_money: 0.00, //自提点运费
        express_company_status: 0, //物流公司弹框
        shipping_company_id: 0, //物流公司id
        express_company: '', //物流公司
        express_money: 0.00, //物流运费
        shipping_time: [], //配送时间列表
        shipping_time_status: 0, //配送时间弹框
        shipping_time_index: -1, //配送时间偏移量
        commitOrderFlag: 0,
        myAddressFlag: 0,
        infoMess: '',
        Become: '1',
        type: '',
        is_use_card: "0",
        card_id: '',
        price: '',
        token: '',
        origin_money: 0,

        // 身份证类
        edit_card:false,
        card_name: '',
        card_no: '',
        encry_no: '',
        buffer_card_name:'',  // 编辑未保存 暂存身份证信息
        buffer_card_no:'',    // 编辑未保存 暂存身份证信息
        card_fouce:false,     // 失败聚焦
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        // 关闭这个接口
        
        // that.get_cards();
        let type = options.type
        //console.log(that.data.balance)
        let tag = options.tag;
        console.log(tag)
        let base = app.globalData.siteBaseUrl;
        let defaultImg = app.globalData.defaultImg;
        let balance = parseFloat(that.data.balance).toFixed(2);
        let order_invoice_money = parseFloat(that.data.order_invoice_money).toFixed(2);
        let copyRight = app.globalData.copyRight;
        that.setData({
            type: type,

        })
      // boxs_list
        if (tag == 1) {
            tag = 'buy_now';
            let sku = options.sku;
            let goods_type = options.goods_type;
            let source_type = options.source_type;
            //console.log(source_type)
            that.setData({
                order_source_type: source_type,
                order_goods_type: goods_type,
                order_sku_list: sku,
            })
        } else if (tag == 2) {
          console.log(11111122312321421)
            tag = 'box';
            let box_list= options.boxs_list
            console.log(box_list)
            let source_type = options.type;
            that.setData({
                order_source_type: source_type,
                box_list: box_list
            })
        } else if (tag == 3) {
            tag = 'combination_packages';
            let sku = options.sku;
            let goods_type = options.goods_type;
            let combo_id = options.combo_id;
            let num = options.num;

            that.setData({
                combo_id: combo_id,
                combo_buy_num: num,
                order_goods_type: goods_type,
                order_sku_list: sku,
            })
        } else if (tag == 4) {
            tag = 'groupbuy';
            let sku = options.sku;
            let goods_type = options.goods_type;

            that.setData({
                order_goods_type: goods_type,
                order_sku_list: sku
            })
        } else {
            app.showBox(that, '111无法获取订单信息');
            wx.navigateBack({
                delta: 1
            })
        }

        that.setData({
            Base: base,
            order_tag: tag,
            defaultImg: defaultImg,
            copyRight: copyRight,
            balance: balance,
            order_invoice_money: order_invoice_money,
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        let that = this;
        //涛哥接口对接
        //console.log(md5)
        let unionid = app.globalData.unionid
        let bc_key = "shopalbc2018"
        let timestamp = Date.parse(new Date());
        let time = timestamp
        let gather = unionid + bc_key + time;
        let sign = md5.hex_md5(gather);
        //console.log(sign)
    },

    get_cards(){
        let that = this;
        // that.setData({
        //   max: 0
        // });
        //console.log(md5)
        let unionid = app.globalData.unionid
        let bc_key = "shopalbc2018"
        let timestamp = Date.parse(new Date());
        let time = timestamp
        let gather = unionid + time + bc_key;
        //console.log(111111, gather)
        let sign = md5.hex_md5(gather);
        //console.log(sign)


        wx.request({
            url: "https://xin.91xdb.com/bc/frontend/user_card_list?",
            data: {
                unionid: unionid,
                timestamp: time,
                sign: sign
            },
            success: function (res) {
                let code = res.data.code
                if (code == 0) {
                    let discount = res.data.data
                    if (discount == '') {
                        //console.log(111111111)
                    } else {

                        if (discount.length == 1) {
                            let max = discount[0].price
                            let token = discount[0].token
                            let card_id = discount[0].card_id
                            that.setData({
                                discount: discount,
                                is_use_card: 1,
                                max: max,
                                card_id: card_id,
                                price: max,
                                token: token,
                            })

                            //console.log(that.data.max)
                            app.globalData.discount = discount
                            //console.log(discount)
                        } else {
                            // let discounts = that.data.datas
                            //console.log(discount)
                            let maxs = 0;
                            let index = 0;
                            discount.forEach((v, i) => {
                                // console.log(v);
                                v.price = parseFloat(v.price, 2);
                                //console.log('######', typeof v.price);
                                if (parseFloat(v.price) > maxs) {
                                    maxs = parseFloat(v.price).toFixed(2);
                                    index = i;
                                }
                                return v;
                            })

                            //console.log(discount[index]);
                            let max = discount[index].price;
                            //console.log(max);
                            // let hashMax = discount.reduce((a, p) => {
                            //   var temp_price = Number(parseFloat(p.price)).toFixed(2);
                            //   console.log(typeof temp_price, temp_price, p.price);
                            //   // p.price = parseFloat(p.price).toFixed(2);
                            //   maxs = Math.max(maxs, p.price);
                            //   console.log(p)
                            //   a[p.price] = a[p.price] || [];
                            //   a[p.price].push(p)
                            //   return a;
                            // }, {});
                            // console.log(hashMax[maxs])
                            // let max = hashMax[maxs]
                            var pay_money = that.data.origin_money - max;

                            that.setData({
                                discount: discount,
                                is_use_card: 1,
                                max: max,
                                pay_money: pay_money,
                            })

                            app.globalData.discount = discount
                            //console.log(discount)
                        }


                    }


                }
            },
            fail(){
                let discount = that.data.datas
                let maxs = 0
                let hashMax = discount.reduce((a, p) => {
                    maxs = Math.max(maxs, p.price)
                    a[p.price] = a[p.price] || [];
                    a[p.price].push(p)
                    return a;
                }, {});
                //console.log(hashMax[maxs])
                let max = hashMax[maxs]

                that.setData({
                    discount: discount,
                    is_use_card: 1,
                    max: max
                })

                //console.log(that.data.max)
                app.globalData.discount = discount
                //console.log(discount)
            }

        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this;
        //console.log(that.data.card_id)

        let myAddressFlag = that.data.myAddressFlag;
        let cancle_pay = that.data.cancle_pay;
        app.restStatus(that, 'myAddressFlag');

        if (cancle_pay == 1) {
            app.setTabParm('cancle_pay');
            let tab_parm = app.globalData.tab_parm;
            app.globalData.tab = 2

            wx.switchTab({
                url: '/pages/member/member/member',
            })
        }


        wx.getStorage({
            key: 'key',
            success: function (res) {
                //console.log(res.data)
                let cost = res.data.price
                let Token = res.data.token
                let Carid = res.data.car_id
                let usefo = res.data.usefo

                that.setData({
                    token: Token,
                    card_id: Carid,
                    max: cost,
                    is_use_card: usefo,
                })
            }
        })


        let pay_money = that.data.pay_money;
        let order_tag = that.data.order_tag;
        let order_goods_type = that.data.order_goods_type;
        let order_sku_list = that.data.order_sku_list;
        let box_list = that.data.box_list;


        let parm = {
            order_tag: order_tag
        };

        if (order_tag == 'buy_now') {
            parm.order_goods_type = order_goods_type;
            parm.order_sku_list = order_sku_list;
        } else if (order_tag == 'box') {
            parm.box_list = box_list;
        } else if (order_tag == 'combination_packages') {

            let combo_id = that.data.combo_id;
            let combo_buy_num = that.data.combo_buy_num;

            parm.order_sku_list = order_sku_list;
            parm.combo_id = combo_id;
            parm.order_goods_type = order_goods_type;
            parm.combo_buy_num = combo_buy_num;

        } else if (order_tag == 'groupbuy') {

            parm.order_sku_list = order_sku_list;

        } else {

            app.showBox(that, '无法获取订单信息');
            wx.navigateBack({
                delta: 1
            })
            return false;
        }
        console.log(parm)

        app.sendRequest({
            url: 'api.php?s=order/getOrderData',
            data: parm,
            success: function (res) {
                let code = res.code;
                let data = res.data;
                console.log(data)

                if (code == 0) {
                    if (typeof data.card_no !== 'undefined' ) {
                        let user_info = {
                            card_no: data.card_no,
                            card_name: data.card_name,
                            encry_no: that.plusXing(data.card_no, 1, 4),
                        };
                        that.setData(user_info);
                    }

                    //选中默认优惠券
                    let coupon_list = data.coupon_list;
                    let use_coupon = that.data.use_coupon;
                    let coupon_money = parseFloat(that.data.coupon_money);
                    let user_telephone = that.data.user_telephone;
                    let shop_config = data.shop_config;

                    if (coupon_list != undefined && coupon_list[0] != undefined && use_coupon == 0) {
                        use_coupon = coupon_list[0].coupon_id;
                        coupon_money = parseFloat(coupon_list[0].money);
                        console.log(coupon_money,'####')
                    }
                    
                    if (user_telephone == '' && data.user_telephone != undefined) {
                        user_telephone = data.user_telephone;
                    }

                    if (order_tag == 'buy_now' && order_goods_type == 0) {
                        data.express = 0.00;
                    }


                    let discount_money = parseFloat(data.discount_money) + coupon_money;
                    let balance = parseFloat(that.data.balance);
                    let new_pay_money = parseFloat(data.count_money)  - discount_money - balance;
                    // + parseFloat(data.express)
                    let constant = parseFloat(data.count_money)  - discount_money - balance;

                    //未开启商家配送 开启买家自提
                    if (shop_config.seller_dispatching == 0 && shop_config.buyer_self_lifting == 1) {
                      new_pay_money = parseFloat(data.count_money) + parseFloat(data.pick_up_money) - discount_money - balance;

                      let point_list = data.pickup_point_list.data;
                      let pick_up = point_list[0] == undefined ? 0 : point_list[0].id;
                      let pick_up_point = point_list[0] == undefined ? '' : point_list[0].province_name + '　' + point_list[0].city_name + '　' + point_list[0].dictrict_name + '　' + point_list[0].address;

                      that.setData({
                        delivery_type: 2,
                        pick_up: pick_up,
                        pick_up_point: pick_up_point,

                      })
                    }

                    pay_money = parseFloat(pay_money) > 0 ? pay_money : new_pay_money;
                    pay_money = pay_money < 0 ? 0.00 : pay_money;

//is_use_card判断
                    // let money = constant
                  
                    // that.data.max
                    // if (that.data.is_use_card == 1) {

                    //     pay_money = Number(money) - Number(that.data.max)
                    // }


                    let shipping_company_id = that.data.shipping_company_id;
                    let express_company = that.data.express_company;
                    let express_company_list = data.express_company_list;
                    express_company_list = express_company_list == undefined ? [] : express_company_list;
                    data.address_default = data.address_default == undefined ? [] : data.address_default;
                    data.promotion_full_mail = data.promotion_full_mail == undefined ? [] : data.promotion_full_mail;

                    //选中默认物流
                    if (parseInt(data.express_company_count) > 0 && shipping_company_id == 0 && data.express_company_list[0] != undefined && shop_config.seller_dispatching == 1) {
                        for (let index in express_company_list) {
                            if (express_company_list[index].is_default == 1) {
                                shipping_company_id = express_company_list[index].co_id;
                                express_company = data.express_company_list[index].company_name;
                            }
                        }

                        if (shipping_company_id == 0 && parseInt(data.express_company_count) > 0 && data.express_company_list[0] != undefined && shop_config.seller_dispatching == 1) {
                            shipping_company_id = express_company_list[0].co_id;
                            express_company = express_company_list[0].company_name;
                        }
                    }


                    if (data.address_default != undefined && data.address_default.address_info != undefined) {
                        let address_info = data.address_default.address_info;
                        data.address_default.address_info = address_info.replace(/&nbsp;/g, '　');
                    }
                    let order_info = data;
                    console.log(order_info.itemlist)
                    
                    //图片处理
                    for (let index in order_info.itemlist) {
                        let img = order_info.itemlist[index].picture_info.pic_cover_small;
                        order_info.itemlist[index].picture_info.pic_cover_small = app.IMG(img);
                    }
                    //赠品图片处理
                    for (let index in order_info.goods_mansong_gifts) {
                        let img = order_info.goods_mansong_gifts[index].gift_goods.picture_info.pic_cover_small
                        order_info.goods_mansong_gifts[index].gift_goods.picture_info.pic_cover_small = app.IMG(img);
                    }


                    if (that.data.is_use_card == 1) {
                        discount_money = Number(discount_money) - Number(that.data.max)

                    }



                    that.setData({
                        order_info: order_info,
                        goods_sku_list: data.goods_sku_list,
                        user_telephone: user_telephone,
                        use_coupon: use_coupon,
                        coupon_money: parseFloat(coupon_money).toFixed(2),
                        pay_money: parseFloat(pay_money).toFixed(2),
                        origin_money: constant,
                        coupon_list: data.coupon_list,
                        discount_money: parseFloat(discount_money).toFixed(2),
                        express_company_list: express_company_list,
                        shipping_company_id: shipping_company_id,
                        express_company: express_company,
                        itemlist: data.itemlist,
                        member_account: data.member_account,
                        count_money: parseFloat(data.count_money).toFixed(2),
                        express_money: parseFloat(data.express).toFixed(2),
                        pick_up_money: parseFloat(data.pick_up_money).toFixed(2),
                        promotion_full_mail: data.promotion_full_mail,
                        shop_config: data.shop_config,
                    })
                    that.lodingShippingTime(that, data.currentTime);
                } else {
                    //console.log(444)
                }
            }
        })
      //数据循环拿到最大优惠指
        let wantch = that.data.suuuu
        //console.log(wantch)
        let prices = []
        //


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
     * 图片加载失败
     */
    errorImg: function (e) {
        let that = this;
        let index = e.currentTarget.dataset.index;
        let order_info = that.data.order_info;
        let defaultImg = that.data.defaultImg;
        let parm = {};
        let img = order_info.itemlist[index].picture_info.pic_cover_small;

        if (defaultImg.is_use == 1) {
            let default_img = defaultImg.value.default_goods_img;
            if (img.indexOf(default_img) == -1) {
                let parm_key = "order_info.itemlist[" + index + "].picture_info.pic_cover_small";

                parm[parm_key] = default_img;
                that.setData(parm);
            }
        }
    },

    /**
     * 赠品图片加载失败
     */
    errorGiftImg: function (e) {
        let that = this;
        let index = e.currentTarget.dataset.index;
        let order_info = that.data.order_info;
        let defaultImg = that.data.defaultImg;
        let parm = {};
        let img = order_info.goods_mansong_gifts[index].gift_goods.picture_info.pic_cover_small;

        if (defaultImg.is_use == 1) {
            let default_img = defaultImg.value.default_goods_img;
            if (img.indexOf(default_img) == -1) {
                let parm_key = "order_info.goods_mansong_gifts[" + index + "].gift_goods.picture_info.pic_cover_small";

                parm[parm_key] = default_img;
                that.setData(parm);
            }
        }
    },

    /**
     * 加载配送时间
     */
    lodingShippingTime: function (that, current_time) {
        let week_arr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        let MIN = 1;//配送时间至少需要两天
        let shipping_time = [];

        for (let i = 1; i < 30 + MIN; i++) {

            let date = new Date(current_time);
            date.setDate(date.getDate() + i);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let week = week_arr[date.getDay()];
            let time = Math.round(date.getTime() / 1000);

            shipping_time[i - 1] = {};
            shipping_time[i - 1].year = year;
            shipping_time[i - 1].month = month;
            shipping_time[i - 1].day = day;
            shipping_time[i - 1].week = week;
            shipping_time[i - 1].time = time;
        }

        that.setData({
            shipping_time: shipping_time
        })
    },

    /**
     * 商品详情
     */
    goodsDetail: function (e) {
        let goods_id = e.currentTarget.dataset.id;

        wx.navigateTo({
            url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + goods_id,
        })
    },

    /**
     * 输入手机号码
     */
    inputTel: function (e) {
        let that = this;
        let user_telephone = e.detail.value;
        that.setData({
            user_telephone: user_telephone
        })
    },

    /**
     * 收货地址
     */
    myAddress: function (event) {
        let that = this;
        let myAddressFlag = that.data.myAddressFlag;

        if (myAddressFlag == 1) {
            return false;
        }
        app.clicked(that, 'myAddressFlag');

        wx.navigateTo({
            url: '/pages/member/memberaddress/memberaddress'
        })
    },

    /**
     * 支付方式
     */
    payType: function (event) {
        let that = this;
        let status = event.currentTarget.dataset.status;

        that.setData({
            pay_box_status: status,
            mask_status: status
        })
    },
    /**
     * 待金券
     */
    coupon: function () {
        let that = this;
        let elment = that.data.discount
        //console.log(elment)
        // let shuju = JSON.parse(elment)
        // console.log(shuju)

        wx.navigateTo({
            url: 'coupon/coupon',
        })
    },
    /**
     * 选择支付方式
     */
    selectPayType: function (e) {
        let that = this;
        let pay_type = e.currentTarget.dataset.flag;
        let delivery_type = that.data.delivery_type;
        delivery_type = pay_type == 0 ? delivery_type : 1;
        let coupon_money = parseFloat(that.data.coupon_money);
        let order_info = that.data.order_info;
        let express = delivery_type == 1 ? parseFloat(that.data.express_money) : parseFloat(that.data.pick_up_money); //运费
        let discount_money = parseFloat(order_info.discount_money); //优惠金额
        let count_money = parseFloat(order_info.count_money); //商品总价
        let balance = parseFloat(that.data.balance);

        discount_money = discount_money + coupon_money;
        let pay_money = count_money + express - discount_money - balance;
        let order_invoice_tax = parseFloat(that.data.shop_config.order_invoice_tax); //发票税率
        let invoice_need = that.data.invoice_need; //是否需要发票
        let order_invoice_money = invoice_need == 1 ? order_invoice_tax / 100 * pay_money : 0.00;
        pay_money = parseFloat(order_invoice_money) + parseFloat(pay_money);
        pay_money = pay_money < 0 ? 0.00 : pay_money;


        //is_use_card判断
        if (that.data.is_use_card == 1) {
            pay_money = that.data.pay_money

            //console.log(pay_money)
            pay_money = Number(pay_money) - Number(that.data.max)
        }
        pay_money = pay_money.toFixed(2);


        that.setData({
            pay_type: pay_type,
            delivery_type: delivery_type,
            order_invoice_money: parseFloat(order_invoice_money).toFixed(2),
            pay_money: pay_money
        })
        that.closePoupo();
    },

    /**
     * 配送方式
     */
    deliveryType: function (event) {
        let that = this;
        let status = event.currentTarget.dataset.status;

        that.setData({
            delivery_status: status,
            mask_status: status
        })
    },

    /**
     * 选择配送方式
     */
    deliveryTypeSelect: function (e) {
        let that = this;
        let status = e.currentTarget.dataset.status;
        let coupon_money = parseFloat(that.data.coupon_money);
        let order_info = that.data.order_info;
        let express = status == 1 ? parseFloat(that.data.express_money) : parseFloat(that.data.pick_up_money); //运费
        let discount_money = parseFloat(order_info.discount_money); //优惠金额
        let count_money = parseFloat(order_info.count_money); //商品总价
        let balance = parseFloat(that.data.balance);

        discount_money = discount_money + coupon_money;
        let pay_money = count_money + express - discount_money - balance;

        if (status == 2) {
            let point_list = that.data.order_info.pickup_point_list.data;
            let pick_up = point_list[0] == undefined ? 0 : point_list[0].id;
            let pick_up_point = point_list[0] == undefined ? '' : point_list[0].province_name + '　' + point_list[0].city_name + '　' + point_list[0].dictrict_name + '　' + point_list[0].address;

            that.setData({
                pick_up: pick_up,
                pick_up_point: pick_up_point
            })
        }

        let order_invoice_tax = parseFloat(that.data.shop_config.order_invoice_tax); //发票税率
        let invoice_need = that.data.invoice_need; //是否需要发票
        let order_invoice_money = invoice_need == 1 ? order_invoice_tax / 100 * pay_money : 0.00;
        pay_money = parseFloat(order_invoice_money) + parseFloat(pay_money);
        pay_money = pay_money < 0 ? 0.00 : pay_money;


        //is_use_card判断
        if (that.data.is_use_card == 1) {
            pay_money = that.data.pay_money
            pay_money = Number(pay_money) - Number(that.data.max)
        }
        pay_money = pay_money.toFixed(2);


        that.setData({
            delivery_type: status,
            order_invoice_money: parseFloat(order_invoice_money).toFixed(2),
            pay_money: pay_money
        })
        that.closePoupo();
    },


    /**
     * 身份验证弹框(动画效果未实现)
     */
    sidShow: function (event) {

        let type = event.currentTarget.dataset.type;
        let status = 0;
        let animation = wx.createAnimation({
            duration: 3000,
            timingFunction: 'ease-in',
            transformOrigin: "50% 50% 0",
            delay: 0
        })
        if (type == 'buy') {
            status = 0;
        } else if (type == 'addCart') {
            status = 1;
        }
        animation.opacity(1).translateX(-100).step();
        this.animation = animation;
        this.setData({
            sBuy: 1,
            maskShow: 1,
            buyButtonStatus: status,
            animation: this.animation.export(),
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

    /**
     * 物流公司
     */
    expressCompany: function (e) {
        let that = this;

        that.setData({
            express_company_status: 1,
            mask_status: 1
        })
    },

    /**
     * 选择物流公司
     */
    selectExpressCompany: function (e) {
        let that = this;
        let data = e.currentTarget.dataset;
        let express_money = data.fee;
        let shipping_company_id = data.id;
        let express_company = data.name;
        let coupon_money = parseFloat(that.data.coupon_money) // 优惠券金额
        let order_info = that.data.order_info; //待付款订单信息
        let discount_money = parseFloat(order_info.discount_money); //优惠金额
        let count_money = parseFloat(order_info.count_money); //商品总价
        let balance = parseFloat(that.data.balance);

        discount_money = discount_money + coupon_money;
        let pay_money = count_money + express_money - discount_money - balance;
        let order_invoice_tax = parseFloat(that.data.shop_config.order_invoice_tax); //发票税率
        let invoice_need = that.data.invoice_need; //是否需要发票
        let order_invoice_money = invoice_need == 1 ? order_invoice_tax / 100 * pay_money : 0.00;
        pay_money = parseFloat(order_invoice_money) + parseFloat(pay_money);
        pay_money = pay_money < 0 ? 0.00 : pay_money;


        //is_use_card判断
        if (that.data.is_use_card == 1) {
            pay_money = that.data.pay_money
            pay_money = Number(pay_money) - Number(that.data.max)
        }
        pay_money = pay_money.toFixed(2);


        that.setData({
            express_money: parseFloat(express_money).toFixed(2),
            shipping_company_id: shipping_company_id,
            express_company: express_company,
            order_invoice_money: parseFloat(order_invoice_money).toFixed(2),
            pay_money: pay_money
        })
        that.closePoupo();
    },

    /**
     * 优惠券
     */
    couponStatus: function (e) {
        let that = this;

        that.setData({
            coupon_status: 1,
            mask_status: 1
        })
    },

    /**
     * 选择优惠券
     */
    selectCoupon: function (e) {
        let that = this;
        let id = e.currentTarget.dataset.id;
        let coupon_money = parseFloat(e.currentTarget.dataset.money); // 优惠券金额
        let order_info = that.data.order_info; //待付款订单信息
        let delivery_type = that.data.delivery_type; //配送方式
        let express = delivery_type == 1 ? parseFloat(that.data.express_money) : parseFloat(that.data.pick_up_money); //运费
        let discount_money = parseFloat(order_info.discount_money); //优惠金额
        let count_money = parseFloat(order_info.count_money); //商品总价
        let balance = parseFloat(that.data.balance);

        discount_money = discount_money + coupon_money;
        let pay_money = count_money + express - discount_money - balance;
        let order_invoice_tax = parseFloat(that.data.shop_config.order_invoice_tax); //发票税率
        let invoice_need = that.data.invoice_need; //是否需要发票
        let order_invoice_money = invoice_need == 1 ? order_invoice_tax / 100 * pay_money : 0.00;
        pay_money = parseFloat(order_invoice_money) + parseFloat(pay_money);
        pay_money = pay_money < 0 ? 0.00 : pay_money;


        //is_use_card判断
        if (that.data.is_use_card == 1) {
            pay_money = that.data.pay_money
            pay_money = Number(pay_money) - Number(that.data.max)
        }

        pay_money = pay_money.toFixed(2);
        that.setData({
            use_coupon: id,
            coupon_money: parseFloat(coupon_money).toFixed(2),
            order_invoice_money: parseFloat(order_invoice_money).toFixed(2),
            pay_money: pay_money,
            discount_money: parseFloat(discount_money).toFixed(2),
        })
        that.closePoupo();
    },

    /**
     * 自提地址
     */
    pickUp: function (e) {
        let that = this;


        that.setData({
            pick_up_status: 1,
            mask_status: 1,
        })
    },

    /**
     * 选择自提地址
     */
    pickUpSelect: function (e) {
        let that = this;
        let data = e.currentTarget.dataset;
        let pick_up = data.id;
        let province = data.province;
        let city = data.city;
        let disctrict = data.disctrict;
        let address = data.address;
        let pick_up_point = province + '　' + city + '　' + disctrict + '　' + address;

        that.setData({
            pick_up: pick_up,
            pick_up_point: pick_up_point
        })

        that.closePoupo();
    },

    /**
     * 发票
     */
    invoiceType: function (e) {
        let that = this;

        that.setData({
            invoice_status: 1,
            mask_status: 1
        })
    },

    /**
     * 选择是否需要发票
     */
    selectInvoice: function (e) {
        let that = this;
        let status = e.currentTarget.dataset.status;
        let order_invoice_content_list = that.data.shop_config.order_invoice_content_list;
        let order_info = that.data.order_info; //待付款订单信息
        let delivery_type = that.data.delivery_type; //配送方式
        let coupon_money = parseFloat(that.data.coupon_money) // 优惠券金额
        let express = delivery_type == 1 ? parseFloat(that.data.express_money) : parseFloat(that.data.pick_up_money); //运费
        let discount_money = parseFloat(order_info.discount_money); //优惠金额
        let count_money = parseFloat(order_info.count_money); //商品总价
        let balance = parseFloat(that.data.balance);

        discount_money = discount_money + coupon_money;
        let pay_money = count_money + express - discount_money - balance;
        let order_invoice_tax = parseFloat(that.data.shop_config.order_invoice_tax); //发票税率
        let order_invoice_money = status == 1 ? order_invoice_tax / 100 * pay_money : 0.00;
        pay_money = parseFloat(order_invoice_money) + parseFloat(pay_money);
        pay_money = pay_money < 0 ? 0.00 : pay_money;


        //is_use_card判断
        if (that.data.is_use_card == 1) {
            pay_money = that.data.pay_money
            pay_money = Number(pay_money) - Number(that.data.max)
        }


        pay_money = pay_money.toFixed(2);
        order_invoice_money = parseFloat(order_invoice_money).toFixed(2)

        that.setData({
            invoice_need: status,
            invoice_content: order_invoice_content_list[0],
            order_invoice_money: parseFloat(order_invoice_money).toFixed(2),
            pay_money: pay_money,
        })

        that.closePoupo();
    },

    /**
     * 发票内容
     */
    invoiceContent: function (e) {
        let that = this;

        that.setData({
            invoice_content_status: 1,
            mask_status: 1
        })
    },

    /**
     * 选择发票内容
     */
    selectInvoiceContent: function (e) {
        let that = this;
        let content = e.currentTarget.dataset.content;

        that.setData({
            invoice_content: content
        })

        that.closePoupo();
    },

    /**
     * 修改配送时间
     */
    updateShippingTime: function (e) {
        let that = this;

        that.setData({
            shipping_time_status: 1,
            mask_status: 1
        })
    },

    /**
     * 选择配送时间
     */
    selectShippingTime: function (e) {
        let that = this;
        let shipping_time_index = e.currentTarget.dataset.index;

        that.setData({
            shipping_time_index: shipping_time_index,
        })

        that.closePoupo();
    },

    /**
     * 删除配送时间
     */
    deleteShippingTime: function (e) {
        let that = this;

        that.setData({
            shipping_time_index: -1
        })
    },

    /**
     * 关闭弹框
     */
    closePoupo: function (e) {
        let that = this;

        that.setData({
            mask_status: 0, //遮罩层
            pay_box_status: 0, //支付方式弹框
            delivery_status: 0, //配送方式弹框
            coupon_status: 0, //优惠券弹框
            pick_up_status: 0, //自提点弹框
            express_company_status: 0, //物流公司弹框
            invoice_status: 0, //发票弹框
            invoice_content_status: 0, //发票内容弹框
            shipping_time_status: 0, //配送时间弹框
        })
    },

    /**
     * 余额输入
     */
    inputBalance: function (event) {
        let that = this;
        let balance = event.detail.value;
        let max_balance = parseFloat(event.currentTarget.dataset.max);

        let delivery_type = that.data.delivery_type; //配送方式
        let express = delivery_type == 1 ? parseFloat(that.data.express_money) : parseFloat(that.data.pick_up_money); //运费
        let coupon_money = parseFloat(that.data.coupon_money) // 优惠券金额
        let order_info = that.data.order_info; //待付款订单信息
        let discount_money = parseFloat(order_info.discount_money); //优惠金额
        let count_money = parseFloat(order_info.count_money); //商品总价
        discount_money = discount_money + coupon_money;
        let order_invoice_tax = parseFloat(that.data.shop_config.order_invoice_tax); //发票税率
        let invoice_need = that.data.invoice_need; //是否需要发票
        let pay_money = count_money + express - discount_money;
        let order_invoice_money = invoice_need == 1 ? order_invoice_tax / 100 * pay_money : 0.00;

        pay_money = parseFloat(order_invoice_money) + parseFloat(pay_money);
        pay_money = pay_money < 0 ? 0.00 : pay_money;


        //is_use_card判断
        if (that.data.is_use_card == 1) {
            pay_money = that.data.pay_money
            pay_money = Number(pay_money) - Number(that.data.max)
        }

        pay_money = pay_money.toFixed(2);
        balance = balance == '' ? 0.00 : balance;
        balance = parseFloat(balance).toFixed(2);
        balance = isNaN(balance) ? 0.00 : balance;

        if (balance <= 0.01 && balance > 0) {
            balance = 0.00;
            app.showBox(that, '余额输入错误');
        }

        if (balance > max_balance) {
            balance = max_balance
            app.showBox(that, '不能超过可用余额！');
        }

        if (pay_money - balance < 0) {
            balance = pay_money
            pay_money = 0.00;
        } else {
            pay_money = pay_money - balance;
        }
        pay_money = pay_money < 0 ? 0.00 : pay_money;

        //is_use_card判断
        if (that.data.is_use_card == 1) {
            pay_money = that.data.pay_money
            pay_money = Number(pay_money) - Number(that.data.max)
        }


        pay_money = parseFloat(pay_money).toFixed(2);

        that.setData({
            balance: balance,
            pay_money: pay_money
        })
        return balance;
    },

    /**
     * 发票抬头输入
     */
    inputInvoiceTitle: function (e) {
        let that = this;
        let title = e.detail.value;

        that.setData({
            invoice_title: title
        })
    },

    /**
     * 纳税人识别号输入
     */
    inputTaxpayerIdentificationNumber: function (e) {
        let that = this;
        let identification_number = e.detail.value;

        that.setData({
            taxpayer_identification_number: identification_number
        })
    },

    /**
     * 留言输入
     */
    inputMessage: function (e) {
        let that = this;
        let leavemessage = e.detail.value;

        that.setData({
            leavemessage: leavemessage
        })
    },
  parachuting:function(){
    let out_trade_no=1
    wx.navigateTo({
      url: '/pages/goods/presentGift/presentGift?out_trade_no=' + out_trade_no
    })
  },


    /**
     * 提交订单
     */
    commitOrder: function (event) {
        app.aldstat.sendEvent('提交订单');
        let that = this;
        let status = that.data.status
        //console.log(that.data.status)

        if (that.data.order_source_type == 2 && (that.data.card_no == '' || that.data.card_name == '' || that.data.card_no == 'undefined' )) {
            wx.showToast({
                title: '需填写身份信息',
                icon: 'loading',
                image: '/images/pintuan/mask_layer_spelling_close.png',
                duration: 1200,
            });
            this.setData({
                card_fouce:true,
            })
            return;
        }

        let commitOrderFlag = that.data.commitOrderFlag;
        let order_tag = that.data.order_tag;
        let order_goods_type = that.data.order_goods_type;
        let goods_sku_list = that.data.goods_sku_list; //商品列表
        let user_telephone = that.data.user_telephone; //手机号
        let delivery_type = that.data.delivery_type; //配送方式
        let use_coupon = that.data.use_coupon; //优惠券
        let integral = that.data.integral; //积分
        let leavemessage = that.data.leavemessage == "" ? "送你一份黑科技好礼！" : that.data.leavemessage; //留言
        let account_balance = that.data.balance; //使用余额
        let pay_type = that.data.pay_type; //支付方式
        let pick_up_id = that.data.pick_up; //自提点,
        let shipping_company_id = that.data.shipping_company_id; //物流公司
        let invoice_need = that.data.invoice_need; //是否需要发票
        let invoice_title = that.data.invoice_title; //发票抬头
        let taxpayer_identification_number = that.data.taxpayer_identification_number; //纳税人识别号
        let invoice_content = that.data.invoice_content; //发票内容
        let buyer_invoice = invoice_title + '$' + invoice_content + '$' + taxpayer_identification_number; //发票
        buyer_invoice = invoice_need == 1 ? buyer_invoice : '';
        let balance = parseFloat(that.data.balance);
        let pay_money = parseFloat(that.data.pay_money);
        let point = parseFloat(that.data.member_account.point);
        let count_point_exchange = parseFloat(that.data.order_info.count_point_exchange);
        let combo_id = that.data.combo_id;
        let combo_buy_num = that.data.combo_buy_num;
        let shipping_time = that.data.shipping_time;
        let shipping_time_index = that.data.shipping_time_index;
        let shipping_time_val = shipping_time_index == -1 ? 0 : shipping_time[shipping_time_index].time;
        let order_designated_delivery_time = that.data.shop_config.order_designated_delivery_time;
        let shop_config = that.data.shop_config;

      // 判断是否存在心意券

        // is_use_card==1

        //console.log(that.data.card_id)
        //console.log(that.data.token)


        if (commitOrderFlag == 1) {
            return false;
        }
        app.clicked(that, 'commitOrderFlag');

        if (shop_config.seller_dispatching == 0 && shop_config.buyer_self_lifting == 0) {
            app.showBox(that, '商家未配置配送方式');
            app.restStatus(that, 'commitOrderFlag');
            return false;
        }

        if (delivery_type == 2 || isNaN(parseInt(shipping_time_val)) || order_designated_delivery_time == 0) {
            shipping_time_val = 0;
        }

        if (order_tag == 'buy_now' && order_goods_type == 0) {
            let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
            if (user_telephone.length != 11 || !myreg.test(user_telephone)) {
                app.showBox(that, '请输入正确的手机号');
                app.restStatus(that, 'commitOrderFlag');
                return false;
            }
        } else {
            // if (member_address == '' || member_address == null || member_address == undefined) {
            //     app.showBox(that, '请先选择收货地址');
            //     app.restStatus(that, 'commitOrderFlag');
            //     return false;
            // }

            if (delivery_type == 1) {

            } else {
                if (pick_up_id == 0) {
                    app.showBox(that, '商家未配置自提点，请选择其他配送方式');
                    app.restStatus(that, 'commitOrderFlag');
                    return false;
                }
            }
        }

        if (point < count_point_exchange) {
            app.showBox(that, '当前用户积分不足');
            app.restStatus(that, 'commitOrderFlag');
            return false;
        }


       //判断留言的特殊字符
      
      let pattern = /[`~!@#\$%\^\&\*\(\)_\+<>\?:"\{\},\.\\\/;'\[\]]/im; 
      if (pattern.test(leavemessage)){
        app.showBox(that, '你输入的祝福存在敏感字符');
        app.restStatus(that, 'commitOrderFlag');
        return false;
       }






        // if (that.data.userN.length == 0 || that.data.passW.length == 0) {
        //   this.setData({
        //     infoMess: '温馨提示：用户名和身份证件号不能为空！',
        //     Become:'1',
        //   })
        // } else {
        //   this.setData({
        //     Become: '0',
        //     infoMess: '',
        //     userN: that.data.userN,
        //     IDsW: that.data.passW

        //   })
        // }


        integral = count_point_exchange;

        pay_type = pay_money == 0 ? 5 : pay_type;

        if (pay_type == 5) {
            let express = delivery_type == 1 ? parseFloat(that.data.express_money) : parseFloat(that.data.pick_up_money); //运费
            let coupon_money = parseFloat(that.data.coupon_money) // 优惠券金额
            let order_info = that.data.order_info; //待付款订单信息
            let discount_money = parseFloat(order_info.discount_money); //优惠金额
            let count_money = parseFloat(order_info.count_money); //商品总价
            discount_money = discount_money + coupon_money;
            let order_invoice_tax = parseFloat(that.data.shop_config.order_invoice_tax); //发票税率
            let invoice_need = that.data.invoice_need; //是否需要发票
            pay_money = count_money + express - discount_money;
            let order_invoice_money = invoice_need == 1 ? order_invoice_tax / 100 * pay_money : 0.00;
            pay_money = parseFloat(order_invoice_money) + parseFloat(pay_money);
            pay_money = pay_money < 0 ? 0.00 : pay_money;


            //is_use_card判断

            if (that.data.is_use_card == 1) {
                pay_money = that.data.pay_money
                pay_money = Number(pay_money) - Number(that.data.max)
            }


            pay_money = pay_money.toFixed(2);
            pay_type = pay_money == 0 ? 0 : pay_type;
        }
        let  ts_type =""
      console.log(that.data.order_source_type)
        if (that.data.type == 1) {
            ts_type = 1
        } else {
            console.log(1111111111)
            ts_type = that.data.order_source_type
        }

        app.sendRequest({
            url: "api.php?s=order/giftOrderCreate",
            data: {
                use_coupon: use_coupon,
                integral: integral,
                goods_sku_list: goods_sku_list,
                leavemessage: leavemessage,
                pay_type: pay_type,
                tx_type: ts_type,
                card_name: that.data.card_name,
                card_no: that.data.card_no,
                store_id: app.globalData.store_id
            },
            success: function (res) {
                let code = res.code;
                let data = res.data;

                if (code == 0) {
                    if (data.order_id == -4012) {
                        app.showBox(that, '当前收货地址暂不支持配送！');
                        app.restStatus(that, 'commitOrderFlag');
                        return false;
                    }

                    if (data.order_id == -4014) {
                        app.showBox(that, '当前地址不支持货到付款');
                        app.restStatus(that, 'commitOrderFlag');
                        return false;
                    }

                    if (data.out_trade_no == undefined || data.out_trade_no == '') {
                        app.showBox(that, '订单生成失败');
                        app.restStatus(that, 'commitOrderFlag');
                        return false;
                    }

                    if (pay_type == 5 || pay_money == 0) {
                        let out_trade_no = data.out_trade_no;

                        wx.reLaunch({
                            url: '/pages/pay/paycallback/paycallback?status=1&type=1&out_trade_no=' + out_trade_no,
                        })
                    } else {
                        let out_trade_no = data.out_trade_no;
                        if (order_tag == 'buy_now' && order_goods_type == 0) {
                            app.setTabType(2);
                        } else {
                            app.setTabType('');
                        }
                        wx.navigateTo({
                          url: '/pages/pay/getpayvalue/getpayvalue?present=1&&out_trade_no=' + out_trade_no
                        })
                    }
                }
                //console.log(res)
            }
        })
    },

    // 废弃
    //userNameInput: function (e) {
    //    this.setData({
    //        card_name: e.detail.value
    //    })
    //    let that = this;
    //},
    //idsInput: function (e) {
    //    this.setData({
    //        card_no: e.detail.value,
    //        encry_no: this.plusXing(e.detail.value, 3, 4),
    //    })
    //    if (e.detail.value == "") {
    //        this.setData({
    //            Become: '1',
    //        })
    //    } else {
    //        this.setData({
    //            Become: '0',
    //        })
    //    }
    //},
    change_gift(e){
        "use strict";
        var teml = e.detail.value;
        console.log(teml)
        this.setData({
            leavemessage: teml
        });

    },

    plusXing (str, frontLen, endLen) {
        //console.log(str);
        var len = str.length - frontLen - endLen;
        var xing = '';
        for (var i = 0; i < len; i++) {
            xing += '*';
        }
        return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
    },
    // 暂存 编辑身份证号
    change_card_no(e){
        "use strict";
        var temp = e.detail.value;

        this.setData({
            buffer_card_no:temp
        });
    },

    change_card_name(e){
        "use strict";
        var temp = e.detail.value;
        this.setData({
            buffer_card_name: temp
        });
    },
    edit_card(){
        "use strict";
        this.setData({
            edit_card:true
        });
    },
    save_card(){
        "use strict";
        var temp_card_no = this.data.buffer_card_no != ''?this.data.buffer_card_no:this.data.card_no;
        var temp_card_name = this.data.buffer_card_name != ''?this.data.buffer_card_name:this.data.card_name;

        if(temp_card_name == '' || temp_card_name.length < 1 ){
            wx.showToast({
                title: '身份证姓名必填',
                icon: 'none',
                image: '/images/pintuan/mask_layer_spelling_close.png',
                duration: 1200
            })
            return ;
        }

        if(temp_card_no.length < 15){
            wx.showToast({
                title: '身份证格式错误',
                icon: 'none',
                image: '/images/pintuan/mask_layer_spelling_close.png',
                duration: 1200
            })
            return ;
        }

        this.setData({
            edit_card:false,
            card_no: temp_card_no,
            card_name:temp_card_name,
            encry_no: this.plusXing(temp_card_no, 1, 4)
        });
    },
    cancel_save(){
        "use strict";
        this.setData({
            edit_card:false
        });
    },
})