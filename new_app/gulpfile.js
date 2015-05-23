var gulp = require('gulp');
var browserify = require('browserify');
var concat = require('gulp-concat');
var reactify = require('reactify');

gulp.task('browserify', function(){
    var b = browserify();
    b.transform(reactify); // use the reactify transform
    b.add('./src/js/main.js');
    return b.bundle()
        .pipe(gulp.src('main.js'))
        .pipe(gulp.dest('./dist/js'));
});


gulp.task('copy', function() {
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['browserify', 'copy']);

gulp.task('watch', ['browserify', 'copy'], function() {
    gulp.watch('src/**/*.*', ['default']);
});

/*
 gulp.task('browserify', function() {
 gulp.src('src/js/*.js')
 .pipe(browserify({transform: 'reactify'}))
 .pipe(concat('main.js'))
 .pipe(gulp.dest('dist/js'));
 });
 */