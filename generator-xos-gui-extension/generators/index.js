
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

'use strict';

var Generator = require('yeoman-generator');
var user = require('../node_modules/yeoman-generator/lib/actions/user');

var extensionname;

module.exports = Generator.extend({

  prompting: {

    init() {
      this.log('---------------------------------------------------------------')
      this.log('This generator will help you initialize a new XOS GUI Extension');
      this.log('---------------------------------------------------------------')
    },

    name() {
      var done = this.async();
      this.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter the name of your XOS GUI Extension',
        default: 'new-gui-extension'
      }).then((answers) => {
        extensionname = answers.name;
        done();
      });
    },
  },

  writing: {
    noTmplRoot() {
      this.log('Creating non-templated files in the extension root...');
      this.fs.copy(this.templatePath('.dockerignore'), this.destinationPath(`${this.config.get('folder')}/${extensionname}/.dockerignore`));
      this.fs.copy(this.templatePath('.gitignore'), this.destinationPath(`${this.config.get('folder')}/${extensionname}/.gitignore`));
      this.fs.copy(this.templatePath('Dockerfile'), this.destinationPath(`${this.config.get('folder')}/${extensionname}/Dockerfile`));
      this.fs.copy(this.templatePath('gulpfile.js'), this.destinationPath(`${this.config.get('folder')}/${extensionname}/gulpfile.js`));
      this.fs.copy(this.templatePath('package.json'), this.destinationPath(`${this.config.get('folder')}/${extensionname}/package.json`));
      this.fs.copy(this.templatePath('tsconfig.json'), this.destinationPath(`${this.config.get('folder')}/${extensionname}/tsconfig.json`));
      this.fs.copy(this.templatePath('tslint.json'), this.destinationPath(`${this.config.get('folder')}/${extensionname}/tslint.json`));
      this.fs.copy(this.templatePath('typings.json'), this.destinationPath(`${this.config.get('folder')}/${extensionname}/typings.json`));
    },

    tmplRoot() {
      this.log('Creating templated files in the extension root...');
      this.fs.copyTpl(
        this.templatePath('README.md'),
        this.destinationPath(`${this.config.get('folder')}/${extensionname}/README.md`),
        {
          name: extensionname
        });
      this.fs.copyTpl(
        this.templatePath('xos-sample-gui-extension.yaml'),
        this.destinationPath(`${this.config.get('folder')}/${extensionname}/${extensionname}.yml`),
        {
          name: extensionname
        });
    },

    conf() {
      this.log('Creating conf...');
      this.fs.copy(this.templatePath('conf'), this.destinationPath(`${this.config.get('folder')}/${extensionname}/conf`));
    },

    gulp() {
      this.log('Creating gulp_tasks...');
      this.fs.copy(this.templatePath('gulp_tasks'), this.destinationPath(`${this.config.get('folder')}/${extensionname}/gulp_tasks`));
    },

    src() {
      this.log('Creating src...');
      this.fs.copyTpl(
        this.templatePath('src'),
        this.destinationPath(`${this.config.get('folder')}/${extensionname}/src`),
        {
          name: extensionname
        });
    }
  }

});
