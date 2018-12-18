(function(AppFramework){

    var AppName = '<%= @AppName %>';

    // instantiate var
    window[AppName] = window[AppName] || [];

    if (window[AppName].length > 0) {
        while(window[AppName].length > 0) {
            var item = window[AppName].shift();
            AppFramework.execute(item);
        }
    }

    // creating an object after load
    window[AppName] = {
        push: function() {
            var item = arguments[0] || null;
            if (item) {
                AppFramework.execute(item);
            }
        },
        loader: AppFramework.loader
    };

}(
    (function(Modulr, DocumentReady){

        // set the global cache param that changes every build generation
        Modulr.setGlobalCacheParam((function(){
            var version = '<%= @deployVersion %>';
            if (/@deployversion/i.test(version)) {
                version = Modulr.version;
            }
            return version;
        })());

        // set global cache conditions
        Modulr.setGlobalCacheCond([
            {
                regex: /geo\.js/,
                param: 'cb',
                noStore: true
            }
        ]);

        // set ready state on document.ready
        DocumentReady(function(){
            Modulr.setReady();
        });

        // instance
        var Instance = Modulr.config((function(){

            var HOST_DOMAIN = window.location.protocol + '//<%= @hostDomain %>',
                HOST_PATH = '<%= @hostPath %>' + '/app';

            var config = {
                // instance uid
                instance: 'modulr.app',
                // host domain
                baseDomain: HOST_DOMAIN,
                // app folder of this instance
                baseUrl: HOST_PATH,
                // additional items not on /plugins/*
                shim: {
                    // external file that's on the app server
                    'jquery': {
                        src: HOST_PATH + '/lib/jquery.js',
                        exports: 'jQuery'
                    },
                    // external file that's not on the app server
                    'lodash': {
                        src: 'https://cdn.jsdelivr.net/npm/lodash@4.17.11/lodash.min.js',
                        exports: '_'
                    }
                }
            };

            return config;

        })());

        // application modules
        (function(){
            //include:${modules}
        })();

        // resuable document ready
        Instance.define('documentReady', function(){
            return DocumentReady;
        });

        Instance.require(['config', 'utils/log'], function(config, log){
            log()('loaded: v' + config.version);
        });

        // return application loader
        return new function() {

            var Proto = this;

            Proto.loader = function() {
                var args = arguments,
                    scripts = (typeof args[0] === 'string') ? [args[0]] : (Array.isArray(args[0])) ? args[0] : [],
                    callback = (typeof args[0] === 'function') ? args[0] : (args[1] && typeof args[1] === 'function') ? args[1] : function(){};

                Instance.require([
                    'require'
                ], function(require){

                    var runCallback = function() {
                        if (typeof callback === 'function') {
                            callback(require);
                        }
                    };

                    if (scripts.length > 0) {
                        var loader = function() {
                            var src = scripts.shift();
                            Modulr.loadScript(src, function(){
                                if (scripts.length > 0) {
                                    loader();
                                } else {
                                    runCallback();
                                }
                            });
                        };
                        loader();
                    } else {
                        runCallback();
                    }

                });
            };

            Proto.execute = function(item) {
                if (typeof item === 'function') {
                    trigger({}, item);
                } else if (typeof item === 'object' && !Array.isArray(item)) {
                    if (typeof item.callback === 'function') {
                        trigger(item.attrs || {}, item.callback);
                    }
                }

                function trigger(attrs, callback) {
                    Proto.loader(function(require){
                        require(['api'], function(API){
                            callback(API);
                        });
                    });
                }
            };

        };

    })(

        (function(){
            //include:${modulr}
            return Modulr;
        })(),

        (function(){
            //include:${documentReady}
            return DocumentReady;
        })()

    )

));
