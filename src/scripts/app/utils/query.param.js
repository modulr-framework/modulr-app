Modulr.define('modulr.app:utils/query.param', [
    'require'
], function(require){

    /**
     * get query params from the url
     */
    var App = function() {

        var Proto = this;

        // get specific query param value
        Proto.getVal = function(name) {
            var queryObj = Proto.getAll();

            return (queryObj && queryObj[name]) ? decodeURIComponent(queryObj[name]) : false;

        };

        // get all query values
        Proto.getAll = function() {
            var ret = {},
                query = window.location.search.substr(1) || "",
                vals = query.split("&");

            for (var x = 0; x < vals.length; x++) {
                var sp = vals[x].split("="),
                    name = sp[0] || false,
                    value = sp.slice(1);

                if (value.length > 1) {
                    value = value.join('=');
                } else {
                    value = sp[1] || false;
                }

                if (name && value) {
                    ret[name] = (decodeURIComponent(value)).toString();
                }
            }

            return ret;

        };

        // translate a to string you can use on building your query url
        Proto.setToString = function(queryObj) {
            var ret = [];

            for (var i in queryObj) {
                ret.push(i + "=" + queryObj[i]);
            }

            ret = ret.join("&");
            return ret;

        };
    };

    return (new App());
});
