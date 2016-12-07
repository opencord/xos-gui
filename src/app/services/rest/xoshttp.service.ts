import {Http, RequestOptionsArgs, Response, URLSearchParams} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
/**
 * Created by teone on 12/6/16.
 */
@Injectable()
export class XosHttp {
  constructor(
    private http: Http,
    private authService: AuthService
  ) {
  }

  private checkOptions(options?: RequestOptionsArgs): RequestOptionsArgs {
    // if options are not there, create them
    if(!options){
      options = {};
    }
    return options;
  }

  private getHeaders(options: RequestOptionsArgs): RequestOptionsArgs {
    // add auth headers
    options.headers = this.authService.getUserHeaders();
    return options;
  }

  private getParams(options: RequestOptionsArgs): RequestOptionsArgs {
    // add the no_hyperlinks param
    if (!options.search) {
      options.search = new URLSearchParams();
    }

    if (options.search instanceof URLSearchParams) {
      options.search.set('no_hyperlinks', '1');
    }
    else if (typeof options.search === 'string') {
      options.search += '&no_hyperlinks=1';
    }
    return options;
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {

    options = this.checkOptions(options);
    options = this.getHeaders(options);
    options = this.getParams(options);

    return this.http.get(url, options)
  }

  // TODO add POST, PUT, DELETE declaration
}
