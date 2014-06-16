/* ==========================================================
 * yp: loaderData.js v20140616
 * ==========================================================
 * Copyright xiewu
 *
 * 全局数据加载模块
 * ========================================================== */

+function($, yp) {
var
  exports = yp
, config = exports.config
, api = exports.loader

  /* 临时缓存队列（避免重复ajax请求） */
, ajaxList = {}

  /* 异步提交 */
, ajax = function(url, opts) {
    if (typeof url === 'object') {
      opts = url;
      url = opts.url;
    }
    opts = opts || {};
    
    var dfd = $.Deferred();
    // 结束回调
    var alwaysCallback = function(e) {
      $.pub('loader/ajax/always');
    };
    // 完成回调
    var doneCallback = function(msg, status, xhr) {
      var e = $.Event('loader/ajax/done');
      $.pub(e, msg);
      if (e.isDefaultPrevented()) return;
      dfd.resolve(msg, status, xhr);
    };
    // 异常回调
    var failCallback = function(msg, status, throws) {
      var oMsgMap = {
            timeout: '请求超时，请稍候重试'
          , error: '服务器错误，请联系管理员'
          , errorInternal: '服务器错误，请联系管理员'
          , parsererror: '返回格式不合法，请联系管理员'
          }
        , sErrMsg = oMsgMap[status] || oMsgMap['error']
        , e = $.Event('yp/' + 'loader/ajax/fail/' + msg.type)
      
      yp.pub(e, msg);
      if (e.isDefaultPrevented()) return;
      $.pub('error/ui', {code:'ajax/fail', message:sErrMsg, data:msg});
    };

    opts.type = opts.type || config.loader.type || 'GET';
    opts.dataType = opts.dataType || config.loader.dataType;

    api[opts.type.toUpperCase()].ajax(url, opts)
    .fail(failCallback)
    .done(doneCallback)
    .always(alwaysCallback);
    
    $.pub('loader/ajax/start', opts);
    return dfd.promise();
  }

  /* 异步提交表单 */
, ajaxSubmit = function(url, opts) {
    if (typeof url === 'object') {
      opts = url;
      url = opts.url;
    }
    opts = opts || {};
    var $target = $(opts.target)
      , dfd = $.Deferred()

    if (!$target.length) {
      $.pub('error/ui', {code:'noFormSubmit', message:'没有找到要提交的表单'});
      return dfd;
    }
    // 触发表单序列化事件
    var $btnSubmit = $target.find(':submit[type=submit]');
    $target.trigger('form-pre-serialize', [$target, $btnSubmit]);

    // 取消提交
    if (opts.beforeSubmit && opts.beforeSubmit($target, opts) === false) {
      return dfd;
    }
    // 触发验证事件
    var e = $.Event('form-submit-validate')
    $target.trigger(e);
    if (e.isDefaultPrevented()) return dfd;

    // 组装提交数据
    url = url || $target.attr('action');
    if (ajaxList[url]) return ajaxList[url];
    
    var type = opts.type || 'POST'/// || $target.attr('method') || config.loader.type;
    var data_list = [];
    var data_pre = config.loader.data_pre
    data_pre && data_list.push(data_pre);
    var data = $target.serialize();
    data && data_list.push(data);
    data = opts.data;
    data && (typeof(data) != 'string' && (data = $.param(data)));
    data && data_list.push(data);
    data = data_list.join('&');
    var callback = opts.success;

    // 触发表单提交事件
    $target.trigger('form-submit-notify');

    return ajaxList[url] = ajax(url, {
        type: type
      , data: data
      })
      .done(callback)
      .always(function(e) {
        delete ajaxList[url];///
        $target.trigger('form-ajax-always', [$target, $btnSubmit]);
      });
  };
  api.ajax = exports.ajax = ajax;
  api.ajaxSubmit = ajaxSubmit;

  $.fn.ajaxSubmit = function(url, opts) {
    if (typeof url === 'object') {
      opts = url || {};
    } else {
      opts = opts || {};
      opts.url = url;
    }
    opts.target = this;
    this.ajax = ajaxSubmit(opts);
    return this;
  };

  // 监听表单事件
  $.sub('form-pre-serialize', function(e, form, $btnSubmit) {
    $btnSubmit.prop('disabled', true);
  });
  $.sub('form-validate-fail form-ajax-always', function(e, form, $btnSubmit) {
    $btnSubmit.prop('disabled', false);
  });

  /* 通用异步模块 */
  yp.each(['GET', 'POST'], function(type) {
    api[type] = $;
    ///exports[type] = $[type];
  });

  define( 'yp.loader', [], function() { return api; } );
}(jQuery, yp);