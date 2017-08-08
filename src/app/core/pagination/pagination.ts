
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


class XosPaginationCtrl {
  $inject = ['$onInit', '$scope'];

  public pageSize: number;
  public totalElements: number;
  public change: any; // fn
  public currentPage: number;
  public pages: number;
  public pageList: number[];

  constructor (
    private $scope: ng.IScope
  ) {
  }

  $onInit() {
    this.currentPage = 0;

    // watch for data changes
    this.$scope.$watch(() => this.totalElements, () => {
      if (this.totalElements) {
        this.pages = Math.ceil(this.totalElements / this.pageSize);
        this.pageList = this.createPages(this.pages);
      }
    });
  }

  public goToPage = (n) => {
    if (n < 0 || n === this.pages) {
      return;
    }
    this.currentPage = n;
    this.change(n);
  };

  private createPages = (pages) => {
    let arr = [];
    for (let i = 0; i < pages; i++) {
      arr.push(i);
    }
    return arr;
  };
}

export const xosPagination: angular.IComponentOptions = {
  template: require('./pagination.html'),
  controllerAs: 'vm',
  controller: XosPaginationCtrl,
  bindings: {
    pageSize: '=',
    totalElements: '=',
    change: '='
  }
};
