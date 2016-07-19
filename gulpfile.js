var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');

gulp.task('js', function () {
    gulp.src(['public/ng/app.js', 'public/ng/services/**/*.js', 'public/ng/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/assets'));
});

// Compiles LESS > CSS
gulp.task('css', function () {
    return gulp.src(['public/css/style.less'])
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(gulp.dest('public/assets'));
});

gulp.task('watch:css', function () {
    gulp.watch('public/css/**/*.less', ['css']);
});

gulp.task('watch:js', function () {
    gulp.watch('public/ng/**/*.js', ['js']);
});

gulp.task('dev', ['watch:css', 'watch:js']);
