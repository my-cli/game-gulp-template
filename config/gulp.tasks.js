/*
 * @Author: zhenghao01
 * @Date:   2020-06-03 16:49:17
 * @Last Modified by:   zhenghao01
 * @Last Modified time: 2021-11-10 17:03:35
 */
const { src, dest, series, watch } = require('gulp');
const { mediaDir } = require('../package.json');
const chalk = require("chalk");
const os = require('os'),
    path = require('path'),
    fs = require('fs'),
    format = require('date-format'),
    hostname = os.hostname(),
    version = format('yyyy-MM-dd-hh-mm-ss-SSS', new Date()),
    Config = require('./gulp.config.js'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    ejs = require('gulp-ejs'),
    minimage = require('gulp-tinypng-unlimited'),
    cleanDir = require('gulp-clean'),
    sass = require('gulp-sass'),
    cleanCSS = require("gulp-clean-css"),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require("gulp-autoprefixer"),
    babel = require('gulp-babel'),
    downloader = require('gulp-downloader'),
    buildDir = Config.build.split("/")[1],
    uglify = require('gulp-uglify');
function html(cb) {
    return src(`${Config.src}*.html`)
        .pipe(ejs({ hostname, version }))
        .pipe(rename({ extname: ".html" }))
        .pipe(dest(`${Config.build}`));
    cb();
}

function image(cb) {
    return src(`${Config.src}images/*`)
        .pipe(dest(`${Config.build}images/`));
    cb();
}

function imagemin(cb) {
    return src(`${Config.src}images/*`)
        .pipe(minimage())
        .pipe(dest(`${Config.build}images/`));
    cb();
}

function clean(cb) {
    return src([`${Config.build}images/`, `${Config.build}*.html`])
        .pipe(cleanDir({ force: true }));
    cb();
}

function css(cb) {
    return src(`${Config.src}style/*.scss`)
        .pipe(replace(/\w+(.jpg|.png|.jpeg)/g,function(match){
            return `${match}?v=${new Date().getTime()}`;
        }))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(dest(`${Config.build}style/`));
    cb();
}

function js(cb) {
    return src(`${Config.src}js/*.js`)
        .pipe(babel({
            presets: ["@babel/env"]
        }))
        .pipe(uglify())
        .pipe(dest(`${Config.build}js/`));
}

function publish(cb) {
    let files = fs.readdirSync(path.resolve(process.cwd(), Config.assets)),
        content = "";
    content = JSON.stringify(files.map((file) => `${mediaDir}${file}`));
    fs.writeFileSync(path.resolve(process.cwd(), Config.src + "assets.json"), content, "utf-8");
    return src(`${Config.build}*.html`)
        .pipe(replace('href="style/', function (match) {
            return `href="${buildDir}/style/`;
        }))
        .pipe(replace('src="js/', function (match) {
            return `src="${buildDir}/js/`;
        }))
        .pipe(replace("href='style/", function (match) {
            return `href="${buildDir}/style/`;
        }))
        .pipe(replace("src='js/", function (match) {
            return `src="${buildDir}/js/`;
        }))
        .pipe(dest(`${process.cwd()}`));
    cb();
}
function convert(cb) {
    return src(`${Config.build}style/*.css`)
        .pipe(replace('../images/', function (match) {
            return `${mediaDir}`;
        }))
        .pipe(dest(`${Config.build}style/`));
    cb();
}
function download(cb) {
    const isExist = fs.existsSync(path.resolve(process.cwd(), Config.src + "assets.json"));
    if (fs.existsSync(path.resolve(process.cwd(), Config.assets))) {
        console.log(chalk.yellow.bgRed.bold("====本地资源已经存在===="));
        cb();
        return false;
    }
    if (!isExist) {
        console.log(chalk.yellow.bgRed.bold("====本地资源映射没有上传！===="));
        cb();
        return false;
    }
    const content = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), Config.src + "assets.json"), "utf-8"));
    return downloader(content, { verbose: true })
        .pipe(dest(`${Config.assets}`));
    cb();
}
module.exports = { html, image, imagemin, clean, css, js, publish, convert, download }