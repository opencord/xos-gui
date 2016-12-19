import * as _ from 'lodash';
import {IXosConfigHelpersService} from '../services/helpers/config.helpers';

export interface IXosFormHelpersService {
  _getFieldFormat(value: any): string;
  parseModelField(fields: any): any[];
  buildFormStructure(modelField: any[], customField: any[], model: any, order: string[]): any;
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

  public buildFormStructure = (modelField, customField, model, order) => {
    // TODO take an array as input
    // NOTE do we want to support auto-generated forms??
    // We can take that out of this component and autogenerate the config somewhere else
    const orderedForm = {};

    modelField = angular.extend(modelField, customField);
    customField = customField || {};

    if (order) {
      _.each(order, function (key: string) {
        orderedForm[key] = {};
      });
    }

    _.each(Object.keys(modelField), (f) => {

      orderedForm[f] = {
        label: (customField[f] && customField[f].label) ? `${customField[f].label}:` : this.ConfigHelpers.toLabel(f),
        type: (customField[f] && customField[f].type) ? customField[f].type : this._getFieldFormat(model[f]),
        validators: (customField[f] && customField[f].validators) ? customField[f].validators : {},
        hint: (customField[f] && customField[f].hint) ? customField[f].hint : '',
      };

      if (customField[f] && customField[f].options) {
        orderedForm[f].options = customField[f].options;
      }
      if (customField[f] && customField[f].properties) {
        orderedForm[f].properties = customField[f].properties;
      }
      if (orderedForm[f].type === 'date') {
        model[f] = new Date(model[f]);
      }

      if (orderedForm[f].type === 'number') {
        model[f] = parseInt(model[f], 10);
      }
    });

    return orderedForm;
  };

  public parseModelField = (fields) => {
  return _.reduce(fields, (form, f) => {
    form[f] = {};
    return form;
  }, {});
}
}
