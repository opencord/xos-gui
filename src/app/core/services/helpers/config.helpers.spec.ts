import * as angular from 'angular';
import 'angular-mocks';
import 'angular-ui-router';

import {IXosConfigHelpersService} from './config.helpers';
import {xosCore} from '../../index';
import {IModeldef} from '../../../datasources/rest/modeldefs.rest';
import {IXosTableCfg} from '../../table/table';

let service: IXosConfigHelpersService;

const model: IModeldef = {
  name: 'Test',
  fields: [
    {
      type: 'number',
      name: 'id',
      validators: {}
    },
    {
      type: 'string',
      name: 'name',
      validators: {}
    },
    {
      type: 'string',
      name: 'something',
      validators: {}
    },
    {
      type: 'date',
      name: 'updated',
      validators: {}
    },
  ]
};

describe('The ConfigHelpers service', () => {

  beforeEach(angular.mock.module(xosCore));

  beforeEach(angular.mock.inject((
    ConfigHelpers: IXosConfigHelpersService,
  ) => {
    service = ConfigHelpers;
  }));

  describe('The pluralize function', () => {
    it('should pluralize string', () => {
      expect(service.pluralize('test')).toEqual('tests');
      expect(service.pluralize('test', 1)).toEqual('test');
      expect(service.pluralize('xos')).toEqual('xosses');
      expect(service.pluralize('slice')).toEqual('slices');
    });

    it('should preprend count to string', () => {
      expect(service.pluralize('test', 6, true)).toEqual('6 tests');
      expect(service.pluralize('test', 1, true)).toEqual('1 test');
    });
  });

  describe('the label formatter', () => {
    it('should format a camel case string', () => {
      expect(service.toLabel('camelCase')).toEqual('Camel case');
    });

    it('should format a snake case string', () => {
      expect(service.toLabel('snake_case')).toEqual('Snake case');
    });

    it('should format a kebab case string', () => {
      expect(service.toLabel('kebab-case')).toEqual('Kebab case');
    });

    it('should set plural', () => {
      expect(service.toLabel('kebab-case', true)).toEqual('Kebab cases');
    });

    it('should format an array of strings', () => {
      let strings: string[] = ['camelCase', 'snake_case', 'kebab-case'];
      let labels = ['Camel case', 'Snake case', 'Kebab case'];
      expect(service.toLabels(strings)).toEqual(labels);
    });

    it('should set plural on an array of strings', () => {
      let strings: string[] = ['camelCase', 'snake_case', 'kebab-case'];
      let labels = ['Camel cases', 'Snake cases', 'Kebab cases'];
      expect(service.toLabels(strings, true)).toEqual(labels);
    });
  });

  describe('the modelFieldsToColumnsCfg method', () => {
    it('should return an array of columns', () => {
      const cols = service.modelFieldsToColumnsCfg(model.fields, 'testUrl/:id?');
      expect(cols[0].label).toBe('Id');
      expect(cols[0].prop).toBe('id');
      expect(cols[0].link).toBeDefined();

      expect(cols[1].label).toBe('Name');
      expect(cols[1].prop).toBe('name');
      expect(cols[1].link).toBeDefined();

      expect(cols[2].label).toBe('Something');
      expect(cols[2].prop).toBe('something');
      expect(cols[2].link).not.toBeDefined();

      expect(cols[3]).not.toBeDefined();
    });
  });

  describe('the modelToTableCfg method', () => {
    it('should return a table config', () => {
      const cfg: IXosTableCfg = service.modelToTableCfg(model, 'testUrl/:id?');
      expect(cfg.columns).toBeDefined();
      expect(cfg.filter).toBe('fulltext');
      expect(cfg.order).toEqual({field: 'id', reverse: false});
      expect(cfg.actions.length).toBe(1);
    });
  });
});
