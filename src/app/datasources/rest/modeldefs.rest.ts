import {IXosModelDefsField} from '../../core/services/helpers/config.helpers';
import {IXosAppConfig} from '../../../index';

// Models interfaces
export interface IXosModelDefsField {
  name: string;
  type: string;
  validators?: any;
  hint?: string;
  relation?: {
    model: string;
    type: string;
  };
}

export interface IXosModelDefsRelation {
  model: string; // model name
  type: string; // relation type
  on_field: string; // the field that is containing the relation
}

export interface IXosModeldef {
  fields: IXosModelDefsField[];
  relations?: IXosModelDefsRelation[];
  name: string;
  app: string;
}

export interface IXosModeldefsService {
  get(): Promise<IXosModeldef[]>;
}

export class XosModeldefsService implements IXosModeldefsService {

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
