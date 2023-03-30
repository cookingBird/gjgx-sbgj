//������Դ��
(function() {
    var r = new RegExp('(^|(.*?\\/))(include-mapboxgl.js)(\\?|$)'),
        s = document.getElementsByTagName('script'),
        targetScript;
	var header='/2D/mapboxgl/'
    for (var i = 0; i < s.length; i++) {
        var src = s[i].getAttribute('src');
        if (src) {
            var m = src.match(r);
            if (m) {
                targetScript = s[i];
                break;
            }
        }
    }
    function inputScript(url) {
        var script = '<script type="text/javascript" src="' + url + '"><' + '/script>';
        document.writeln(script);
    }

    function inputCSS(url) {
        var css = '<link rel="stylesheet" href="' + url + '">';
        document.writeln(css);
    }

    function inArray(arr, item) {
        for (i in arr) {
            if (arr[i] == item) {
                return true;
            }
        }
        return false;
    }

    function supportES6() {
        var code = "'use strict'; class Foo {}; class Bar extends Foo {};";
        try {
            new Function(code)();
        } catch (err) {
            return false;
        }
        if (!Array.from) {
            return false;
        }
        return true;
    }
    function load() {
        var includes = (targetScript.getAttribute('include') || '').split(',');
        var excludes = (targetScript.getAttribute('exclude') || '').split(',');
        if (!inArray(includes, 'mapbox-gl-enhance')) {			
            inputCSS(header+'mapbox-gl.css');
			inputCSS(header+'mapbox-gl-enhance.css');
			inputScript(header+'mapbox-gl-enhance.js');
			inputScript(header+'iclient-mapboxgl-es6.min.js')
			inputCSS(header+'iclient-mapboxgl.min.css');
        }
		if (!inArray(excludes, 'anybox')) {
		    inputScript(header+'terraformer.js');
			inputScript(header+'terraformer-wkt-parser.js');
			inputScript(header+'turf.min.js');
			inputScript(header+'echarts.min.js');
			inputScript(header+'echarts-liquidfill.min.js');
			inputScript(header+'EchartsLayer.min.js');
			inputScript(header+'transform.js');
			inputCSS(header+'pop.css');
		}
    }

    load();
 
})();
