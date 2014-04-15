/* ==========================================================
 * yp: test.js v20140413
 * ==========================================================
 * Copyright 2014 xiewu
 *
 * 通用测试模块
 * ========================================================== */

+function($, yp) {
var
  win = this
, exports = yp
, config = exports.config

  yp.test = {
    ajax: Mock.mock
  , random: Mock.Random
  };

  config.loader.dataType = 'json';
  // 加载测试文件
  /*+function() {
    yp.sub('ui/load', function(e, data) {
      data.url.replace(/.*\/(.*)\.html/, function($0, $1) {
        yp.use('../test/' + $1);
      });
    });
  }();*/
  
  /* 旧版本函数支持 */
  win.randomNum = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return Random.integer(min, max);
  }
  win.randomDate = function() {
    return Random.datetime('yyyy-MM-dd');
  };
  win.randomStr = function(min, max, num) {
    var arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
      , str = ''

    if (min === 'chinese') {
      return '中文';
    } else if (min === 'emall') {
      return '123@163.com';
    } else if (min === 'ip') {
      return '192.168.0.1';
    } else if (min === 'ChinaID') {
      arr = [1,2,3,4,5,6,7,8,9,0];
      str = '33030219'
      min = 10;
      max = 10;
    } else if (min === 'number') {
      arr = [1,2,3,4,5,6,7,8,9,0];
      min = max;
      max = num;
    }
    
    var len = randomNum(min, max)
    for (var i = len; i--;) {
      str += arr[randomNum(0, arr.length - 1)];
    };
    return str;
  };

}(jQuery, yp);