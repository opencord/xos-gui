import {BehaviorSubject} from 'rxjs';
import * as _ from 'lodash';
import * as pluralize from 'pluralize';
import {IWSEvent} from '../websocket/global';
import {IXosResourceService} from '../rest/model.rest';

export interface IStoreHelpersService {
  urlFromCoreModel(name: string): string;
  updateCollection(event: IWSEvent, subject: BehaviorSubject<any>): BehaviorSubject<any>;
}

export class StoreHelpers implements IStoreHelpersService {
  static $inject = ['ModelRest'];

  constructor (
    private modelRest: IXosResourceService
  ) {
  }

  public urlFromCoreModel(name: string): string {
    return `/core/${pluralize(name.toLowerCase())}`;
  }

  public updateCollection(event: IWSEvent, subject: BehaviorSubject<any>): BehaviorSubject<any> {
    const collection: any[] = subject.value;
    const index: number = _.findIndex(collection, (i) => {
      // NOTE evaluate to use event.msg.pk
      return i.id === event.msg.object.id;
    });
    const exist: boolean = index > -1;
    const isDeleted: boolean = _.includes(event.msg.changed_fields, 'deleted');

    // generate a resource for the model
    const endpoint = this.urlFromCoreModel(event.model);
    const resource = this.modelRest.getResource(endpoint);
    const model = new resource(event.msg.object);

    // remove
    if (exist && isDeleted) {
       _.remove(collection, {id: event.msg.object.id});
     }
    // Replace item at index using native splice
    else if (exist && !isDeleted) {
       collection.splice(index, 1, model);
     }
    // if the element is not deleted add it
    else if (!exist && !isDeleted) {
      collection.push(model);
     }

    subject.next(collection);

    return subject;
    }
}
