const gulp = require('gulp');
const inlinesource = require('gulp-inline-source');
const inlineCss = require('gulp-inline-css');
const connect = require('gulp-connect');
const imagemin = require('gulp-imagemin');
const pngcrush = require('imagemin-pngcrush');
const del = require('del');
const preprocess = require('gulp-preprocess');
const Datauri = require('datauri');

const paths = {
  styles: 'styles/*.css',
  images: 'images/*',
  dist: 'build/',
  preview: 'preview/',
  tmp: 'tmp/',
  templates: 'src/templates/**.html',
  filesToMove: 'src/css/**.css',
};

// data uri part
function toBase64(path, env) {
  return env === 'production' ? new Datauri(__dirname + path).content : path;
}

// clean
gulp.task('clean', del.bind(null, [ paths.dist, paths.preview ]));

// dev server
gulp.task('connect', function previewServer() {
  connect.server({
    livereload: true,
    root: 'preview',
  });

  return gulp.watch([ paths.filesToMove, paths.templates ], [ 'default' ]);
});

// move css
gulp.task('css', [ 'clean' ], function moveStyles() {
  return gulp.src(paths.filesToMove)
    .pipe(gulp.dest(paths.dist + 'css'))
    .pipe(gulp.dest(paths.preview + 'css'));
});

// minify images
gulp.task('imagemin', [ 'clean' ], function minifyImages() {
  return gulp.src(paths.images)
    .pipe(imagemin({
      use: [ pngcrush() ],
    }))
    .pipe(gulp.dest(paths.preview + 'images'));
});

// preview templates
gulp.task('templates', [ 'clean' ], function buildTemplates() {
  return gulp.src(paths.templates)
    .pipe(preprocess({ context: { NODE_ENV: 'development', toBase64 }, extension: '.html' }))
    .pipe(inlinesource({ swallowErrors: false }))
    .pipe(gulp.dest(paths.preview + 'templates'))
    .pipe(connect.reload());
});

// production templates
gulp.task('templatesProduction', [ 'clean', 'css' ], function buildProdTemplates() {
  return gulp.src(paths.templates)
    .pipe(preprocess({ context: { NODE_ENV: 'production', toBase64 }, extension: '.html' }))
    .pipe(inlinesource({
      swallowErrors: false,
      rootpath: __dirname + '/src',
    }))
    .pipe(inlineCss({
      removeLinkTags: false,
      preserveMediaQueries: true,
    }))
    .pipe(gulp.dest(paths.dist + 'templates'));
});

// reload connect
gulp.task('reload', function reloadConnect() {
  return gulp.src(paths.templates)
    .pipe(connect.reload());
});

gulp.task('production', [ 'templatesProduction', 'css', 'imagemin' ]);
gulp.task('default', [ 'templates', 'templatesProduction', 'imagemin', 'css'] );
gulp.task('watch', [ 'default', 'connect' ]);
