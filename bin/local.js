/*eslint-env es6, node */
'use strict';

const Listener = require('git-changelog-listener');
const listener = new Listener({
    interval: 500
});
const Helper = require('cli-helper').instance;

listener.onChange((info) => {
    if (info && (info.change || info.type === 'initialize')) {
        const ver = Helper.shellCmd('git describe --always');
        console.log(`running build [dev]:[${ver}]\n`);
        Helper.shellCmd(`grunt --env=dev --tagver=${ver}`, null, true);
    }
});
