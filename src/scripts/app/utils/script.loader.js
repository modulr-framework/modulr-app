Modulr.define('modulr.app:utils/script.loader', [
    'require'
], function(require){

    /**
     * generic script loader
     */
     return function(src, callback, attr) {

        if (typeof callback !== 'function') {
            callback = function() {};
        }

        var script = document.createElement("script");
        script.type = "text/javascript";
        script.charset = "utf-8";
        script.async = true;

        if ( attr && typeof attr === "object" ) {
            for(var key in attr) {
                script.setAttribute(key, attr[key]);
            }
        }

        function onError() {
            throw new Error("Error loading script: " + src);
        }

        if (script.attachEvent &&
            //Check if node.attachEvent is artificially added by custom script or
            //natively supported by browser
            //read https://github.com/jrburke/requirejs/issues/187
            //if we can NOT find [native code] then it must NOT natively supported.
            //in IE8, node.attachEvent does not have toString()
            //Note the test for "[native code" with no closing brace, see:
            //https://github.com/jrburke/requirejs/issues/273
            !(script.attachEvent.toString && script.attachEvent.toString().indexOf("[native code") < 0) &&
            !isOpera) {

            script.attachEvent("onreadystatechange", callback);
        } else {
            script.addEventListener("load", callback, false);
            script.addEventListener("error", onError, false);
        }

        script.src = src;
        document.getElementsByTagName("head")[0].appendChild(script);

    };

});
