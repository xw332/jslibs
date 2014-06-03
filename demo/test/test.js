yp.use('yp-test', function() {
  // 生成指定格式消息
  var setMsg = function(data, message) {
    return {code:0, data:data, message:message};
  };
  yp.test.ajax(/url_ajax1/, setMsg({id:1, name:'测试数据1'}, '操作成功'));
  yp.test.ajax(/url_ajax2/, setMsg({id:2, name:'测试数据2'}, '操作成功'));
});