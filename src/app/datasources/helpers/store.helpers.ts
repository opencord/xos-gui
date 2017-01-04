import {BehaviorSubject} from 'rxjs';
import * as _ from 'lodash';
import {IWSEvent} from '../websocket/global';
import {IXosModelHelpersService} from './model.helpers';
import {IXosResourceService} from '../rest/model.rest';

export interface IStoreHelpersService {
  updateCollection(event: IWSEvent, subject: BehaviorSubject<any>): BehaviorSubject<any>;
}

export class StoreHelpers {
  static $inject = ['ModelHelpers', 'ModelRest'];

  constructor (
    private modelHelpers: IXosModelHelpersService,
    private modelRest: IXosResourceService
  ) {
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
    const endpoint = this.modelHelpers.urlFromCoreModel(event.model);
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
