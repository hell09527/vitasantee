const util = {
  //数据转化 
  formatNumber: function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  /**
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
  formatTime: function (number, format) {
    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];

    var date = new Date(number * 1000);
    returnArr.push(date.getFullYear());
    returnArr.push(this.formatNumber(date.getMonth() + 1));
    returnArr.push(this.formatNumber(date.getDate()));

    returnArr.push(this.formatNumber(date.getHours()));
    returnArr.push(this.formatNumber(date.getMinutes()));
    returnArr.push(this.formatNumber(date.getSeconds()));

    for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
  },// 计算时间差
  calcDateTime: function (endTime, startTime) {
    let start = startTime || Date.now()/1000;
    let count = endTime - start ;
    if (count < 0) return null; //开始时间早于结束时间
    return {
      day: Math.floor((count / 3600) / 24),
      hour: Math.floor((count / 3600) % 24),
      minute: Math.floor((count / 60) % 60),
      second: Math.floor(count % 60)
    }
  }
}
module.exports = util;