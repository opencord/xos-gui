import {IXosModelDefsField} from '../../core/services/helpers/config.helpers';
import {IXosAppConfig} from '../../../index';

export interface IModeldef {
  fields: IXosModelDefsField[];
  relations?: string[];
  name: string;
}

export interface IModeldefsService {
  get(): Promise<IModeldef[]>;
}

export class ModeldefsService {

  static $inject = ['$http', '$q', 'AppConfig'];

  constructor(
    private $http: angular.IHttpService,
    private $q: angular.IQService,
    private AppConfig: IXosAppConfig
  ) {
  }

  public get(): Promise<any> {
    const d = this.$q.defer();
    this.$http.get(`${this.AppConfig.apiEndpoint}/modeldefs`)
      .then((res: any) => {
        d.resolve(res.data.items);
      })
      .catch(e => {
        d.reject(e);
      });
    return d.promise;
  }
}
