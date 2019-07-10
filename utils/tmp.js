const data = JSON.parse('{"goods_id":16,"goods_name":"Vitarmonyl维美利莱 Aqualigne瘦身口服液","source_type":1,"material_code":"FHVI008","shop_id":0,"category_id":4,"brand_id":4,"group_id_array":"","promotion_type":0,"goods_type":1,"market_price":"9999.00","price":"0.01","promote_price":"0.01","cost_price":"0.00","vip_price":"0.00","point_exchange_type":0,"point_exchange":0,"give_point":0,"is_member_discount":0,"shipping_fee":"0.00","shipping_fee_id":0,"stock":9963,"max_buy":0,"min_stock_alarm":1,"clicks":83,"sales":47,"collects":0,"star":0,"evaluates":0,"shares":0,"province_id":0,"city_id":0,"picture":45,"keywords":"","introduction":"听说你需要一个超级长超级长超级长像虫洞那么长的促销语所以给你写了一个超级长的促销语哦","description":"<p>瘦</p>","QRcode":"upload/goods_qrcode/goods_qrcode_16.png","code":"AMB10","is_stock_visible":1,"is_hot":0,"is_recommend":0,"is_new":0,"is_pre_sale":0,"is_bill":0,"state":1,"sale_date":1554965984,"create_time":1554965984,"update_time":1560320251,"sort":0,"real_sales":36,"brand_name":"Vitarmonyl","brand_pic":"","category_name":"燃脂","pic_cover_micro":"https://static.vitasantee.com/upload/goods/20190527/af2971533fbe3e8d90ecee55965af8d64.jpg","pic_cover_mid":"https://static.vitasantee.com/upload/goods/20190527/af2971533fbe3e8d90ecee55965af8d62.jpg","pic_cover_small":"https://static.vitasantee.com/upload/goods/20190527/af2971533fbe3e8d90ecee55965af8d63.jpg","shop_name":null,"shop_type":null,"pic_id":45,"upload_type":2,"domain":"https://static.vitasantee.com","bucket":"cb-weimeishante","group_query":[],"sku_list":[{"sku_id":19,"goods_id":16,"sku_name":"400ml ","attr_value_items":"2:15","attr_value_items_format":"2:15","market_price":"9999.00","price":"0.01","promote_price":"0.01","vip_price":"0.00","cost_price":"0.00","stock":9963,"picture":0,"code":"AMB10","material_code":"FHVI008","QRcode":"","create_date":1554965984,"update_date":1560320251}],"is_member_fav_goods":0}');
let end_time1 = parseInt((Date.now() + 1000*60*60*(Math.random()*3))/1000);
let end_time2 = parseInt((Date.now() + 1000*60*60*(Math.random()*3))/1000);
const data1 = Object.assign({},{
    assemble_status: 1, //已加入，待人数完整
    assemble_type: 1, //邀新团
    assemble_num_all: 3, //总拼团人数
    assemble_num_remian: 1, //剩余人数
    assemble_end_time: end_time1, //倒计时
},data);
data1.source_type = 2;
const data2 = Object.assign({},{
    assemble_status: 1, //已加入，待人数完整
    assemble_type: 2, //普通团
    assemble_num_all: 4,
    assemble_num_remian: 2, //剩余人数
    assemble_end_time: end_time2 //倒计时
},data);
const data3 = Object.assign({},{
    assemble_status: 2, //人数完整, 拼团中
    assemble_num_all: 2,
    assemble_type: 1 //邀新团
},data);
const data4 = Object.assign({},{
    assemble_status: 3, //拼团失败
    assemble_num_all: 3,
    assemble_type: 1 //邀新团
},data);

module.exports = [data1,data3,data2,data4,data3,data1,data2,data4,data2,data1];