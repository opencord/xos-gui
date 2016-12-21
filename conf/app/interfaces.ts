import {IXosNavigationRoute} from '../../src/app/core/services/navigation';
export interface IStyleConfig {
  projectName: string;
  favicon: string;
  background: string;
  routes: IXosNavigationRoute[];
}

export interface IAppConfig {
  apiEndpoint: string;
  websocketClient: string;
}
