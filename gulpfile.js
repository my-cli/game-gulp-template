/*
 * @Author: zhenghao01
 * @Date:   2020-06-03 14:14:56
 * @Last Modified by:   zhenghao01
 * @Last Modified time: 2021-11-10 10:32:40
 */
const chalk = require("chalk");
const Config = require('./config/gulp.config.js');
const { series, parallel, watch } = require('gulp');
const { html, image, imagemin, clean, css, js, publish, convert, download } = require('./config/gulp.tasks.js');
const browserSync = require('browser-sync').create();
exports.dev = series(image, css, js, html, function (cb) {
    browserSync.init({
        server: {
            baseDir: Config.build
        },
        notify: false
    });
    const watcher1 = watch(`${Config.src}/`, html),
        watcher2 = watch(`${Config.src}/`, css),
        watcher3 = watch(`${Config.src}/`, js),
        watcher4 = watch(`${Config.src}/`, image);
    [watcher1, watcher2, watcher3, watcher4].map((watcher) => {
        watcher.on("change", () => {
            browserSync.reload();
        })
    })
    cb();
});
exports.prod = series(parallel(imagemin), css, js, html, function (cb) {
    cb();
    console.log(chalk.yellow.bgRed.bold(">>>>打包完成<<<<"));
});
exports.publish = series(convert, publish, clean, function (cb) {
    cb();
    console.log(chalk.yellow.bgGreen("----本地图片资源删除----"));
    console.log(chalk.yellow.bgGreen("----媒体服务器替换完成----"));
    console.log(chalk.yellow.bgRed.bold(">>>>发布完成<<<<"));
});
exports.assets = series(download);