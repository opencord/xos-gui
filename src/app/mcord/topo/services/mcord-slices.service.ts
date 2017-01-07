
import {MCordSlicesData, IMCordSlices} from '../mocks/slices.mock';

export interface  IMcordSlicesService {
  query(): ng.IPromise<IMCordSlices>;
}

export class MCordSlices implements IMcordSlicesService {
  static $inject = ['$log', '$q'];
  constructor(
    private $log: ng.ILogService,
    private $q: ng.IQService
  ) {
  }

  public query() {
    const d = this.$q.defer();
    d.resolve(MCordSlicesData);
    return d.promise;
  }
}
