'use strict';

var Generator = require('yeoman-generator');
var user = require('../node_modules/yeoman-generator/lib/actions/user');

var config = {};
var userName;

module.exports = Generator.extend({

  _firstCharToUpper: function(string){
    return string.replace(/^./, string[0].toUpperCase());
  },

  prompting: {
    name() {
      var done = this.async();
      this.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter the name of your XOS GUI Extension',
        default: this.config.get('name')
      }, function(answers) {
        config.name = answers.name;
        done();
      }.bind(this));
    },
  },

  writing: {
    noTmplRoot() {
      if (!user.git.name()){
        userName = ['', '']
      }
      else {
        userName = user.git.name().split(' ');
      }
      this.fs.copy(this.templatePath('.dockerignore'), this.destinationPath(`${this.config.get('folder')}/${config.name}/.dockerignore`));
      this.fs.copy(this.templatePath('.gitignore'), this.destinationPath(`${this.config.get('folder')}/${config.name}/.gitignore`));
      this.fs.copy(this.templatePath('Dockerfile'), this.destinationPath(`${this.config.get('folder')}/${config.name}/Dockerfile`));
      this.fs.copy(this.templatePath('gulpfile.js'), this.destinationPath(`${this.config.get('folder')}/${config.name}/gulpfile.js`));
      this.fs.copy(this.templatePath('package.json'), this.destinationPath(`${this.config.get('folder')}/${config.name}/package.json`));
      this.fs.copy(this.templatePath('tsconfig.json'), this.destinationPath(`${this.config.get('folder')}/${config.name}/tsconfig.json`));
      this.fs.copy(this.templatePath('tslint.json'), this.destinationPath(`${this.config.get('folder')}/${config.name}/tslint.json`));
      this.fs.copy(this.templatePath('typings.json'), this.destinationPath(`${this.config.get('folder')}/${config.name}/typings.json`));
    },

    tmplRoot() {
      this.fs.copyTpl(
        this.templatePath('README.md'),
        this.destinationPath(`${this.config.get('folder')}/${config.name}/'README.md'`),
        {
          name: config.name
        });
      this.fs.copyTpl(
        this.templatePath('xos-sample-gui-extension.yml'),
        this.destinationPath(`${this.config.get('folder')}/${config.name}/'${config.name}.yml'`),
        {
          name: config.name
        });
    },

    conf() {
      this.fs.copy(this.templatePath('conf'), this.destinationPath(`${this.config.get('folder')}/${config.name}/conf`));
    },

    gulp() {
      this.fs.copy(this.templatePath('gulp'), this.destinationPath(`${this.config.get('folder')}/${config.name}/gulp`));
    },

    src() {
      this.fs.copyTpl(
        this.templatePath('src'),
        this.destinationPath('src'),
        {
          name: config.name
        });
    }
  }

});
