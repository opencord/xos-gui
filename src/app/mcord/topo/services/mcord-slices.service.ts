import {IMCordSlices} from '../mocks/slices.mock';

export interface  IMcordSlicesService {
  query(): ng.IPromise<IMCordSlices>;
}

export class MCordSlices implements IMcordSlicesService {
  static $inject = ['$log', '$q', 'MCordTopoData'];
  constructor(
    private $log: ng.ILogService,
    private $q: ng.IQService,
    private MCordTopoData: IMCordSlices
  ) {
  }

  public query() {
    const d = this.$q.defer();
    d.resolve(this.MCordTopoData);
    return d.promise;
  }
}
