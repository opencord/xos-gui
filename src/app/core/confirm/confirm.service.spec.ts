
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
import {IXosConfirm, XosConfirm} from './confirm.service';

let service: IXosConfirm;
let modal;
let modalInstance;
let q;
let scope;

describe('The XosConfirm service', () => {

  beforeEach(() => {
    angular.module('XosConfirmTest', ['ui.bootstrap.modal'])
      .service('XosConfirm', XosConfirm);
    angular.mock.module('XosConfirmTest');

    angular.mock.inject((
      XosConfirm: IXosConfirm,
      $uibModal: any,
      $q: ng.IQService,
      $rootScope: ng.IScope
    ) => {
      service = XosConfirm;
      modal = $uibModal;
      q = $q;
      scope = $rootScope;
    });
  });

  describe('the open method', () => {

    let test1 = {
        header: 'Test Header',
        text: 'Test body',
        actions: [{
          label: 'Action',
          cb: () => {
            return;
          },
          class: 'btn-success'
        }]
      };

    it('should open the modal', () => {
      spyOn(modal, 'open').and.returnValue('fake');
      modalInstance = service.open(test1);
      expect(modal.open).toHaveBeenCalled();
      expect(modalInstance).toEqual('fake');
      expect(service.modalInstance).toEqual('fake');
    });

    it('should close the modal', (done) => {
      const p = q.defer();
      const cb = jasmine.createSpy('cb').and.returnValue(p.promise);
      service.modalInstance = {
        close: jasmine.createSpy('close')
      };

      service.close(cb);
      expect(cb).toHaveBeenCalled();
      p.resolve();
      scope.$apply();
      expect(service.modalInstance.close).toHaveBeenCalled();
      done();
    });



  });

});
