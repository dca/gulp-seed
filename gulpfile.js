var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    stylish = require('jshint-stylish'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr();

gulp.task('styles', function() {
    return gulp.src('src/styles/main.scss')
        .pipe(sass({ style: 'expanded' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(livereload(server))
        .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function() {
    return gulp.src('src/scripts/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter(stylish))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify({outSourceMap: true}))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(livereload(server))
        .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/assets/img'))
        .pipe(livereload(server))
        // .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('clean', function() {
    return gulp.src(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], {read: false})
        .pipe(clean());
});

gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});

gulp.task('watch', function() {
    server.listen(35729, function (err) {
       if (err) {
            return console.log(err)
       };

       // Watch tasks go inside inside server.listen()

       // Watch .scss files
       gulp.watch('src/styles/**/*.scss', ['styles']);

       // Watch .js files
       gulp.watch('src/scripts/**/*.js', ['scripts']);

       // Watch image files
       gulp.watch('src/images/**/*', ['images']);
    });


});
