/*!
  * Bowser - a browser detector
  * https://github.com/ded/bowser
  * MIT License | (c) Dustin Diaz 2011
  */
!function (name, definition) {
  if (typeof define == 'function') define(definition()(navigator.userAgent))
  else if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else this[name] = definition()(navigator.userAgent)
}('bowser', function () {
  /**
    * navigator.userAgent =>
    * Chrome:  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_7) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.57 Safari/534.24"
    * Opera:   "Opera/9.80 (Macintosh; Intel Mac OS X 10.6.7; U; en) Presto/2.7.62 Version/11.01"
    * Safari:  "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_7; en-us) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1"
    * IE:      "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C)"
    * Firefox: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:2.0) Gecko/20100101 Firefox/4.0"
    * iPhone:  "Mozilla/5.0 (iPhone Simulator; U; CPU iPhone OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5"
    * iPad:    "Mozilla/5.0 (iPad; U; CPU OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5",
    * Android: "Mozilla/5.0 (Linux; U; Android 2.3.4; en-us; T-Mobile G2 Build/GRJ22) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"
    * Touchpad: "Mozilla/5.0 (hp-tabled;Linux;hpwOS/3.0.5; U; en-US)) AppleWebKit/534.6 (KHTML, like Gecko) wOSBrowser/234.83 Safari/534.6 TouchPad/1.0"
    * PhantomJS: "Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/534.34 (KHTML, like Gecko) PhantomJS/1.5.0 Safari/534.34"
    * IE10 on a touch-enabled device: "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; ARM; Trident/6.0; Touch)"
    */

  var t = true

  function detect(ua) {
    function getFirstMatch(regexp) {
      var match = ua.match(regexp);
      return match && match[1];
    }

    var ie = /msie/i.test(ua)
      , chrome = /chrome/i.test(ua)
      , phantom = /phantom/i.test(ua)
      , safari = /safari/i.test(ua) && !chrome && !phantom
      , iphone = /iphone/i.test(ua)
      , ipad = /ipad/i.test(ua)
      , touchpad = /touchpad/i.test(ua)
      , android = /android/i.test(ua)
      , opera = /opera/i.test(ua)
      , firefox = /firefox/i.test(ua)
      , gecko = /gecko\//i.test(ua)
      , seamonkey = /seamonkey\//i.test(ua)
      , webkitVersion = /version\/(\d+(\.\d+)?)/i
      , o

    if (ie) return {
        touch: /touch/i.test(ua)
      , msie: t
      , version: getFirstMatch(/msie (\d+(\.\d+)?);/i)
    }
    if (chrome) return {
        webkit: t
      , chrome: t
      , version: getFirstMatch(/chrome\/(\d+(\.\d+)?)/i)
    }
    if (phantom) return {
        webkit: t
      , phantom: t
      , version: getFirstMatch(/phantomjs\/(\d+(\.\d+)+)/i)
    }
    if (touchpad) return {
        webkit: t
      , touch: true
      , touchpad: t
      , version: getFirstMatch(/touchpad\/(\d+(\.\d+)?)/i)
    }
    if (iphone || ipad) {
      o = {
          webkit: t
        , touch: t
        , mobile: t
        , ios: t
        , iphone: iphone
        , ipad: ipad
      }
      // WTF: version is not part of user agent in web apps
      if (webkitVersion.test(ua)) {
        o.version = getFirstMatch(webkitVersion)
      }
      return o
    }
    if (android) return {
        webkit: t
      , touch: t
      , android: t
      , mobile: t
      , version: getFirstMatch(webkitVersion)
    }
    if (safari) return {
        webkit: t
      , safari: t
      , version: getFirstMatch(webkitVersion)
    }
    if (opera) return {
        opera: t
      , version: getFirstMatch(webkitVersion)
    }
    if (gecko) {
      o = {
          gecko: t
        , mozilla: t
        , version: getFirstMatch(/firefox\/(\d+(\.\d+)?)/i)
      }
      if (firefox) o.firefox = t
      return o
    }
    if (seamonkey) return {
        seamonkey: t
      , version: getFirstMatch(/seamonkey\/(\d+(\.\d+)?)/i)
    }
  }

  return function createBowser(ua) {
    var bowser = detect(ua)
    if (!bowser) {
        return
    }

    // Graded Browser Support
    // http://developer.yahoo.com/yui/articles/gbs
    if ((bowser.msie && bowser.version >= 7) ||
        (bowser.chrome && bowser.version >= 10) ||
        (bowser.firefox && bowser.version >= 4.0) ||
        (bowser.safari && bowser.version >= 5) ||
        (bowser.opera && bowser.version >= 10.0)) {
      bowser.a = t;
    }

    else if ((bowser.msie && bowser.version < 7) ||
        (bowser.chrome && bowser.version < 10) ||
        (bowser.firefox && bowser.version < 4.0) ||
        (bowser.safari && bowser.version < 5) ||
        (bowser.opera && bowser.version < 10.0)) {
      bowser.c = t
    } else bowser.x = t
    return bowser;
  }
})
