import * as _ from 'lodash';
import './line-side-form.component.scss';
import {IXosModelStoreService} from '../../../datasources/stores/model.store';

class EcordLineSideFormCtrl {

  static $inject = [
    '$log',
    '$scope',
    'XosModelStore'
  ];

  public ngModel;
  public line;
  public bandwidthProfiles;

  constructor (
    private $log: ng.ILogService,
    private $scope: ng.IScope,
    private XosModelStore: IXosModelStoreService
  ) {
    $scope.$watch(() => this.line, (val) => {
      if(val){
        this.ngModel = this.line.model;
      }
    });
    XosModelStore.query('BandwidthProfile', '/metronetwork/bandwidthprofiles')
      .subscribe(
        (res) => {
          // res = _.map(res, bp => {
          //   return {
          //     label: bp.name,
          //     values: bp
          //   }
          // });
          this.bandwidthProfiles = res;
        },
        err => {
          $log.error(`[EcordLineSideFormCtrl] BandwidthProfile observable error: `, err);
        }
      );
  }

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

  public updateBP(profileId, item) {
    const profile = this.getBPbyId(profileId);
    item.profile = {
      bwpcfgcir: profile.bwpcfgcir,
      bwpcfgcbs: profile.bwpcfgcbs,
      bwpcfgeir: profile.bwpcfgeir,
      bwpcfgebs: profile.bwpcfgebs,
    };
  }

  public getBPbyId(id) {
    return _.find(this.bandwidthProfiles, {id: id});
  }

  public save(item) {
    console.log('call ONOS');
    // then
    item.status = 1;

    this.saveInLocalStorage(item);
    console.log(item);
  }

  private saveInLocalStorage(item) {
    let connections;
    try {
      connections = JSON.parse(localStorage.getItem('ecord-connections'));
      if (!connections) {
        connections = [];
      }
    }
    catch (e) {
      connections = [];
    }

    const connId = _.findIndex(connections, c => {
      c.model.id === item.id;
    });
    if (connId > -1) {
      connections[connId] = this.line;
    }
    else {
      connections.push(this.line);
    }
    localStorage.setItem('ecord-connections', JSON.stringify(connections));
  }
}

export const ecordLineSideForm: angular.IComponentOptions = {
  template: require('./line-side-form.component.html'),
  controllerAs: 'vm',
  controller: EcordLineSideFormCtrl,
  bindings: {
    line: '='
  }
};