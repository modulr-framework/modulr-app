/*eslint-env es6, node */
'use strict';

const config = require(`${process.env.BASE_DIR}/config`);
const Helper = require(`${process.env.BUILD_DIR}/helper`);
const grunt = require("grunt");

const Task = () => {

    let task = {
        'dest': `${config.dest.dir}/**`,
        'tmp': `${config.dest.tmp}/**`
    };

    return task;

};

module.exports = Task;
