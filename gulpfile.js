const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();

// SCSS to CSS, then Minify
gulp.task('styles', function() {
    return gulp.src('src/scss/**/*.scss')  // adjust this path to your SCSS files
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'))  // compiled and minified CSS will go here
        .pipe(browserSync.stream());
});

// Convert JS for backwards compatibility
gulp.task('scripts', function() {
    return gulp.src('src/js/**/*.js')  // adjust this path to your JS files
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulp.dest('dist/js'))  // transpiled JS will go here
        .pipe(browserSync.stream());
});

// Serve and watch for changes
gulp.task('serve', function() {
    browserSync.init({
        server: './'  // path to your project's root this is for HTML version
        
    });

    gulp.watch('src/scss/**/*.scss', gulp.series('styles'));
    gulp.watch('src/js/**/*.js', gulp.series('scripts'));
    gulp.watch('*.html').on('change', browserSync.reload);
});

gulp.task('default', gulp.series('styles', 'scripts', 'serve'));
