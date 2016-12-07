/// <reference path="../../../../typings/index.d.ts"/>

// Imports
import {AppConfig} from '../../config/app.config';
import { Injectable }     from '@angular/core';
import { Response} from '@angular/http';
import {XosHttp} from './xoshttp.service';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class SliceService {
  private baseUrl = AppConfig.apiEndpoint;
  constructor (private http: XosHttp) {}
  // Fetch all existing instances
  query() : Observable<any[]> {
    return this.http.get(`${this.baseUrl}/core/slices/`)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.response.json().error || 'Server error'));
  }
}
