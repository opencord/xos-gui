const path = require('path');

const gulp = require('gulp');
const del = require('del');
const filter = require('gulp-filter');
const rename = require("gulp-rename");

const conf = require('../conf/gulp.conf');
const cfgFolder = path.join(conf.paths.src, 'app/config');

gulp.task('clean', clean);
gulp.task('other', other);
gulp.task('brand', styleConfig);
gulp.task('appConfig', appConfig);
gulp.task('config', gulp.series('brand', 'appConfig'));

function clean() {
  return del([conf.paths.dist, conf.paths.tmp]);
}

function appConfig() {
  const env = process.env.NODE_ENV || 'production';
  return gulp.src([
    path.join(conf.paths.appConfig, `app.config.${env}.ts`)
  ])
  .pipe(rename('app.config.ts'))
  .pipe(gulp.dest(cfgFolder));
}

function styleConfig() {
  const env = process.env.BRAND || 'cord';
  return gulp.src([
    path.join(conf.paths.appConfig, `style.config.${env}.ts`)
  ])
  .pipe(rename('style.config.ts'))
  .pipe(gulp.dest(cfgFolder));
}

function other() {
  const fileFilter = filter(file => file.stat.isFile());

  return gulp.src([
    path.join(conf.paths.src, '/**/*'),
    path.join(`!${conf.paths.src}`, '/**/*.{scss,ts,html}')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(conf.paths.dist));
}
