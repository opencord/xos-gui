/// <reference path="../typings/index.d.ts" />

// TODO handle backend failure

export function interceptorConfig($httpProvider: angular.IHttpProvider, $resourceProvider: angular.resource.IResourceServiceProvider) {
  $httpProvider.interceptors.push('UserStatusInterceptor');
  $httpProvider.interceptors.push('CredentialsInterceptor');
  $resourceProvider.defaults.stripTrailingSlashes = false;
}

export function userStatusInterceptor($state: angular.ui.IStateService) {

  const checkLogin = (res) => {
    if (res.status === 403) {
      $state.go('login');
    }
    else if (res.data.status === 403) {
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
      if (!$cookies.get('xoscsrftoken') || !$cookies.get('xossessionid')) {
        return req;
      }
      req.headers['X-CSRFToken'] = $cookies.get('xoscsrftoken');
      req.headers['x-csrftoken'] = $cookies.get('xoscsrftoken');
      req.headers['x-sessionid'] = $cookies.get('xossessionid');
      return req;
    }
  };
}
