
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


import * as angular from 'angular';
import 'angular-mocks';
import {ArrayToListFilter} from './array-to-list.filter';

describe('The pagination filter', function () {

  let $filter;

  beforeEach(() => {
    angular
      .module('array', [])
      .filter('arrayToList', ArrayToListFilter);
    angular.mock.module('array');

    inject(function (_$filter_: ng.ICompileService) {
      $filter = _$filter_;
    });
  });

  it('should return element from given to the end', function () {
    let list = ['a', 'b', 'c', 'd'], result;
    result = $filter('arrayToList')(list);
    expect(result).toEqual('a, b, c, d');
  });
});
