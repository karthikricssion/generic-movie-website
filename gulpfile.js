var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var prefix = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');

gulp.task('sass', function (){
    gulp.src(['./app/scss/*.scss'])
        .pipe(sass.sync().on('error', sass.logError))
        
        .pipe(concat('style.min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('./app/css'))
});

gulp.task('default', ['sass'], function(){
    gulp.watch("./app/scss/**/*.scss", ['sass']);
});