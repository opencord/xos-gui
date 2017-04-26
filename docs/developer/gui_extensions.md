# Create a custom GUI Extension
 
The CORD GUI is designed to be extensible. There are two cases in which we envision an extension to be needed:
- Provide a different view over data
- Create custom interfaces for services
 
The development process for the two cases it's absolutely the same.
  
We suggest to get started by duplicating [xos-sample-gui-extension](https://github.com/opencord/xos-sample-gui-extension)
  
## Development
 
The development environment is the same as `xos-gui` so you can use the `npm start` command and augment it with the same sets fo environment variables.
The dev server is going to proxy your requests to the appropriate backend and load the base application from it.
 
## Add an extension to a profile
 
To deploy your GUI extension with a cord profile you'll need to reference it in `platform-install`.
 
Open the `profile-manifest` you're working on (eg: profile_manifests/frontend.yml) and locate `enabled_gui_extensions`.
It may appear in two forms, depending whether or not there are others loaded extensions:
```yaml
enabled_gui_extensions:
  - name: sample
    path: orchestration/xos-sample-gui-extension
```
or: 
```yaml
enabled_gui_extensions: []
```
_NOTE: if it is not there, just create it_

To add your extension, just add it to the list:
```yaml
enabled_gui_extensions:
  - name: sample
    path: orchestration/xos-sample-gui-extension
  - name: myextension
    path: orchestration/myextension
```
_NOTE: if it was defined as an empty array you'll need to remove the square brackets (`[]`)_

The `name` field must match the directory in which the GUI Extension is built. You can update it in `conf/gulp.conf.js`, just locate:
```js
exports.paths = {
  src: 'src',
  dist: 'dist/extensions/sample', // NOTE that 'sample' have to match the extension name provided in platform install
  appConfig: 'conf/app',
  tmp: '.tmp',
  e2e: 'e2e',
  tasks: 'gulp_tasks'
};
```
and replace `sample` with the appropriate name.

The `path` field identify the directory (starting from the `repo` root), in which your extension is stored. As now is not supported the loading from external sources. 