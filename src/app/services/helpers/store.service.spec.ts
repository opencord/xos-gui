
import {ObservableCollectionHandler} from './store.service';
import {IWSEvent} from '../../interfaces/ws.interface';
import {BehaviorSubject} from 'rxjs';

describe('Service: Observable Collection Handler', () => {

  let subject: BehaviorSubject<any>;
  let observable;

  beforeEach(() => {
    subject = new BehaviorSubject([]);
    observable = subject.asObservable();
  });

  it('Should have an update method', () => {
    expect(ObservableCollectionHandler.update).toBeDefined();
  });

  it('should add an element to the observable', (done) => {
    const event: IWSEvent = {
      model: 'Test',
      msg: {
        pk: 1,
        changed_fields: [],
        object: {id: 1, foo: 'bar'}
      }
    };

    ObservableCollectionHandler.update(event, subject);

    subject.subscribe(
      (collection: any[]) => {
        expect(collection.length).toBe(1);
        expect(collection[0].foo).toEqual('bar');
        done();
      }
    );
  });

  describe('when the subject already have content', () => {
    beforeEach(() => {
      subject.next([{id: 1, foo: 'bar'}, {id: 2, foo: 'baz'}]);
    });

    it('should update an element', (done) => {
      const event: IWSEvent = {
        model: 'Test',
        msg: {
          pk: 1,
          changed_fields: [],
          object: {id: 1, foo: 'updated'}
        }
      };

      ObservableCollectionHandler.update(event, subject);

      subject.subscribe(
        (collection: any[]) => {
          expect(collection.length).toBe(2);
          expect(collection[0].foo).toEqual('updated');
          done();
        }
      );
    });

    it('should delete an element', (done) => {
      const event: IWSEvent = {
        model: 'Test',
        msg: {
          pk: 1,
          changed_fields: ['deleted'],
          object: {id: 1, foo: 'deleted'}
        }
      };

      ObservableCollectionHandler.update(event, subject);

      subject.subscribe(
        (collection: any[]) => {
          expect(collection.length).toBe(1);
          expect(collection[0].foo).toEqual('baz');
          done();
        }
      );
    });
  });
});
