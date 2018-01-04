//Global
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');

//Data
var rename = require('gulp-rename');

//Server
var connect = require('gulp-connect');
var serve = require('gulp-serve');
//Flatten folder
var flatten = require('gulp-flatten');

//javascript
var uglify = require('gulp-uglify');


gulp.task('server', serve('dist'));

gulp.task('copy-assets', function() {
    gulp.src('./assets/**/*.{png,jpg,gif,svg,mp3,mp4,obj,gltf}')
    // Perform minification tasks, etc here
    .pipe(flatten())
    .pipe(gulp.dest('./dist/assets'));
});

gulp.task('copy-html', function() {
    gulp.src('./*.html')
    // Perform minification tasks, etc here
    .pipe(flatten())
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy-templates', function() {
    gulp.src('./templates/**/*.html')
    // Perform minification tasks, etc here
    .pipe(flatten())
    .pipe(gulp.dest('./dist/templates'));
});

gulp.task('js', function(){
 var b = browserify({
    entries: './js/app.js',
    debug: true
  });
  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));
});


gulp.task('watch', function(){
  gulp.watch('./js/**/*.js', ['js']);
});

gulp.task('build', ['copy-assets', 'copy-html','copy-templates','js']);
gulp.task('default', ['server','copy-assets', 'copy-html','copy-templates','js', 'watch']);
