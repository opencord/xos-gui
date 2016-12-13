import {AppConfig} from '../config/app.config';

export interface IXosResourceService {
  getResource(): ng.resource.IResourceClass<any>;
}

export class SlicesRest implements IXosResourceService{
  static $inject = ['$resource'];

  /** @ngInject */
  constructor(
    private $resource: ng.resource.IResourceService
  ) {

  }

  public getResource(): ng.resource.IResourceClass<ng.resource.IResource<any>> {
    return this.$resource(`${AppConfig.apiEndpoint}/core/slices/`);
  }
}
