/// <reference path="../../typings/index.d.ts"/>

import { Observable } from 'rxjs/Rx';
import {BehaviorSubject} from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { XosTableComponent } from './../../src/app/components/tables/table.component';
import {IXosTableConfig} from '../../src/app/interfaces/xos-components/table.interface';
import * as $ from 'jquery';

describe('Component: XosTableComponent', () => {
  let component: XosTableComponent;
  let fixture;
  let compiled;
  let subject: BehaviorSubject<any>;
  let observable: Observable<any>;

  beforeEach(() => {

    subject = new BehaviorSubject([]);
    observable = subject.asObservable();

    TestBed.configureTestingModule({
      declarations: [XosTableComponent],
      imports: []
    });

    fixture = TestBed.createComponent(XosTableComponent);
    component = fixture.componentInstance;
  });

  it('should exist', () => {
    expect(component).toBeDefined();
  });

  describe('when configured', () => {
    beforeEach(() => {
      component.config = {
        columns: [
          {
            label: 'Col 1',
            prop: 'foo'
          },
          {
            label: 'Col 2',
            prop: 'bar'
          }
        ]
      };

      subject.next([
        {foo: 'foo1', bar: 'baz1'},
        {foo: 'foo2', bar: 'baz2'}
      ]);

      component.data = observable;

      // manually trigger data bindng
      fixture.detectChanges();
      compiled = fixture.nativeElement;
    });

    it('should print labels', () => {
      const th1 = $(compiled).find('table tr:first-child th:first-child');
      const th2 = $(compiled).find('table tr:first-child th:last-child');
      expect(th1.text()).toBe('Col 1');
      expect(th2.text()).toBe('Col 2');
    });

    it('should print content in rows', () => {
      const td1_1 = $(compiled).find('table tr:nth-child(2) td:first-child');
      const td1_2 = $(compiled).find('table tr:nth-child(2) td:last-child');
      expect(td1_1.text().trim()).toBe('foo1');
      expect(td1_2.text().trim()).toBe('baz1');

      const td2_1 = $(compiled).find('table tr:nth-child(3) td:first-child');
      const td2_2 = $(compiled).find('table tr:nth-child(3) td:last-child');
      expect(td2_1.text().trim()).toBe('foo2');
      expect(td2_2.text().trim()).toBe('baz2');
    });
  });
});
