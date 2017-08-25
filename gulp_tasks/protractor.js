/*
 * Copyright 2017-present Open Networking Foundation

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const gulp = require('gulp');
const gulpProtractorAngular = require('gulp-angular-protractor');

const args = process.env.PT_ARGS ? process.env.PT_ARGS.split(' ') : [];
const conf = process.env.PT_CONF || './conf/protractor.conf.jenkins.js'


gulp.task('protractor', callback => {

  gulp
    .src(['./e2e/**/*.js'])
    .pipe(gulpProtractorAngular({
      configFile: conf,
      debug: false,
      autoStartStopServer: true,
      verbose: false,
      args: args
    }))
    .on('error', e => {
      console.log(e);
    })
    .on('end', callback);
});
