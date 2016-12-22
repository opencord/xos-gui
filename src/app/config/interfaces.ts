import {IXosNavigationRoute} from '../core/services/navigation';
export interface IStyleConfig {
  projectName: string;
  payoff: string;
  favicon: string;
  background: string;
  logo: string;
  routes: IXosNavigationRoute[];
}

export interface IAppConfig {
  apiEndpoint: string;
  websocketClient: string;
}
