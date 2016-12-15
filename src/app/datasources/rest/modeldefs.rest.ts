import {AppConfig} from '../../config/app.config';

interface IModeldefField {
  name: string;
  type: string;
}

export interface IModeldef {
  fields: IModeldefField[];
  relations: string[];
  name: string;
}

export interface IModeldefsService {
  get(): Promise<IModeldef[]>;
}

export class ModeldefsService {
  constructor(
    private $http: angular.IHttpService,
    private $q: angular.IQService,
  ) {
  }

  public get(): Promise<any> {
    const d = this.$q.defer();
    this.$http.get(`${AppConfig.apiEndpoint}/utility/modeldefs/`)
      .then((res) => {
        d.resolve(res.data);
      })
      .catch(e => {
        d.reject(e);
      });
    return d.promise;
  }
}
