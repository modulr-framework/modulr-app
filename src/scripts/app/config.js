Modulr.define('modulr.app:config', [
    'require'
], function(require){

    var config = {};

    config.version = '<%= @tagVersion %>';

    config.deployTimestamp = '<%= @deployVersion %>';

    // environment
    config.env = (function(){
        var res = '<%= @buildEnv %>',
            defaultVal = 'prod';
        if (/\@buildEnv/i.test(res)) {
            res = defaultVal;
        } else {
            res = (['dev', 'stage', 'prod'].indexOf(res) > -1) ? res : defaultVal;
        }
        return res;
    })();

    config.hostPath = '<%= @hostPath %>';

    // keys
    config.SEGMENT_KEY = (function(){

        //include:${secrets_segmentKeys}

    })();

    // eu list allowed providers
    config.EU_List = [
        'segment'
    ];

    // pages with custom js files for metrics
    config.pageMetrics = [
        'search',
        'foxbusiness',
        'foxnews.hp'
    ];

    // custom page events
    config.pageEvents = [
        'breakingNewsAlert'
    ];

    return config;

});
