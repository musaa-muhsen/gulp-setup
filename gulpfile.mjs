import gulp from 'gulp';
import * as dartSass from 'sass';  // Use recommended import syntax
import gulpSass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import babel from 'gulp-babel';
import browserSyncPackage from 'browser-sync';
import rename from 'gulp-rename';

const sass = gulpSass(dartSass);
const browserSync = browserSyncPackage.create();

// SCSS to CSS, then Minify
gulp.task('styles', async function() {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))  // Rename to main.min.css
        .pipe(gulp.dest('dist/css'))  // Save in dist/css
        .pipe(browserSync.stream());
});

// Convert JS for backwards compatibility
gulp.task('scripts', async function() {
    return gulp.src('src/js/**/*.js')  // Adjust this path to your JS files
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulp.dest('dist/js'))  // Transpiled JS will go here
        .pipe(browserSync.stream());
});

// Serve and watch for changes
gulp.task('serve', async function() {
    browserSync.init({
        server: './',  // Set the root of your project
        notify: false 
    });

    gulp.watch('src/scss/**/*.scss', gulp.series('styles'));
    gulp.watch('src/js/**/*.js', gulp.series('scripts'));
    gulp.watch('*.html').on('change', browserSync.reload);
});

// Default task
gulp.task('default', gulp.series('styles', 'scripts', 'serve'));
