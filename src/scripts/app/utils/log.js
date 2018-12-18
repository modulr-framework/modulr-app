Modulr.define('modulr.app:utils/log', [
    'require'
], function(require, Cookie){

    var _PREFIX = "[<%= @AppName %>]";

    return function(addPrefix) {

        addPrefix = (addPrefix) ? (" '" + addPrefix.replace(/^\s+|\s$/g, '') + "'") : "";
        var prefix = [_PREFIX, addPrefix].join("") + " >>";

        return function() {

            var args = Array.prototype.slice.call(arguments);
            args = [prefix].concat(args);

            if (window.console) {
                try {
                    window.console.log.apply(console, args);
                } catch(err) {
                    // do nothing
                }
            }
        };

    };

});
