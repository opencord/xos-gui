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
