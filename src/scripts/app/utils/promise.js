Modulr.define('modulr.app:utils/promise', [
    'require'
], function(require){

    var supports = (typeof Promise !== "undefined" && Promise.toString().indexOf("[native code]") !== -1) ? true : false;
    
    // promise
    return (supports) ? Promise : function(sender) {

        var Proto = this;

        var RESOLVE_STACK = [],
            REJECT_STACK = [],
            ARGS_DATA = {},
            READY_STATE = {};

        Proto.then = Proto.resolve = function(callback){
            if (typeof callback === 'function') {
                // if it's already ready
                if (READY_STATE.resolve) {
                    callback.apply(callback, ARGS_DATA.resolve);
                } else {
                    RESOLVE_STACK.push(callback);
                }
            }
            return this;
        };

        Proto.reject = function(callback) {
            if (typeof callback === 'function') {
                // if it's already ready
                if (READY_STATE.reject) {
                    callback.apply(callback, ARGS_DATA.reject);
                } else {
                    REJECT_STACK.push(callback);
                }
            }
            return this;
        };

        sender(function(){
            READY_STATE.resolve = true;
            if (RESOLVE_STACK.length > 0) {
                ARGS_DATA.resolve = Array.prototype.slice.call(arguments);
                while (RESOLVE_STACK.length > 0) {
                    var fn = RESOLVE_STACK.shift();
                    fn.apply(fn, ARGS_DATA.resolve);
                }
            }
        }, function(){
            READY_STATE.reject = true;
            if (REJECT_STACK.length > 0) {
                ARGS_DATA.reject = Array.prototype.slice.call(arguments);
                while (REJECT_STACK.length > 0) {
                    var fn = REJECT_STACK.shift();
                    fn.apply(fn, ARGS_DATA.reject);
                }
            }
        });
    };

});
