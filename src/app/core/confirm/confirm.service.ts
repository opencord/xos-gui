
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

import {IXosConfirmConfig} from './confirm';

export interface IXosConfirm {
  modalInstance: any;
  open(config: IXosConfirmConfig) : void;
  close(cb: any) : void;
  dismiss() : void;
}

export class XosConfirm implements IXosConfirm {

  static $inject = ['$uibModal', '$log'];
  public modalInstance;

  constructor(
    private $uibModal : any,
    private $log: ng.ILogService,
  ) {

  }

  public open(config: IXosConfirmConfig) {
    this.$log.debug('[XosConfirm] called open');
    this.modalInstance = this.$uibModal.open({
      keyboard: true,
      component: 'xosConfirm',
      backdrop: 'static',
      resolve: {
        config: () => config
      }
    });

    return this.modalInstance;
  }

  public close(cb: any) {
    // check if model instance exists
    if (angular.isUndefined(this.modalInstance)) {
      this.$log.debug('[XosConfirm] called close without a modalInstance');
      return;
    }
    cb()
      .then(() => {
        this.modalInstance.close();
      })
      .catch((err) => {
        this.modalInstance.dismiss(err);
    });
  }

  public dismiss() {
      this.modalInstance.dismiss();
  }

}

