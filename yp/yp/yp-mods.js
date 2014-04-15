/* ==========================================================
 * yp: mods.js v20140413
 * ==========================================================
 * Copyright xiewu
 *
 * 全局组件管理模块
 * ========================================================== */

+function($, yp) {
var
  win = this
, exports = yp
, config = exports.config
, ui = exports.ui

, api = {
    // 初始化
    init: function() {
      this.modList = config.mods.modList;
      this.css = config.mods.css;
      this.jq = config.mods.jq;
      this.update = {};
      this.updateList = {};
    }
    // 注册组件
  , addMods: function(mods) {
      mods = [].concat(mods);
      yp.each(mods, function(name) {
        var mod = api.modList[name]
        if (!mod.isLoad) {
          mod.isLoad = true;
          $.pub('mods/init/css', [api.css[name], name]);
          $.pub('mods/init/jq', [api.jq[name], name]);
          $.pub('mods/init/update', [api.update[name], name, ui.$body]);
          $.pub('mods/ready/' + name, mod);
        }
      });
      return this;
    }
    // 初始化组件
  , updateAll: function(container) {
      var $container = $(container)
      yp.each(api.updateList, function(fUpdate) {
        fUpdate($container);
      });
    }
  };
  api.init();

  // 监听组件加载完成
  $.sub('loader/ready.mods', function(e, mod) {
    if (mod in api.modList) {
      api.addMods(mod);
    }
  });
  // 监听特殊类型注册
  // 用于自动加载css文件
  $.sub('mods/init/css', function(e, arr) {
    if (arr) {
      yp.each(arr, function(val) {
        yp.loader.loadCSS(val);
      });
    }
  });
  // 用于默认绑定jq事件
  $.sub('mods/init/jq', function(e, arr, key) {
    if (arr) {
      // 排除空对象的注册
      if (!arr.length) arr = [key];
      var limitFn = function(key) {
        yp.each(arr, function(name) {
          var _fn = $.fn[name]
          $.fn[name] = function() {
            return this.length ? _fn.apply(this, arguments) : this;
          }
        });
      }
      limitFn(key);
    }
  });
  // 用于绑定动态插入的html内容
  $.sub('mods/init/update', function(e, fn, name, $container) {
    if (fn) {
      fn($container);
      api.updateList[name] = fn;
    }
  });

  // 框架功能初始化（不依赖文件加载触发，页面运行中可多次执行）
  // debug示例
  api.updateList.debug = function($container) {
    console.log('框架组件初始化', $container);
  };

  // 自定义组件初始化（依赖文件加载触发，页面运行中可多次执行）
  // yp-chat示例
  api.update['mock'] = function($container) {
    console.log('模块内定义：mock模块加载成功', $container);
  };

  // 监听UI内容更新（常见动态插入html内容）
  $.sub('ui/update.mods', function(e, target) {
    // 模块自动初始化事件
    $.pub('mods/updateAll', target);
    api.updateAll(target);
  });

  exports.mods = api;
  define( 'yp.mods', [], function() { return api; } );
}(jQuery, yp);