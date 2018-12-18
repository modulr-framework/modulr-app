/*eslint-env es6, node */
'use strict';

const Helper = require(`${process.env.BUILD_DIR}/helper`);
const DateTime = require('datetime-js');
const _ = require('lodash');

module.exports = (() => {

    const config = {};
    const baseDir = process.env.BASE_DIR;

    const serverConf = (() => {
        let conf = ((val) => {
            return JSON.parse(val);
        })(Helper.readFile(`${baseDir}/config/default.json`));

        // override with custom configs if present
        ((local) => {
            if (Helper.isPathExists(local)) {
                let str = Helper.readFile(local);
                try {
                    let val = JSON.parse(str);
                    _.merge(conf, val);
                } catch(err) {
                    // do nothing
                }
            }
        })(`${baseDir}/config/env/local.json`);

        return conf;
    })();

    config.ApplicationName = serverConf.appName || 'MyModulrApp';

    config.env = (() => {
        let res = 'prod';
        let opt = Helper.getOpt('env');
        if (opt) {
            if (['dev', 'stage', 'prod'].indexOf(opt) > -1)
            res = opt;
        }
        return res;
    })();

    // the git tag the build was on
    config.tagVersion = Helper.getOpt('tagver') || '';

    // timestamp
    config.timestamp = DateTime(new Date(), '%m-%d-%Y %h:%i %AMPM');
    // for cache busting query string
    config.qs = DateTime(new Date(), '%Y%m%d%H%i');
    // banner
    config.banner = `/** udpated: ${config.timestamp} **/`;

    config.pathPrefix = ((path) => {
        return (path === '') ? '' : (/^\//.test(path)) ? path : `/${path}`;
    })(serverConf.pathPrefix || '');

    config.domain = ((env) => {
        let res = serverConf.domain;
        if (res === 'localhost') {
            res = `${res}:${serverConf.port}`;
        }
        return res;
    })(config.env);

    config.webAppPath = `//${config.domain}${config.pathPrefix}`;

    config.dir = {
        base: baseDir,
        web: `${baseDir}/web`,
        src: `${baseDir}/src`,
        builder: process.env.BUILD_DIR
    };

    config.dest = {
        dir: `${baseDir}/build/dest/www`,
        tmp: `${baseDir}/build/dest/_temp`
    };

    config.src = {
        dir: `${config.dir.src}/scripts`
    };

    return config;

})();
