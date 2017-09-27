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
import 'angular-ui-router';
import {XosModeldefsCache, IXosModeldefsCache} from './modeldefs.service';
import {IXosModel} from './model-discoverer.service';

describe('The XosModeldefsCache service', () => {
  let service;

  beforeEach(() => {
    angular
      .module('test', [])
      .service('XosModeldefsCache', XosModeldefsCache);

    angular.mock.module('test');
  });

  beforeEach(angular.mock.inject((XosModeldefsCache: IXosModeldefsCache) => {
    service = XosModeldefsCache;
  }));

  beforeEach(() => {
    service['xosModelDefs'] = [];
  });

  describe('the cache method', () => {

    const modelDef: IXosModel = {
      fields: [
        {name: 'id', type: 'number'},
        {name: 'foo', type: 'string'}
      ],
      relations: [],
      name: 'Node',
      app: 'core',
      description: '',
      verbose_name: ''
    };
    it('should add a modelDefs', () => {
      service.cache(modelDef);
      expect(service['xosModelDefs'].length).toBe(1);
    });

    it('should not add a modelDefs twice', () => {
      service.cache(modelDef);
      service.cache(modelDef);
      expect(service['xosModelDefs'].length).toBe(1);
    });
  });

  it('should get the service name from the app name', () => {
    expect(service.serviceNameFromAppName('services.vsg')).toBe('vsg');
  });

  describe('the get method', () => {
    it('should retrieve a model definition from local cache', () => {
      const model = {
        name: 'Node',
        app: 'core'
      };
      service['xosModelDefs'] = [
        model
      ];
      expect(service.get('Node')).toEqual(model);
    });
  });
});
