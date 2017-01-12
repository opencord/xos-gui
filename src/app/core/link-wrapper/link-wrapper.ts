import IDirective = angular.IDirective;
export function xosLinkWrapper(): IDirective {
  return {
    template: `
    <a ng-if="col.link" ui-sref="{{col.link(item)}}">
      <div ng-transclude></div>
    </a>
    <div ng-transclude ng-if="!col.link"></div>
    `,
    restrict: 'A',
    transclude: true
  };
};
