
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
  open(config: IXosConfirmConfig) : void;
  close(cb: Function) : void;
  dismiss() : void;
}

export class XosConfirm implements IXosConfirm {

  static $inject = ['$uibModal'];
  public modalInstance;

  constructor(
    private $uibModal : any,
  ) {

  }

  public open(config: IXosConfirmConfig) {

    this.modalInstance = this.$uibModal.open({
      keyboard: false,
      component: 'xosConfirm',
      backdrop: 'static',
      resolve: {
        config: () => config
      }
    });
    return this.modalInstance;
  }

  public close(cb: Function) {
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

