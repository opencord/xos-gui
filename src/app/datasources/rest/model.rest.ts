import {AppConfig} from '../../config/app.config';

export interface IXosResourceService {
  getResource(url: string): ng.resource.IResourceClass<any>;
}

export class ModelRest implements IXosResourceService {
  static $inject = ['$resource'];
  private resource: angular.resource.IResourceClass<any>;

  /** @ngInject */
  constructor(
    private $resource: ng.resource.IResourceService
  ) {

  }

  public getResource(url: string): ng.resource.IResourceClass<ng.resource.IResource<any>> {
    return this.resource = this.$resource(`${AppConfig.apiEndpoint}${url}/:id`, {id: '@id'});
  }
}
