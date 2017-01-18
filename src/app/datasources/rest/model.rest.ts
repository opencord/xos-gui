import {IXosAppConfig} from '../../../index';
export interface IXosResourceService {
  getResource(url: string): ng.resource.IResourceClass<any>;
}

export class ModelRest implements IXosResourceService {
  static $inject = ['$resource', 'AppConfig'];

  /** @ngInject */
  constructor(
    private $resource: ng.resource.IResourceService,
    private AppConfig: IXosAppConfig
  ) {

  }

  public getResource(url: string): ng.resource.IResourceClass<ng.resource.IResource<any>> {
    const resource: angular.resource.IResourceClass<any> = this.$resource(`${this.AppConfig.apiEndpoint}${url}/:id/`, {id: '@id'}, {
      update: { method: 'PUT' }
    });

    resource.prototype.$save = function() {
      if (this.id) {
        return this.$update();
      } else {
        return resource.save(this).$promise;
      }
    };

    return resource;
  }
}
