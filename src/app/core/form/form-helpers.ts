
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


export interface IXosFormHelpersService {
  _getFieldFormat(value: any): string;
}

export class XosFormHelpers implements IXosFormHelpersService {
  static $inject = [];

  public _getFieldFormat = (value) => {
    if (angular.isArray(value)) {
      return 'array';
    }

    // check if is date
    if (
      angular.isDate(value) ||
      (
        !Number.isNaN(Date.parse(value)) && // Date.parse is a number
        /^\d+-\d+-\d+\D\d+:\d+:\d+\.\d+\D/.test(value) // the format match ISO dates
      )) {
      return 'date';
    }

    // check if is boolean
    // isNaN(false) = false, false is a number (0), true is a number (1)
    if (typeof value  === 'boolean') {
      return 'boolean';
    }

    // check if a string is an email
    if (this._isEmail(value)) {
      return 'email';
    }

    // if null return string
    if (angular.isString(value) || value === null) {
      return 'text';
    }

    return typeof value;
  };

  private _isEmail = (text) => {
    const re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    return re.test(text);
  };
}

