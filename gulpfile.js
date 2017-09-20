const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const filter = require('gulp-filter');
const debug = require('gulp-debug');
const rename = require('gulp-rename');
const del = require('del');

var paths = {
  src: 'src/**/*',
  dist: 'dist/',
  manifest: 'src/manifest.json',
  styles: {
    src: 'src/**/*.css',
    dest: 'dist/'
  },
  scripts: {
    src: 'src/**/*.js',
    dest: 'dist/'
  },
  assets: {
    src: require('./assets.json'),
    dest: 'dist/assets/'
  }
};

/* Not all tasks need to use streams, a gulpfile is just another node program
 * and you can use all packages available on npm, but it must return either a
 * Promise, a Stream or take a callback and call it
 */
function clean() {
  // You can use multiple globbing patterns as you would with `gulp.src`,
  // for example if you are using del 2.0 or above, return its promise
  return del(['dist']);
}



function assets() {
  return gulp.src('./assets/**/*').pipe(gulp.dest(paths.assets.dest));
}

function node() {

  const jsFilter = filter('**/*.js', { restore: true });
  const cssFilter = filter('**/*.css', { restore: true });

  return gulp.src(paths.assets.src)
    .pipe(jsFilter)
    .pipe(gulp.dest(paths.assets.dest + "/scripts"))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(gulp.dest(paths.assets.dest + "/styles"))
    .pipe(cssFilter.restore);
}

function manifest() {
  return gulp.src(paths.manifest)
    .pipe(gulp.dest(paths.dist))
}

/*
 * Define our tasks using plain functions
 */
function html() {

  const htmlFilter = filter('**/*.html', { restore: true });

  return gulp.src(paths.src)
    // pass in options to the stream
    .pipe(htmlFilter)
    .pipe(gulp.dest(paths.dist))
    .pipe(htmlFilter.restore);
}

function styles() {
  return gulp.src(paths.styles.src)
    // pass in options to the stream
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
  let gulpObj = gulp.src(paths.scripts.src, { sourcemaps: true })
  if (process.argv[3] === '--prod') {
    gulpObj.pipe(process.argv[3] && uglify())
  }
  gulpObj.pipe(rename({
    suffix: '.min'
  })).pipe(gulp.dest(paths.scripts.dest));
  return gulpObj;
}

function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
}

exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.series(clean, gulp.parallel(assets, node, manifest, html, styles, scripts));

/*
 * You can still use `gulp.task` to expose tasks
 */
gulp.task('build', build);

/*
 * Define default task that can be called by just running `gulp` from cli
 */
gulp.task('default', build);