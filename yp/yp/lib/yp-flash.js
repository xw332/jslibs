/**
 * flash封装模块
 */
!function($, yp) {
var
  win = this
, exports = yp

  // 获取flash对象
, getSwfObj = function(movieName) {
    if (navigator.appName.indexOf("Microsoft") != -1) {
      return window[movieName];
    } else {
      return document[movieName];
    }
  }

, api = {
    init: function(conf) {
      var sUrlFlash = conf.url + '?' + yp.config.ver///
        , sHolder = conf.placeholder || "yp-flash-placeholder"
        , sFlashInstall = conf.installUrl + '?' + yp.config.ver
        , flashvars = yp.mix({}, conf.vars)
        , params = yp.mix({}, conf.params)
        , attributes = yp.mix({}, conf.attr)
      
      this.id = conf.attr.id
      this.connection = {};

      this.connection.open = function() {
        this.onopen();
      };
      this.connection.send = function(data) {
        api.getWS()[api.J2F](data);
      };
      this.connection.close = function() {
        /// 发关闭消息
        this.onclose();
        $(document).trigger('socket/close', {
          ws: api.getWS()
        });
      };
      this.connection.error = function() {
        this.onerror();
      };
      this.connection.onopen = conf.onopen || yp.noop;
      this.connection.onmessage = conf.onmessage || yp.noop;
      this.connection.onclose = conf.onclose || yp.noop;
      this.connection.onerror = conf.onerror || yp.noop;
      
      setTimeout(function() {
        swfobject.embedSWF(
          sUrlFlash
        , sHolder
        , "100%", "100%"
        , "10.0.0"
        , sFlashInstall
        , flashvars
        , params
        , attributes
        );
      });
      return this.connection;
    }
  , getWS: function() {
      return this.connection.ws || getSwfObj(this.id);
    }
  , F2J: function(data) {
      api.connection.ws = api.getWS();
      if (data.cmdid === 'ready_resp') {///
        api.connection.open();
      } /*else if (0) {
        api.connection.close();
      } */else if (0) {
        api.connection.error();
      } else {
        api.connection.onmessage({
          data: data
        });
      }
    }
  };

  var WebSocket = function(url) {
    ///
  };
  win.WebSocket = WebSocket;
  window['JSInterface'] = api.F2J;
  api.J2F = 'receiveFormJS';

  /// 监听socket关闭
  /*$(document).on('socket/close', function(e, data) {
    // 发送关闭请求
    data.ws[api.J2F]({cmdid:'logout'});
  });*/

  exports.flash = api;
  define( 'yp.flash', [], function() { return api; } );
}(jQuery, yp);