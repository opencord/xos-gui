const path = require('path');

const gulp = require('gulp');
const karma = require('karma');

gulp.task('karma:single-run', karmaSingleRun);
gulp.task('karma:auto-run', karmaAutoRun);

function karmaFinishHandler(done) {
  return failCount => {
    done(failCount ? new Error(`Failed ${failCount} tests.`) : null);
  };
}

function karmaSingleRun(done) {
  process.env.NODE_ENV = 'test';
  const configFile = path.join(process.cwd(), 'conf', 'karma.conf.js');
  const karmaServer = new karma.Server({configFile}, karmaFinishHandler(done));
  karmaServer.start();
}

function karmaAutoRun(done) {
  process.env.NODE_ENV = 'test';
  const configFile = path.join(process.cwd(), 'conf', 'karma-auto.conf.js');
  const karmaServer = new karma.Server({configFile}, karmaFinishHandler(done));
  karmaServer.start();
}

const remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
gulp.task('remap-istanbul', function() {
  return gulp.src('coverage/coverage-final.json')
    .pipe(remapIstanbul({
      reports: {
        'json': 'coverage/coverage-final.json',
        'html': 'coverage/html',
        'cobertura': 'coverage/coverage.xml'
      }
    }));
});