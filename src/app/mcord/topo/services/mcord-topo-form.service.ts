import {IXosSidePanelService} from '../../../core/side-panel/side-panel.service';
import {IMCordD3Node} from '../components/mcord-topo.component';
export interface  IMCordTopoFormService {
  showForm(node: IMCordD3Node): void;
  showCookieForm(node: IMCordD3Node): void;
}

const ScheduleType = [{id: 1, label: 'Round Robin'}, {id: 2, label: 'Proportional Fair'}, {id: 2, label: 'MAX C/I'}];
const AdmissionControl = [{id: 1, label: 'Voice'}, {id: 2, label: 'Data'}, {id: 3, label: 'Voice + Data'}]
const models = {
  'ran-ru': {
    dlst: 1,
    dlar: 30,
    ulst: 2,
    ular: 45
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
      name: 'dlar',
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
      name: 'ular',
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
  static $inject = ['$log', '$timeout', '$state', 'XosSidePanel'];

  private baseFormConfig = {
    actions: [],
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
    private $log: ng.ILogService,
    private $timeout: angular.ITimeoutService,
    private $state: ng.ui.IStateService,
    private XosSidePanel: IXosSidePanelService
  ) {
  }

  public showForm(node: IMCordD3Node) {
    this.baseFormConfig['inputs'] = formFields[node.type];

    this.baseFormConfig.actions = [];
    this.baseFormConfig.actions.push(this.baseAction);

    this.XosSidePanel.injectComponent('mcordSideForm', {name: node.name, config: this.baseFormConfig, ngModel: models[node.type]});
  }

  public showCookieForm(node: IMCordD3Node) {
    this.XosSidePanel.injectComponent('mcordPublicSafetyForm');
  }
}
