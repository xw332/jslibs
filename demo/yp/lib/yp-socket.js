/**
 * socket封装模块
 */
!function($, yp) {
var
  win = this
, exports = yp

, api = {
    init: function(conf) {
      if (typeof WebSocket == 'undefined') {
        if (swfobject.getFlashPlayerVersion().major < 10) {
          alert('您的flash版本过低');
        } else {
          alert('您的浏览器不支持socket功能');
        }
        return false;
      }
      conf.onopen = function() {
        $.pub('socket/open');
      };
      conf.onmessage = function(e) {
        $.pub('socket/message', e.data);
      };
      conf.onclose = function() {
        $.pub('socket/close');
      };
      conf.onerror = function(e) {
        $.pub('socket/error', e.data);
      };

      win.onunload = function() {
        api.connection.close();
      };///

      $.sub('socket/send.socket', function(e, msg) {
        api.connection.send(msg);
      });

      // 异常处理
      $.topic('msgc/error').sub(function(data) {
        if (data.msg) {
          alert(data.msg);
          ///yp.pub('page/sys/error');
        }
        // 处理flash异常
        // if (code === 1) {
        //   ///
        // }
      });

      var socket_type = typeof WebSocket == 'undefined' ? 'flash' : 'webSocket'
      return api.connection = yp[socket_type].init(conf);
    }
  };

  yp.webSocket = {
    init: function(conf) {
      return new WebSocket(conf);
    }
  };

  api.cmd_name = 'cmdid';

  exports.socket = api;
  define( 'yp.socket', [], function() { return api; } );
}(jQuery, yp);

/**
 * loader类扩展
 */
!function($, yp) {
var
  exports = yp
, loader = exports.loader

  /* 消息中心异步通信 */
  loader['SOCKET'] = (function() {
    // var deferredList = {}
    //     消息中心异步回调
    //   , _jsonpCallback = function(e, msg) {
    //       var dfd = deferredList[msg.type]
    //       if (dfd) {
    //         msg.message = msg.message || msg.data.errmsg;
    //         ///msg.code = msg.code || msg.data.flag;
    //         dfd[msg.code === 1 ? 'resolve' : 'reject'](msg);///
    //       }
    //     }
    $.sub('loader/msgc/message.loader', function(e, msg) {
      if (msg.dataType === 'socket') {
        msg.winType = 'msgc';
        $.pub('loader/msgc/message/socket', msg);
      } else {
        // 当前模式，无回调
        //_jsonpCallback.apply(this, arguments);
      }
    });
    $.sub('loader/msgc/message/socket.loader', function(e, msg) {
      $.topic([msg.winType, msg.name].join('/')).pub.call(null, msg.params);///
    });
    
    return {
      ajax: function(url, opts) {
        var dfd = $.Deferred()
          , data = opts.data || {}
        
        //deferredList[url] = dfd;
        data['cmdid'] = url;///
        $.pub('loader/msgc/send', data);
        return dfd.promise();
      }
    };
  }());
}(jQuery, yp);

/**
 * event类扩展
 */
!function($, yp) {
var
  exports = yp
, event = exports.event

  // 主题订阅
  var topics = {}
  event.topic = function( id ) {
    var callbacks
      , topic = id && topics[ id ];
   
    if ( !topic ) {
      callbacks = $.Callbacks();
      // 逐层发布给上级
      function pubParents( id, args ) {
        if ( /\//.test( id ) ) {
          var pid = id.replace( /[^\/]*(\/\*)?$/, '*' )
            , topicP = topics[ pid ]
          topicP ? topicP.pub.apply( topicP, args ) : pubParents( pid, args );
        }
      }
      // 发布给所有订阅者
      function fireAll() {
        callbacks.fire.apply( this, arguments );
        pubParents( this.id, arguments );
      }
      topic = {
        id: id,
        pub: fireAll,
        sub: callbacks.add,
        unsub: callbacks.remove
      };
      if ( id ) {
        topics[ id ] = topic;
      }
    }
    return topic;
  };
  $.topic = event.topic;

  // 监听socket消息
  $.sub('socket/open.event', function() {
    yp.pub('msgc/ready');
  });
  $.sub('socket/message.event', function(e, msg) {
    var oMsg = msg///
      , data = {
          name: oMsg['cmdid']
        , params: oMsg
        }
    data.dataType = 'socket';
    $.pub('loader/msgc/message', data);///
  });
  $.sub('loader/msgc/send.event', function(e, msg) {
    $.pub('socket/send', msg);///
  });
}(jQuery, yp);