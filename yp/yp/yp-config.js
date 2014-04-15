/* ==========================================================
 * yp: config.js v20140413
 * ==========================================================
 * Copyright xiewu
 *
 * 全局配置模块
 * ========================================================== */
+function(win) {
  var api = win.oYpConfig

  // 调试模式控制器，线上环境默认关闭
  api.debug = true;

  // 公共函数配置
  api.fun = {
    // 模板函数正则
    formatSettings: {
      re: /\${([\s\S]+?)}/g
    }
  };
  // 模块加载配置
  api.mods = {
    // 模块列表
    // 可陪参数包括（js文件路径，css文件路径，shim依赖模块，jq方法名）
    modList: {
      'yp-ui': {
        js: '../yp/yp-ui'
      }
    , 'yp-mods': {
        js: '../yp/yp-mods'
      }
    , 'yp-loader': {
        js: '../yp/lib/yp-loader'
      }
    , 'yp-loger': {
        js: '../yp/lib/yp-loger'
      }
    , 'yp-cache': {
        js: '../yp/lib/yp-cache'
      }
    , 'yp-test': {
        js: '../yp/lib/yp-test'
      , shim: ['mock']
      }
    , 'mock': {
        js: '../yp/lib/mock'
      }
    /*, 'yp-socket': {
        js: '../yp/lib/yp-socket'
      , shim: ['yp-flash']
      }
    , 'yp-flash': {
        js: '../yp/lib/yp-flash'
      , shim: ['flashobject']
      }
    , 'flashobject': {
        js: 'swfobject'
      }*/
    }
  };

  // 文件资源配置
  api.baseUrl = api.baseUrl || '../';
  api.loader = {
    require: {
      // 统一文件版本号（也可对特殊模块做单独配置）
      urlArgs: 'v=' + (api.ver || +new Date())
    , paths: {}
    , shim: {}
    , waitSeconds: 10
    }
    // 默认加载列表
  , baseList: ['yp-loader', 'yp-ui', 'yp-mods', 'yp-loger']
  };
  // 各类型文件目录配置
  api.loader.baseUrlList = {
    js: api.baseUrl + 'lib'
  , css: api.baseUrl + 'c/'
  , html: api.baseUrl + 'h/'
  };
  api.loader.require.baseUrl = api.loader.baseUrlList.js;
  api.loader.debug = api.debug || true;

}(this);