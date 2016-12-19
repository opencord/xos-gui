import {StyleConfig} from '../../config/style.config';
export interface IXosPageTitleService {
  get(): string;
  set(title: string): void;
  formatStateName(stateName: string): string;
}

export class PageTitle {
  static $inject = ['$window', '$transitions'];
  constructor(
    private $window: angular.IWindowService,
    private $transitions: any // missing definition
  ) {
    this.$transitions.onSuccess({ to: '**' }, (transtion) => {
      this.set(transtion.$to().name);
    });
  }

  get() {
    return this.$window.document.title;
  }

  set(title: string) {
    this.$window.document.title = `${StyleConfig.projectName} - ${this.formatStateName(title)}`;
  }

  private formatStateName(stateName: string): string {
    // TODO pluralize and capitalize first letter only
    return stateName.replace('xos.', '').split('.').join(' > ');
  }
}

