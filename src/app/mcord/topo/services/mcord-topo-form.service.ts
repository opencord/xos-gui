import {IXosSidePanelService} from '../../../core/side-panel/side-panel.service';
import {IMCordD3Node} from '../components/mcord-topo.component';
import {IXosAppConfig} from '../../../../index';
export interface  IMCordTopoFormService {
  showForm(node: IMCordD3Node): void;
  showCookieForm(node: IMCordD3Node): void;
}

const ScheduleType = [{id: 1, label: 'Round Robin'}, {id: 2, label: 'Proportional Fair'}, {id: 2, label: 'MAX C/I'}];
const AdmissionControl = [{id: 1, label: 'Voice'}, {id: 2, label: 'Data'}, {id: 3, label: 'Voice + Data'}];
const models = {
  'ran-ru': {
    dlst: 1,
    dlrate: 30,
    ulst: 2,
    ulrate: 45
  },
  'ran-cu': {
    admctrl: 3,
    hand_over: 10,
  },
  pgw: {
    brand: 1
  },
  profile: {
    start: new Date('2016-01-01T08:00:00.000Z'),
    end: new Date('2016-12-01T08:00:00.000Z')
  },
  cookie: {
    active: false
  }
};

const formFields = {
  'ran-ru': [
    {
      label: 'Download Schedule Type',
      name: 'dlst',
      type: 'select',
      options: ScheduleType
    },
    {
      label: 'Download Allocation Rate',
      name: 'dlrate',
      type: 'number',
    },
    {
      label: 'Upload Schedule Type',
      name: 'ulst',
      type: 'select',
      options: ScheduleType
    },
    {
      label: 'Upload Allocation Rate',
      name: 'ulrate',
      type: 'number',
    }
  ],
  'ran-cu': [
    {
      label: 'Admission Control',
      name: 'admctrl',
      type: 'select',
      options: AdmissionControl
    },
    {
      label: 'Hand Hover',
      name: 'hand_over',
      type: 'number',
    }
  ],
  pgw: [
    {
      label: 'Brand',
      name: 'brand',
      type: 'select',
      options: [{id: 1, label: 'Radysis'}, {id: 2, label: 'Quortus'}]
    }
  ],
  profile: [
    {
      label: 'Start',
      name: 'start',
      type: 'date',
    },
    {
      label: 'End',
      name: 'end',
      type: 'date',
    }
  ],
  cookie: [
    {
      label: 'Active',
      name: 'active',
      type: 'boolean',
    }
  ]
};

export class MCordTopoForm implements IMCordTopoFormService {
  static $inject = ['$rootScope', '$log', '$timeout', '$state', '$http', 'XosSidePanel', 'AppConfig'];

  private baseFormConfig = {
    actions: [],
    formName: 'MWC',
    exclude: ['id', 'uuid']
  };

  private baseAction = {
  label: 'Save',
  icon: 'check',
  cb: (item) => {
    this.$log.info(item);
    this.$timeout(() => {
      this.XosSidePanel.close();
    }, 500);
  },
  class: 'success'
};

  constructor(
    private $rootScope: ng.IScope,
    private $log: ng.ILogService,
    private $timeout: angular.ITimeoutService,
    private $state: ng.ui.IStateService,
    private $http: ng.IHttpService,
    private XosSidePanel: IXosSidePanelService,
    private AppConfig: IXosAppConfig
  ) {
  }

  public showForm(node: IMCordD3Node) {
    this.baseFormConfig['inputs'] = formFields[node.type];

    this.baseFormConfig.actions = [];
    this.baseFormConfig.actions.push(this.baseAction);

    if (node.type === 'ran-ru') {
      // FIXME hardoded request to update profile
      this.baseFormConfig.actions = [{
        label: 'Save',
        icon: 'check',
        cb: (item) => {
          let model;
          if (node.id === 35) {
            model = {
              uiid: '35',
              id: 1,
              profile: 'slice1',
              dlrate: item.dlrate,
              ulrate: item.ulrate
            };
          }
          else if (node.id === 45) {
            model = {
              uiid: '45',
              id: 2,
              profile: 'slice2',
              dlrate: item.dlrate,
              ulrate: item.ulrate
            };
          }

          this.$http.put(`${this.AppConfig.apiEndpoint}/service/profile/${model.id}/`, model)
            .then(() => {
              this.XosSidePanel.close();
            })
            .catch(() => {
              this.XosSidePanel.close();
            });

        },
        class: 'success'
      }];

      // FIXME loading data for profile
      let id;
      if (node.id === 35) {
        id = 1;
      }
      else if (node.id === 45) {
        id = 2;
      }
      else {
        return;
      }
      this.$http.get(`${this.AppConfig.apiEndpoint}/service/profile/${id}/`)
        .then((res) => {
          res.data['dlrate'] = parseInt(res.data['dlrate'], 10);
          res.data['ulrate'] = parseInt(res.data['ulrate'], 10);
          models[node.type] = angular.merge(models[node.type], res.data);
          this.XosSidePanel.injectComponent('mcordSideForm', {name: node.name, config: this.baseFormConfig, ngModel: models[node.type]});
        });
    }
    // end rru hardcoding
    else {
      this.XosSidePanel.injectComponent('mcordSideForm', {name: node.name, config: this.baseFormConfig, ngModel: models[node.type]});
    }
  }

  public showCookieForm(node: IMCordD3Node) {
    this.XosSidePanel.injectComponent('mcordPublicSafetyForm');
  }
}
