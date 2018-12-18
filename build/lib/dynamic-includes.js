/*eslint-env es6, node */
'use strict';

const config = require(`${process.env.BASE_DIR}/config`);
const Helper = require(`${process.env.BUILD_DIR}/helper`);
const _ = require('lodash');

const MATCH_REGEX = /\/\/include\:\$\{([a-zA-Z_]+)\}/g;
const PATT_REGEX = /\$\{([a-zA-Z_]+)\}/;

class DynamicIncludes {

    constructor() {

    }

    replace(content, replacements) {

        let matches = _.uniq(content.match(MATCH_REGEX));

        matches.forEach((val) => {
            let matchArr = val.match(PATT_REGEX);
            if (matchArr && matchArr[1]) {
                let id = matchArr[1];
                if (replacements[id]) {
                    content = replaceMatch(id, val);
                }
            }

        });

        function replaceMatch(id, patt) {
            var regex = new RegExp(patt, 'gi');
            let rep = (typeof replacements[id] === 'function') ? (replacements[id]()) : replacements[id];
            content = content.replace(patt, rep || `//WARNING:no_return_value:${id}`);
            return content;
        }

        return content;
    }

}

module.exports = new DynamicIncludes;
