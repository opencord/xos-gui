
/*
 * Copyright 2017-present Open Networking Foundation

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/// <reference path="../typings/index.d.ts" />

export function interceptorConfig($httpProvider: angular.IHttpProvider, $resourceProvider: angular.resource.IResourceServiceProvider) {
  $httpProvider.interceptors.push('UserStatusInterceptor');
  $httpProvider.interceptors.push('CredentialsInterceptor');
  $httpProvider.interceptors.push('NoHyperlinksInterceptor');
}

export function userStatusInterceptor($state: angular.ui.IStateService, $cookies: ng.cookies.ICookiesService, $q: ng.IQService) {
  const checkLogin = (res) => {
    // NOTE this interceptor may never be called as the request is not rejected byt the "model-discoverer" service
    switch (res.status) {
      case -1:
      case 401:
      case 403:
        $cookies.remove('sessionid', {path: '/'});
        $state.go('login');
        return $q.reject(res);
      default:
        return $q.reject(res);
    }
  };

  return {
    responseError: checkLogin
  };
}

export function CredentialsInterceptor($cookies: angular.cookies.ICookiesService) {
  return {
    request: (req) => {
      if (!$cookies.get('sessionid')) {
        return req;
      }
      req.headers['x-sessionid'] = $cookies.get('sessionid');
      req.headers['x-xossession'] = $cookies.get('sessionid');
      return req;
    }
  };
}

export function NoHyperlinksInterceptor($q: ng.IQService) {
  return {
    request: (req) => {
      if (req.url.indexOf('.html') === -1) {
        // NOTE  force content type to be JSON
        req.headers['Content-Type'] = 'application/json';

        if (req.method === 'PUT') {
          // XosModelStore.search add this value for visualization purpose,
          // no one should change models
          delete req.data.modelName;
        }
      }
      return req;
    },
    response: (res) => {
      try {
        // NOTE convert res.data from string to JSON
        res.data = JSON.parse(res.data);
        try {
          // NOTE chameleon return everything inside an "items" field
          res.data = res.data.items;
        } catch (_e) {
          res.data = res.data;
        }
      } catch (e) {
        res.data = res.data;
      }
      return res;
    },
    responseError: (res) => {
      return $q.reject(res.data);
    }
  };
}
