import {IXosConfigHelpersService} from '../services/helpers/config.helpers';
import {IXosFormInput} from './form';

export interface IXosFormHelpersService {
  _getFieldFormat(value: any): string;
  parseModelField(fields: any): any[];
  buildFormStructure(modelField: any[], customField: any[], model: any, order: string[]): any;
  buildFormData(fields: IXosFormInput[], model: any): any;
}

export class XosFormHelpers {
  static $inject = ['ConfigHelpers'];

  constructor (
    private ConfigHelpers: IXosConfigHelpersService
  ) {

  }

  public _isEmail = (text) => {
    const re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    return re.test(text);
  };

  public  _getFieldFormat = (value) => {
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
}

