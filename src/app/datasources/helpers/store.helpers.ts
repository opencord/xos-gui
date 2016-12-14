import {BehaviorSubject} from 'rxjs';
import * as _ from 'lodash';
import {IWSEvent} from '../websocket/global';

export interface IStoreHelpersService {
  updateCollection(event: IWSEvent, subject: BehaviorSubject<any>): BehaviorSubject<any>;
}

export class StoreHelpers {
  public updateCollection(event: IWSEvent, subject: BehaviorSubject<any>): BehaviorSubject<any> {
    const collection: any[] = subject.value;
    const index: number = _.findIndex(collection, (i) => {
      return i.id === event.msg.object.id;
    });
    const exist: boolean = index > -1;
    const isDeleted: boolean = _.includes(event.msg.changed_fields, 'deleted');
       // remove
    if (exist && isDeleted) {
       _.remove(collection, {id: event.msg.object.id});
     }
    // Replace item at index using native splice
    else if (exist && !isDeleted) {
       collection.splice(index, 1, event.msg.object);
     }
    // if the element is not deleted add it
    else if (!exist && !isDeleted) {
      collection.push(event.msg.object);
     }

    subject.next(collection);

    return subject;
    }
}
