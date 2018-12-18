/*eslint-env es6, node */
'use strict';

const ENV = require('./env');
const config = require(`${process.env.BASE_DIR}/config`);
const grunt = require('grunt');
const _ = require('lodash');
const requireDir = require('require-dir');
const log = console.log;

const Tasks = requireDir(`${config.dir.builder}/tasks`, { recurse: true });
let gruntConfig = {};

// process tasks
for (let key in Tasks) {
    let obj = {};

    if (/^custom\-/.test(key)) {
        Tasks[key]();
    } else {
        obj[key] = Tasks[key]();
        _.assign(gruntConfig, obj);
    }
}

// load all npm dependencies for grunt
require("matchdep").filter("grunt-*").forEach(grunt.loadNpmTasks);

const tasks = [
    'clean:dest',
    'clean:tmp',

    'copy:loader',
    'copy:scripts',
    'uglify:scripts',
    'concat:scripts',

    'copy:core',
    'uglify:core',
    'copy:demoIndex'
];

grunt.registerTask('default', tasks);
grunt.initConfig(gruntConfig);
