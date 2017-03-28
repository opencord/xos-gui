import * as _ from 'lodash';
import './line-side-form.component.scss';
import {IXosModelStoreService} from '../../../datasources/stores/model.store';
import {maJson, mep1, mep2, dm1, dm2, flows, md} from './data';

class EcordLineSideFormCtrl {

  static $inject = [
    '$log',
    '$scope',
    '$http',
    'XosModelStore'
  ];

  public ngModel;
  public line;
  public bandwidthProfiles;

  constructor (
    private $log: ng.ILogService,
    private $scope: ng.IScope,
    private $http: ng.IHttpService,
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
    const data = {
     evcCfgId: item.id,
     uniList: [
       `${this.line.startUni.model.cpe}`,
       `${this.line.endUni.model.cpe}`
     ],
     evcType: 'POINT_TO_POINT',
     vlanId: item.id,
     cir: item.profile.bwpcfgcir,
     eir: item.profile.bwpcfgeir,
     cbs: item.profile.bwpcfgcbs,
     ebs: item.profile.bwpcfgebs
    };
    this.$http.post('/onos/carrierethernet/evc', data)
      .then((res) => {
        if (res.status > 400) {
          this.$log.error(`[EcordLineSideFormCtrl] Error saving EVC: `, res.data);
          return;
        }
        item.status = 1;
        this.saveInLocalStorage(item);

        return this.$http.post(`/onos/v1/flows/`, flows)
      })
      .then((res) => {
        localStorage.setItem('flows', JSON.stringify(res.data['flows']));
        return this.$http.post(`/onos/onos-app-cfm/md`, md);
      })
      .then(() => {
        return this.$http.post(`/onos/onos-app-cfm/md/Microsemi/ma`, maJson)
      })
      .then(() => {
        return this.$http.post(`/onos/onos-app-cfm/md/Microsemi/ma/ma-vlan-2/mep`, mep1)
      })
      .then(() => {
        return this.$http.post(`/onos/onos-app-cfm/md/Microsemi/ma/ma-vlan-2/mep`, mep2)
      })
      .then(() => {
        return this.$http.post(`/onos/onos-app-cfm/md/Microsemi/ma/ma-vlan-2/mep/10/dm`, dm1)
      })
      .then(() => {
        return this.$http.post(`/onos/onos-app-cfm/md/Microsemi/ma/ma-vlan-2/mep/10/dm`, dm2)
      })
      .catch(err => {
        this.$log.error(`[EcordLineSideFormCtrl] Error saving EVC: `, err);
      });
  }

  private getConnections = () => {
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
    return connections;
  }

  private saveInLocalStorage(item) {
    const connections = this.getConnections();

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