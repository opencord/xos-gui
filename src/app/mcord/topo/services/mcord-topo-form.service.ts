import {IXosSidePanelService} from '../../../core/side-panel/side-panel.service';
export interface  IMCordTopoFormService {
  showForm(nodeId: number, nodeType: string): void;
}

const ScheduleType = [{id: 1, label: 'Round Robin'}, {id: 2, label: 'Proportional Fair'}, {id: 2, label: 'MAX C/I'}];

const models = {
  'ran-ru': {
    dlst: 1,
    dlar: 30,
    ulst: 2,
    ular: 45
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
 ]
};

export class MCordTopoForm implements IMCordTopoFormService {
  static $inject = ['$log', 'XosSidePanel'];

  private baseFormConfig = {
    actions: [
      {
        label: 'save',
        icon: 'ok',
        cb: (item) => {
          console.log(item);
        },
        class: 'success'
      }
    ],
  };

  constructor(
    private $log: ng.ILogService,
    private XosSidePanel: IXosSidePanelService
  ) {
  }

  public showForm(nodeId: number, nodeType: string) {
    console.log(models[nodeType]);
    this.baseFormConfig['inputs'] = formFields[nodeType];
    this.XosSidePanel.injectComponent('xosForm', {config: this.baseFormConfig, ngModel: models[nodeType]}, `Sample message ${nodeId}`);
  }
}
