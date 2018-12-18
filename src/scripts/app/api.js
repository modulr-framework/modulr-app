Modulr.define('modulr.app:api', [
    'require',
    'helper',
    'config',
    'utils/log'

], function(require, Helper, config){

    var log = require('utils/log')('API');

    var API = function() {

        var Proto = this;

        var INITIALIZED = false;

        Proto.initialize = function() {
            // initialize once
            if (INITIALIZED) { return; }
            INITIALIZED = true;
            log('initialized: v' + config.version);

            // TODO: initialization execution here
        };

    };

    return new API();

});
