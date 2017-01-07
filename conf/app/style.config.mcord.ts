import {IStyleConfig} from './interfaces';
export const StyleConfig: IStyleConfig = {
    projectName: 'M-CORD',
    favicon: 'cord-favicon.png',
    background: 'mcord-bg.jpg',
    payoff: 'Your way toward 5G',
    logo: 'cord-logo.png',
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
        },
        {
            label: 'MCORD',
            state: 'xos.mcord'
        },
        {
            label: 'Topology',
            state: 'xos.mcord.topology',
            parent: 'xos.mcord'
        }
    ]
};
