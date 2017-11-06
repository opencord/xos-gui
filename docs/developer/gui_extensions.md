# Creating a custom GUI Extension
 
The CORD GUI is designed to be extensible. There are two cases in which we envision an extension to be needed:
- Provide a different view over data
- Create custom interfaces for services
 
The development process for both is the same.
  
## Starting Development 

### Option 1: Use the provided Yeoman xos-gui-extension generator

The provided generator in `generator-xos-gui-extension` will generate a new GUI extension for you with the name of
your choice and demo components based on a simplified `sample-gui-extension`. No refactoring necessary.

#### Prerequisites
You must have the Yeoman toolset installed via npm on your system. It can be installed by running `npm install --global yo`. 
If you encounter any issues, full detailed instructions on installation can be found at the [Yeoman website](http://yeoman.io/codelab/setup.html).

#### Installation
Once you have successfully installed Yeoman, run the following to install the generator.
```bash
cd ~cord/orchestration/xos-gui/generator-xos-gui-extension
npm link
```
To run the generator, simply run `yo xos-gui-extension` from whatever location in your file system you wish to place your
new GUI extension. The extension will prompt for a name for your extension. 


### Option 2: Copy over sample-gui-extension
If you choose not to use the Yeoman generator, you can copy over the contents of `sample-gui-extension` to your desired
destination in your file system. If you are creating a GUI extension to used with a service, we suggest creating the 
extension in a folder named `gui` in the service's `xos` folder as follows: `orchestration/xos_services/service_name/xos/gui/`.
When changing the name of `sample-gui-extension`, you must be wary to change all instances of `sample-gui-extension` in the 
extension folder.

 
## Adding an extension to the build system
 
To deploy your GUI extension with a cord profile you'll need to reference it in `platform-install` and `build`.
The following steps must be followed to ensure that your GUI extension builds correctly with XOS.

### Adding the extension to `docker_images.yml`

Open `cord/build/docker_images.yml`. Locate the section of the file with other GUI extensions, and add the following:

```yaml
- name: xosproject/gui-extension-sample
    repo: sampleRepo # should match Gerrit repo name
    path: "xos/gui" # path to find extension in the repo (i.e. sampleRepo/xos/gui/)
```
Please maintain ascending alphabetical order among the GUI extensions when inserting your own extension.

### Adding the extension to the podconfig scenario

Open the `config.yml` file of the podconfig scenario relevant to your GUI extension (e.g. cord, mock, local). 
Locate the section titled `docker_image_whitelist` and add your GUI extension.

```yaml
docker_image_whitelist:
# ...other docker images...
  - "xosproject/gui-extension-rcord"
  - "xosproject/gui-extension-sample" # extension added in alphabetical order
  - "xosproject/gui-extension-vtr"
# ...more docker images...

```

### Adding the extension to the podconfig profile manifest
 
Open the `profile-manifest` relevant to the podconfig you're working on (eg: profile_manifests/frontend.yml) and locate `enabled_gui_extensions`.
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
_NOTE: if it is not there, just create it._

### Change conf export settings to match extension name

To add your extension, just add it to the list:
```yaml
enabled_gui_extensions:
  - name: sample
    path: orchestration/xos-sample-gui-extension
  - name: myextension
    path: orchestration/myextension
```
_NOTE: if it was defined as an empty array you'll need to remove the square brackets (`[]`)_

You must make sure that the `name` field matches the directory in which the GUI Extension is built. You can update it in `conf/gulp.conf.js`.
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
and replace `sample` with your appropriate name. If you used the Yeoman generator, `sample` will already have been 
replaced with the GUI extension name you chose.

The `path` field identifies the directory (starting from the CORD `repo` root), in which your extension is stored.
Loading from external sources is not currently supported.

## Additional Tips

### Including Extra Files

Additional necessary files (such as stylesheets or config files) can be added to the profile manifest as follows, 
with the extension's `src` folder as the root. Here, we use `xos-sample-gui-extension` as an example.

```yaml
enabled_gui_extensions:
  - name: sample
    path: orchestration/xos-sample-gui-extension
    extra_files:
      -  app/style/style.css
```

### Generating config files

During development, you may find it necessary to create separate config files in order to include other files used in
your extension (such as images). The path to your extension may vary depending on whether you are running it locally 
(`./xos/extensions/extension-name`) vs. on a container in production (`./extensions/extension-name`).

You can create separate `customconfig.local.js` and `customconfig.production.js` files in the `conf/` folder, and then edit the 
following portion of the appropriate `webpack.conf.js` file as follows:

```js
new CopyWebpackPlugin([
      { from: `./conf/app/app.config.${env}.js`, to: `app.config.js` },
      { from: `./conf/app/style.config.${brand}.js`, to: `style.config.js` },
      // add your file here
      { from: `./conf/app/customconfig.local.js`, to: `customconfig.js`}
    ])
```

`webpack.conf.js` will be used in a local development environment, such as when running `npm start`

`webpack-dist.conf.js` will be used in a production container after deploying a profile.

### Handy XOS Components and Services

The following XOS components and services may be helpful to you in your GUI extension development.

#### XosComponentInjector
Allows for the injection of components into the XOS GUI by specifying a target element ID. Useful IDs include:
* `#dashboard-component-container`: the dashboard as seen on the XOS home
* `#side-panel-container`: a side panel that can slide out from the right. However, there is also a `XosSidePanel` 
service that can make development easier.

#### XosConfirm
Allows for the creation of confirmation modal dialogs to confirm whether or not to execute a selected action.

#### XosKeyboardShortcut
Allows for the creation of custom user keyboard shortcuts. See the provided `components/demo.ts` as an example.

#### XosModelStore
Provides easy access to model ngResources provided by an XOS service. Can be used as follows in your component's
associated TypeScript file:

```typescript
import {Subscription} from 'rxjs/Subscription';
export class ExampleComponent {
    static $inject = ['XosModelStore'];
    public resource;
    private modelSubscription : Subscription;
    constructor(
      private XosModelStore: any,
    ){}
    
    $onInit() {
        this.modelSubscription = this.XosModelStore.query('SampleModel', '/sampleservice/SampleModels').subscribe(
          res => {
            this.resource = res;
          }
        );
    }
}
export const exampleComponent : angular.IComponentOptions = {
  template: require('./example.component.html'),
  controllerAs: 'vm',
  controller: ExampleComponent
}
```

#### XosNavigationService
Used to create custom navigation links in the left navigation panel.

#### XosSidePanel
Makes the injection of a custom side panel somewhat easier (no need to specify a target)

