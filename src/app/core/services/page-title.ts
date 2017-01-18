import {IXosStyleConfig} from '../../../index';
export interface IXosPageTitleService {
  get(): string;
  set(title: string): void;
  formatStateName(stateName: string): string;
}

export class PageTitle {
  static $inject = ['$window', '$transitions', 'StyleConfig'];
  constructor(
    private $window: angular.IWindowService,
    private $transitions: any, // missing definition
    private StyleConfig: IXosStyleConfig
  ) {
    this.$transitions.onSuccess({ to: '**' }, (transtion) => {
      this.set(transtion.$to().name);
    });
  }

  get() {
    return this.$window.document.title;
  }

  set(title: string) {
    this.$window.document.title = `${this.StyleConfig.projectName} - ${this.formatStateName(title)}`;
  }

  private formatStateName(stateName: string): string {
    // TODO pluralize and capitalize first letter only
    return stateName.replace('xos.', '').split('.').join(' > ');
  }
}

