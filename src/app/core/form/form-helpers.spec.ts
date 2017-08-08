
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
import {IXosFormHelpersService, XosFormHelpers} from './form-helpers';

let service: IXosFormHelpersService;

describe('The XosFormHelpers service', () => {

  beforeEach(() => {
    angular.module('formHelpers', [])
      .service('XosFormHelpers', XosFormHelpers);
    angular.mock.module('formHelpers');

    angular.mock.inject((
      XosFormHelpers: IXosFormHelpersService,
    ) => {
      service = XosFormHelpers;
    });
  });

  describe('the getFieldFormat method', () => {
    it('should return text', () => {
      expect(service._getFieldFormat('cordSubscriber-1')).toEqual('text');
      expect(service._getFieldFormat('a random text')).toEqual('text');
      expect(service._getFieldFormat(null)).toEqual('text');
      expect(service._getFieldFormat('1')).toEqual('text');
    });
    it('should return mail', () => {
      expect(service._getFieldFormat('test@onlab.us')).toEqual('email');
      expect(service._getFieldFormat('testonlab.us')).not.toEqual('email');
    });
    it('should return number', () => {
      expect(service._getFieldFormat(1)).toEqual('number');
    });
    it('should return boolean', () => {
      expect(service._getFieldFormat(false)).toEqual('boolean');
      expect(service._getFieldFormat(true)).toEqual('boolean');
    });

    it('should return date', () => {
      expect(service._getFieldFormat('2016-04-19T23:09:1092Z')).toEqual('text');
      expect(service._getFieldFormat(new Date())).toEqual('date');
      expect(service._getFieldFormat('2016-04-19T23:09:10.208092Z')).toEqual('date');
    });

    it('should return array', () => {
      expect(service._getFieldFormat([])).toEqual('array');
      expect(service._getFieldFormat(['a', 'b'])).toEqual('array');
    });

    it('should return object', () => {
      expect(service._getFieldFormat({})).toEqual('object');
      expect(service._getFieldFormat({foo: 'bar'})).toEqual('object');
    });
  });
});
