/* https://gist.github.com/bobslaede/1221602, see user comment by jtangelder */

;(function(Modernizr, window) {
    Modernizr.addTest('positionfixed', function () {
        var ret;

        // no (solid) support on <Android2 and <iOS4
        var ua = navigator.userAgent;
        if(ua.match(/android [0-2]/i) || ua.match(/(iphone|ipad|ipod).+(OS [0-4])/i)) {
          return false;
        }

        var test  = document.createElement('div'),
            control = test.cloneNode(false),
                fake = false,
                root = document.body || (function () {
                fake = true;
                return document.documentElement.appendChild(document.createElement('body'));
            }());

        var oldCssText = root.style.cssText;
        root.style.cssText = 'padding:0;margin:0';
        test.style.cssText = 'position:fixed;top:42px';
        root.appendChild(test);
        root.appendChild(control);

        ret = test.offsetTop !== control.offsetTop;

        root.removeChild(test);
        root.removeChild(control);
        root.style.cssText = oldCssText;

        if (fake) {
            document.documentElement.removeChild(root);
        }

        return ret;
    });
})(Modernizr, window);