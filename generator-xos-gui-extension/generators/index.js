
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

var extensionName, extensionFolder, extensionRoot;

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
        extensionName = answers.name;
        done();
      });
    },

    choosepath() {
      var done = this.async();
      this.prompt({
        type: 'list',
        name: 'pathChoice',
        message: 'Choose a filepath root to store your GUI Extension',
        choices: [
          {
            name: 'Default Folder (cord/orchestration/xos-gui/generator-xos-gui-extension/GUIExtensions/)',
            value: this.config.get('defaultFolder')
          },
          {
            name: 'XOS Services (cord/orchestration/xos_services/)',
            value: this.config.get('xos_services')
          },
        ]
      }).then((answers) => {
        extensionRoot = answers.pathChoice;
        done();
      });
    },

    path() {
      if (extensionRoot != 'GUIExtensions/'){
        var done = this.async();
        this.prompt({
          type: 'input',
          name: 'path',
          message: `(Optional) Enter a path to store your GUI Extension at ${extensionRoot}`,
          default: '',
        }).then((answers) => {
          extensionFolder = extensionRoot + answers.path;
          done();
        });
      }
      else{
        extensionFolder = extensionRoot;
      }
    }
  },

  writing: {
    noTmplRoot() {
      this.log('Creating non-templated files in the extension root...');
      this.fs.copy(this.templatePath('.dockerignore'), this.destinationPath(`${extensionFolder}/${extensionName}/.dockerignore`));
      this.fs.copy(this.templatePath('.gitignore'), this.destinationPath(`${extensionFolder}/${extensionName}/.gitignore`));
      this.fs.copy(this.templatePath('Dockerfile'), this.destinationPath(`${extensionFolder}/${extensionName}/Dockerfile`));
      this.fs.copy(this.templatePath('gulpfile.js'), this.destinationPath(`${extensionFolder}/${extensionName}/gulpfile.js`));
      this.fs.copy(this.templatePath('package.json'), this.destinationPath(`${extensionFolder}/${extensionName}/package.json`));
      this.fs.copy(this.templatePath('tsconfig.json'), this.destinationPath(`${extensionFolder}/${extensionName}/tsconfig.json`));
      this.fs.copy(this.templatePath('tslint.json'), this.destinationPath(`${extensionFolder}/${extensionName}/tslint.json`));
      this.fs.copy(this.templatePath('typings.json'), this.destinationPath(`${extensionFolder}/${extensionName}/typings.json`));
    },

    tmplRoot() {
      this.log('Creating templated files in the extension root...');
      this.fs.copyTpl(
        this.templatePath('README.md'),
        this.destinationPath(`${extensionFolder}/${extensionName}/README.md`),
        {
          name: extensionName
        });
      this.fs.copyTpl(
        this.templatePath('xos-sample-gui-extension.yaml'),
        this.destinationPath(`${extensionFolder}/${extensionName}/${extensionName}.yml`),
        {
          name: extensionName
        });
    },

    conf() {
      this.log('Creating conf...');
      this.fs.copy(this.templatePath('conf'), this.destinationPath(`${extensionFolder}/${extensionName}/conf`));
    },

    gulp() {
      this.log('Creating gulp_tasks...');
      this.fs.copy(this.templatePath('gulp_tasks'), this.destinationPath(`${extensionFolder}/${extensionName}/gulp_tasks`));
    },

    src() {
      this.log('Creating src...');
      this.fs.copyTpl(
        this.templatePath('src'),
        this.destinationPath(`${extensionFolder}/${extensionName}/src`),
        {
          name: extensionName
        });
    }
  }

});
