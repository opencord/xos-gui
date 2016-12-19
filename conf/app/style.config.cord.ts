import {IStyleConfig} from './interfaces';
export const StyleConfig: IStyleConfig = {
    projectName: 'CORD',
    favicon: 'cord-favicon.png',
    routes: [
        {
            label: 'Slices',
            state: 'xos.core.slices'
        },
        {
            label: 'Instances',
            state: 'xos.core.instances'
        },
        {
            label: 'Nodes',
            state: 'xos.core.nodes'
        }
    ]
};
