/// <reference path="../typings/index.d.ts" />

// TODO handle backend failure

export function interceptorConfig($httpProvider: angular.IHttpProvider, $resourceProvider: angular.resource.IResourceServiceProvider) {
  $httpProvider.interceptors.push('UserStatusInterceptor');
  $httpProvider.interceptors.push('CredentialsInterceptor');
  $httpProvider.interceptors.push('NoHyperlinksInterceptor');
}

export function userStatusInterceptor($state: angular.ui.IStateService, $cookies: ng.cookies.ICookiesService) {

  const checkLogin = (res) => {
    if (res.status === 401 || res.status === -1) {
      $cookies.remove('sessionid', {path: '/'});
      $state.go('login');
    }
    return res;
  };

  return {
    response: checkLogin,
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

export function NoHyperlinksInterceptor() {
  return {
    request: (req) => {
      if (req.url.indexOf('.html') === -1) {
        // NOTE  force content type to be JSON
        req.headers['Content-Type'] = 'application/json';
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
    }
  };
}
