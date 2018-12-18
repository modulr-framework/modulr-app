Modulr.define('modulr.app:helper', [
    'require',
    'utils/promise',
    'utils/promise.iterator',
    'utils/log'
], function(require, PromiseUtil, PromiseIterator){

    var log = require('utils/log')('helper');

    var Helper = function() {

        var Proto = this;

        Proto.executeModules = function(modules, data, replacePath) {

            var res = new PromiseUtil(function(resolve, reject){

                var dataset = {};

                PromiseIterator(modules, function(next, i, step, stop){
                    var moduleId = modules[i],
                        modulePath = moduleId;

                    if (replacePath) {
                        modulePath = replacePath.replace('$1', moduleId);
                    }

                    require([modulePath], function(Mod){
                        var done = false;
                        if (typeof Mod.trigger === 'function') {
                            Mod.trigger(data).then(function(data){
                                dataset[moduleId] = data || null;
                                step();
                            });
                        } else {
                            log('module does not have a promise:', modules[i]);
                            dataset[moduleId] = null;
                            step();
                        }
                    });

                }, function() {
                    resolve(dataset);
                });

            });

            return res;
        };

        Proto.isFn = function(val) {
            return (typeof val === 'function');
        };

        Proto.getTrackingNameDetails = function(val) {
            var sp = val.split(':'),
                bool = (sp.length > 0) ? true : false;

            return {
                id: (bool) ? (sp.slice(1).join(':')) : val,
                group: (bool) ? sp[0] : null
            };
        };

    };

    return new Helper();

});
