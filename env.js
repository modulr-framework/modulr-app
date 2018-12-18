/*eslint-env es6, node */
'use strict';

// timezone
process.env.TZ = 'America/New_York';

const dir = __dirname;

const envs = {
    BASE_DIR: dir,
    SRC_DIR: `${dir}/src`,
    BUILD_DIR: `${dir}/build`
};

// environment vars
for (let id in envs) {
    process.env[id] = envs[id];
}

module.exports = envs;
