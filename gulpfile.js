/**
 * Created by yeshuijuan on 6/24/16.
 */

//引入 gulp 和 nodemon livereload 插件

var gulp       = require('gulp');
var nodemon    = require('gulp-nodemon'),
    livereload = require('gulp-livereload'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del'),
    jshint = require('gulp-jshint');

// 压缩文件
//压缩css
gulp.task('minifycss', function () {
    return gulp.src('app/www/css/*.css')      //压缩的文件
        .pipe(concat('main.css'))
        .pipe(gulp.dest('app/www/minified/css'))   //输出文件夹
        .pipe(minifycss());   //执行压缩
});

//压缩js
gulp.task('minifyjs', function () {
    return gulp.src('app/www/js/**/*.js')
        .pipe(concat('main.js'))    //合并所有js到main.js
        .pipe(gulp.dest('app/www/minified/js'))    //输出main.js到文件夹
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('minified/js'));  //输出
});

//执行压缩前，先删除文件夹里的内容
gulp.task('clean', function (cb) {
    del(['app/www/minified/css', 'app/www/minified/js'], cb);
});



var paths = {
    client: [
        'app/www/js/**/*.js',
        'app/www/templates/**/*.html',
        'app/www/css/*.css'
    ],
    server: {
        index: 'srv/app.js'
    }
};

// nodemon配置
var nodemonConfig = {
    script : paths.server.index,
    ext: 'js json',
    //files that under 'app' folder will be ignored (not cause server restart)
    ignore : [
        "app/**"
    ],
    env    : {
        "NODE_ENV": "development"
    }
};

// 启动/重启 node服务
gulp.task('serve', ['livereload'], function () {
    'use strict'
    return nodemon(nodemonConfig);
});


gulp.task('lint', function () {
    return gulp.src('app/www/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// 刷新浏览器
gulp.task('livereload',  function () {

    livereload.listen();
    //var serverr = livereload();
    return gulp.watch(paths.client, function (event) {
        livereload.changed(event.path);
    });
});


// develop 任务， 同时开启 serve、livereload 任务
gulp.task('develop', ['livereload', 'lint', 'serve']);