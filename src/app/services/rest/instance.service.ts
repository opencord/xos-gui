/// <reference path="../../../../typings/index.d.ts"/>

// Imports
import {AppConfig} from '../../config/app.config';
import {AuthService} from './auth.service';
import { Injectable }     from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import {XosHttp} from './xoshttp.service';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class InstanceService {
  private baseUrl = AppConfig.apiEndpoint;
  constructor (private http: XosHttp, private authService: AuthService) {}
  // Fetch all existing instances
  query() : Observable<any[]> {
    return this.http.get(`${this.baseUrl}/core/instances/`)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.response.json().error || 'Server error'));
  }
}
