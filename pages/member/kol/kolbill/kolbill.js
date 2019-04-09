const app = new getApp();

Page({
  data: {
    array: ['美国', '中国', '巴西', '日本'],
    index: 0,
    date: '2016-09-01',
    time: '12:01',
    Tiemr: {
      "code": 200,
      "data": {
        "width": 800,
        "prism_wordsInfo": [
          {
            "prob": 99,
            "pos": [
              {
                "x": 550,
                "y": 35
              },
              {
                "x": 673,
                "y": 35
              },
              {
                "x": 673,
                "y": 55
              },
              {
                "x": 550,
                "y": 55
              }
            ],
            "word": "招商银行"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 323,
                "y": 53
              },
              {
                "x": 398,
                "y": 53
              },
              {
                "x": 398,
                "y": 66
              },
              {
                "x": 323,
                "y": 66
              }
            ],
            "word": "收款回单"
          },
          {
            "prob": 68,
            "pos": [
              {
                "x": 546,
                "y": 61
              },
              {
                "x": 678,
                "y": 61
              },
              {
                "x": 678,
                "y": 72
              },
              {
                "x": 546,
                "y": 72
              }
            ],
            "word": "61 SAY IT R 11 ANT$ BANN "
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 39,
                "y": 87
              },
              {
                "x": 172,
                "y": 87
              },
              {
                "x": 172,
                "y": 99
              },
              {
                "x": 39,
                "y": 99
              }
            ],
            "word": "日期：2018年12月21日"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 545,
                "y": 86
              },
              {
                "x": 689,
                "y": 85
              },
              {
                "x": 689,
                "y": 99
              },
              {
                "x": 545,
                "y": 100
              }
            ],
            "word": "流水号：18 R 2008941656"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 39,
                "y": 108
              },
              {
                "x": 209,
                "y": 108
              },
              {
                "x": 209,
                "y": 121
              },
              {
                "x": 39,
                "y": 121
              }
            ],
            "word": "收款账号：121914463810802"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 40,
                "y": 130
              },
              {
                "x": 232,
                "y": 130
              },
              {
                "x": 232,
                "y": 143
              },
              {
                "x": 40,
                "y": 143
              }
            ],
            "word": "户名：上海深屹网络科技有限公司"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 39,
                "y": 153
              },
              {
                "x": 259,
                "y": 153
              },
              {
                "x": 259,
                "y": 166
              },
              {
                "x": 39,
                "y": 166
              }
            ],
            "word": "开户行：招商银行上海分行福州路支行"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 39,
                "y": 174
              },
              {
                "x": 262,
                "y": 174
              },
              {
                "x": 262,
                "y": 187
              },
              {
                "x": 39,
                "y": 187
              }
            ],
            "word": "金额(大写)：人民币壹佰叁拾万元整"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 44,
                "y": 196
              },
              {
                "x": 100,
                "y": 196
              },
              {
                "x": 100,
                "y": 209
              },
              {
                "x": 44,
                "y": 209
              }
            ],
            "word": "(小写)："
          },
          {
            "prob": 95,
            "pos": [
              {
                "x": 131,
                "y": 198
              },
              {
                "x": 239,
                "y": 197
              },
              {
                "x": 239,
                "y": 209
              },
              {
                "x": 131,
                "y": 211
              }
            ],
            "word": " CNY 1，300，000.00"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 40,
                "y": 219
              },
              {
                "x": 258,
                "y": 219
              },
              {
                "x": 258,
                "y": 232
              },
              {
                "x": 40,
                "y": 232
              }
            ],
            "word": "付款人账号：31050110711100000176"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 40,
                "y": 241
              },
              {
                "x": 272,
                "y": 241
              },
              {
                "x": 272,
                "y": 254
              },
              {
                "x": 40,
                "y": 254
              }
            ],
            "word": "付款人户名：上海深屹网络科技有限公司"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 40,
                "y": 263
              },
              {
                "x": 364,
                "y": 263
              },
              {
                "x": 364,
                "y": 276
              },
              {
                "x": 40,
                "y": 276
              }
            ],
            "word": "付款人开户行：中国建设银行股份有限公司上海第三支行"
          },
          {
            "prob": 98,
            "pos": [
              {
                "x": 40,
                "y": 285
              },
              {
                "x": 203,
                "y": 285
              },
              {
                "x": 203,
                "y": 299
              },
              {
                "x": 40,
                "y": 299
              }
            ],
            "word": "摘要：附言：戈款备注：划款"
          },
          {
            "prob": 98,
            "pos": [
              {
                "x": 39,
                "y": 305
              },
              {
                "x": 132,
                "y": 305
              },
              {
                "x": 132,
                "y": 317
              },
              {
                "x": 39,
                "y": 317
              }
            ],
            "word": "18 R 2008941656"
          },
          {
            "prob": 70,
            "pos": [
              {
                "x": 645,
                "y": 290
              },
              {
                "x": 757,
                "y": 235
              },
              {
                "x": 769,
                "y": 259
              },
              {
                "x": 657,
                "y": 314
              }
            ],
            "word": "招百"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 39,
                "y": 326
              },
              {
                "x": 122,
                "y": 326
              },
              {
                "x": 122,
                "y": 339
              },
              {
                "x": 39,
                "y": 339
              }
            ],
            "word": "经办： G 69440"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 287,
                "y": 326
              },
              {
                "x": 348,
                "y": 326
              },
              {
                "x": 348,
                "y": 338
              },
              {
                "x": 287,
                "y": 338
              }
            ],
            "word": "第1次打印"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 544,
                "y": 327
              },
              {
                "x": 602,
                "y": 326
              },
              {
                "x": 602,
                "y": 338
              },
              {
                "x": 544,
                "y": 339
              }
            ],
            "word": "20181221"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 287,
                "y": 361
              },
              {
                "x": 444,
                "y": 361
              },
              {
                "x": 444,
                "y": 374
              },
              {
                "x": 287,
                "y": 374
              }
            ],
            "word": "回单编号：8020046587530"
          },
          {
            "prob": 98,
            "pos": [
              {
                "x": 507,
                "y": 361
              },
              {
                "x": 695,
                "y": 361
              },
              {
                "x": 695,
                "y": 374
              },
              {
                "x": 507,
                "y": 374
              }
            ],
            "word": "回单验证码：96  F  41 CEE A  B E 0 B 94  F  "
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 73,
                "y": 388
              },
              {
                "x": 236,
                "y": 388
              },
              {
                "x": 236,
                "y": 407
              },
              {
                "x": 73,
                "y": 407
              }
            ],
            "word": "招商银行股份有限公司"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 287,
                "y": 390
              },
              {
                "x": 693,
                "y": 389
              },
              {
                "x": 693,
                "y": 403
              },
              {
                "x": 287,
                "y": 404
              }
            ],
            "word": "提示：1.电子回单验证码相同表示同一笔业务回单，请勿重复记账使用。"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 326,
                "y": 410
              },
              {
                "x": 731,
                "y": 410
              },
              {
                "x": 731,
                "y": 423
              },
              {
                "x": 326,
                "y": 423
              }
            ],
            "word": "2.已在银行柜台领用业务回单的单位，请注意核对，请勿重复记账使用。"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 89,
                "y": 421
              },
              {
                "x": 221,
                "y": 421
              },
              {
                "x": 221,
                "y": 440
              },
              {
                "x": 89,
                "y": 440
              }
            ],
            "word": "电子回单专用章"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 287,
                "y": 438
              },
              {
                "x": 483,
                "y": 439
              },
              {
                "x": 483,
                "y": 453
              },
              {
                "x": 287,
                "y": 451
              }
            ],
            "word": "打印时间：2018-12-2112：04：21"
          }
        ],
        "height": 483
      }
    },
    Alipay:
    {
      "code": 200,
      "data": {
        "width": 2479,
        "prism_wordsInfo": [
          {
            "prob": 99,
            "pos": [
              {
                "x": 1628,
                "y": 169
              },
              {
                "x": 2331,
                "y": 169
              },
              {
                "x": 2331,
                "y": 206
              },
              {
                "x": 1628,
                "y": 206
              }
            ],
            "word": "编号：2018120500085000911298919801800080755185"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 1567,
                "y": 279
              },
              {
                "x": 2102,
                "y": 287
              },
              {
                "x": 2101,
                "y": 337
              },
              {
                "x": 1566,
                "y": 330
              }
            ],
            "word": "币种：人民币/单位：元"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 942,
                "y": 402
              },
              {
                "x": 1536,
                "y": 402
              },
              {
                "x": 1536,
                "y": 460
              },
              {
                "x": 942,
                "y": 460
              }
            ],
            "word": "支付宝转账电子回单"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 1357,
                "y": 488
              },
              {
                "x": 2108,
                "y": 492
              },
              {
                "x": 2108,
                "y": 538
              },
              {
                "x": 1357,
                "y": 534
              }
            ],
            "word": "回单生成时间：2018-12-0511：3235"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 812,
                "y": 580
              },
              {
                "x": 1611,
                "y": 580
              },
              {
                "x": 1611,
                "y": 628
              },
              {
                "x": 812,
                "y": 628
              }
            ],
            "word": "账户名：上海深屹网络科技有限公司"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 380,
                "y": 683
              },
              {
                "x": 524,
                "y": 683
              },
              {
                "x": 524,
                "y": 727
              },
              {
                "x": 380,
                "y": 727
              }
            ],
            "word": "付款方"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 812,
                "y": 655
              },
              {
                "x": 1793,
                "y": 659
              },
              {
                "x": 1793,
                "y": 706
              },
              {
                "x": 812,
                "y": 702
              }
            ],
            "word": "账号：ali51xdb@ayuncom(2088911298919801)"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 812,
                "y": 731
              },
              {
                "x": 1309,
                "y": 731
              },
              {
                "x": 1309,
                "y": 775
              },
              {
                "x": 812,
                "y": 775
              }
            ],
            "word": "账户类型：支付宝账户"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 812,
                "y": 807
              },
              {
                "x": 1810,
                "y": 807
              },
              {
                "x": 1810,
                "y": 854
              },
              {
                "x": 812,
                "y": 854
              }
            ],
            "word": "开户机构：支付宝(中国)网络技术有限公司"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 816,
                "y": 899
              },
              {
                "x": 1110,
                "y": 899
              },
              {
                "x": 1110,
                "y": 943
              },
              {
                "x": 816,
                "y": 943
              }
            ],
            "word": "账户名：姜红"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 812,
                "y": 974
              },
              {
                "x": 1217,
                "y": 974
              },
              {
                "x": 1217,
                "y": 1018
              },
              {
                "x": 812,
                "y": 1018
              }
            ],
            "word": "账号：15021476513"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 377,
                "y": 998
              },
              {
                "x": 524,
                "y": 998
              },
              {
                "x": 524,
                "y": 1042
              },
              {
                "x": 377,
                "y": 1042
              }
            ],
            "word": "收款方"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 816,
                "y": 1046
              },
              {
                "x": 1309,
                "y": 1046
              },
              {
                "x": 1309,
                "y": 1094
              },
              {
                "x": 816,
                "y": 1094
              }
            ],
            "word": "账户类型：支付宝账户"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 812,
                "y": 1122
              },
              {
                "x": 1810,
                "y": 1122
              },
              {
                "x": 1810,
                "y": 1169
              },
              {
                "x": 812,
                "y": 1169
              }
            ],
            "word": "开户机构：支付宝(中国)网络技术有限公司"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 373,
                "y": 1187
              },
              {
                "x": 678,
                "y": 1183
              },
              {
                "x": 679,
                "y": 1230
              },
              {
                "x": 373,
                "y": 1234
              }
            ],
            "word": "支付宝流水号"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 809,
                "y": 1190
              },
              {
                "x": 1560,
                "y": 1190
              },
              {
                "x": 1560,
                "y": 1234
              },
              {
                "x": 809,
                "y": 1234
              }
            ],
            "word": "20181130200040011100800023595358"
          },
          {
            "prob": 97,
            "pos": [
              {
                "x": 377,
                "y": 1255
              },
              {
                "x": 572,
                "y": 1255
              },
              {
                "x": 572,
                "y": 1299
              },
              {
                "x": 377,
                "y": 1299
              }
            ],
            "word": "付款时间"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 809,
                "y": 1259
              },
              {
                "x": 1213,
                "y": 1255
              },
              {
                "x": 1214,
                "y": 1298
              },
              {
                "x": 809,
                "y": 1302
              }
            ],
            "word": "2018-11-3016：1429"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 816,
                "y": 1348
              },
              {
                "x": 1090,
                "y": 1348
              },
              {
                "x": 1090,
                "y": 1392
              },
              {
                "x": 816,
                "y": 1392
              }
            ],
            "word": "小写：577.50"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 380,
                "y": 1372
              },
              {
                "x": 575,
                "y": 1372
              },
              {
                "x": 575,
                "y": 1419
              },
              {
                "x": 380,
                "y": 1419
              }
            ],
            "word": "付款金额"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 816,
                "y": 1419
              },
              {
                "x": 1361,
                "y": 1423
              },
              {
                "x": 1361,
                "y": 1473
              },
              {
                "x": 815,
                "y": 1469
              }
            ],
            "word": "大写：伍佰柒拾柒元伍角"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 366,
                "y": 1488
              },
              {
                "x": 476,
                "y": 1488
              },
              {
                "x": 476,
                "y": 1536
              },
              {
                "x": 366,
                "y": 1536
              }
            ],
            "word": "摘要"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 809,
                "y": 1485
              },
              {
                "x": 966,
                "y": 1485
              },
              {
                "x": 966,
                "y": 1536
              },
              {
                "x": 809,
                "y": 1536
              }
            ],
            "word": "服务费"
          },
          {
            "prob": 97,
            "pos": [
              {
                "x": 147,
                "y": 1574
              },
              {
                "x": 233,
                "y": 1574
              },
              {
                "x": 233,
                "y": 1618
              },
              {
                "x": 147,
                "y": 1618
              }
            ],
            "word": "注："
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 150,
                "y": 1646
              },
              {
                "x": 2225,
                "y": 1646
              },
              {
                "x": 2225,
                "y": 1693
              },
              {
                "x": 150,
                "y": 1693
              }
            ],
            "word": "1.本《支付宝电子回单》仅证明用户在申请该电子回单时间之前通过其支付宝账户的支付行为。"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 147,
                "y": 1721
              },
              {
                "x": 1525,
                "y": 1721
              },
              {
                "x": 1525,
                "y": 1769
              },
              {
                "x": 147,
                "y": 1769
              }
            ],
            "word": "2.本《支付宝电子回单》有任何修改或涂改的，均为无效证明。"
          },
          {
            "prob": 99,
            "pos": [
              {
                "x": 147,
                "y": 1800
              },
              {
                "x": 2279,
                "y": 1795
              },
              {
                "x": 2280,
                "y": 1844
              },
              {
                "x": 147,
                "y": 1849
              }
            ],
            "word": "3.本《支付宝电子回单》仅供参考，如与用户支付宝账户记录不一致的，以支付宝账户记录为准。"
          },
          {
            "prob": 86,
            "pos": [
              {
                "x": 2061,
                "y": 1962
              },
              {
                "x": 2273,
                "y": 2042
              },
              {
                "x": 2248,
                "y": 2110
              },
              {
                "x": 2035,
                "y": 2030
              }
            ],
            "word": "技术"
          },
          {
            "prob": 97,
            "pos": [
              {
                "x": 1330,
                "y": 2101
              },
              {
                "x": 2300,
                "y": 2101
              },
              {
                "x": 2300,
                "y": 2169
              },
              {
                "x": 1330,
                "y": 2169
              }
            ],
            "word": "支付宝(中国)网络技术有限"
          },
          {
            "prob": 98,
            "pos": [
              {
                "x": 1930,
                "y": 2283
              },
              {
                "x": 2225,
                "y": 2283
              },
              {
                "x": 2225,
                "y": 2354
              },
              {
                "x": 1930,
                "y": 2354
              }
            ],
            "word": "业务凭证专用章"
          },
          {
            "prob": 98,
            "pos": [
              {
                "x": 1827,
                "y": 2389
              },
              {
                "x": 2328,
                "y": 2389
              },
              {
                "x": 2328,
                "y": 2447
              },
              {
                "x": 1827,
                "y": 2447
              }
            ],
            "word": "业务凭证专用章盖章处"
          }
        ],
        "height": 3508
      }
    }
    },
  onLoad:function(){
    let _this=this;
    let str = _this.data.Tiemr.data.prism_wordsInfo;
    let Ali= _this.data.Alipay.data.prism_wordsInfo; 
    let Openbank = new Array();
    let payBill = new Array();
    let reg = /^[A - Z] + $(?=,*\d)[^]{4,16}$/;
    let ft=    /^ [0 - 9] * ${ 24, 40}/;
    let Con
   


    for (let index in str) {
      if (str[index].word.indexOf("招商银行") != -1){
        Openbank.push(str[index].word)
      } else if (str[index].word.indexOf("日期") != -1){
        Openbank.push(str[index].word)
      } else if (str[index].word.indexOf("流水号") != -1) {
        Openbank.push(str[index].word)
      } else if (str[index].word.indexOf("收款账号") != -1) {
        Openbank.push(str[index].word)
      } else if (str[index].word.indexOf("户名") != -1) {
        Openbank.push(str[index].word)
      } else if (str[index].word.indexOf("开户行") != -1) {
        Openbank.push(str[index].word)
      } else if (str[index].word.indexOf("金额(大写)") != -1) {
        Openbank.push(str[index].word)
      } else if (str[index].word.indexOf("(小写)") != -1) {
        Openbank.push(str[index].word)
      } else if (str[index].word.indexOf("CNY") != -1) {
        Openbank.push(str[index].word)
        console.log(str[index].word)
      }else if (str[index].word.indexOf("付款人账号") != -1) {
        Openbank.push(str[index].word)
      } else if (str[index].word.indexOf("付款人户名") != -1) {
        Openbank.push(str[index].word)
      } else if (str[index].word.indexOf("戈款备注") != -1) {
        Openbank.push(str[index].word)
      } else {
      }
    
    }
    //整理招商银行数据
   let Concat= Openbank[7].concat(Openbank[8]);
   console.log(Concat)
    Openbank.splice(7,2);
    Openbank.splice(7, 0, Concat)
    console.log(Openbank)
    Openbank.pop()


       //整理支付宝数据
    // console.log(Ali)
    for (var i = 0; i < Ali.length; i++) {
      if (Ali[i].word.indexOf("账户类型") != -1) {
        // payBill.push(Ali[i].word)
      } else if (Ali[i].word.indexOf("回单生成时间") != -1) {
        payBill.push(Ali[i].word)
      } else if (Ali[i].word.indexOf("流水号") != -1) {
        let   X= i+1
        Con = Ali[i].word.concat(Ali[X].word);
      } else if (Ali[i].word.indexOf("账号：") != -1) {
        payBill.push(Ali[i].word)
      } else if (Ali[i].word.indexOf("大写：") != -1) {
        payBill.push(Ali[i].word)
      } else if (Ali[i].word.indexOf("小写：") != -1) {
        payBill.push(Ali[i].word)
      } else if (Ali[i].word.indexOf("日期") != -1) {
        payBill.push(Ali[i].word)
      } else if (Ali[i].word.indexOf("支付宝转账电子回单") != -1) {
        payBill.push(Ali[i].word)
      } else if (Ali[i].word.indexOf("日期") != -1) {
        payBill.push(Ali[i].word)
      } else if (Ali[i].word.indexOf("日期") != -1) {
        payBill.push(Ali[i].word)
      } else if (Ali[i].word.indexOf("日期") != -1) {
        payBill.push(Ali[i].word)
      } else if (Ali[i].word.indexOf("日期") != -1) {
        payBill.push(Ali[i].word)
      } else if (Ali[i].word.indexOf("日期") != -1) {
        payBill.push(Ali[i].word)
      }  
    }
    payBill.splice(1, 0, Con)
    console.log(payBill)
    _this.setData({
      Tiemr: str,
      Alipay: Ali,
      Openbank,
      payBill
    })

  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  }
})
