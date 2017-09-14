
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
var Path = require('path');

var extensionName, extensionFolder;

module.exports = Generator.extend({

  prompting: {

    init() {
      this.log('---------------------------');
      this.log('XOS GUI Extension Generator');
      this.log('---------------------------');
    },

    name() {
      var done = this.async();
      this.log(`Your extension will be created in the current working directory, ${this.destinationRoot()}`);
      this.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter the name of your XOS GUI Extension',
        default: 'new-gui-extension',
        filter: (str) => {
          var newstr = str.replace(' ', '-');
          return newstr;
        }
      }).then((answers) => {
        extensionName = answers.name;
        done();
      });
    },
  },

  writing: {

    noTmplRoot() {
      this.log('Creating non-templated files in the extension root...');
      this.fs.copy(this.templatePath('.dockerignore'), this.destinationPath(`${extensionName}/.dockerignore`));
      this.fs.copy(this.templatePath('.gitignore'), this.destinationPath(`${extensionName}/.gitignore`));
      this.fs.copy(this.templatePath('Dockerfile'), this.destinationPath(`${extensionName}/Dockerfile`));
      this.fs.copy(this.templatePath('gulpfile.js'), this.destinationPath(`${extensionName}/gulpfile.js`));
      this.fs.copy(this.templatePath('package.json'), this.destinationPath(`${extensionName}/package.json`));
      this.fs.copy(this.templatePath('tsconfig.json'), this.destinationPath(`${extensionName}/tsconfig.json`));
      this.fs.copy(this.templatePath('tslint.json'), this.destinationPath(`${extensionName}/tslint.json`));
      this.fs.copy(this.templatePath('typings.json'), this.destinationPath(`${extensionName}/typings.json`));
    },

    tmplRoot() {
      this.log('Creating templated files in the extension root...');
      this.fs.copyTpl(
        this.templatePath('README.md'),
        this.destinationPath(`${extensionName}/README.md`),
        {
          name: extensionName
        });
      this.fs.copyTpl(
        this.templatePath('xos-sample-gui-extension.yaml'),
        this.destinationPath(`${extensionName}/${extensionName}.yml`),
        {
          name: extensionName
        });
      this.fs.copyTpl(
        this.templatePath('Dockerfile'),
        this.destinationPath(`${extensionName}/Dockerfile`),
        {
          name: extensionName
        });
    },

    conf() {
      this.log('Creating conf...');
      this.fs.copyTpl(
        this.templatePath('conf'), 
        this.destinationPath(`${extensionName}/conf`),
        {
          name: extensionName
        });
    },

    gulp() {
      this.log('Creating gulp_tasks...');
      this.fs.copy(this.templatePath('gulp_tasks'), this.destinationPath(`${extensionName}/gulp_tasks`));
    },

    src() {
      this.log('Creating src...');
      this.fs.copyTpl(
        this.templatePath('src'),
        this.destinationPath(`${extensionName}/src`),
        {
          name: extensionName
        });
    }
  },

  install (){
    var done = this.async();
    this.prompt({
      type: 'confirm',
      name: 'deps',
      message: 'Install dependencies?',
      default: false
    }).then((answers) => {
      if(answers.deps){
        process.chdir(`${extensionName}/`);
        this.installDependencies({
          npm: true,
          bower: false,
          yarn: false
        });
      }
      done();
    });
  }

});
