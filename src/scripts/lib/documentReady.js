var DocumentReady = (function(){
    var ready = false,
        init = false,
        stack = [];

    var executeStack = function() {
        if (stack.length === 0) { return; }
        while (stack.length > 0) {
            var fn = stack.shift();
            fn();
        }
    };

    return function(callback) {
        if (typeof callback !== 'function') { return; }

        if (ready) {
            return callback();
        } else {
            stack.push(callback);
        }

        if (init) { return; }
        init = true;

        if (window.addEventListener) {

            if (document.readyState === "complete" ||
                (document.readyState !== "loading" && !document.documentElement.doScroll)
            ) {
                ready = true;
                executeStack();
            } else {
                document.addEventListener("DOMContentLoaded", executeStack);
            }
        } else if (window.attachEvent) {

            document.attachEvent("onreadystatechange", function(){
                // check if the DOM is fully loaded
                if(document.readyState === "complete"){
                    // remove the listener, to make sure it isn't fired in future
                    document.detachEvent("onreadystatechange", arguments.callee);
                    ready = true;
                    executeStack();
                }
            });

        }
    };
})();
