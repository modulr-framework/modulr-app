/*eslint-env es6, node */
'use strict';

const config = require(`${process.env.BASE_DIR}/config`);
const Helper = require(`${process.env.BUILD_DIR}/helper`);
const grunt = require("grunt");
const _ = require("lodash");

const Task = () => {

    let options = {
        separator: '\n',
        stripBanners: true
    };

    let src = `${config.dest.dir}`;

    let task = {

        scripts: {
            options: options,
            nonull: true,
            files: (() => {
                let obj = {};
                obj[`${config.dest.tmp}/modules.js`] = [
                    `${src}/app/**/*`,
                    `!${src}/app/lib/**/*`,
                    `!${src}/app/**/*.orig.js`
                ];

                obj[`${config.dest.tmp}/modules.orig.js`] = [
                    `${src}/app/**/*.orig.js`,
                    `!${src}/app/lib/**/*`
                ];

                return obj;
            })()
        }

    };

    return task;

};

module.exports = Task;
