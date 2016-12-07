/// <reference path="../../../../typings/index.d.ts"/>

// Imports
import {AppConfig} from '../../config/app.config';
import {Injectable}     from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {IAuthRequest, IAuthResponse} from '../../interfaces/auth.interface';
import {CookieService} from 'angular2-cookie/core';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthService {
  private xosToken: string;
  private xosSessionId: string;
  // resolve HTTP using the constructor
  constructor (private http: Http, private cookieService: CookieService) {
  }

  // check if the user is authenticated
  isAuthenticated(): string {
    this.xosToken = this.cookieService.get('xoscsrftoken');
    this.xosSessionId = this.cookieService.get('xossessionid');
    return this.xosToken && this.xosSessionId;
  }

  // get auth info to authenticate API
  getUserHeaders(): Headers{
    const headers = new Headers();
    headers.append('x-csrftoken', this.cookieService.get('xoscsrftoken'));
    headers.append('x-sessionid', this.cookieService.get('xossessionid'));
    return headers;
  }

  // save cookies
  private storeAuth(auth: IAuthResponse): void {
    this.cookieService.put('xoscsrftoken', auth.xoscsrftoken);
    this.cookieService.put('xossessionid', auth.xossessionid);
  }

  // remove cookies
  private removeAuth(): void {
    this.cookieService.remove('xoscsrftoken');
    this.cookieService.remove('xossessionid');
  }

  // log the user in
  login(auth: IAuthRequest): Observable<IAuthResponse> {
    return this.http.post(`${AppConfig.apiEndpoint}/utility/login/`, auth)
      .map((res: Response) => res.json())
      .map((auth: IAuthResponse) => {
        this.storeAuth(auth);
        auth.user = JSON.parse(auth.user);
        return auth;
      })
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  // logout the user
  logout(): Observable<any> {
    return this.http.post(`${AppConfig.apiEndpoint}/utility/logout/`, {xossessionid: this.xosSessionId})
      .map((res: Response) => {
        this.removeAuth();
        return res.text();
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
}

