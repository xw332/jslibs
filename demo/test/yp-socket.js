// 模拟WebSocket和服务器
window.WebSocket = function(conf) {
  var api = {
    onopen: conf.onopen || yp.noop
  , close: conf.onclose || yp.noop
  , send: function(msg) {
      console.log('接收到socket发送消息：', msg.cmdid);
      for (var i = 5; i--;) {
        +function() {
          var j = i
          setTimeout(function() {
            conf.onmessage({
              data: {cmdid:'userIn',data:{userid:111 * (5-j), username:'测试用户' + (5-j)}}
            });
          }, 300 * (5-j));
        }();
      };
    }
  };
  setTimeout(function() {
    api.onopen();
  }, 100);
  return api;
};