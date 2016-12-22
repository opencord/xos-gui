import {IStyleConfig} from './interfaces';
export const StyleConfig: IStyleConfig = {
    projectName: 'OpenCloud',
    favicon: 'opencloud-favicon.png',
    background: 'opencloud-bg.jpg',
    payoff: 'Your OS resource manager',
    logo: 'opencloud-logo.png',
    routes: [
        {
            label: 'Slices',
            state: 'xos.core.slices'
        }
    ]
};
