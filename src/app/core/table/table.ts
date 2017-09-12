
/*
 * Copyright 2017-present Open Networking Foundation

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


// TODO fininsh to import all methods from https://github.com/opencord/ng-xos-lib/blob/master/src/ui_components/dumbComponents/table/table.component.js
// TODO import tests

import './table.scss';
import * as _ from 'lodash';

enum EXosTableColType {
  'boolean',
  'array',
  'object',
  'custom',
  'date' ,
  'icon'
}

export interface IXosTableColumn {
  label: string;
  prop: string;
  type?: string; // understand why enum does not work
  formatter?(item: any): string;
  link?(item: any): string;
  hover?(item: any): string;
}

interface IXosTableCgfOrder {
  reverse?: boolean;
  field: string;
}

export interface IXosTableCfg {
  columns: any[];
  pagination?: {
    pageSize: number;
  };
  order?: IXosTableCgfOrder;
  filter?: string;
  selectedRow?: number;
  filteredData?: any[];
  actions?: any[]; // TODO create interface
}

class TableCtrl {
  $inject = ['$onInit', '$scope'];

  public columns: any[];
  public orderBy: string;
  public reverse: boolean;
  public classes: string;
  public data: any;
  private config: IXosTableCfg;
  private currentPage: number;
  private loader: boolean = true;

  constructor(
    private $scope: ng.IScope
  ) {

  }

  $onInit() {

    this.$scope.$watch(() => this.data, data => {
      if (angular.isDefined(data)) {
        this.loader = false;
      }
    });

    this.classes = 'table table-striped'; // table-bordered

    if (!this.config) {
      throw new Error('[xosTable] Please provide a configuration via the "config" attribute');
    }

    if (!this.config.columns) {
      throw new Error('[xosTable] Please provide a columns list in the configuration');
    }

    // handle default ordering
    if (this.config.order && angular.isObject(this.config.order)) {
      this.reverse = this.config.order.reverse || false;
      this.orderBy = this.config.order.field || 'id';
    }

    // if columns with type 'custom' are provided
    // check that a custom formatter is provided too
    let customCols = _.filter(this.config.columns, {type: 'custom'});
    if (angular.isArray(customCols) && customCols.length > 0) {
      _.forEach(customCols, (col) => {
        if (!col.formatter || !angular.isFunction(col.formatter)) {
          throw new Error('[xosTable] You have provided a custom field type, a formatter function should provided too.');
        }
      });
    }

    // if columns with type 'icon' are provided
    // check that a custom formatter is provided too
    let iconCols = _.filter(this.config.columns, {type: 'icon'});
    if (angular.isArray(iconCols) && iconCols.length > 0) {
      _.forEach(iconCols, (col) => {
        if (!col.formatter || !angular.isFunction(col.formatter)) {
          throw new Error('[xosTable] You have provided an icon field type, a formatter function should provided too.');
        }
      });
    }

    // if a link property is passed,
    // it should be a function
    let linkedColumns = _.filter(this.config.columns, col => angular.isDefined(col.link));
    if (angular.isArray(linkedColumns) && linkedColumns.length > 0) {
      _.forEach(linkedColumns, (col) => {
        if (!angular.isFunction(col.link)) {
          throw new Error('[xosTable] The link property should be a function.');
        }
      });
    }

    // if an hover property is passed,
    // it should be a function
    let hoverColumns = _.filter(this.config.columns, col => angular.isDefined(col.hover));
    if (angular.isArray(hoverColumns) && hoverColumns.length > 0) {
      _.forEach(hoverColumns, (col) => {
        if (!angular.isFunction(col.hover)) {
          throw new Error('[xosTable] The hover property should be a function.');
        }
      });
    }

    if (this.config.pagination) {
      this.currentPage = 0;
    }

  }

  public goToPage = (n) => {
    this.currentPage = n;
  };
}

export const xosTable: angular.IComponentOptions = {
  template: require('./table.html'),
  controllerAs: 'vm',
  controller: TableCtrl,
  bindings: {
    data: '<',
    config: '='
  }
};
