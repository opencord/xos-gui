import {Injectable} from '@angular/core';
import {IWSEvent} from '../../interfaces/ws.interface';
import {BehaviorSubject} from 'rxjs';
import * as _ from 'lodash';
/**
 * @whatItDoes Update a BehaviorSubject after receiving an event from an Observable
 * @stable
 */

@Injectable()
export class ObservaleCollectionHandler {
    static update(event: IWSEvent, subject: BehaviorSubject<any>):BehaviorSubject<any> {
      const collection: any[] = subject.value;

      const exist: any = _.find(collection, (i) => {
        return i.id === event.msg.object.id;
      });

      // remove
      if (exist) {
        _.remove(collection, {id: event.msg.object.id});
      }
      // if the element is not deleted add it
      // if it was there it has been removed (works as an update)
      if (!_.includes(event.msg.changed_fields, 'deleted')) {
        collection.push(event.msg.object);
      }

      console.log(collection);

      subject.next(collection);

      return subject;
    }
}
