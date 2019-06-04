'use strict';
//TODO 等待系统封装请求api(太多暂时无法大范围修改、当前仅为部分已使用请求列表)

const SERVERS = {};

SERVERS.BASEURL = 'https://dev02.vitasantee.com/';

// 登录
SERVERS.LOGIN = {
    getWechatEncryptInfo: 'api.php?s=Login/getWechatEncryptInfo', //微信登录
}
// 通用配置
SERVERS.COMMON = {
    getDefaultImages: 'api.php?s=login/getDefaultImages', //默认图片(包含商品图片、用户头像)
    getWebSiteInfo: 'api.php?s=login/getWebSiteInfo',//默认配置
    copyRightIsLoad: 'api.php?s=task/copyRightIsLoad',//版权信息
    getVertification: 'api.php?s=index/getVertification',//随机验证码
}
// 首页
SERVERS.HOME = {
    getIndexData: 'api.php?s=index/getIndexData', //首页数据
    getTrialGoodsTemplate: 'api.php?s=order/getTrialGoodsTemplate', //新品推送
}
// 话题
SERVERS.TOPIC = {
    hotTopic: 'api.php?s=/activity/hotTopic', //热门话题列表
    activityInfo: 'api.php?s=/Activity/activityInfo', //话题详情
}
// 商品
SERVERS.GOODS = {
    //分类
    goodsClassificationList: 'api.php?s=goods/goodsClassificationList', //商品分类(包含二级分类)
    //商品列表
    getNewGoods: 'api.php?s=Goods/getNewGoods', //新品商品(含封面)
    getHotSaleGoods: 'api.php?s=Goods/getHotSaleGoods', //热卖商品(含封面)
    getIndexGoodsList: 'api.php?s=goods/getIndexGoodsList', //推荐商品(猜你喜欢)
    searchGoodsList: 'api.php?s=goods/searchGoodsList', //搜索
    // 商品详情
    goodsDetail: 'api.php?s=goods/goodsDetail', //商品详情
    getDistributorGoodsWxCode: 'api.php?s=Distributor/getDistributorGoodsWxCode', //惠选师的单品小程序码
    getBrandGoodsList: 'api.php?s=goods/getBrandGoodsList', //获取品牌商品列表
    getGoodsDetailAdv: 'api.php?s=goods/getGoodsDetailAdv', //获取门店信息广告位
    getClickPoint: 'api.php?s=goods/getClickPoint', //商品点赞
    getGoodsComments: 'api.php?s=goods/getGoodsComments', //商品评价
    getGoodsEvaluateCount: 'api.php?s=goods/getGoodsEvaluateCount', //商品评论统计
    getUpProTemplate: 'api.php?s=order/getUpProTemplate', //商品到货通知预约
    addBox: '/api.php?s=goods/addBox', //商品加入礼物盒
}
// 购物车
SERVERS.CART = {
    cart: 'api.php?s=goods/cart', //购物车列表
    addCart: 'api.php?s=goods/addCart', //购物车商品添加
    cartDelete: 'api.php?s=goods/cartDelete', //购物车商品删除
    cartAdjustNum: 'api.php?s=goods/cartAdjustNum', //购物车数量调整
    //下单
    getOrderData: 'api.php?s=order/getOrderData', //预下单信息
    orderCreate: 'api.php?s=order/orderCreate', //普通下单
    getPayValue: 'api.php?s=pay/getPayValue', //获取支付信息
    comboPackageOrderCreate: 'api.php?s=order/comboPackageOrderCreate', //下单(未知)
    virtualOrderCreate: 'api.php?s=order/virtualOrderCreate', //虚拟商品下单
    groupBuyOrderCreate: 'api.php?s=order/groupBuyOrderCreate', //下单(疑似拼购)
    orderWarnTemplateCreat: 'api.php?s=order/orderWarnTemplateCreat', //未知
    //支付
    appletWechatPay: 'api.php?s=pay/appletWechatPay', //微信钱包支付
    getOrderNoByOutTradeNo: 'api.php?s=pay/getOrderNoByOutTradeNo', //通过订单号查询订单
}
// 个人
SERVERS.MEMBER = {
    getMemberDetail: 'api.php?s=member/getMemberDetail', //获取用户信息
    memberIndex: 'api.php?s=member/memberIndex', //获取会员信息
    getMemberVipAdv: 'api.php?s=member/getMemberVipAdv', //会员广告(目前为加群)
    updateMemberDetail: 'api.php?s=member/updateMemberDetail', //更新用户信息(拉取微信用户信息)
    //收藏
    myCollection: 'api.php?s=member/myCollection', //收藏商品列表
    FavoritesGoodsorshop: 'api.php?s=member/FavoritesGoodsorshop', //收藏
    cancelFavorites: 'api.php?s=member/cancelFavorites', //取消收藏
    //优惠券
    memberCoupon: 'api.php?s=member/memberCoupon', //用户优惠券列表
    receiveGoodsCoupon: 'api.php?s=goods/receiveGoodsCoupon', //领取优惠券
    //我的订单
    getOrderList: 'api.php?s=order/getOrderList', //订单列表
    orderClose: 'api.php?s=order/orderClose', //订单关闭
    deleteOrder: 'api.php?s=order/deleteOrder', //删除订单
    orderTakeDelivery: 'api.php?s=order/orderTakeDelivery', //确认收货
    //其他
    checkNeiGou: "api.php?s=/goods/checkNeiGou", //有无内购活动
    getNoticeConfig: "api.php?s=member/getNoticeConfig", //通知开启检测
    getLoginVerifyCodeConfig: "api.php?s=member/getLoginVerifyCodeConfig", //验证码开启检测
    sendBindCode: "api.php?s=member/sendBindCode", //发送验证码
    //邮箱
    email: "api.php?s=login/email", //验证邮箱
    modifyemail: "api.php?s=member/modifyemail", //邮箱修改
    //手机号
    mobile: "api.php?s=login/mobile", //验证手机号
    modifymobile: "api.php?s=login/modifymobile", //手机号修改
    modifyNickName: "api.php?s=member/modifyNickName", //昵称修改
    // 收货地址
    getmemberaddresslist: "api.php?s=member/getmemberaddresslist", //收货地址列表
    updateAddressDefault: "api.php?s=member/updateAddressDefault", //设置默认地址
    addmemberlocaladdress: "api.php?s=member/addmemberlocaladdress", //添加用户本地地址(存在无手机号报错!)
    memberAddressDelete: "api.php?s=member/memberAddressDelete", //地址删除
    addmemberaddress: "api.php?s=member/addmemberaddress", //地址添加
    getProvince: "api.php?s=index/getProvince", //获取省列表
    getCity: "api.php?s=index/getCity", //获取城市列表
    getDistrict: "api.php?s=index/getDistrict", //获取地区列表
    //用户浏览历史
    newMyPath: "api.php?s=member/newMyPath", //用户浏览历史列表
    delMyPath: "api.php?s=member/delMyPath", //用户浏览历史删除
}
module.exports = SERVERS;