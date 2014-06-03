// 模拟发生系统异常
setTimeout(function() {
  $.pub('error/ui.ui', {message:'这是一个系统处理的错误消息'});
  setTimeout(function() {
    $.pub('error/ui.ui', {message:'这又是一个错误消息',code:'ajax',data:{a:1}});
  }, 500);
}, 500);