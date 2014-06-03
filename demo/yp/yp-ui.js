/* ==========================================================
 * yp: ui.js v20140413
 * ==========================================================
 * Copyright xiewu
 *
 * 全局UI模块
 * ========================================================== */
 
+function($, yp) {
var
  win = this
, exports = yp
, global = exports.global || {}
, ui = exports.ui || {}
  
  yp.mix(ui, {
    // 键位数组
    keyCode: {
      BACKSPACE: 8
    , COMMA: 188
    , DELETE: 46
    , DOWN: 40
    , END: 35
    , ENTER: 13
    , ESCAPE: 27
    , HOME: 36
    , LEFT: 37
    , NUMPAD_ADD: 107
    , NUMPAD_DECIMAL: 110
    , NUMPAD_DIVIDE: 111
    , NUMPAD_ENTER: 108
    , NUMPAD_MULTIPLY: 106
    , NUMPAD_SUBTRACT: 109
    , PAGE_DOWN: 34
    , PAGE_UP: 33
    , PERIOD: 190
    , RIGHT: 39
    , SPACE: 32
    , TAB: 9
    , UP: 3
    }
  });

  // 保存常用对象
  ui.$win = $(win);
  ui.$doc = $(document);
  ui.$body = $(document.body);

  // 对话框
  ui.alert = window.alert;
  ui.confirm = window.confirm;

  // resize
  global.zIndex = 999;
  var resizeWindow = function() {
    global.width = ui.$win.width();
    global.height = ui.$win.height();
  }
  resizeWindow();
  $.sub('ui/resize.ui', function() {
    resizeWindow();
    $.pub('ui/main/resize');
  });

  // 监听错误消息
  $.sub('error/ui.ui', function(e, msg) {
    var e = $.Event('yp/ui/error/' + msg.code)
    yp.pub(e, msg.data);
    if (e.isDefaultPrevented()) return;
    alert(msg.message);
  });
  $.sub('error/sys.ui', function(e, msg) {
    yp.log(msg.message);
  });

  define( 'yp.global', [], function() { return global; } );
  define( 'yp.ui', [], function() { return ui; } );
}(jQuery, yp);

/**
 * 事件模块扩展
 */
+function($, yp) {
var
  win = this
, exports = yp
, ui = exports.ui
, event = exports.event

  // 监听窗口大小改变事件
  ui.$win.on('resize.ui.event', function() {
    $.pub('ui/resize');
  });

  // 监听页面初始化事件
  yp.sub('page/domCreate.ui.event', function(e, data) {
    $.pub('ui/update', data.target);
    return false;
  });
  yp.ready(function() {
    $.pub('ui/update', ui.$body);
  });
}(jQuery, yp);