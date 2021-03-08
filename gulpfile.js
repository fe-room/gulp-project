// gulp core function
const { src, dest, watch, series, parallel } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const del = require('delete');
const gulpif = require('gulp-if');
const production = process.env.NODE_ENV === 'production' ? true : false;

/**
 * src :从文件系统中读取文件生成node流(stream)
 * dest: 接受一个输出目录作为参数 产生一个node流
 * pipe: 用于在src和dest之间，用来转换流
 * @returns {*}
 */
// Clear the dist directory
function clean() {
  return del(['dist']);
}

// 如果工程比较复杂可以先预定义路径
// const paths = {
//
//
// }

function reloadJs() {
  return src('src/*.js')
    .pipe(babel({
      presets: [['@babel/preset-env', {
        useBuiltIns: 'usage',
        corejs: 3,
        targets: {
          chrome: 58,
          ie: 11
        }
      }]]
    }))
    .pipe(dest('dist/'))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(dest('dist/js'));
}

function reloadPluginsJs() {
  return  src('vendor/*.js')
    .pipe(dest('dist/vendor'));
}

function reloadCss() {
  return src('src/css/*.css')
    .pipe(gulpif(production, cleanCSS()))
    .pipe(dest('dist/css/'));
}

function copyStaticHtml(){
  return src('src/*.html')
    .pipe(dest('dist'));
}

function watcher() {
  watch('src/*.js', { delay: 500 }, reloadJs)
  watch('src/css/*.css', {delay: 500}, reloadCss)
  watch('vendor/*.js',{delay: 500}, reloadPluginsJs)
  watch('src/*.html',{ delay: 500 }, copyStaticHtml);
}

const dev = series(clean,parallel(reloadJs,reloadPluginsJs,reloadCss, copyStaticHtml), watcher)

const build = series(clean,parallel(reloadJs,reloadPluginsJs,reloadCss, copyStaticHtml))

exports.default =  dev
exports.build = build
