import {AppConfig} from '../config/app.config';
export class SlicesRest {
  static $inject = ['$resource'];

  /** @ngInject */
  constructor(
    private $resource: ng.resource.IResourceService
  ) {

  }

  public resource(): ng.resource.IResourceClass<ng.resource.IResource<any>> {
    return this.$resource(`${AppConfig.apiEndpoint}/core/slices/`);
  }
}
