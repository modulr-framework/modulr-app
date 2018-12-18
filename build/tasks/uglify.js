/*eslint-env es6, node */
'use strict';

const config = require(`${process.env.BASE_DIR}/config`);
const Helper = require(`${process.env.BUILD_DIR}/helper`);
const grunt = require("grunt");
const _ = require("lodash");

const Task = () => {

    let options = {
        mangle: false,
        report: "min",
        preserveComments: false,
        banner: `\n${config.banner}`
    };

    let src = `${config.dest.www}/`;

    let task = {

        core: {
            options: options,
            files: {}
        },

        scripts: {
            options: options,
            files: {}
        }

    };

    return task;

};

module.exports = Task;
