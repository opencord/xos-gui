import * as _ from 'lodash';
import './monitoring-dashboard.scss';
import {IXosMonitoringApiService} from '../services/montoring-api';

export interface IXosMonitoringSlice {
  project_id: string;
  slice: string;
}

export interface IXosMonitoringMeter {
  name?: string;
  unit: string;
  resource_name: string;
  resource_id: string;
  meter: string;
  slice: string;
  volume: number;
  // meter for pie chart
  metadata?: any;
  length?: number;
}

class MonitoringDashboardComponent {
  static $inject = ['XosMonitoringApi'];

  public showStats = false;

  // this open the accordion
  public accordion = {
    open: {}
  };

  // visualization info
  public loader = true;
  public error = null;
  public ceilometerError = null;

  public selectedMeters = null;
  public selectedSlice = null;
  public selectedResource = null;
  public selectedResources = null;
  public selectedTenant = null;
  public services;

  constructor(
    private XosMonitoringApi: IXosMonitoringApiService
  ) {
    this.loadMappings();
  }


  /**
   * Open the active panel base on the service stored values
   */
  public openPanels() {
    if (this.XosMonitoringApi.selectedService) {
      this.accordion.open[this.XosMonitoringApi.selectedService] = true;
      if (this.XosMonitoringApi.selectedSlice) {
        this.loadSliceMeter(this.XosMonitoringApi.selectedSlice, this.XosMonitoringApi.selectedService);
        this.selectedSlice = this.XosMonitoringApi.selectedSlice;
        if (this.XosMonitoringApi.selectedResource) {
          this.selectedResource = this.XosMonitoringApi.selectedResource;
        }
      }
    }
  };

  /**
   * Load the list of service and slices
   */
  public loadMappings() {
    this.loader = true;
    this.XosMonitoringApi.getMappings()
      .then((services) => {

        // rename thing in UI
        services.map((service) => {
          if (service.service === 'service_ONOS_vBNG') {
            service.service = 'ONOS_FABRIC';
          }
          if (service.service === 'service_ONOS_vOLT') {
            service.service = 'ONOS_CORD';
          }

          service.slices.map(s => {
            if (s.slice === 'mysite_onos_volt') {
              s.slice = 'ONOS_CORD';
            }
            if (s.slice === 'mysite_onos_vbng') {
              s.slice = 'ONOS_FABRIC';
            }
            if (s.slice === 'mysite_vbng') {
              s.slice = 'mysite_vRouter';
            }
          });

          return service;
        });
        // end rename thing in UI

        this.services = services;
        this.openPanels();
      })
      .catch(err => {
        this.error = (err.data && err.data.detail) ? err.data.detail : 'An Error occurred. Please try again later.';
      })
      .finally(() => {
        this.loader = false;
      });
  };

  /**
   * Load the list of a single slice
   */
  public loadSliceMeter(slice: IXosMonitoringSlice, service_name: string) {

  this.XosMonitoringApi.selectedSlice = null;
  this.XosMonitoringApi.selectedService = null;
  this.XosMonitoringApi.selectedResources = null;

  this.XosMonitoringApi.getMeters({tenant: slice.project_id})
    .then((sliceMeters) => {
      this.selectedSlice = slice.slice;
      this.selectedTenant = slice.project_id;

      // store the status
      this.XosMonitoringApi.selectedSlice = slice;
      this.XosMonitoringApi.selectedService = service_name;

      // rename things in UI
      sliceMeters.map(m => {
        m.resource_name = m.resource_name.replace('mysite_onos_vbng', 'ONOS_FABRIC');
        m.resource_name = m.resource_name.replace('mysite_onos_volt', 'ONOS_CORD');
        m.resource_name = m.resource_name.replace('mysite_vbng', 'mysite_vRouter');
        return m;
      });
      // end rename things in UI

      this.selectedResources = _.groupBy(sliceMeters, 'resource_name');

      // hacky
      if (this.XosMonitoringApi.selectedResource) {
        this.selectedMeters = this.selectedResources[this.XosMonitoringApi.selectedResource];
      }
    })
    .catch(err => {

      // this means that ceilometer is not yet ready
      if (err.status === 503) {
        return this.ceilometerError = err.data.detail.specific_error;
      }

      this.ceilometerError = (err.data && err.data.detail && err.data.detail.specific_error) ? err.data.detail.specific_error : 'An Error occurred. Please try again later.';
    })
    .finally(() => {
      this.loader = false;
    });
  };

  /**
   * Select Meters for a resource
   *
   * @param Array meters The list of selected resources
   * @returns void
   */

  public selectMeters(meters: IXosMonitoringMeter[], resource: string) {
    this.selectedMeters = meters;

    this.XosMonitoringApi.selectedResource = resource;
    this.selectedResource = resource;
  };
};

export const xosMonitoringDashboardComponent: angular.IComponentOptions = {
  template: require('./monitoring-dashboard.html'),
  controllerAs: 'vm',
  controller: MonitoringDashboardComponent
};
