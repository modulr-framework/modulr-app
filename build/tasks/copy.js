/*eslint-env es6, node */
'use strict';

const config = require(`${process.env.BASE_DIR}/config`);
const Helper = require(`${process.env.BUILD_DIR}/helper`);
const grunt = require("grunt");
const _ = require("lodash");

const DynamicVars = require(`${config.dir.builder}/lib/dynamic-vars`);
const DynamicIncludes = require(`${config.dir.builder}/lib/dynamic-includes`);

const Task = () => {

    var SEGMENT_KEYS = JSON.stringify(config.segmentKeys);

    let task = {

        loader: {
            src: `${config.src.dir}/loader.js`,
            dest: `${config.dest.dir}/loader.orig.js`,
            options: {
                process: (content, scrpath) => {

                    content = DynamicIncludes.replace(content, {
                        coreFile: `${config.webAppPath}/core.js?v=${config.qs}`
                    });

                    content = DynamicVars.replaceVarsFromStr(content);
                    content = [content, config.banner].join('');

                    // add to uglify
                    grunt.config.merge({
                        uglify: {
                            scripts: {
                                files: (() => {
                                    let obj = {};
                                    obj[`${config.dest.dir}/loader.js`] = [`${config.dest.dir}/loader.orig.js`];
                                    return obj;
                                })()
                            }
                        }
                    });

                    return content;
                }
            }
        },

        scripts: {
            options: {
                process: (content, srcpath) => {
                    content = [content, config.banner].join('');
                    content = DynamicVars.replaceVarsFromStr(content);
                    return content;
                }
            },
            expand: true,
            cwd: config.src.dir,
            src: (() => {
                let arr = [
                    'app/**/*.js',
                    'lib/**/*.js'
                ];
                return arr;
            })(),
            dest: config.dest.dir,
            filter: "isFile",
            rename: (dest, src) => {
                let newSrc = null;
                newSrc = src.replace(/\.js$/, '.orig.js');
                // add to uglify
                grunt.config.merge({
                    uglify: {
                        scripts: {
                            files: (() => {
                                let obj = {};
                                let minFile = [dest, src].join('/');
                                let origFile = [dest, newSrc].join('/');
                                obj[minFile] = [origFile];
                                return obj;
                            })()
                        }
                    }
                });
                let path = [dest, newSrc || src].join('/');
                return path;
            }
        },

        core: {
            src: `${config.src.dir}/core.js`,
            dest: `${config.dest.dir}/core.orig.js`,
            options: {
                process: (content, scrpath) => {

                    content = DynamicIncludes.replace(content, {
                        // use functions when includes don't need to run every time
                        // like this read file!
                        modules: () => { return Helper.readFile(`${config.dest.tmp}/modules.orig.js`); },
                        modulr:  () => { return Helper.readFile(`${config.dest.dir}/lib/modulr.js`); },
                        documentReady:  () => { return Helper.readFile(`${config.dest.dir}/lib/documentReady.js`); }
                    });

                    content = DynamicVars.replaceVarsFromStr(content);

                    // add to uglify
                    grunt.config.merge({
                        uglify: {
                            core: {
                                files: (() => {
                                    let obj = {};
                                    obj[`${config.dest.dir}/core.js`] = [`${config.dest.dir}/core.orig.js`];
                                    return obj;
                                })()
                            }
                        }
                    });

                    return content;
                }
            }
        },

        demoIndex: {
            src: `${config.dir.web}/index.template`,
            dest: `${config.dir.web}/index.html`,
            options: {
                process: (content, scrpath) => {
                    content = DynamicVars.replaceVarsFromStr(content);
                    return content;
                }
            }
        }

    };

    return task;

};

module.exports = Task;
