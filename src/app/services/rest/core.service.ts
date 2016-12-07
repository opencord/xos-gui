/// <reference path="../../../../typings/index.d.ts"/>

// Imports
import {AppConfig} from '../../config/app.config';
import {Injectable}     from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {XosHttp} from './xoshttp.service';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class CoreService {
  // private instance variable to hold base url
  private baseUrl = AppConfig.apiEndpoint;

  // Resolve HTTP using the constructor
  constructor (private http: XosHttp) {}

  // Fetch all existing comments
  getCoreEndpoints() : Observable<any[]> {

    const search = 'some=param';

    // ...using get request
    return this.http.get(`${this.baseUrl}/core/`, {search})
    // ...and calling .json() on the response to return data
      .map((res: Response) => res.json())
      // ...errors if any
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));

  }
}
