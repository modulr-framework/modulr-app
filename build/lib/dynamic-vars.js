/*eslint-env es6, node */
'use strict';

const config = require(`${process.env.BASE_DIR}/config`);
const Helper = require(`${process.env.BUILD_DIR}/helper`);
const _ = require('lodash');

/**
 * variable map object
 */
const VAR_MAP = (() => {
    let res = {};

    res.buildEnv = config.env;
    res.deployVersion = config.qs;
    res.tagVersion = config.tagVersion;
    res.hostDomain = `${config.domain}`;
    res.hostPath = `${config.pathPrefix}`;
    res.AppName = `${config.ApplicationName}`;

    return res;
})();


// format: <%= @[id] %>
// NOTE that this needs the @ symbol to separate it from erb templating via lodash
const MATCH_REGEX = /<%\=(|\s+)\@([a-zA-Z_]+)(|\s+)%\>/g;
const PATT_REGEX = /\@([a-zA-Z_]+)/;

class DynamicVars {

    constructor() {

    }

    replaceVarsFromFile(file) {
        let res = Helper.readFile(file);
        let processed = this.replaceVarsFromStr(res);
        return processed;
    }

    replaceVarsFromStr(str) {

        if (typeof str === 'string') {

            let matches = _.uniq(str.match(MATCH_REGEX));
            //if (matches.length > 0) { console.log("MATCH", matches); }

            matches.forEach((val) => {

                let matchArr = val.match(PATT_REGEX);

                if (matchArr && matchArr[0] && /^\@([a-zA-Z_]+)/.test(matchArr[0])) {
                    let patt = matchArr[0];
                    let id = matchArr[1];
                    str = replaceMatch(str, val, id);
                }

            });

        }

        return str;

    }

}

function replaceMatch(str, patt, id) {

    if (VAR_MAP[id]) {
        let varVal = VAR_MAP[id].toString();
        while (str.indexOf(patt) > -1) {
            str = str.replace(patt, varVal);
        }
    }

    return str;

}

module.exports = new DynamicVars;
