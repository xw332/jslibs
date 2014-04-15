/* ==========================================================
 * yp: loader.js v20140413
 * ==========================================================
 * Copyright xiewu
 *
 * 框架加载模块
 * ========================================================== */
+function(win) {
  function scripts() {
    return document.getElementsByTagName('script');
  }
  /**
   * Helper function for iterating over an array backwards. If the func
   * returns a true value, it will break out of the loop.
   */
  function eachReverse(ary, func) {
    if (ary) {
      var i;
      for (i = ary.length - 1; i > -1; i -= 1) {
        if (ary[i] && func(ary[i], i, ary)) {
          break;
        }
      }
    }
  }

  function loadJs(src, ver) {
    document.write('<script src="' + src + '.js?v=' + ver + '"><\/script>');
  };

  var oYpConfig = win.oYpConfig
    , sUrlBase = oYpConfig.baseUrl
    , sUrlYp = sUrlBase + (oYpConfig.ypUrl || 'yp/')
    , sUrlJq = sUrlBase + (oYpConfig.ypUrl || 'yp/lib/require-jquery')
    , sUrlYpConfig = sUrlYp + 'yp-config'
    , sUrlYpCore = sUrlYp + 'lib/yp-core'
    , sVer = oYpConfig.ver || 'yp'
    , sUrlMain;
  
  eachReverse(scripts(), function(script) {
    sUrlMain = script.getAttribute('data-main-yp');
    if (sUrlMain) {
      return true;
    }
  });
  
  // 加载jq
  loadJs(sUrlJq, sVer);
  // 加载配置模块
  loadJs(sUrlYpConfig, sVer);
  // 加载核心模块
  loadJs(sUrlYpCore, sVer);
  // 加载入口文件
  if (sUrlMain) loadJs(sUrlMain, sVer);
}(this);