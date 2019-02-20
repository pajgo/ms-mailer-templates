const {
  dest, src, series, parallel, watch,
} = require('gulp');
const inlinesource = require('gulp-inline-source');
const inlineCss = require('gulp-inline-css');
const connect = require('gulp-connect');
const imagemin = require('gulp-imagemin');
const pngcrush = require('imagemin-pngcrush');
const del = require('del');
const preprocess = require('gulp-preprocess');
const htmlmin = require('gulp-htmlmin');
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
  return env === 'production' ? new Datauri(`${__dirname}/path`).content : path;
}

// clean
exports.clean = del.bind(null, [paths.dist, paths.preview]);

// dev server
exports.connect = function previewServer() {
  connect.server({
    livereload: true,
    root: 'preview',
  });

  return watch([paths.filesToMove, paths.templates], exports.defaultTask);
};

// move css
exports.css = series(exports.clean, function moveStyles() {
  return src(paths.filesToMove)
    .pipe(dest(`${paths.dist}css`))
    .pipe(dest(`${paths.preview}css`));
});

// minify images
exports.imagemin = series(exports.clean, function minifyImages() {
  return src(paths.images)
    .pipe(imagemin({
      use: [pngcrush()],
    }))
    .pipe(dest(`${paths.preview}images`));
});

// preview templates
exports.templates = series(exports.clean, function buildTemplates() {
  return src(paths.templates)
    .pipe(preprocess({ context: { NODE_ENV: 'development', toBase64 }, extension: '.html' }))
    .pipe(inlinesource({ swallowErrors: false }))
    .pipe(dest(`${paths.preview}templates`))
    .pipe(connect.reload());
});

// production templates
exports.templatesProduction = series(
  parallel(exports.clean, exports.css),
  function buildProdTemplates() {
    return src(paths.templates)
      .pipe(preprocess({ context: { NODE_ENV: 'production', toBase64 }, extension: '.html' }))
      .pipe(inlinesource({
        swallowErrors: false,
        rootpath: `${__dirname}/src`,
      }))
      .pipe(inlineCss({
        removeLinkTags: false,
        preserveMediaQueries: true,
      }))
      .pipe(htmlmin({ removeComments: true, collapseWhitespace: true, minifyCSS: true }))
      .pipe(dest(`${paths.dist}templates`));
  },
);

// reload connect
exports.reload = function reloadConnect() {
  return src(paths.templates)
    .pipe(connect.reload());
};

exports.production = parallel(exports.templatesProduction, exports.css, exports.imagemin);
exports.defaultTask = parallel(exports.templates, exports.templatesProduction, exports.imagemin, exports.css);
exports.watch = parallel(exports.defaultTask, exports.connect);
