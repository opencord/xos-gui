import * as _ from 'lodash';
import './line-side-form.component.scss';
import {IXosModelStoreService} from '../../../datasources/stores/model.store';

class EcordLineSideFormCtrl {

  static $inject = [
    '$log',
    '$scope',
    'XosModelStore'
  ];

  constructor (
    private $log: ng.ILogService,
    private $scope: ng.IScope,
    private XosModelStore: IXosModelStoreService
  ) {
    XosModelStore.query('BandwidthProfile', '/metronetwork/bandwidthprofiles')
      .subscribe(
        (res) => {
          res = _.map(res, bp => {
            return {
              label: bp.name,
              values: bp
            }
          });
          this.bandwidthProfiles = res;
        },
        err => {
          $log.error(`[EcordLineSideFormCtrl] BandwidthProfile observable error: `, err);
        }
      );
  }

  public ngModel;
  public bandwidthProfiles;
  // public bandwidthProfiles = [
  //   {
  //     label: 'Basic',
  //     values: {
  //       bwpcfgcir: 10,
  //       bwpcfgcbs: 10,
  //       bwpcfgeir: 10,
  //       bwpcfgebs: 10,
  //     }
  //   },
  //   {
  //     label: 'Silver',
  //     values: {
  //       bwpcfgcir: 30,
  //       bwpcfgcbs: 30,
  //       bwpcfgeir: 30,
  //       bwpcfgebs: 30,
  //     }
  //   },
  //   {
  //     label: 'Premium',
  //     values: {
  //       bwpcfgcir: 100,
  //       bwpcfgcbs: 100,
  //       bwpcfgeir: 100,
  //       bwpcfgebs: 100,
  //     }
  //   }
  // ];

  public addSelector() {
    if (!this.ngModel.selectors) {
      this.ngModel.selectors = [];
    }
    this.ngModel.selectors.push({
      selector: '',
      bandwidthProfile: this.bandwidthProfiles[0].values
    });
  }

  public removeSelector(index) {
    this.ngModel.selectors.splice(index, 1);
  }

  public updateBP(val, item) {
    angular.merge(item, val);
  }

  public save(item) {
    console.log('call ONOS');
    // then
    item.status = 1;
    console.log(item);
  }
}

export const ecordLineSideForm: angular.IComponentOptions = {
  template: require('./line-side-form.component.html'),
  controllerAs: 'vm',
  controller: EcordLineSideFormCtrl,
  bindings: {
    ngModel: '='
  }
};